import { z } from "zod";

//the values expected to be found in the .env file
const envSchema = z.object({
    APP_NAME: z.string().default('DoodleDuels'),
    APP_PORT: z.coerce.number(),

    JWT_SECRET: z.string().min(32),

    BBDD_CONNECTION: z.string('postgres'),
    BBDD_HOST: z.hostname().or(z.ipv4()),
    BBDD_SYNCHRONIZE: z.string('production').or(z.string('development')),
    BBDD_SSL: z.coerce.boolean(),
    BBDD_DATABASE_NAME: z.string('db_transcendence'),
    BBDD_USERNAME: z.string(),
    BBDD_ROOT_PASSWORD: z.string(),
    BBDD_PORT: z.coerce.number(),

    REDIS_HOST: z.hostname().or(z.ipv4()),
    REDIS_PORT: z.coerce.number()
});

export default envSchema