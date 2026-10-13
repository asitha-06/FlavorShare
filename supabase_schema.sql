
-- 1. Account type: NULL means onboarding is not completed yet.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role text;

-- Allow only these account types.
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check
CHECK (role IS NULL OR role IN ('viewer', 'homechef', 'headchef'));

-- 2. Real follow relationships.
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id <> following_id)
);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS follows_select ON public.follows;
CREATE POLICY follows_select ON public.follows
FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS follows_insert ON public.follows;
CREATE POLICY follows_insert ON public.follows
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS follows_delete ON public.follows;
CREATE POLICY follows_delete ON public.follows
FOR DELETE TO authenticated
USING (auth.uid() = follower_id);

-- 3. Ensure users can read chef profiles.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_select ON public.profiles;
CREATE POLICY profiles_select ON public.profiles
FOR SELECT USING (true);
