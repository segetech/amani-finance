import { supabase } from '@/lib/supabase';

export type Content = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published' | 'archived';
  type: 'article' | 'podcast' | 'indice';
  author_id: string;
  category_id?: string;
  tags?: string[];
  featured_image?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
};

export const getContents = async (type?: Content['type']) => {
  let query = supabase
    .from('contents')
    .select('*')
    .order('created_at', { ascending: false });

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching contents:', error);
    throw error;
  }
  
  return data as Content[];
};

export const getContentBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('contents')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching content:', error);
    throw error;
  }

  return data as Content;
};

export const createContent = async (content: Omit<Content, 'id' | 'created_at' | 'updated_at' | 'status' | 'author_id'>) => {
  const user = await supabase.auth.getUser();
  
  if (!user.data.user?.id) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('contents')
    .insert([
      {
        ...content,
        author_id: user.data.user.id,
        status: 'draft',
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating content:', error);
    throw error;
  }

  return data as Content;
};

export const updateContent = async (id: string, updates: Partial<Content>) => {
  const { data, error } = await supabase
    .from('contents')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating content:', error);
    throw error;
  }

  return data as Content;
};

export const deleteContent = async (id: string) => {
  const { error } = await supabase.from('contents').delete().eq('id', id);
  
  if (error) {
    console.error('Error deleting content:', error);
    throw error;
  }
  
  return true;
};
