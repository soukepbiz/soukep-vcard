-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id                      UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username                TEXT UNIQUE NOT NULL,
  full_name               TEXT,
  job_title               TEXT,
  company                 TEXT,
  bio                     TEXT,
  avatar_url              TEXT,
  cover_url               TEXT,
  social_links            JSONB DEFAULT '[]'::jsonb,
  phone_numbers           JSONB DEFAULT '[]'::jsonb,
  emails                  JSONB DEFAULT '[]'::jsonb,
  location                TEXT,
  accent_color            TEXT DEFAULT '#0099FF',
  is_published            BOOLEAN DEFAULT false,
  subscription_type       TEXT DEFAULT 'free' CHECK (subscription_type IN ('free','premium','lifetime')),
  subscription_expires_at TIMESTAMPTZ,
  role                    TEXT DEFAULT 'user' CHECK (role IN ('user','admin')),
  created_at              TIMESTAMPTZ DEFAULT now(),
  updated_at              TIMESTAMPTZ DEFAULT now()
);

-- Profile views for analytics
CREATE TABLE IF NOT EXISTS profile_views (
  id         BIGSERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  viewer_ip  TEXT,
  user_agent TEXT,
  referrer   TEXT,
  viewed_at  TIMESTAMPTZ DEFAULT now()
);

-- Admin action logs
CREATE TABLE IF NOT EXISTS admin_logs (
  id             BIGSERIAL PRIMARY KEY,
  admin_id       UUID REFERENCES profiles(id),
  target_user_id UUID REFERENCES profiles(id),
  action         TEXT NOT NULL,
  metadata       JSONB DEFAULT '{}'::jsonb,
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INT := 0;
BEGIN
  base_username := LOWER(REGEXP_REPLACE(SPLIT_PART(NEW.email, '@', 1), '[^a-z0-9_-]', '', 'g'));
  IF LENGTH(base_username) < 3 THEN
    base_username := 'user' || base_username;
  END IF;
  final_username := base_username;

  -- Ensure unique username
  WHILE EXISTS (SELECT 1 FROM profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter::TEXT;
  END LOOP;

  INSERT INTO profiles (id, username)
  VALUES (NEW.id, final_username);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true) ON CONFLICT DO NOTHING;
