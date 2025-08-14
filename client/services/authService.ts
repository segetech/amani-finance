import { supabase } from '@/lib/supabase';

export type UserProfile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  role: 'admin' | 'editor' | 'analyst' | 'moderator' | 'subscriber';
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export const signUp = async (email: string, password: string, userData: { firstName: string; lastName: string }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: userData.firstName,
        last_name: userData.lastName,
      },
    },
  });

  if (error) {
    console.error('Error signing up:', error);
    throw error;
  }

  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error signing in:', error);
    throw error;
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
  
  if (!user) return null;
  
  // Get the user's profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (profileError) {
    console.error('Error getting user profile:', profileError);
    throw profileError;
  }
  
  return {
    ...user,
    ...profile,
  } as UserProfile & { email: string };
};

export const updateProfile = async (updates: Partial<UserProfile>) => {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
  
  return data as UserProfile;
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/update-password`,
  });
  
  if (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};
