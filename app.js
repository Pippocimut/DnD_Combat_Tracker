const path = require('path');
const { doubleCsrf } = require("csrf-csrf");
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');
const User = require('./models/user');
const Token = require('./models/token')

const MONGODB_URI =
'mongodb+srv://NodeJSUser:fkUIzkn8Owv0IJjk@cluster0.lxafrex.mongodb.net/dnd?retryWrites=true&w=majority'


const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const {
  generateToken, // Use this in your routes to provide a CSRF hash cookie and token.
  doubleCsrfProtection, // This is the default CSRF protection middleware.
} = doubleCsrf({
  getSecret: () => "Secret", // A function that optionally takes the request and returns a secret
  cookieName: "__Host.x-csrf-token", // The name of the cookie to be used, recommend using Host prefix.
  cookieOptions: {
    sameSite : "lax",  // Recommend you make this strict if possible
    path : "/",
    secure : false, // See cookieOptions below
  },
  size: 64, // The size of the generated tokens in bits
  ignoredMethods: ["GET", "HEAD", "OPTIONS"], // A list of request methods that will not be protected.
  getTokenFromRequest: (req) => {
    return req.body._csrf
  }
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    console.log("Saving file")
    let date = new Date().toISOString().replace('.','').replace(/\:/gi,'')
    const newFilename = date+"-"+file.originalname
    console.log("new file name"+newFilename)
    try {
      cb(null, newFilename);
    } catch (error) {
      console.log(error);
    }
  }
});

const fileFilter = (req, file, cb) => {
  console.log("filerting")
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/combat');
const authRoutes = require('./routes/auth');
const { error } = require('console');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));

//app.use(cookieParser())
//app.use(doubleCsrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  //res.locals.csrfToken = req.csrfToken();
  next();
});



/*app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});*/

/*app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  Token.findById("65b7a195759b1281dc8f08a5")
  .then(token =>{
    if(!token){
      const newToken = new Token({
        title: "Catty",
        position: {
          x: "200",
          y: "200"
        }
      })
    
      newToken.save().then(result => {
        next();
      }).catch(err=>{
        console.log("Error saving")
        console.log(err)
        next()
      })
    }
    next()
  })

});*/

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(...);
  // res.redirect('/500');
  console.log(error)
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated : req.session.isLoggedIn
  });
});

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
