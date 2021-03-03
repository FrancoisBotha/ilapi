// create an express app
const express = require("express");
const app = express();

const { MongoClient } = require("mongodb");

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const uri = process.env.MONGODB_URI;

// use the express-static middleware
app.use(express.static("public"));


app.get("/users", async function (req, res) {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  
  try {
    await client.connect();

    const database = client.db('ilume');
    const collection = database.collection('users');
   
    const query = {};
    const cursor = await collection.aggregate([
      { $match: query },
      { $sample: { size: 5 } },
      { $project: 
        {
          name: 1,
          fav: 1
        }
      }
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

app.get("/test", async function (req, res) {
  try {
    return res.end('test' + process.env.MONGODB_URI);
  } catch(err) {
    console.log(err);
  }
  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
});

// start the server listening for requests
app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));