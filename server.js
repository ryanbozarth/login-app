
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const session = require('express-session')
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');

const routes = require('./public/routes/index.js');
const user = require('./public/routes/users.js');

const app = express();

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());

//Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport initializ
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Flash messages
app.use(function(req, res , next) {
  res.locals.sucess_msg = req.flash('sucess_msg');
  res.locals.erro_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', routes);
app.use('/users', user);

// Set database port
const DATABASE_URL = process.env.DATABASE_URL ||
  global.DATABASE_URL ||
  (process.env.NODE_ENV === 'production' ?
    'mongodb://ryanbozarth:QmdrKcFz3UB,zG@ds111549.mlab.com:11549/login-app' :
    'mongodb://localhost/login-app');
const PORT = process.env.PORT || 8080;

console.log('database_url: ' + DATABASE_URL);
console.log('port: ' + PORT);

// Run and close the server
function runServer() {
  return new Promise((resolve, reject) => {
    console.log(DATABASE_URL);
    mongoose.connect(DATABASE_URL, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(PORT, () => {
          console.log(`Your app is listening on port ${PORT}`);

          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

app.get('/', (req, res) => {
  res.status(200);
  res.sendFile(__dirname + '/pubic/index.html');
});

exports.app = app;
