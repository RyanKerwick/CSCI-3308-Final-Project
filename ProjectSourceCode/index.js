// Importing Dependencies

const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcryptjs'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part C.
app.use(express.static('public'));


// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
    extname: 'hbs',
    layoutsDir: __dirname + '/src/views/layouts',
    partialsDir: __dirname + '/src/views/partials',
});


// database configuration
const dbConfig = {
    host: 'db', // the database server
    port: 5432, // the database port
    database: process.env.POSTGRES_DB, // the database name
    user: process.env.POSTGRES_USER, // the user account to connect with
    password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);


// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });


// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/src/views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.


// initialize session variables
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
    })
);
  
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
);


// API Routes go here

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('pages/login.hbs');
});

app.get('/register', (req, res) => {
  res.render('pages/register.hbs');
});

// Register
app.post('/register', async (req, res) => {
  //hash the password using bcrypt library
  const hash = await bcrypt.hash(req.body.password, 10);
  
  const query = 'INSERT INTO users (username, password) values ($1, $2) returning *';
  db.one(query, [req.body.username, hash])
      .then(() => {
          // For testing:
          //res.status(200).json({message: 'Success'}) 

          res.redirect('/login');
      })
      .catch(err => {
          // For testing:
          res.status(400).json({message: 'Invalid input'})

          // res.redirect('/register');
      })
});

app.post('/login', async (req, res) => {
  // check if password from request matches with password in DB
  const query = 'SELECT * FROM users where username = $1';
  let user = await getQuery(query, [req.body.username]);

  if(!user){
    // For testing:
    res.status(400).json({message: 'Invalid input'})
    return;

    // res.render('pages/login.hbcf s', {message: "Incorrect username or password"});
  }

  const match = await bcrypt.compare(req.body.password, await bcrypt.hash(user.password, 10)); // Added hash for testing purposes
  if(!match){
      // For testing:
      res.status(400).json({message: 'Invalid input'})

      // res.render('pages/login.hbs', {message: "Incorrect username or password"});
  }else{
      // For testing:
      res.status(200).json({message: 'Success'}) 


      //save user details in session like in lab 7
      //req.session.user = user;
      //req.session.save();
      //res.redirect('/discover');
  }
});

app.get('/discover', (req, res) => {
  //store items in database
  const query = "INSERT INTO items (name, item_img, price, category) VALUES ($1, $2, $3, $4);"
  var clothing_items;
  fetch("https://fakestoreapi.com/products").then((res) => res.json()).then((json) => {
    clothing_items = json;
    console.log(json);
    for (i = 0; i < 20; i++) {
      db.one(query, [clothing_items.i.title, clothing_items.i.image, clothing_items.i.price, clothing_items.i.category])
      .then(msg => console.log(msg))
      .catch(error => console.log(error));
    }
  });
  res.render('pages/discover.hbs')
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if(err){
      return res.status(500).send('Failed to destroy session');
    }

    res.render('pages/logout.hbs')

  });
});


// Miscellaneous functions

// Used in case queries may return nothing
async function getQuery(query, args){
  try {
    let result = await db.one(query, args);
    return result;
  }
  catch(err){
    // console.log(err);
    return null;
  }
}


app.post('/login', async (req, res) => {
  // check if password from request matches with password in DB
  const query = 'SELECT * FROM users where username = $1'
  let user = await db.one(query, [req.body.username]);

  const match = await bcrypt.compare(req.body.password, user.password);
  if(!match){
      res.render('pages/login.hbs', {message: "Incorrect username or password"});
  }else{
      //save user details in session like in lab 7
      req.session.user = user;
      req.session.save();
      res.redirect('/discover');
  }
})

// Register
app.post('/register', async (req, res) => {
  //hash the password using bcrypt library
  const hash = await bcrypt.hash(req.body.password, 10);
  
  const query = 'INSERT INTO users (username, password) values ($1, $2) returning *';
  db.one(query, [req.body.username, hash])
      .then(() => {
          res.redirect('/login');
          // For testing:
          res.status(200).json({message: 'Success'}) 

          res.redirect('/login');
      })
      .catch(err => {
          // For testing:
          res.status(400).json({message: 'Invalid input'})

          // res.redirect('/register');
      })
});

app.post('/login', async (req, res) => {
  // check if password from request matches with password in DB
  const query = 'SELECT * FROM users where username = $1';
  let user = await getQuery(query, [req.body.username]);

  if(!user){
    // For testing:
    res.status(400).json({message: 'Invalid input'})
    return;

    // res.render('pages/login.hbs', {message: "Incorrect username or password"});
  }

  console.log(req.body.password);
  console.log(user.password);
  const match = await bcrypt.compare(req.body.password, user.password);
  if(!match){
      // For testing:
      res.status(400).json({message: 'Invalid input'})

      // res.render('pages/login.hbs', {message: "Incorrect username or password"});
  }else{
      // For testing:
      res.status(200).json({message: 'Success'}) 


      //save user details in session like in lab 7
      //req.session.user = user;
      //req.session.save();
      //res.redirect('/discover');
  }
});

// Authentication Required
app.use(auth);


app.get('/discover', (req, res) => {
  //store items in database
  const query = "INSERT INTO items (name, item_img, price, category) VALUES ($1, $2, $3, $4);"
  var clothing_items;
  fetch("https://fakestoreapi.com/products").then((res) => res.json()).then((json) => {
    clothing_items = json;
    console.log(json);
    for (i = 0; i < 20; i++) {
      db.one(query, [clothing_items.i.title, clothing_items.i.image, clothing_items.i.price, clothing_items.i.category])
      .then(msg => console.log(msg))
      .catch(error => console.log(error));
    }
  });

  res.render('pages/discover.hbs')
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if(err){
      return res.status(500).send('Failed to destroy session');
    }

    res.render('pages/logout.hbs')

  });
});


// Miscellaneous functions

// Used in case queries may return nothing
async function getQuery(query, args){
  try {
    let result = await db.one(query, args);
    return result;
  }
  catch(err){
    // console.log(err);
    return null;
  }
}


// starting the server
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');