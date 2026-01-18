import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PushNotificationsState {
  isSupported: boolean;
  permission: NotificationPermission | null;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
}

export function usePushNotifications() {
  const { user } = useAuth();
  const [state, setState] = useState<PushNotificationsState>({
    isSupported: false,
    permission: null,
    isSubscribed: false,
    isLoading: true,
    error: null,
  });

  // Check support and current status
  useEffect(() => {
    const checkSupport = async () => {
      const isSupported = 
        'serviceWorker' in navigator && 
        'PushManager' in window && 
        'Notification' in window;
      
      if (!isSupported) {
        setState(prev => ({ 
          ...prev, 
          isSupported: false, 
          isLoading: false 
        }));
        return;
      }
      
      const permission = Notification.permission;
      let isSubscribed = false;
      
      if (user && permission === 'granted') {
        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          isSubscribed = !!subscription;
        } catch (e) {
          console.error('[Push] Error checking subscription:', e);
        }
      }
      
      setState(prev => ({
        ...prev,
        isSupported: true,
        permission,
        isSubscribed,
        isLoading: false,
      }));
    };
    
    checkSupport();
  }, [user]);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service workers not supported');
    }
    
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      
      console.log('[Push] Service worker registered:', registration.scope);
      return registration;
    } catch (error) {
      console.error('[Push] Service worker registration failed:', error);
      throw error;
    }
  }, []);

  // Request permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!state.isSupported) {
      throw new Error('Push notifications not supported');
    }
    
    const permission = await Notification.requestPermission();
    
    setState(prev => ({
      ...prev,
      permission,
    }));
    
    return permission;
  }, [state.isSupported]);

  // Subscribe to push
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!user) {
      setState(prev => ({ ...prev, error: 'Must be logged in' }));
      return false;
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Ensure permission
      if (Notification.permission !== 'granted') {
        const permission = await requestPermission();
        if (permission !== 'granted') {
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: 'Permission denied' 
          }));
          return false;
        }
      }
      
      // Register service worker
      const registration = await registerServiceWorker();
      
      // Subscribe to push - using userVisibleOnly only for basic setup
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
      });
      
      // Save subscription to database
      const subscriptionJSON = subscription.toJSON();
      
      await supabase.from('push_subscriptions').upsert({
        user_id: user.id,
        endpoint: subscription.endpoint,
        p256dh_key: subscriptionJSON.keys?.p256dh || '',
        auth_key: subscriptionJSON.keys?.auth || '',
        user_agent: navigator.userAgent,
      }, {
        onConflict: 'user_id,endpoint'
      });
      
      setState(prev => ({
        ...prev,
        isSubscribed: true,
        isLoading: false,
      }));
      
      console.log('[Push] Subscribed successfully');
      return true;
    } catch (error) {
      console.error('[Push] Subscription failed:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Subscription failed',
      }));
      return false;
    }
  }, [user, requestPermission, registerServiceWorker]);

  // Unsubscribe from push
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        // Remove from database
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', user.id)
          .eq('endpoint', subscription.endpoint);
      }
      
      setState(prev => ({
        ...prev,
        isSubscribed: false,
        isLoading: false,
      }));
      
      console.log('[Push] Unsubscribed successfully');
      return true;
    } catch (error) {
      console.error('[Push] Unsubscribe failed:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unsubscribe failed',
      }));
      return false;
    }
  }, [user]);

  // Test notification
  const sendTestNotification = useCallback(async () => {
    if (!state.isSubscribed) {
      throw new Error('Not subscribed to push notifications');
    }
    
    // Send local notification for testing
    if (Notification.permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('SITA Test', {
        body: 'Push notifications are working correctly!',
        icon: '/favicon.ico',
        tag: 'test-notification',
      });
    }
  }, [state.isSubscribed]);

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification,
  };
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}
