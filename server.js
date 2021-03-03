// create an express app
const express = require("express");
var cors = require('cors')
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
    const sort = { length: -1 };
    const limit = 11;
    const cursor = collection.find(query).sort(sort).limit(limit);

    const user = await cursor.toArray();

    return res.json(user);    
   
  } catch(err) {
    console.log(err);
  }
  finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

app.get("/users/:userId", async function (req, res) {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  
  try {
    await client.connect();

    const database = client.db('ilume');
    const collection = database.collection('users');
   
    const query = {"_id": req.params.userId };
    const cursor = collection.find(query);

    const user = await cursor.toArray();

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

app.use(cors())

// start the server listening for requests
app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));