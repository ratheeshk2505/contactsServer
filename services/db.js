const mongoose = require("mongoose")

const URI = 'mongodb+srv://adminC:adminC123@contactbook.xahr3.mongodb.net/contacts?retryWrites=true&w=majority';
mongoose.connect(URI, {
        useNewUrlParser:true,
        useUnifiedTopology:true
        }
    )
    console.log('MongoDB Atlas Connected');

// mongoose.connect('mongodb://localhost:27017/contacts',{useNewUrlParser:true})
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