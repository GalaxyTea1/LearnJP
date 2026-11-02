CREATE TABLE external_identities (
  issuer TEXT NOT NULL,
  subject TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (issuer, subject),
  UNIQUE (issuer, user_id)
);
-- Short-lived browser-bound PKCE attempts. No provider access/refresh tokens are stored.
CREATE TABLE oauth_attempts (
  id TEXT PRIMARY KEY,
  verifier TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  subject TEXT,
  email TEXT
);
CREATE INDEX oauth_attempt_expiry ON oauth_attempts(expires_at);
