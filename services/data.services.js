const db = require('./db')
const jwt = require('jsonwebtoken')

const register = (pname, email, phone, dob, uname, pwrd)=>{
    return db.User.findOne({uname})
    .then(user=>{
      if(user){
        return{
          statusCode:422,
          status:false,
          message:"Username Already Used, Use Different One"
        }   
      }
      else{
        const newUser = new db.User({
            pname, email, phone, dob, uname, pwrd
        })
        newUser.save()
        return{
          statusCode:200,
          status:true,
          message:"User Registered Successfully.. Please Login to Continue."
        } 
      }
    })
}

const login = (uname, pwrd) => {
    return db.User.findOne({uname,pwrd})
    .then(user=>{
      if(user){
        const token = jwt.sign({currentUser:uname},'supersecretkey123')
        return{
          statusCode:200,
          status:true,
          message:"Login Successful.",
          token,
          currUser:user.pname,
          currUserName:user.uname,
          userId:user._id
        } 
      }
      else{
        return {
          statusCode:422,
          status:false,
          message:"Invalid Credentials."
        }
      }
      
    })
  }


  const saveContact = (uname, uId, fname, lname, email, phone, dob, img, label)=>{
    return db.User.findOne({uname})
    .then(user=>{
      if(user){
          if(label){
            const newContactdetail = new db.Contactdetail({
              userId:uId, fname:fname, lname:lname, email:email, phone:phone, dob:dob, img:img, label:true
            })
            newContactdetail.save()
          }
          else{
            const newContactdetail = new db.Contactdetail({
              userId:uId, fname:fname, lname:lname, email:email, phone:phone, dob:dob, img:img, label:false
            })
            newContactdetail.save()
          }
        
        return {
          statusCode:200,
          status:true,
          message:"Contact Added Successfully."
        }
      }
    }) 
  }

  const showContacts = (uId) => {
    return db.Contactdetail.find({"userId":uId}).sort({"fname":1})
    .then(user=>{
      if(user){
        // console.log(user);
        return {
          statusCode:200,
          status:true,
          contacts:user,
          messageYes: "Your Contacts....",
          messageNo:"No Contacts to Show"
        }
      }
      else{
        return {
          statusCode:422,
          status:false,
          message:"Operation Denied."
        }
      }
    })
  
  }

 

  const favContacts = (uId) => {
    return db.Contactdetail.find({"userId":uId, "label":true}).sort({"fname":1})
    .then(user=>{
      if(user){
        return {
          statusCode:200,
          status:true,
          contacts:user,
          messageYes: "Your Favorite Contacts....",
          messageNo:"No Favorite Contacts to Show"
        }
      }
      else{
        return {
          statusCode:422,
          status:false,
          message:"Operation Denied."
        }
      }
    })
  
  }

  const updateCall = (uId, eId) => {
    return db.Contactdetail.findOne({"userId":uId, _id:eId})
    .then(user=>{
      if(user){
        return {
          statusCode:200,
          status:true,
          contacts:user
        }
      }
    })
  }

  const updateContact = (uId, eId, fname, lname, email, phone, dob, img, label) => {
    return db.Contactdetail.updateOne(
      {"userId":uId, _id:eId},
      { $set: {"fname":fname, "lname":lname, "email":email, "phone":phone, "dob":dob, "img":img, "label":label }}
      )
    .then(user=>{
      if(user){
        return {
          statusCode:200,
          status:true,
          message:"Updated Successfully"
        }
      }
    })
  }

  const deleteContact = (uId, eId) => {
    return db.Contactdetail.deleteOne({"userId":uId, _id:eId})
    .then(user=>{
      if(user){
        console.log(`delete called, match found, deleted the contact`);
        console.log(user);
        return {
          statusCode:200,
          status:true,
          message:"Contact Deleted Successfully"
        }
      }
    })
  }

module.exports={
    register, login, saveContact, showContacts, favContacts, updateCall, updateContact, deleteContact
  }