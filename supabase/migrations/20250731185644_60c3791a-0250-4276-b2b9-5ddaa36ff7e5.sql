-- Fix function search paths for security

-- Update get_current_user_role function with search path
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

-- Update handle_new_user function with search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  
  INSERT INTO public.user_points (user_id, points)
  VALUES (NEW.id, 0);
  
  RETURN NEW;
END;
$$;

-- Update update_updated_at_column function with search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;