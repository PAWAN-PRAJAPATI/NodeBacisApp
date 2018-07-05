const express = require('express')
const app = express.Router()
var ObjectID = require('mongodb').ObjectID
var appMongo = require("./appMongo")

var dev = new appMongo("local","dev")


function insert(n,req,res,next){


    dev.connect((collection,db)=>{
        for(var i = 0;i < n;i++){
            collection.insert({n:i})
        }
        res.send("Inserted "+n+" records")
    },req,res,next)

}

function find(query,req,res,next){
    dev.connect((collection,db)=>{
        collection.createIndex( { n: 1} )
        var f = collection.find(query).explain((err,result)=>{
            console.log(result)
            res.send(result)
        })
        //console.log(f)
    },req,res,next)
}

app.get("/insert",(req,res,next)=>{
    insert(100,req,res,next)
})

app.get("/find",(req,res,next)=>{
    var id = new ObjectID("5b35c8e23c746204e3aed9d1")
    find({_id:id},req,res,next)
})

module.exports = app