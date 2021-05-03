// Based off https://auth0.com/blog/update-auth0-applications-using-the-management-api/. Using getToken() and init() functions from example
// Code to access api and update app metadata is writen by me.

import axios from 'axios';
import { ManagementClient } from 'auth0';

import authConfig from '../auth_managment_config.json';

let managementClient: ManagementClient;

/**
    * Get an access token from the Auth0 API
    * We will use this access token to connect to the management API
    * To get a token, we need to provide client_id and client_secret
    * Both of these can be found in the APIs section of Auth0 dashboard
    */
function getToken() {
  // get the info we need
  const clientId = authConfig.CLIENT_ID;
  const clientSecret = authConfig.CLIENT_SECRET;
  const url = `https://${authConfig.CLIENT_DOMAIN}/oauth/token`;

  // make the call to the API via POST
  return axios
    .post(url, {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      audience: `https://${authConfig.CLIENT_DOMAIN}/api/v2/`,
    })
    .then((res) => res.data)
    .catch((err) => err);
}

/**
    * Create a management client
    */
export function init() {
  return getToken()
    .then((data) => data.access_token)
    .then((token) => {
      managementClient = new ManagementClient({
        domain: `${authConfig.CLIENT_DOMAIN}`,
        token,
        audience: `https://${authConfig.CLIENT_DOMAIN}/api/v2/`,
      });
      return true;
    })
    .catch((err) => err);
}

export function updateAppMetadata(user_id: string, metadata: any): void {
  const params = { id: user_id };
  managementClient.updateAppMetadata(params, metadata, (err, _) => {
    if (err) {
      throw err;
    }
  });
}
