export const backUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://api.supercola.co.kr'
    : 'http://localhost:3065';
export const callbackUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://api.supercola.co.kr/user/auth/google/callback'
    : 'http://localhost:3065/user/auth/google/callback';
export const frontUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://supercola.co.kr'
    : 'http://localhost:3000';
