// create an express app
const express = require("express");
const app = express();

const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

// use the express-static middleware
app.use(express.static("public"));

// define the first route
app.get("/users", async function (req, res) {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  
  try {
    await client.connect();

    const database = client.db('ilume');
    const collection = database.collection('users');

    // Query for a movie that has the title 'Back to the Future'
    const query = { name: "Ted Harrington" };
    const cursor = await collection.aggregate([
      { $match: query },
      { $sample: { size: 1 } },
    ]);

    const user = await cursor.next();

    return res.json(user);
  } catch(err) {
    console.log(err);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

// start the server listening for requests
app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));