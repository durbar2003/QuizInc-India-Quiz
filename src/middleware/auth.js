module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated() && !req.user.completed) {
      return next();
    } else if (req.user.completed) {
      res.render("finished");
    } else {
      res.redirect("/");
    }
  },
  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect("/dashboard");
    } else {
      return next();
    }
  },
};
