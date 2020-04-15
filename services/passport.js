var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: '731982883373-onah9k5cb3kj1la80a5np8d8cgo6fegv.apps.googleusercontent.com',
    clientSecret: 'YdBTQr1TWkO7-GHXf2y1NzfF',
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }
      const user = await new User({
        googleId: profile.id,
        displayName: profile.displayName
      }).save();
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));
