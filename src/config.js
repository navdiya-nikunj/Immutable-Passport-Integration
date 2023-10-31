import { config, passport  } from '@imtbl/sdk';

const passportInstance = new passport.Passport({
baseConfig: new config.ImmutableConfiguration({
environment: config.Environment.SANDBOX,
  }),
  clientId: 'Zp4RTE7dVopUvFfb3IbKEm6S31toc6Gg',
  redirectUri: 'https://localhost:3000/connect',
  logoutRedirectUri: 'https://localhost:3000/',
  audience: 'platform_api',
  scope: 'openid offline_access email transact'
});
export default passportInstance;