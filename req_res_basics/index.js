const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const profile = require('./profile')
const user = require('./user')
const model = require('./models')


app.use(bodyParser.json({extended:true}))
app.use('/profile',profile)
app.use('/user',user)
app.use('/models',model)

/*
app.get('/',(req,res)=>{
    res.send("This is Home")
})
*/
app.listen(3000, () => console.log('Example app listening on port 3000!'))