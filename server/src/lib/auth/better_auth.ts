import { betterAuth as betterAuthLib } from 'better-auth';
import { admin, openAPI } from 'better-auth/plugins';
import BetterSqlite3 from 'better-sqlite3';
import { env } from '../env';

export const betterAuth = betterAuthLib({
  database: new BetterSqlite3('database.sqlite'),
  plugins: [admin({}), openAPI()],
  trustedOrigins: ['http://localhost:3000', 'http://localhost:4000'],
  emailAndPassword: {
    enabled: true,
    sendEmailVerificationOnSignUp: true,
    minPasswordLength: 1,
    autoSignIn: true,
    async sendVerificationEmail() {
      console.log('Send email to verify email address');
    },
    async sendResetPassword(url, user) {
      console.log('Send email to reset password');
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: env.GOOGLE_AUTH_CLIENT_SECRET,
      redirectURI: 'http://localhost:4000/api/auth/callback/google',
      callbackURL: 'http://localhost:4000',
    },
  },
});

// required for running the cli
// npx @better-auth/cli@latest generate --config ./src/lib/auth/better_auth.ts
// export const auth = betterAuth;
