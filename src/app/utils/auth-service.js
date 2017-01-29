import Auth0Lock from "auth0-lock";
import axios from "axios";

const __AUTH0_CLIENT_ID__ = '35Fn4o16JWNyXaKVm4YJT2DL01qrSnF6';
const __AUTH0_DOMAIN__ = 'ricard0javier.eu.auth0.com';
const AUTHENTICATED_EVENT = 'authenticated';
const __ID_TOKEN_KEY__ = 'id_token';
const TOKEN_INFO_URL = "https://{{auth0_domain}}/tokeninfo".replace("{{auth0_domain}}", __AUTH0_DOMAIN__);

let authInstance;
let localLogoutHandler;

const auth = (loginHandler, logoutHandler) => {
  const options = {
    autoclose: true,
    allowForgotPassword: false,
    allowSignUp: false,
    auth: {
      redirect: false,
      responseType: 'token'
    }
  };
  localLogoutHandler = logoutHandler;
  // instantiates Auth0 and store
  const auth0Lock = new Auth0Lock(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__, options);
  // saves the token in the local storage
  auth0Lock.on(AUTHENTICATED_EVENT, result => localStorage.setItem(__ID_TOKEN_KEY__, result.idToken));
  auth0Lock.on(AUTHENTICATED_EVENT, result => loginHandler(result.idToken));
  return auth0Lock;
};

export const getInstance = (loginHandler, logoutHandler) => {
  if (authInstance === undefined) {
    authInstance = auth(loginHandler, logoutHandler);

    const tokenId = localStorage.getItem(__ID_TOKEN_KEY__);
    if (tokenId !== undefined && tokenId !== null) {
      /* eslint-disable camelcase */
      axios
        .post(TOKEN_INFO_URL, {id_token: tokenId})
        .then(() => loginHandler(tokenId))
        .catch(() => logoutHandler());
      /* eslint-enable camelcase */
    }
  }

  return authInstance;
};

export const login = () => {
  getInstance().show({
    responseType: 'token',
    authParams: {
      state: window.location.pathname
    }
  });
};

export const logout = () => {
  localStorage.removeItem(__ID_TOKEN_KEY__);
  localLogoutHandler();
};
