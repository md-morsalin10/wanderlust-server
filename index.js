const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors")
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {

        await client.connect();

        const db = client.db("wanderlust")
        const destinationCollection = db.collection('destination')
        const bookingCollection = db.collection('booking')

        app.get('/destination', async(req, res)=>{
            const result =await destinationCollection.find().toArray()
            res.send(result)
        })

        app.post('/destination', async(req, res)=>{
            const destinationData = req.body
            console.log(destinationData);
            
            const result = await destinationCollection.insertOne(destinationData)
            res.send(result)
        })

        app.post("/booking", async(req, res)=>{
            const bookingData = req.body
            const result = await bookingCollection.insertOne(bookingData)
            res.send(result)
        })

        app.get("/booking/:userId", async(req, res)=>{
            const {userId} = req.params
            const result = await bookingCollection.find({userId:userId}).toArray()
            res.send(result)
        })

        app.delete("/booking/:bookingId", async(req, res)=>{
            const {bookingId}= req.params
            const result = await bookingCollection.deleteOne({_id: new ObjectId(bookingId)})
            res.send(result);
        })

        app.get("/destination/:id", async(req, res)=>{
            const id = req.params
            const result =await destinationCollection.findOne({
                _id: new ObjectId(id)
            })
            res.send(result)
        })
        app.patch('/destination/:id', async(req, res)=>{
            const id = req.params
            const updatedData = req.body
            console.log(updatedData, "updated data");
            
            const result = await destinationCollection.updateOne(
                {_id: new ObjectId(id)},
                {$set: updatedData}
            )
            res.send(result)
        })

        app.delete("/destination/:id", async(req, res)=>{
            const id = req.params
            const result = await destinationCollection.deleteOne(
                {_id: new ObjectId(id)}
            )
            res.send(result)
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("server is serving")
})

app.listen(port, () => {
    console.log(`server is running on the ${port}`)
})
