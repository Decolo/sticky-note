const express = require('express')
const passport = require('passport')
const router = express.Router()
const GitHubStrategy = require('passport-github').Strategy

passport.serializeUser(function(user, done) {
  // console.log(user)
  done(null, user)
}) 

passport.deserializeUser(function(obj, done) {
  done(null, obj)
})

passport.use(new GitHubStrategy({
  clientID: '64d0a36b98eca256f35f',
  clientSecret: 'c6634efab30446307f46dabf1230235c4d9153e7',
  callbackURL: 'http://127.0.0.1:9000/auth/github/callback'
},
function(accessToken, refreshToken, profile, cb) {
  // User.findOrCreate({ githubId: profile.id }, function (err, user) {
  //   return cb(err, user)
  // })
  cb(null, profile)
}))

router.get('/logout', function(req, res){
  req.session.destroy()
  // 重定向
  res.redirect('/')
})

router.get('/github', passport.authenticate('github'))

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    req.session.user = {
      id: req.user.id,
      username: req.user.displayName || req.user.username,
      avatar: req.user._json.avatar_url,
      provider: req.user.provider
    }
    res.redirect('/admin')
  })

module.exports = router