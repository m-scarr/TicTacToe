import passport from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";

const LocalStrategy = passportLocal.Strategy;

export default (db) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password" },
      (username, password, done) => {
        db.User.findOne({
          where: {
            username,
          },
        }).then(async (user) => {
          if (user !== null && await bcrypt.compare(password, user.dataValues.password)) {
            done(null, { id: user.dataValues.id, username: user.dataValues.username, profilePic: user.dataValues.profilePic });
          } else {
            done(null, false, { message: "Log In failed, invalid credentials." });
          }
        }).catch((err) => {
          console.error(err);
          done(null, false, { message: `Log In failed.` });
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    db.User.findOne({
      where: {
        id,
      },
      attributes: ["id", "username", "profilePic"],
    }).then(function (user) {
      if (user == null) {
        done(new Error("Something went wrong!"));
      } else {
        done(null, { id: user.dataValues.id, username: user.dataValues.username, profilePic: user.dataValues.profilePic });
      }
    }).catch((err) => {
      console.error(err);
      done(new Error("Something went wrong!"));
    });
  });

  return passport;
};

export const sessionSecret = "mQ7g2$Lz5sFpRvT9";
