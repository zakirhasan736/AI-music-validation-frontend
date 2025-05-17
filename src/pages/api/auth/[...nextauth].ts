import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

const backend = process.env.NEXT_PUBLIC_API_URL;

interface ExtendedUser {
  access_token: string;
  refresh_token: string;
  role?: string;
  email?: string | null;
}

const refreshAccessToken = async (
  refreshToken: string
): Promise<string | null> => {
  try {
    const res = await axios.post(`${backend}/auth/token/refresh`, {
      refresh_token: refreshToken,
    });
    return res.data.access_token;
  } catch (e) {
    console.error('Failed to refresh token', e);
    return null;
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(`${backend}/auth/login`, credentials);
          return { ...credentials, ...res.data };
        } catch (e) {
          console.error('Credentials login error:', e);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        const extendedUser = user as ExtendedUser;

        token.accessToken = extendedUser.access_token;
        token.refreshToken = extendedUser.refresh_token;
        token.role = extendedUser.role;
        token.email = extendedUser.email ?? undefined;
        token.accessTokenExpires = Date.now() + 60 * 60 * 1000;
      }

      if (Date.now() > (token.accessTokenExpires ?? 0)) {
        const newAccessToken = await refreshAccessToken(
          token.refreshToken as string
        );
        if (newAccessToken) {
          token.accessToken = newAccessToken;
          token.accessTokenExpires = Date.now() + 60 * 60 * 1000;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user.role = token.role;
      session.user.email = token.email;
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      return session;
    },

    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await axios.post(`${backend}/auth/google-login`, {
            email: user.email,
            name: user.name,
          });
        } catch (error) {
          console.error('Google login error:', error);
        }
      }
      return true;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 60 * 60,
  },

  jwt: {
    maxAge: 60 * 60,
  },
};

export default NextAuth(authOptions);
