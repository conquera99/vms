import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { config as loadEnv } from 'dotenv';

import { defineConfig } from 'prisma/config';

const envPath = existsSync(resolve('.env')) ? '.env' : '.env.template';

loadEnv({ path: envPath });

export default defineConfig({
	schema: 'src/db/schema.prisma',
	migrations: {
		path: 'src/db/migrations',
	},
	datasource: {
		url: process.env.DATABASE_URL ?? '',
		shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
	},
});
