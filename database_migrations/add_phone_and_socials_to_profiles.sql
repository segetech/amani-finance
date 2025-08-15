-- Add phone and social media columns to the profiles table
ALTER TABLE public.profiles
ADD COLUMN phone VARCHAR(50),
ADD COLUMN twitter_url VARCHAR(300),
ADD COLUMN linkedin_url VARCHAR(300);
