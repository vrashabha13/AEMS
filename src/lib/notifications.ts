import { supabase } from './supabase';

export async function sendNotification(userId: string, type: string, message: string) {
  try {
    // Get user's email from auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get user's notification preferences
    const { data: userData } = await supabase
      .from('users')
      .select('notification_settings')
      .eq('id', userId)
      .single();

    if (!userData?.notification_settings?.[type]) return;

    // Send email via Supabase Edge Function
    await supabase.functions.invoke('send-notification', {
      body: {
        to: user.email,
        type,
        message
      }
    });

    // Store notification in database
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        message,
        read: false
      });

  } catch (error) {
    console.error('Error sending notification:', error);
  }
}