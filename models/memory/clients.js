/**
 * Created by donaldgreen on 2/3/16.
 */
'use strict';

/**
 * Credit to FrankHassanabad and his github project https://github.com/FrankHassanabad/Oauth2orizeRecipes
 * for providing a nice template to work off of extending from the official oauth2orize documentation examples.
 *
 * This is the configuration of the clients that are allowed to connected to your authorization server.
 * These represent client applications that can connect.  At a minimum you need the required properties of
 *
 * id: (A unique numeric id of your client application )
 * name: (The name of your client application)
 * clientId: (A unique id of your client application)
 * clientSecret: (A unique password(ish) secret that is _best not_ shared with anyone but your client
 *     application and the authorization server.
 *
 * Optionally you can set these properties which are
 * trustedClient: (default if missing is false.  If this is set to true then the client is regarded as a
 *     trusted client and not a 3rd party application.  That means that the user will not be presented with
 *     a decision dialog with the trusted application and that the trusted application gets full scope access
 *     without the user having to make a decision to allow or disallow the scope access.
 */
const clientRoles = {
  user: 'ROLE_USER',
  admin: 'ROLE_ADMIN'
};

const clients = [
  {
    id: '1',
    name: 'test',
    clientId: 'newclient',
    clientSecret: 'newsecret',
    scope: 'read',
    authorities: 'ROLE_USER',
    tokenValiditySeconds: 300
  }
];

/**
 * Returns a client if it finds one, otherwise returns
 * null if a client is not found.
 * @param id The unique id of the client to find
 * @param done The function to call next
 * @returns The client if found, otherwise returns null
 */
exports.find = function (id, done) {
  for (let i = 0, len = clients.length; i < len; i++) {
    let client = clients[i];
    if (client.id === id) {
      return done(null, client);
    }
  }
  return done(null, null);
};

/**
 * Returns a client if it finds one, otherwise returns
 * null if a client is not found.
 * @param clientId The unique client id of the client to find
 * @param done The function to call next
 * @returns The client if found, otherwise returns null
 */
exports.findByClientId = function (clientId, done) {
  for (let i = 0, len = clients.length; i < len; i++) {
    let client = clients[i];
    if (client.clientId === clientId) {
      return done(null, client);
    }
  }
  return done(null, null);
};

exports.clientRoles = clientRoles;