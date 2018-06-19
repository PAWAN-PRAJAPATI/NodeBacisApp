var express = require('express');
var app = express()
var appMongo = require("./appMongo")

var bodyParser = require('body-parser');
var mongoose  =  require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = 'mongodb://vishwesh1010:vishwesh101025@ds163530.mlab.com:63530/driving';
mongoose.connect(MONGO_URL)
var db =  mongoose.connection;
Book = require('./book');
function mongo(next){
    console.log("In mongo")
MongoClient.connect(MONGO_URL, function(err, client) {
    console.log("Connected successfully to server");
    const dbo = client.db();
    dbo.collection('books').insert(
        {
          title: 'book1',
          text: 'Hopefully this works!'
        },
        {
            title: 'book2',
           text: 'Hopefully this works!'
        },
        function (err, res) {
          if (err) {
            db.close();
            return console.log(err);
          }
          console.log("Mongo Connected")
          db.close();
          next()
        }
      )
    client.close();
  });
}

var notesMongo = new appMongo("driving","books")

app.get('/books', (req, res,next) => {
mongo(next)
},(req,res,next)=>{
    console.log("books")
    notesMongo.find({title:"book1"},(data,req,res,next,err)=>{res.send(data)},req,res,next)
    
    //res.send("books");
    /*
    Book.getBooks(function(err, books){
        console.log("books1")
        if(err){
            throw  err;
        }
        console.log("Hello")
        res.send("books");
    })
    */
});


app.get('/', (req, res) => {
    res.send('Hello World !');
});


app.listen(2000);
