import { DefaultUser } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      accessToken?: string;
      refreshToken?: string;
      role?: string;
      email?: string;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User extends DefaultUser {
    access_token?: string;
    refresh_token?: string;
    role?: string;
    email?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    role?: string;
    email?: string;
  }
}
