const express = require('express');
const passport = require('passport');
const app = express();
const mongoose = require('mongoose');
const port = 4000;

path = require('path');
app.use(passport.initialize());
app.use(passport.session());
require('dotenv').config();
require('./services/passport');

mongoose.connect(
  process.env.DB_CONNECTION, 
  {useNewUrlParser: true }, 
  () => {
    console.log('connected to DB');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/pages/signIn.html'));
});

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/success');
});

app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname + '/pages/activeUser.html'));
});

app.listen(port, () => console.log('listening on 4000'));