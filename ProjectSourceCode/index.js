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

// ** allow public access to static css and img files **
app.use(express.static(path.join(__dirname, 'src/resources')));

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
    extname: 'hbs',
    layoutsDir: __dirname + '/src/views/layouts',
    partialsDir: __dirname + '/src/views/partials'
});


// database configuration
const dbConfig = {
    host: process.env.HOST, // the database server
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

    //  ---------------------------------------------------------------------
    //  TODO: If Database is empty, add the items from the API in a function. This shouldn't happen every time we recieve a discover Post request
    //  I think we should not have an insert.sql file and just add from the external API if the db is empty
    //  ---------------------------------------------------------------------

    populate_items();

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
          // res.status(200).json({message: 'Success'}) 

          res.redirect('/login');
      })
      .catch(err => {
          // For testing:
          // res.status(400).json({message: 'Invalid input'})

          res.render('pages/register', {message: "Username taken. Please use a different username."});
      })
});

app.post('/login', async (req, res) => {
  // check if password from request matches with password in DB
  const query = 'SELECT * FROM users where username = $1';
  let user = await getQuery(query, [req.body.username]);

  if(!user){
    // For testing:
    // res.status(400).json({message: 'Invalid input'})
    // return;

    res.render('pages/login.hbs', {message: "Incorrect username or password."});
  }

  try {
    const match = await bcrypt.compare(req.body.password, user.password);
    if(!match){
        // For testing:
        // res.status(400).json({message: 'Invalid input'})
  
        res.render('pages/login.hbs', {message: "Incorrect username or password."});
    }else{
        // For testing:
        // res.status(200).json({message: 'Success'}) 
  
  
        //save user details in session like in lab 7
        req.session.user = user;
        req.session.save();
        res.redirect('/discover');
    }
  } catch (err){
    console.error("Error during login:", err);
    res.status(500).render('pages/login.hbs', { message: "An error occurred. Please try again." });
  }
});

// Authentication Middleware.
const auth = (req, res, next) => {
 if (!req.session.user) {
     // Default to login page.
     return res.redirect('/login');
 }
 next();
};

// Authentication Required
app.use(auth);


app.get('/discover', async (req, res) => {
  const items_query = "SELECT * FROM items";

  try {
    let items = await db.any(items_query);
    res.render('pages/discover.hbs', {items});
  }
  catch (error) {
    return console.log(error);
  }

});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if(err){
      return res.status(500).send('Failed to destroy session');
    }

    res.render('pages/logout.hbs')

  });
});

app.get('/profile', async (req, res) => {
  const username = req.session.user.username;
  const query_outfit_1 = 'SELECT * FROM items INNER JOIN outfits ON items.item_id = outfits.item_id_1 WHERE outfits.username = $1;';
  const query_outfit_2 = 'SELECT * FROM items INNER JOIN outfits ON items.item_id = outfits.item_id_2 WHERE outfits.username = $1;';
  const query_wishlist = `SELECT * FROM items INNER JOIN wishlist ON items.item_id = wishlist.item_id WHERE wishlist.username = $1;`;

  db.task(async t => {
    const outfits_1 = await t.any(query_outfit_1, [username]);
    const outfits_2 = await t.any(query_outfit_2, [username]);
    const items = await t.any(query_wishlist, [username]);

    console.log("Outfits 1: ", outfits_1);
    console.log("Outfits 2: ", outfits_2);
    let outfits = outfits_1.map((item, index) => [item, outfits_2[index]]);
    console.log("Overall Outfits: ", outfits);
    return {outfits, items};
  })
  .then(data => {
    res.render('pages/profile.hbs', {username, outfits: data.outfits, items: data.items})
  })
});


app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if(err){
      return res.status(500).send('Failed to destroy session');
    }

    res.render('pages/logout.hbs')

  });
});


