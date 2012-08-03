/**
 * Module dependencies.
 */
var util = require('util'),
    OAuthStrategy = require('passport-oauth').OAuthStrategy;

/**
 * `Strategy` constructor.
 *
 * The Drupal authentication strategy authenticates requests by delegating to
 * a Drupal website using the OAuth protocol.
 *
 * Applications must supply a `verify` callback which accepts a `token`,
 * `tokenSecret` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `requestTokenURL`       URL used to obtain an unauthorized request token
 *   - `accessTokenURL`        URL used to exchange a user-authorized request token for an access token
 *   - `userAuthorizationURL`  URL used to obtain user authorization
 *   - `consumerKey`           identifies client to service provider
 *   - `consumerSecret`        secret used to establish ownership of the consumer key
 *   - `callbackURL`           URL to which the service provider will redirect the user after obtaining authorization
 *   - `resourceURL`           URL used to obtain user data
 *
 * Examples:
 *
 *     passport.use(new Strategy({
 *         consumerKey: '123-456-789',
 *         consumerSecret: 'shhh-its-a-secret',
 *         requestTokenURL: 'http://www.example.com/oauth/request_token',
 *         accessTokenURL: 'http://www.example.com/oauth/access_token',
 *         userAuthorizationURL: 'http://www.example.com/oauth/authorize',
 *         resourceURL: 'http://www.example.com/oauthlogin/api/user/info',
 *         callbackURL: 'http://www.example.net/auth/drupal/callback'
 *       },
 *       function(token, tokenSecret, profile, done) {
 *         User.findOrCreate({ uid: profile.id }, function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  OAuthStrategy.call(this, options, verify);
  this._resourceURL = options.resourceURL;
  this.name = 'drupal';
}

/**
 * Inherit from `OAuthStrategy`.
 */
util.inherits(Strategy, OAuthStrategy);

/**
 * Retrieve user profile from Drupal
 *
 * This function constructs a normalized profile, along with Drupal user roles
 *
 * @param {String} token
 * @param {String} tokenSecret
 * @param {Object} params
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(token, tokenSecret, params, done) {
  this._oauth.post(this._resourceURL, token, tokenSecret, {}, function (err, body, res) {
    if (err) { return done(err); }
    try {
      var json = JSON.parse(body);
      // Create normalized user profile
      var profile = {
        provider: 'drupal',
        id: Number(json.uid),
        displayName: json.name,
        emails: [{value: json.mail}]
      };
      // Add Drupal user roles
      profile.roles = [];
      for (role in json.roles) {
        profile.roles.push(json.roles[role]);
      }
      profile._raw = body;
      profile._json = json;
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
