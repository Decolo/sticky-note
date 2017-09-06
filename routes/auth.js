const express = require('express')
const passport = require('passport')
const router = express.Router()
const GitHubStrategy = require('passport-github').Strategy

passport.serializeUser(function(user, done) {
  console.log('---serializeUser---')
  console.log(user)
  done(null, user)
}) 

passport.deserializeUser(function(obj, done) {
  console.log('---deserializeUser---')
  done(null, obj)
})

passport.use(new GitHubStrategy({
  clientID: 'b7bfd7fcc56fdb76ad7f',
  clientSecret: '02de06a1c53b5d6aa9d5d805af6b936b42381ddd',
  callbackURL: 'http://127.0.0.1:9000/auth/github/callback'
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ githubId: profile.id }, function (err, user) {
    return cb(err, user);
  })
}
))

router.get('/logout', function(req, res){
  req.session.destroy()
  res.redirect('/')
})

router.get('/github',
  passport.authenticate('github'));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    req.session.user = {
      id: req.user.id,
      username: req.user.displayName || req.user.username,
      avatar: req.user._json.avatar_url,
      provider: req.user.provider
    }
    res.redirect('/')
  })