/*

Wishlist POST API
Adds entries to the wishlist table upon pressing the wishlist button on discover page.
TODO:
  Currently able to wishlist an item multiple times and make duplicate entries into the wishlist table. Needs fix.
  Would like to update discover to disable the button for items already wishlisted by the user.
  Also would like for the page to not refresh upon adding an item to the wishlist.
*/


app.post('/wishlist', (req, res) => {
  const query = "INSERT INTO wishlist (username, item_id) VALUES ($1, $2) RETURNING *;";

  db.one(query, [req.session.user.username, req.body.item_id])
    .then(() => {
      res.redirect('discover')
      // res.status(200).json({ success: true, message: "Wishlist item added successfully!" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, message: "Failed to add wishlist item." });
    });
});

/*
outfit GET API
Takes user to outfit creator page
*/
app.get('/outfit', (req, res) => {
  const query = 'SELECT * FROM items;';
  db.any(query)
  .then((items) => {
    res.render('pages/outfit', {items});
  })
  .catch(err => {
    return console.log(err);
  })
})

/*
outfit POST API
Adds entry to outfits table, holds up to 3 items, should add top items before bottom items so that the outfit is displayed correctly
*/

app.post('/outfit', (req, res) => {
  const query = "INSERT INTO outfits (username, item_id_1, item_id_2) VALUES ($1, $2, $3) RETURNING *;";
  db.any(query, [req.session.user.username, req.body.item_ids[0], req.body.item_ids[1]])
  .then(() => {
    res.redirect('profile');
  })
  .catch(err => {
    return console.log(err);
  })
})

// -----------------------
// Miscellaneous functions
// -----------------------


// Used in case queries may return nothing
async function getQuery(query, args){
  try {
    let result = await db.one(query, args);
    return result;
  }
  catch(err){
    console.log(err);
    return null;
  }
}

/* populate_items: Checks if items table in the database is empty, if so, will use the external API to repopulate the table.
  Use: If docker compose down -v is used, the database will be updated with the most recent external API data. Only works if insert.sql is commented out.
*/
async function populate_items(){
  let empty_query = "SELECT CASE WHEN EXISTS (SELECT * FROM items LIMIT 1) THEN 1 ELSE 0 END"

  db.one(empty_query)
  .then((result) => {
    // console.log(result)
    if(result.case == 0){ // Items table is empty
      // Insert into items table with external API
      
      //store items in database
      const query = "INSERT INTO items (name, item_img, price, category, description) VALUES ($1, $2, $3, $4, $5) returning item_id;"
      var clothing_items;
      fetch("https://fakestoreapi.com/products").then((res) => res.json()).then((json) => {
        clothing_items = json;
        // console.log(clothing_items);

        ci_length = Object.keys(json).length;
        // console.log(ci_length);

        for (i = 0; i < ci_length; i++) {
          db.one(query, [clothing_items[i].title, clothing_items[i].image, clothing_items[i].price, clothing_items[i].category, clothing_items[i].description])
          // .then(msg => console.log(msg))
          .catch(error => console.log(error));
        }

        //delete electronic items
        //const query2 = "DELETE FROM items WHERE category = 'electronics'"
        //db.one(query).then(msg => console.log(msg)).catch(error => console.log(error));

        // console.log("Items table has been repopulated.");
        return;
      });
    }
    else{
      // console.log("Items table already populated.")
      return;
    }
  })
  .catch(err => {
    console.log(err);
  })
}

function printItems(){
  let query = "SELECT * FROM items;"
  db.any(query)
  .then((data) => {
    console.log(data);
  })
  .catch(err => {
    return console.log(err);
  })
}

function printWishlist(){
  let query = "SELECT * FROM wishlist;"
  db.any(query)
  .then((data) => {
    console.log(data);
  })
  .catch(err => {
    return console.log(err);
  })
}

function printOutfits(){
  let query = "SELECT * FROM outfits;";
  db.any(query)
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    return console.log(err);
  })
}

// starting the server
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');