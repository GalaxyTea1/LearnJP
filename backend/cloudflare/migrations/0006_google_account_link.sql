ALTER TABLE oauth_attempts ADD COLUMN link_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE oauth_attempts ADD COLUMN link_session_id TEXT;
ALTER TABLE oauth_attempts ADD COLUMN link_password_hash TEXT;
