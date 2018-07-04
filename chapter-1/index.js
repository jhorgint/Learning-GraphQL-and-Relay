const graphqlHTTP = require('express-graphql');
const express = require('express');

const { graphql } = require('graphql');
const readLine = require('readline');

const app = express();
const mySchema = require('./schema/main');

var MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const rli = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

const MONGO_URL = 'mongodb://localhost:27017';

// This is the <rli interface> 
// just comment one in order to use the other
MongoClient.connect(MONGO_URL, (err, client) => {
    assert.equal(null, err);
    console.log('Connected to MongoDB server');
    var db = client.db('test');

    rli.question('Client Request: ', inputQuery => {
        graphql(mySchema, inputQuery, {}, db).then(result => {
            console.log('Server Answer :', result.data);
        });
        client.close(() => rli.close());
    });
});

// this the <HTTP interface>
MongoClient.connect(MONGO_URL, (err, client) => {
    assert.equal(null, err);
    console.log('Connected to MongoDB server');
    var db = client.db('test');

    app.use('/graphql', graphqlHTTP({
        schema: mySchema,
        context: db,
        graphiql: true
    }));

    app.listen(3000, () => {
        console.log('Running Express.js on port 3000')
    });
});