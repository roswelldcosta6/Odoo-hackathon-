import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hash plain-text password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare plain-text password with hashed password
 */
export const comparePassword = async (
  plain: string,
  hashed: string
): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};
