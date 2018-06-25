const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const property = require('./property')
//const user = require('./user')
//const model = require('./models')


app.use(bodyParser.json({extended:true}))
app.use(bodyParser.urlencoded({extended:true}))


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/property',property)
//app.use('/user',user)
//app.use('/models',model)

/*
app.get('/',(req,res)=>{
    res.send("This is Home")
})
*/
app.listen(3000, () => console.log('Example app listening on port 3000!'))