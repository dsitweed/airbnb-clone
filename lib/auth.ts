import { betterAuth } from 'better-auth';

export const auth = betterAuth({});

//  * const auth = betterAuth({
//  * 	database: new PostgresDialect({ connection: process.env.DATABASE_URL }),
//  * });
