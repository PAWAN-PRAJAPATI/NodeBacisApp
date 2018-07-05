const utils = require('./utils')
const express = require('express')
const bodyParser = require('body-parser')
const app = express.Router()
var ObjectID = require('mongodb').ObjectID

var appMongo = require("./appMongo")
app.use(bodyParser.urlencoded())

var contact = new appMongo("user64","contacts")



function callbackConnect(collection,db,req,res,next,err){

    //collection.createIndex( { location: "2dsphere" } )
    
    //console.log(req.body)
    total = req.body
    console.log(total)
    if(err){
        res.send(JSON.stringify({status:"error1"}))
        db.close()
    }
    //db.tollbooth.createIndex( { location: "2d" } )
    //console.log(req.body)
    total = req.body
    console.log(total)
    if(err){
        res.send(JSON.stringify({status:"error1"}))
        db.close()
    }
    collection.insertOne(req.body,function(err,result){
        if(err){
            console.log(err)
            res.send(JSON.stringify({status:"error2"}))
            db.close()
        }
        else{
            console.log("Updated")
            res.send(JSON.stringify({status:"success"}))
            db.close()
        }
    })
    //next()
}


function random_contact(n){
    var l = []
    for(var i = 0; i < n; i++){
        var tanent = {
            fname:utils.makeText(1),
            lname:utils.makeText(1),
            phone:utils.makeNumber(10),
            email:utils.makeText(1)+ "@gmail.com",
            add_line1:utils.makeText(4),
            add_line2:utils.makeText(3),
            state:utils.makeText(1),
            city:utils.makeText(1),
            country:utils.makeText(1),
        }
        l.push(tanent)
    }
    console.log(l)
    return l
}


function callbackFind(result,req,res,next){
    res.send(result)
}

app.post('/insert',(req,res,next)=>{
    contact.connect(callbackConnect,req,res,next)
})


app.get('/random',(req,res,next)=>{
    var rand_contact = random_contact(10)
    contact.connect((collection,db,req,res)=>{
        collection.insertMany(rand_contact,(err,result)=>{
            console.log(result)
            res.send("Inserted")
        })
    },req,res,next)
})

app.get('/findall',(req,res,next)=>{
    contact.find({},callbackFind,req,res,next)
})

app.post('/update',(req,res,next)=>{
    var data = req.body
    console.log(data)
    var _id = new ObjectID(data._id)
    data._id = _id
    contact.updateOne({_id:_id},data,(data,req,res)=>{res.send(JSON.stringify({status:"success"}))
},req,res,next)
})

module.exports = app