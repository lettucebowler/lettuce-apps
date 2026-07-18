import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  API_WORDLETTUCE_TOKEN: {},
  PUBLIC_API_WORDLETTUCE_HOST: {
    public: true,
  },
  AUTH_HOST: {},
});
