const mongoose = require("mongoose")

const connectDb = async () => {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser:true, useUnifiedTopology:true})
        console.log(`mongoDB Atlas is connected to ${connect.connection.host}`);
    }
    catch(error){
        console.log(`Error : ${error.message}`);
        process.exit(1)
    }
}

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


module.exports={ User, Contactdetail, connectDb } 