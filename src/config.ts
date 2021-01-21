import type { Mode } from './shared.types';

const env = process.env.NODE_ENV || '';

const supportedModes = ['production', 'development', 'test'];

const mode: Mode = supportedModes.includes(env) ? (env as Mode) : 'production';

export const config = { mode };
