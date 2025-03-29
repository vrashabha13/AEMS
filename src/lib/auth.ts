import { supabase } from './supabase';
import type { User } from '../types';

export async function signIn(email: string, password: string) {
  try {
    // First, attempt to sign in
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // Be more specific about authentication errors
      if (signInError.message.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password');
      }
      throw signInError;
    }

    if (!data.user) {
      throw new Error('No user data returned');
    }

    // Then fetch the user's role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, full_name')
      .eq('id', data.user.id)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      throw new Error('Error fetching user data');
    }

    if (!userData) {
      throw new Error('User profile not found');
    }

    return {
      user: data.user,
      role: userData.role,
      session: data.session
    };

  } catch (error) {
    console.error('Sign in error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred during sign in');
  }
}

export async function signUp(
  email: string,
  password: string,
  role: 'student' | 'faculty',
  fullName: string,
  metadata?: Record<string, unknown>
) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          full_name: fullName,
          ...metadata
        }
      }
    });

    if (authError) throw authError;

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          role,
          full_name: fullName,
          ...metadata
        });

      if (profileError) throw profileError;

      return {
        user: authData.user,
        role,
        session: authData.session,
        message: 'Account created successfully'
      };
    }

    throw new Error('Failed to create account');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An error occurred during sign up');
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) throw error;
    return {
      ...session.user,
      ...data
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function refreshSession() {
  const { data: { session }, error } = await supabase.auth.refreshSession();
  if (error) throw error;
  return session;
}