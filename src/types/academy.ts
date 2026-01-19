// Academy Types

export interface CommunityPost {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  category: string;
  media_urls: string[];
  poll_options: PollOption[] | null;
  poll_votes: Record<string, string[]>;
  is_pinned: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  author?: AcademyProfile;
  user_liked?: boolean;
}

export interface PollOption {
  id: string;
  text: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_comment_id: string | null;
  likes_count: number;
  created_at: string;
  // Joined fields
  author?: AcademyProfile;
  replies?: PostComment[];
  user_liked?: boolean;
}

export interface AcademyCourse {
  id: string;
  created_by: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_hours: number;
  unlock_at_level: number;
  is_published: boolean;
  order_index: number;
  lessons_count: number;
  enrolled_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  lessons?: CourseLesson[];
  user_progress?: UserCourseProgress[];
  completion_percentage?: number;
  is_locked?: boolean;
}

export interface CourseLesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  content_type: 'video' | 'text' | 'resource';
  video_url: string | null;
  video_duration_seconds: number;
  text_content: string | null;
  resources: LessonResource[];
  transcript: string | null;
  order_index: number;
  is_published: boolean;
  created_at: string;
  // Joined fields
  is_completed?: boolean;
  watch_progress_seconds?: number;
}

export interface LessonResource {
  name: string;
  url: string;
  type: 'pdf' | 'link' | 'file';
}

export interface UserCourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id: string;
  completed_at: string | null;
  watch_progress_seconds: number;
  notes: string | null;
  created_at: string;
}

export interface CommunityEvent {
  id: string;
  created_by: string;
  title: string;
  description: string | null;
  event_type: 'livestream' | 'zoom' | 'workshop' | 'meetup';
  start_time: string;
  end_time: string;
  timezone: string;
  meeting_url: string | null;
  cover_image_url: string | null;
  is_recurring: boolean;
  recurrence_rule: string | null;
  max_attendees: number | null;
  reminder_sent: boolean;
  created_at: string;
  // Joined fields
  rsvp_count?: number;
  user_rsvp?: EventRSVP;
}

export interface EventRSVP {
  id: string;
  event_id: string;
  user_id: string;
  status: 'going' | 'maybe' | 'not_going';
  created_at: string;
}

export interface MemberPoints {
  id: string;
  user_id: string;
  total_points: number;
  current_level: number;
  level_name: string;
  streak_days: number;
  last_activity_date: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  profile?: AcademyProfile;
}

export interface PointTransaction {
  id: string;
  user_id: string;
  points: number;
  action_type: string;
  reference_id: string | null;
  description: string | null;
  created_at: string;
}

export interface ContentLike {
  id: string;
  user_id: string;
  content_type: 'post' | 'comment';
  content_id: string;
  created_at: string;
}

export interface AcademyProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  location: string | null;
  website: string | null;
  social_links: Record<string, string>;
  badges: Badge[];
  is_admin: boolean;
  notification_preferences: NotificationPreferences;
  created_at: string;
  updated_at: string;
  // Joined fields
  points?: MemberPoints;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  earned_at: string;
}

export interface NotificationPreferences {
  email_digest: boolean;
  event_reminders: boolean;
  new_content: boolean;
}

export interface GamificationSettings {
  point_values: {
    post: number;
    comment: number;
    like_received: number;
    lesson_complete: number;
    course_complete: number;
    event_attend: number;
    daily_login: number;
  };
  levels: LevelConfig[];
}

export interface LevelConfig {
  level: number;
  name: string;
  min_points: number;
}

export interface AcademyNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string | null;
  reference_type: string | null;
  reference_id: string | null;
  is_read: boolean;
  created_at: string;
}

// Tab types
export type AcademyTab = 'community' | 'classroom' | 'calendar' | 'leaderboard' | 'members' | 'admin';

// Category types
export type PostCategory = 'general' | 'wins' | 'questions' | 'resources' | 'introductions';

export const POST_CATEGORIES: { value: PostCategory; label: string; icon: string }[] = [
  { value: 'general', label: 'General', icon: 'MessageSquare' },
  { value: 'wins', label: 'Wins', icon: 'Trophy' },
  { value: 'questions', label: 'Questions', icon: 'HelpCircle' },
  { value: 'resources', label: 'Resources', icon: 'FileText' },
  { value: 'introductions', label: 'Introductions', icon: 'UserPlus' },
];

export const COURSE_CATEGORIES = [
  'Mindset',
  'Business',
  'Marketing',
  'Sales',
  'Productivity',
  'Health',
  'Finance',
  'General',
];

export const EVENT_TYPES: { value: CommunityEvent['event_type']; label: string }[] = [
  { value: 'livestream', label: 'Livestream' },
  { value: 'zoom', label: 'Zoom Meeting' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'meetup', label: 'Meetup' },
];
