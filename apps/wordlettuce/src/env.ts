import { defineEnvVars } from '@sveltejs/kit/hooks';
import * as v from 'valibot';

export const variables = defineEnvVars({
  API_WORDLETTUCE_TOKEN: {},
  PUBLIC_API_WORDLETTUCE_HOST: {
    public: true,
  },
  AUTH_HOST: {},
});
