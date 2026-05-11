-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- PROFILES policies
CREATE POLICY "profiles_public_read"
  ON profiles FOR SELECT
  USING (is_published = true OR auth.uid() = id OR is_admin());

CREATE POLICY "profiles_own_update"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = 'user');

CREATE POLICY "profiles_admin_update"
  ON profiles FOR UPDATE
  USING (is_admin());

-- PROFILE_VIEWS policies
CREATE POLICY "views_insert_public"
  ON profile_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "views_owner_read"
  ON profile_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = profile_id AND id = auth.uid()
    )
    OR is_admin()
  );

-- ADMIN_LOGS policies
CREATE POLICY "logs_admin_all"
  ON admin_logs FOR ALL
  USING (is_admin());

-- STORAGE policies
CREATE POLICY "storage_avatars_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "storage_covers_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'covers' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "storage_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('avatars', 'covers'));

CREATE POLICY "storage_own_update"
  ON storage.objects FOR UPDATE
  USING (
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "storage_own_delete"
  ON storage.objects FOR DELETE
  USING (
    auth.uid()::text = (storage.foldername(name))[1]
  );
