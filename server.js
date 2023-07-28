// Require/use express.
const express = require("express");

// Require/use body-parser.
const bodyParser = require("body-parser");

// Require/use mongodb.
const MongoClient = require("mongodb").MongoClient;

// Create express app.
const app = express();

// MONGO_URI.
const MONGO_URI =
  "mongodb+srv://GeorgeIoannou:Georgios33mongodb3@cluster0.j9rriyy.mongodb.net/?retryWrites=true&w=majority";

// Port.
const PORT = process.env.PORT || 3000;

// Connect to MongoDB database.
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then((client) => {
    // Successful console message indicating successful connection to the MognoDB database.
    console.log("Connected to Database");

    // Changing the database.
    const db = client.db("star-wars-quotes");

    // Specify the collection.
    const quotesCollection = db.collection("quotes");

    // bodyParser is the middleware responsible for parsing incoming request bodies before the handlers.
    app.use(bodyParser.urlencoded({ extended: true }));

    // Set view engine to ejs.
    // Tell Express we are using EJS as the template engine.
    app.set("view engine", "ejs");

    // Middleware that tells Express to serve static files from a directory named "public".
    app.use(express.static("public"));

    // Make the server accept JSON data.
    app.use(bodyParser.json());

    // Method: GET
    // Endpoint: /
    // Callback/Controller: Get quote.
    app.get("/", (req, res) => {
      db.collection("quotes")
        .find()
        .toArray()
        .then((results) => {
          res.render("index.ejs", { quotes: results });
        })
        .catch((error) => console.error(error));
    });

    // Method: POST
    // Endpoint: /quotes
    // Callback/Controller: Create quote.
    app.post("/quotes", (req, res) => {
      // Add items/documents into the MongoDB collection.
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });

    // Method: PUT
    // Endpoint: /quotes
    // Callback/Controller: Update quote.
    app.put("/quotes", (req, res) => {
      // Updating a document from the MongoDB collection.
      quotesCollection
        .findOneAndUpdate(
          { name: "Yoda" },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => {
          res.json("Success!");
        })
        .catch((error) => console.error(error));
    });

    // Method: DELETE
    // Endpoint: /quotes
    // Callback/Controller: Delete quote.
    app.delete("/quotes", (req, res) => {
      // Deleting a document from the MongoDB collection.
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No quote to delete!");
          }
          res.json(`Deleted Darth Vader's quote`);
        })
        .catch((error) => console.error(error));
    });

    // Create a server that browsers can connect to.
    app.listen(PORT, () => {
      console.log("Express server running on port " + PORT + "!");
      //console.log("http://localhost:3000/");
    });
  })

  .catch((error) => console.error(error));
