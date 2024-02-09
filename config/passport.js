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
        }).then((user) => {
          let hashedPassword;
          if (user !== null) {
            hashedPassword = bcrypt.hashSync(password, user.salt);
          }
          return (user !== null && user.dataValues.password === hashedPassword) ?
            done(null, {
              id: user.dataValues.id,
              username: user.dataValues.username,
            })
            :
            done(null, false, { message: "Log In failed, invalid credentials." });
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
        done(null, user);
      }
    });
  });

  return passport;
};

export const sessionSecret = "mQ7g2$Lz5sFpRvT9"
