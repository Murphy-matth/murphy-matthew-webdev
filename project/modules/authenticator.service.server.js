/**
 * Used to authenticator requests.
 * Created by Matt on 6/17/17.
 */
var authenticator = {};

authenticator.authenticate = authenticate;

module.exports = authenticator;

function authenticate(req) {
    return req.isAuthenticated();
}