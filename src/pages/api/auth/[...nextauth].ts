import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

const backend = process.env.NEXT_PUBLIC_API_URL;

const refreshAccessToken = async (refreshToken: string) => {
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

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: { email: {}, password: {} },
      async authorize(credentials: any) {
        try {
          const res = await axios.post(`${backend}/auth/login`, credentials);
          return { ...credentials, ...res.data };
        } catch (e) {
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
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.access_token;
        token.refreshToken = user.refresh_token;
        token.role = user.role;
        token.accessTokenExpires = Date.now() + 60 * 60 * 1000;
      }
      if (Date.now() > token.accessTokenExpires) {
        const newAccessToken = await refreshAccessToken(token.refreshToken);
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
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.role = token.role;
      session.user.email = token.email;
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
      await axios.post(`${backend}/auth/google-login`, {
        email: user.email,
        name: user.name,
      });

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
