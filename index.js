const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3036qk8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const myCoffeeDB = client.db("mycoffeeDB");
        const myCollection = myCoffeeDB.collection("mycollection");
        const myCol = myCoffeeDB.collection("users")

        app.get('/product', async(req, res) => {
            
            const data = myCollection.find()
            const result =await data.toArray()
            res.send(result)
        })
        app.post('/product', async (req, res) => {
            const user = req.body
            console.log(user)
            const result = await myCollection.insertOne(user)
            res.send(result)
        })
        app.get('/product/:id', async(req, res) => {
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await myCollection.findOne(query)
            res.send(result)
        })
        app.delete('/product/:id', async(req,res) => {
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await myCollection.deleteOne(query)
            console.log(result)
            res.send(result)
        })

        app.put('/product/:id', async(req,res) => {
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const options = { upsert: true };
            const coffeeData = req.body
            const updateDoc = {
                $set:coffeeData
            }
            const result = await myCollection.updateOne(query,updateDoc,options)
            res.send(result)
        })

        // user data go to server site
        app.post('/signIn' ,async(req, res) => {
            const user = req.body
            console.log(user)
            const result = await myCol.insertOne(user)
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('coffee has getting on client server')
})

app.listen(port, () => {
    console.log(`server has running on port:${port}`)
})