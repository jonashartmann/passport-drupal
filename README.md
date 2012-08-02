# Passport-Drupal

[Passport](http://passportjs.org/) strategy for authenticating with [Drupal](http://drupal.org/)
websites that use the [OAuth Login Provider](http://drupal.org/project/oauthloginprovider) module.

This module lets you authenticate using a Drupal website in your Node.js applications.
By plugging into Passport, Drupal authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Installation

    $ npm install passport-drupal

## Usage

#### Configure Strategy

The Drupal OAuth authentication strategy authenticates users using a Drupal
account and OAuth tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as `options`
specifying a consumer key, consumer secret, and callback URL.

    passport.use(new Strategy({
        consumerKey: DRUPAL_CONSUMER_KEY,
        consumerSecret: DRUPAL_CONSUMER_SECRET,
        requestTokenURL: "http://www.example.com/oauth/request_token",
        accessTokenURL: "http://www.example.com/oauth/access_token",
        userAuthorizationURL: "https://www.example.com/oauth/authorize",
        resourceURL: "http://www.example.com/oauthlogin/api/user/info",
        callbackURL: "http://www.example.net/auth/drupal/callback"
      },
      function(token, tokenSecret, profile, done) {
        User.findOrCreate({ uid: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'drupal'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/drupal',
      passport.authenticate('drupal'),
      function(req, res){
        // The request will be redirected to the Drupal website for
        // authentication, so this function will not be called.
      });

    app.get('/auth/drupal/callback', 
      passport.authenticate('drupal', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Credits

This module is developed by [Victor Kareh](http://www.vkareh.net/) and is heavily based on work by [Jared Hanson](http://github.com/jaredhanson)

## License

(The MIT License)

Copyright (c) 2011 Jared Hanson

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
