import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type {
  CommunityPost,
  PostComment,
  AcademyCourse,
  CourseLesson,
  CommunityEvent,
  MemberPoints,
  AcademyProfile,
  GamificationSettings,
  AcademyNotification,
  PostCategory,
  LessonResource,
  Badge,
  NotificationPreferences,
} from '@/types/academy';
import type { Json } from '@/integrations/supabase/types';

// Type-safe database queries using type assertions
const db = supabase as any;

// Helper to safely parse JSON fields
const parseJsonArray = <T,>(json: Json | null, defaultValue: T[] = []): T[] => {
  if (!json) return defaultValue;
  if (Array.isArray(json)) return json as T[];
  return defaultValue;
};

const parseJsonObject = <T,>(json: Json | null, defaultValue: T): T => {
  if (!json) return defaultValue;
  if (typeof json === 'object' && !Array.isArray(json)) return json as unknown as T;
  return defaultValue;
};

export function useAcademy() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // =============================================
  // PROFILE
  // =============================================

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['academy-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await db
        .from('academy_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      if (!data) return null;
      
      return {
        ...data,
        badges: parseJsonArray<Badge>(data.badges),
        social_links: parseJsonObject<Record<string, string>>(data.social_links, {}),
        notification_preferences: parseJsonObject<NotificationPreferences>(data.notification_preferences, {
          email_digest: true,
          event_reminders: true,
          new_content: true,
        }),
      } as AcademyProfile;
    },
    enabled: !!user?.id,
  });

  const createProfile = useMutation({
    mutationFn: async (profileData: Partial<AcademyProfile>) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { data, error } = await db
        .from('academy_profiles')
        .upsert({
          user_id: user.id,
          display_name: profileData.display_name || user.email?.split('@')[0],
          bio: profileData.bio || null,
          avatar_url: profileData.avatar_url || null,
          is_admin: profileData.is_admin || false,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academy-profile'] });
    },
  });

  // =============================================
  // COMMUNITY POSTS
  // =============================================

  const { data: posts = [], isLoading: postsLoading, refetch: refetchPosts } = useQuery({
    queryKey: ['community-posts'],
    queryFn: async () => {
      const { data, error } = await db
        .from('community_posts')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get profiles for authors
      const userIds = [...new Set((data || []).map((p: any) => p.user_id))];
      const { data: profiles } = userIds.length > 0 ? await db
        .from('academy_profiles')
        .select('*')
        .in('user_id', userIds) : { data: [] };
      
      // Get user's likes
      let userLikes: string[] = [];
      if (user?.id) {
        const { data: likes } = await db
          .from('content_likes')
          .select('content_id')
          .eq('user_id', user.id)
          .eq('content_type', 'post');
        userLikes = (likes || []).map((l: any) => l.content_id);
      }
      
      return (data || []).map((post: any) => {
        const authorData = profiles?.find((p: any) => p.user_id === post.user_id);
        return {
          ...post,
          poll_options: parseJsonArray(post.poll_options),
          poll_votes: parseJsonObject<Record<string, string[]>>(post.poll_votes, {}),
          author: authorData ? {
            ...authorData,
            badges: parseJsonArray<Badge>(authorData.badges),
            social_links: parseJsonObject<Record<string, string>>(authorData.social_links, {}),
            notification_preferences: parseJsonObject<NotificationPreferences>(authorData.notification_preferences, {
              email_digest: true,
              event_reminders: true,
              new_content: true,
            }),
          } : undefined,
          user_liked: userLikes.includes(post.id),
        };
      }) as CommunityPost[];
    },
  });

  const createPost = useMutation({
    mutationFn: async (postData: { title?: string; content: string; category: PostCategory; media_urls?: string[]; poll_options?: { id: string; text: string }[] }) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { data, error } = await db
        .from('community_posts')
        .insert({
          user_id: user.id,
          title: postData.title || null,
          content: postData.content,
          category: postData.category,
          media_urls: postData.media_urls || [],
          poll_options: postData.poll_options as unknown as Json || null,
        })
        .select()
        .single();
      if (error) throw error;
      await awardPoints('post', data.id);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      toast.success('Post created!');
    },
  });

  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await db
        .from('community_posts')
        .delete()
        .eq('id', postId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      toast.success('Post deleted');
    },
  });

  const togglePostLike = useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: string; isLiked: boolean }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      if (isLiked) {
        await db
          .from('content_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('content_type', 'post')
          .eq('content_id', postId);
        
        const currentPost = posts.find(p => p.id === postId);
        await db
          .from('community_posts')
          .update({ likes_count: Math.max(0, (currentPost?.likes_count ?? 1) - 1) })
          .eq('id', postId);
      } else {
        await db
          .from('content_likes')
          .insert({ user_id: user.id, content_type: 'post', content_id: postId });
        
        const currentPost = posts.find(p => p.id === postId);
        await db
          .from('community_posts')
          .update({ likes_count: (currentPost?.likes_count ?? 0) + 1 })
          .eq('id', postId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
  });

  // =============================================
  // COMMENTS
  // =============================================

  const getPostComments = async (postId: string): Promise<PostComment[]> => {
    const { data, error } = await db
      .from('post_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    const userIds = [...new Set((data || []).map((c: any) => c.user_id))];
    const { data: profiles } = userIds.length > 0 ? await db
      .from('academy_profiles')
      .select('*')
      .in('user_id', userIds) : { data: [] };
    
    return (data || []).map((comment: any) => {
      const authorData = profiles?.find((p: any) => p.user_id === comment.user_id);
      return {
        ...comment,
        author: authorData ? {
          ...authorData,
          badges: parseJsonArray<Badge>(authorData.badges),
          social_links: parseJsonObject<Record<string, string>>(authorData.social_links, {}),
          notification_preferences: parseJsonObject<NotificationPreferences>(authorData.notification_preferences, {
            email_digest: true,
            event_reminders: true,
            new_content: true,
          }),
        } : undefined,
      };
    }) as PostComment[];
  };

  const createComment = useMutation({
    mutationFn: async ({ postId, content, parentCommentId }: { postId: string; content: string; parentCommentId?: string }) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { data, error } = await db
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content,
          parent_comment_id: parentCommentId || null,
        })
        .select()
        .single();
      if (error) throw error;
      
      // Update comment count
      const currentPost = posts.find(p => p.id === postId);
      await db
        .from('community_posts')
        .update({ comments_count: (currentPost?.comments_count ?? 0) + 1 })
        .eq('id', postId);
      
      await awardPoints('comment', data.id);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      queryClient.invalidateQueries({ queryKey: ['post-comments'] });
    },
  });

  // =============================================
  // COURSES
  // =============================================

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['academy-courses'],
    queryFn: async () => {
      const { data, error } = await db
        .from('academy_courses')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      
      // Get user progress if logged in
      let progressMap: Record<string, number> = {};
      if (user?.id) {
        const { data: progress } = await db
          .from('user_course_progress')
          .select('course_id, lesson_id, completed_at')
          .eq('user_id', user.id);
        
        // Calculate completion percentage per course
        if (progress) {
          const courseProgress: Record<string, { completed: number }> = {};
          for (const p of progress) {
            if (!courseProgress[p.course_id]) {
              courseProgress[p.course_id] = { completed: 0 };
            }
            if (p.completed_at) {
              courseProgress[p.course_id].completed++;
            }
          }
          
          for (const courseId in courseProgress) {
            const course = (data || []).find((c: any) => c.id === courseId);
            if (course && course.lessons_count > 0) {
              progressMap[courseId] = Math.round((courseProgress[courseId].completed / course.lessons_count) * 100);
            }
          }
        }
      }
      
      // Get user level for unlock check
      let userLevel = 1;
      if (user?.id) {
        const { data: points } = await db
          .from('member_points')
          .select('current_level')
          .eq('user_id', user.id)
          .maybeSingle();
        userLevel = points?.current_level || 1;
      }
      
      return (data || []).map((course: any) => ({
        ...course,
        difficulty: course.difficulty as 'beginner' | 'intermediate' | 'advanced',
        completion_percentage: progressMap[course.id] || 0,
        is_locked: course.unlock_at_level > userLevel,
      })) as AcademyCourse[];
    },
  });

  const createCourse = useMutation({
    mutationFn: async (courseData: Partial<AcademyCourse>) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { data, error } = await db
        .from('academy_courses')
        .insert({
          created_by: user.id,
          title: courseData.title || 'Untitled Course',
          description: courseData.description || null,
          thumbnail_url: courseData.thumbnail_url || null,
          category: courseData.category || 'general',
          difficulty: courseData.difficulty || 'beginner',
          unlock_at_level: courseData.unlock_at_level || 1,
          is_published: courseData.is_published || false,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academy-courses'] });
      toast.success('Course created!');
    },
  });

  const updateCourse = useMutation({
    mutationFn: async ({ id, ...courseData }: Partial<AcademyCourse> & { id: string }) => {
      const { data, error } = await db
        .from('academy_courses')
        .update({
          title: courseData.title,
          description: courseData.description,
          thumbnail_url: courseData.thumbnail_url,
          category: courseData.category,
          difficulty: courseData.difficulty,
          unlock_at_level: courseData.unlock_at_level,
          is_published: courseData.is_published,
          order_index: courseData.order_index,
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academy-courses'] });
      toast.success('Course updated!');
    },
  });

  const deleteCourse = useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await db
        .from('academy_courses')
        .delete()
        .eq('id', courseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academy-courses'] });
      toast.success('Course deleted');
    },
  });

  // =============================================
  // LESSONS
  // =============================================

  const getCourseLessons = async (courseId: string): Promise<CourseLesson[]> => {
    const { data, error } = await db
      .from('course_lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    
    // Get user progress
    let progressMap: Record<string, { completed: boolean; watch_progress: number }> = {};
    if (user?.id) {
      const { data: progress } = await db
        .from('user_course_progress')
        .select('lesson_id, completed_at, watch_progress_seconds')
        .eq('user_id', user.id)
        .eq('course_id', courseId);
      
      for (const p of progress || []) {
        progressMap[p.lesson_id] = {
          completed: !!p.completed_at,
          watch_progress: p.watch_progress_seconds || 0,
        };
      }
    }
    
    return (data || []).map((lesson: any) => ({
      ...lesson,
      content_type: lesson.content_type as 'video' | 'text' | 'resource',
      resources: parseJsonArray<LessonResource>(lesson.resources as Json),
      is_completed: progressMap[lesson.id]?.completed || false,
      watch_progress_seconds: progressMap[lesson.id]?.watch_progress || 0,
    })) as CourseLesson[];
  };

  const createLesson = useMutation({
    mutationFn: async (lessonData: Partial<CourseLesson> & { course_id: string }) => {
      const { data, error } = await db
        .from('course_lessons')
        .insert({
          course_id: lessonData.course_id,
          title: lessonData.title || 'Untitled Lesson',
          description: lessonData.description || null,
          content_type: lessonData.content_type || 'video',
          video_url: lessonData.video_url || null,
          video_duration_seconds: lessonData.video_duration_seconds || 0,
          text_content: lessonData.text_content || null,
          resources: (lessonData.resources || []) as unknown as Json,
          transcript: lessonData.transcript || null,
          order_index: lessonData.order_index || 0,
        })
        .select()
        .single();
      if (error) throw error;
      
      // Update lesson count
      const currentCourse = courses.find(c => c.id === lessonData.course_id);
      await db
        .from('academy_courses')
        .update({ lessons_count: (currentCourse?.lessons_count ?? 0) + 1 })
        .eq('id', lessonData.course_id);
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academy-courses'] });
      queryClient.invalidateQueries({ queryKey: ['course-lessons'] });
      toast.success('Lesson created!');
    },
  });

  const updateLesson = useMutation({
    mutationFn: async ({ id, ...lessonData }: Partial<CourseLesson> & { id: string }) => {
      const updateData: Record<string, unknown> = {};
      if (lessonData.title !== undefined) updateData.title = lessonData.title;
      if (lessonData.description !== undefined) updateData.description = lessonData.description;
      if (lessonData.content_type !== undefined) updateData.content_type = lessonData.content_type;
      if (lessonData.video_url !== undefined) updateData.video_url = lessonData.video_url;
      if (lessonData.video_duration_seconds !== undefined) updateData.video_duration_seconds = lessonData.video_duration_seconds;
      if (lessonData.text_content !== undefined) updateData.text_content = lessonData.text_content;
      if (lessonData.resources !== undefined) updateData.resources = lessonData.resources as unknown as Json;
      if (lessonData.transcript !== undefined) updateData.transcript = lessonData.transcript;
      if (lessonData.order_index !== undefined) updateData.order_index = lessonData.order_index;
      if (lessonData.is_published !== undefined) updateData.is_published = lessonData.is_published;
      
      const { data, error } = await db
        .from('course_lessons')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-lessons'] });
      toast.success('Lesson updated!');
    },
  });

  const completeLesson = useMutation({
    mutationFn: async ({ courseId, lessonId }: { courseId: string; lessonId: string }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { data, error } = await db
        .from('user_course_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      
      await awardPoints('lesson_complete', lessonId);
      
      // Check if course is complete
      const lessons = await getCourseLessons(courseId);
      const completedCount = lessons.filter(l => l.is_completed || l.id === lessonId).length;
      if (completedCount === lessons.length) {
        await awardPoints('course_complete', courseId);
        toast.success('🎉 Course completed!');
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academy-courses'] });
      queryClient.invalidateQueries({ queryKey: ['course-lessons'] });
    },
  });

  // =============================================
  // EVENTS
  // =============================================

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['community-events'],
    queryFn: async () => {
      const { data, error } = await db
        .from('community_events')
        .select('*')
        .gte('end_time', new Date().toISOString())
        .order('start_time', { ascending: true });
      
      if (error) throw error;
      
      // Get RSVP counts
      const eventIds = (data || []).map((e: any) => e.id);
      const { data: rsvps } = eventIds.length > 0 ? await db
        .from('event_rsvps')
        .select('event_id, status')
        .in('event_id', eventIds) : { data: [] };
      
      const rsvpCounts: Record<string, number> = {};
      for (const rsvp of rsvps || []) {
        if (rsvp.status === 'going') {
          rsvpCounts[rsvp.event_id] = (rsvpCounts[rsvp.event_id] || 0) + 1;
        }
      }
      
      // Get user's RSVPs
      let userRsvps: Record<string, any> = {};
      if (user?.id && eventIds.length > 0) {
        const { data: myRsvps } = await db
          .from('event_rsvps')
          .select('*')
          .eq('user_id', user.id)
          .in('event_id', eventIds);
        
        for (const rsvp of myRsvps || []) {
          userRsvps[rsvp.event_id] = rsvp;
        }
      }
      
      return (data || []).map((event: any) => ({
        ...event,
        event_type: event.event_type as 'livestream' | 'zoom' | 'workshop' | 'meetup',
        rsvp_count: rsvpCounts[event.id] || 0,
        user_rsvp: userRsvps[event.id],
      })) as CommunityEvent[];
    },
  });

  const createEvent = useMutation({
    mutationFn: async (eventData: Partial<CommunityEvent>) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { data, error } = await db
        .from('community_events')
        .insert({
          created_by: user.id,
          title: eventData.title || 'Untitled Event',
          description: eventData.description || null,
          event_type: eventData.event_type || 'livestream',
          start_time: eventData.start_time!,
          end_time: eventData.end_time!,
          timezone: eventData.timezone || 'UTC',
          meeting_url: eventData.meeting_url || null,
          cover_image_url: eventData.cover_image_url || null,
          is_recurring: eventData.is_recurring || false,
          recurrence_rule: eventData.recurrence_rule || null,
          max_attendees: eventData.max_attendees || null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-events'] });
      toast.success('Event created!');
    },
  });

  const updateEvent = useMutation({
    mutationFn: async ({ id, ...eventData }: Partial<CommunityEvent> & { id: string }) => {
      const { data, error } = await db
        .from('community_events')
        .update({
          title: eventData.title,
          description: eventData.description,
          event_type: eventData.event_type,
          start_time: eventData.start_time,
          end_time: eventData.end_time,
          meeting_url: eventData.meeting_url,
          cover_image_url: eventData.cover_image_url,
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-events'] });
      toast.success('Event updated!');
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await db
        .from('community_events')
        .delete()
        .eq('id', eventId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-events'] });
      toast.success('Event deleted');
    },
  });

  const rsvpToEvent = useMutation({
    mutationFn: async ({ eventId, status }: { eventId: string; status: 'going' | 'maybe' | 'not_going' }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { data, error } = await db
        .from('event_rsvps')
        .upsert({
          event_id: eventId,
          user_id: user.id,
          status,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-events'] });
    },
  });

  // =============================================
  // GAMIFICATION
  // =============================================

  const { data: memberPoints } = useQuery({
    queryKey: ['member-points', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await db
        .from('member_points')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as MemberPoints | null;
    },
    enabled: !!user?.id,
  });

  const { data: leaderboard = [] } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await db
        .from('member_points')
        .select('*')
        .order('total_points', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      
      // Get profiles
      const userIds = (data || []).map((p: any) => p.user_id);
      const { data: profiles } = userIds.length > 0 ? await db
        .from('academy_profiles')
        .select('*')
        .in('user_id', userIds) : { data: [] };
      
      return (data || []).map((points: any) => {
        const profileData = profiles?.find((p: any) => p.user_id === points.user_id);
        return {
          ...points,
          profile: profileData ? {
            ...profileData,
            badges: parseJsonArray<Badge>(profileData.badges),
            social_links: parseJsonObject<Record<string, string>>(profileData.social_links, {}),
            notification_preferences: parseJsonObject<NotificationPreferences>(profileData.notification_preferences, {
              email_digest: true,
              event_reminders: true,
              new_content: true,
            }),
          } : undefined,
        };
      }) as MemberPoints[];
    },
  });

  const { data: gamificationSettings } = useQuery({
    queryKey: ['gamification-settings'],
    queryFn: async () => {
      const { data, error } = await db
        .from('gamification_settings')
        .select('*');
      
      if (error) throw error;
      
      const settings: GamificationSettings = {
        point_values: { post: 10, comment: 5, like_received: 2, lesson_complete: 15, course_complete: 100, event_attend: 25, daily_login: 5 },
        levels: [],
      };
      
      for (const row of data || []) {
        if (row.setting_key === 'point_values') {
          settings.point_values = row.setting_value as unknown as GamificationSettings['point_values'];
        } else if (row.setting_key === 'levels') {
          settings.levels = row.setting_value as unknown as GamificationSettings['levels'];
        }
      }
      
      return settings;
    },
  });

  const awardPoints = async (actionType: string, referenceId?: string) => {
    if (!user?.id || !gamificationSettings) return;
    
    const pointValue = gamificationSettings.point_values[actionType as keyof typeof gamificationSettings.point_values] || 0;
    if (pointValue === 0) return;
    
    // Create transaction
    await db
      .from('point_transactions')
      .insert({
        user_id: user.id,
        points: pointValue,
        action_type: actionType,
        reference_id: referenceId || null,
        description: `Earned ${pointValue} points for ${actionType.replace('_', ' ')}`,
      });
    
    // Update total points
    const currentPoints = memberPoints?.total_points || 0;
    const newTotal = currentPoints + pointValue;
    
    // Calculate new level
    let newLevel = 1;
    let newLevelName = 'Newcomer';
    for (const level of gamificationSettings.levels) {
      if (newTotal >= level.min_points) {
        newLevel = level.level;
        newLevelName = level.name;
      }
    }
    
    await db
      .from('member_points')
      .upsert({
        user_id: user.id,
        total_points: newTotal,
        current_level: newLevel,
        level_name: newLevelName,
        last_activity_date: new Date().toISOString().split('T')[0],
      });
    
    queryClient.invalidateQueries({ queryKey: ['member-points'] });
    queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    
    // Check for level up
    if (newLevel > (memberPoints?.current_level || 1)) {
      toast.success(`🎉 Level up! You're now a ${newLevelName}!`);
    }
  };

  const updateGamificationSettings = useMutation({
    mutationFn: async (settings: Partial<GamificationSettings>) => {
      if (settings.point_values) {
        await db
          .from('gamification_settings')
          .upsert({
            setting_key: 'point_values',
            setting_value: settings.point_values as unknown as Json,
          });
      }
      if (settings.levels) {
        await db
          .from('gamification_settings')
          .upsert({
            setting_key: 'levels',
            setting_value: settings.levels as unknown as Json,
          });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gamification-settings'] });
      toast.success('Settings updated!');
    },
  });

  // =============================================
  // MEMBERS
  // =============================================

  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ['academy-members'],
    queryFn: async () => {
      const { data, error } = await db
        .from('academy_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get points for all members
      const userIds = (data || []).map((p: any) => p.user_id);
      const { data: points } = userIds.length > 0 ? await db
        .from('member_points')
        .select('*')
        .in('user_id', userIds) : { data: [] };
      
      return (data || []).map((profileData: any) => ({
        ...profileData,
        badges: parseJsonArray<Badge>(profileData.badges),
        social_links: parseJsonObject<Record<string, string>>(profileData.social_links, {}),
        notification_preferences: parseJsonObject<NotificationPreferences>(profileData.notification_preferences, {
          email_digest: true,
          event_reminders: true,
          new_content: true,
        }),
        points: points?.find((p: any) => p.user_id === profileData.user_id),
      })) as AcademyProfile[];
    },
  });

  // =============================================
  // NOTIFICATIONS
  // =============================================

  const { data: notifications = [] } = useQuery({
    queryKey: ['academy-notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await db
        .from('academy_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as AcademyNotification[];
    },
    enabled: !!user?.id,
  });

  const markNotificationRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await db
        .from('academy_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academy-notifications'] });
    },
  });

  // =============================================
  // SEARCH
  // =============================================

  const search = async (query: string) => {
    const searchTerm = `%${query}%`;
    
    const [postsResult, coursesResult, membersResult] = await Promise.all([
      db
        .from('community_posts')
        .select('id, title, content, category')
        .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
        .limit(10),
      db
        .from('academy_courses')
        .select('id, title, description')
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .eq('is_published', true)
        .limit(10),
      db
        .from('academy_profiles')
        .select('id, user_id, display_name, bio')
        .or(`display_name.ilike.${searchTerm},bio.ilike.${searchTerm}`)
        .limit(10),
    ]);
    
    return {
      posts: postsResult.data || [],
      courses: coursesResult.data || [],
      members: membersResult.data || [],
    };
  };

  // =============================================
  // REALTIME SUBSCRIPTIONS
  // =============================================

  useEffect(() => {
    const postsChannel = supabase
      .channel('community-posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => {
        queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      })
      .subscribe();

    const commentsChannel = supabase
      .channel('post-comments-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_comments' }, () => {
        queryClient.invalidateQueries({ queryKey: ['post-comments'] });
        queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      })
      .subscribe();

    const likesChannel = supabase
      .channel('content-likes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'content_likes' }, () => {
        queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(commentsChannel);
      supabase.removeChannel(likesChannel);
    };
  }, [queryClient]);

  // Comments query for specific post
  const toggleCommentLike = useMutation({
    mutationFn: async ({ commentId, isLiked }: { commentId: string; isLiked: boolean }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      if (isLiked) {
        await db
          .from('content_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('content_type', 'comment')
          .eq('content_id', commentId);
      } else {
        await db
          .from('content_likes')
          .insert({ user_id: user.id, content_type: 'comment', content_id: commentId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post-comments'] });
    },
  });

  // Course progress helper
  const getCourseProgress = useCallback((courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course?.completion_percentage || 0;
  }, [courses]);

  // Mark all notifications read
  const markAllNotificationsRead = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');
      const { error } = await db
        .from('academy_notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academy-notifications'] });
    },
  });

  // Realtime subscription helper
  const subscribeToRealtime = useCallback(() => {
    // Already set up in useEffect above
    return () => {};
  }, []);

  return {
    // Profile
    profile,
    profileLoading,
    createProfile,
    isAdmin: profile?.is_admin || false,
    
    // Posts
    posts,
    postsLoading,
    refetchPosts,
    createPost,
    deletePost,
    togglePostLike,
    
    // Comments
    getPostComments,
    createComment,
    toggleCommentLike,
    
    // Courses
    courses,
    coursesLoading,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseLessons,
    createLesson,
    updateLesson,
    completeLesson,
    getCourseProgress,
    
    // Events
    events,
    eventsLoading,
    createEvent,
    updateEvent,
    deleteEvent,
    rsvpToEvent,
    
    // Gamification
    memberPoints,
    leaderboard,
    gamificationSettings,
    awardPoints,
    updateGamificationSettings,
    
    // Members
    members,
    membersLoading,
    profiles: members, // Alias for compatibility
    
    // Notifications
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    
    // Search
    search,
    searchContent: search, // Alias for compatibility
    
    // Realtime
    subscribeToRealtime,
    
    // Leaderboard helper
    getLeaderboard: () => leaderboard,
    
    // User
    user,
  };
}
