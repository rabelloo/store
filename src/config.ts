import type { Mode } from './shared.types';

const { NODE_ENV } = process.env;

const supportedModes = ['production', 'development', 'test'] as const;

const mode: Mode = supportedModes.includes(NODE_ENV as Mode)
  ? (NODE_ENV as Mode)
  : 'production';

export const config = { mode };
