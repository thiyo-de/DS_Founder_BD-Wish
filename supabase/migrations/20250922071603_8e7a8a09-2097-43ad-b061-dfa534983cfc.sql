-- Fix function search path security warning
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    'user'  -- Default role
  );
  RETURN NEW;
END;
$function$;