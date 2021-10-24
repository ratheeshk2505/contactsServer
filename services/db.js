const mongoose = require("mongoose")
mongoose.connect('mongodb://localhost:27017/contacts',{useNewUrlParser:true})
const User = mongoose.model('User',{
    pname:String,
    email:String,
    phone:String,
    dob:String,
    uname:String,
    pwrd:String,
})

const Contactdetail = mongoose.model('Contactdetail',{
    userId:String,
    fname:String,
    lname:String,
    email:String,
    phone:String,
    dob:String,
    img:String,
    label:Boolean,
})


module.exports={ User, Contactdetail } 