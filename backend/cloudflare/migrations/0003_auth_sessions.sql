-- Stable session identity permits logout with a pre-rotation cookie to revoke its successor.
-- Existing pre-CF3 rows are not accepted by the new JWT format and expire naturally.
ALTER TABLE refresh_tokens ADD COLUMN session_id TEXT;
CREATE UNIQUE INDEX refresh_session_id ON refresh_tokens(session_id);
CREATE INDEX refresh_expiry ON refresh_tokens(expires_at);
CREATE INDEX auth_rate_limit_expiry ON auth_rate_limits(reset_at);
