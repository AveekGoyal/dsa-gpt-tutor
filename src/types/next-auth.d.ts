import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    username: string;
    email: string;
    name?: string;
    image?: string;
    bio?: string;
    preferredLanguages?: string[];
  }

  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      name?: string;
      image?: string;
      bio?: string;
      preferredLanguages?: string[];
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: User;
  }
}
