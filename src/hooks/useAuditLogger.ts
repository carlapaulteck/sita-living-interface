import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

type AuditAction =
  | 'create_user'
  | 'update_user'
  | 'delete_user'
  | 'update_role'
  | 'create_announcement'
  | 'update_announcement'
  | 'delete_announcement'
  | 'create_ticket_reply'
  | 'update_ticket'
  | 'delete_ticket'
  | 'update_subscription'
  | 'cancel_subscription'
  | 'create_feature_flag'
  | 'update_feature_flag'
  | 'delete_feature_flag'
  | 'update_settings'
  | 'resolve_error'
  | 'bulk_action'
  | 'export_data';

type AuditTargetType =
  | 'user'
  | 'announcement'
  | 'support_ticket'
  | 'subscription'
  | 'feature_flag'
  | 'error_log'
  | 'settings'
  | 'bulk';

interface AuditLogParams {
  action: AuditAction;
  targetType: AuditTargetType;
  targetId?: string;
  details?: Record<string, unknown>;
}

/**
 * Hook to automatically log admin actions to the audit_logs table.
 * 
 * Usage:
 * const { logAction, logWithTransaction } = useAuditLogger();
 * 
 * // Simple logging
 * await logAction({
 *   action: 'update_role',
 *   targetType: 'user',
 *   targetId: userId,
 *   details: { old_role: 'user', new_role: 'admin' }
 * });
 * 
 * // With transaction wrapper
 * await logWithTransaction(
 *   { action: 'delete_announcement', targetType: 'announcement', targetId: announcementId },
 *   async () => {
 *     await supabase.from('admin_announcements').delete().eq('id', announcementId);
 *   }
 * );
 */
export const useAuditLogger = () => {
  /**
   * Log an action to the audit_logs table
   */
  const logAction = useCallback(async ({
    action,
    targetType,
    targetId,
    details = {},
  }: AuditLogParams): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('useAuditLogger: No authenticated user found');
        return false;
      }

      // Capture browser info for the log
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : null;

      const { error } = await supabase.from('audit_logs').insert({
        admin_user_id: user.id,
        action,
        target_type: targetType,
        target_id: targetId,
        details: {
          ...details,
          timestamp: new Date().toISOString(),
        },
        user_agent: userAgent,
      });

      if (error) {
        console.error('useAuditLogger: Failed to log action', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('useAuditLogger: Unexpected error', err);
      return false;
    }
  }, []);

  /**
   * Wrap an async operation with automatic audit logging.
   * Logs success or failure based on operation result.
   */
  const logWithTransaction = useCallback(async <T>(
    params: AuditLogParams,
    operation: () => Promise<T>
  ): Promise<T> => {
    const startTime = Date.now();
    
    try {
      const result = await operation();
      
      // Log successful action
      await logAction({
        ...params,
        details: {
          ...params.details,
          status: 'success',
          duration_ms: Date.now() - startTime,
        },
      });
      
      return result;
    } catch (error) {
      // Log failed action
      await logAction({
        ...params,
        details: {
          ...params.details,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          duration_ms: Date.now() - startTime,
        },
      });
      
      throw error;
    }
  }, [logAction]);

  /**
   * Log a bulk action affecting multiple items
   */
  const logBulkAction = useCallback(async (
    action: AuditAction,
    targetType: AuditTargetType,
    targetIds: string[],
    additionalDetails?: Record<string, unknown>
  ): Promise<boolean> => {
    return logAction({
      action,
      targetType,
      details: {
        ...additionalDetails,
        affected_count: targetIds.length,
        target_ids: targetIds.slice(0, 100), // Limit stored IDs to prevent huge payloads
        bulk_operation: true,
      },
    });
  }, [logAction]);

  return {
    logAction,
    logWithTransaction,
    logBulkAction,
  };
};

export type { AuditAction, AuditTargetType, AuditLogParams };
