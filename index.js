const express = require("express");
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rqste.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const partsCollection = client.db('himashray_motors').collection('car_parts');
        const reviewsCollection = client.db('himashray_motors').collection('reviews');
        const partsQuantityCollection = client.db('himashray_motors').collection('ordered_Parts'); 
        app.get('/parts', async(req, res) => {
            const query = {};
            const cursor = partsCollection.find(query);
            const parts = await cursor.toArray();
            
            res.send(parts);
        })
        app.get('/parts/:partsId', async(req, res)=>{
            const id = req.params.partsId;
            const query = {_id: ObjectId(id)};
            const parts = await partsCollection.findOne(query);
            res.send(parts);
        })
        app.get('/review', async(req, res) => {
            const query = {};
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            
            res.send(reviews);
        })
        app.post('/review', async(req, res)=>{
            const newReviews = req.body;
            const reviews = await reviewsCollection.insertOne(newReviews);
            res.send(reviews);
        })
        app.post('/orderedParts', async(req, res)=>{
            const partsQuantity = req.body;
            const allPartsQuantity = await partsQuantityCollection.insertOne(partsQuantity);
            res.send(allPartsQuantity);
        })
        app.get('/orderedParts', async(req, res) => {
            const query = {};
            const cursor = partsQuantityCollection.find(query);
            const myOrders = await cursor.toArray();
            
            res.send(myOrders);
        })
        app.delete('/orderedParts/:id', async(req, res)=>{
            const id = req.params.id;
            console.log(id);
            const query = {_id: ObjectId(id)}
            const result = await partsQuantityCollection.deleteOne(query);
            res.send(result)
        })
    }
    finally{

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('server for himashray-motors created recently')
})

app.listen(port, () => {
    console.log(`himashray-motors server runnning on ${port}`);
})