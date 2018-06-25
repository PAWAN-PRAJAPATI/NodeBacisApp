const express = require('express')
const bodyParser = require('body-parser')
const app = express()


app.use((req,res,next)=>{
    console.log("I am root middleware "+req.hostname+req.baseUrl)
    next()
    //res.send("I am root middleware "+req.hostname)

})

var user = app.route('/login/:id/:name')
var user_root = app.route('/')



user.all(function(req, res, next) {
  console.log("User middleware")
  next()
})

user.get(function(req, res, next) {
    console.log('this matches');
    res.send("I am get in "+req.baseUrl+"\n"+req.query.last)

})

user.post(function(req, res, next) {
    console.log(req.body)
    res.send("I am post in "+req.baseUrl)
});


app.param('name', function (req, res, next,name) {
    console.log('name params called');
    //console.log(id)
    console.log(name)
    next();
  });

app.param('id', function (req, res, next,name) {
    console.log('id params called');
    //console.log(id)
    console.log(name)
    next();
});

module.exports = app