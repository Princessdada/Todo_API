const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../model/user");

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        const isValid = await user.isValidPassword(password);
        if (!isValid) {
          return done(null, false, { message: "Wrong password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// session handling
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => done(null, user))
    .catch(done);
});

module.exports = passport;
