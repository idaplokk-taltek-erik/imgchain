import { betterAuth as betterAuthLib } from 'better-auth';
import { openAPI } from 'better-auth/plugins';
import BetterSqlite3 from 'better-sqlite3';

export const betterAuth = betterAuthLib({
  database: new BetterSqlite3('database.sqlite'),
  plugins: [openAPI()],
  emailAndPassword: {
    enabled: true,
    sendEmailVerificationOnSignUp: true,
    async sendVerificationEmail() {
      console.log('Send email to verify email address');
    },
    async sendResetPassword(url, user) {
      console.log('Send email to reset password');
    },
  },
  // socialProviders: {
	// 	google: {
	// 		clientId: process.env.GOOGLE_CLIENT_ID || "",
	// 		clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
	// 	},
	// },
});
