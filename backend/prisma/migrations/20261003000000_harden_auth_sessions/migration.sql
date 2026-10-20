-- Store SHA-256 digests instead of bearer credentials. PostgreSQL 11+ provides
-- sha256(bytea) without requiring the pgcrypto extension.
UPDATE refresh_tokens SET token = encode(sha256(convert_to(token, 'UTF8')), 'hex')
WHERE token LIKE '%.%.%';

CREATE TABLE auth_rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  reset_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX auth_rate_limits_reset_at_idx ON auth_rate_limits(reset_at);
