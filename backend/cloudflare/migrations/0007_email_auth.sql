-- Existing identity rows were created only through verified Google flows.
ALTER TABLE external_identities ADD COLUMN google_verified INTEGER NOT NULL DEFAULT 1 CHECK (google_verified IN (0,1));
-- Fence in-flight email logins when a password recovery revokes sessions.
ALTER TABLE users ADD COLUMN credential_version INTEGER NOT NULL DEFAULT 0;
