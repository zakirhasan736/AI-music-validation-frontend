// src/next-auth.d.ts

import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    token?: string;
  }
}
declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: string;
      role?: string;
      token?: string; // use token if it’s named token
      accessToken?: string; // or use accessToken if that's what you intended
    };
  }

  interface User {
    role?: string;
    id?: string;
  }
}
