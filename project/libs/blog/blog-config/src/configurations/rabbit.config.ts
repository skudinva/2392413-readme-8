import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

const DEFAULT_RABBIT_PORT = 5672;

export interface NotifyConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  exchange: string;
  queue: string;
}

const validationSchema = Joi.object({
  host: Joi.string().hostname().required(),
  port: Joi.number().port().default(DEFAULT_RABBIT_PORT),
  user: Joi.string().required(),
  password: Joi.string().required(),
  exchange: Joi.string().required(),
  queue: Joi.string().required(),
});

function validateConfig(config: NotifyConfig): void {
  const { error } = validationSchema.validate(config, { abortEarly: true });

  if (error) {
    throw new Error(`[Rabbit config validation error]: ${error.message}`);
  }
}

function getConfig(): NotifyConfig {
  const config: NotifyConfig = {
    host: process.env.RABBIT_HOST,
    port: parseInt(process.env.RABBIT_PORT, 10) ?? DEFAULT_RABBIT_PORT,
    user: process.env.RABBIT_USER,
    password: process.env.RABBIT_PASSWORD,
    queue: process.env.RABBIT_QUEUE,
    exchange: process.env.RABBIT_EXCHANGE,
  };

  validateConfig(config);
  return config;
}

export default registerAs('rabbit', getConfig);
