import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  if (Buffer.byteLength(password, 'utf8') > 72) throw new Error('Password exceeds 72 UTF-8 bytes');
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  if (Buffer.byteLength(password, 'utf8') > 72) return false;
  return bcrypt.compare(password, hash);
};
