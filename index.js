const express = require('express')
const jwt = require('jsonwebtoken')
const dataServices = require('./services/data.services')
const cors = require('cors')
const path = require('path');
const multer = require('multer')
const port = process.env.PORT || 8080;
const baseUrl = `http://localhost:${port}/`
const dotenv = require('dotenv');
const { connectDb } = require('./services/db');

dotenv.config()
connectDb()

const app = express()
app.use(express.json())
app.use(errHandler);
app.use(express.static(__dirname + "/images"))
app.use(express.static(__dirname + "/dist"))
app.use('/image', express.static(__dirname + "/images"));


app.use(cors({
    origin:'http://localhost:4200',
    credentials:true
}))



const jwtMiddleWare = (req,res,next)=>{
    try{
        const token = req.headers["x-token"]
        const data = jwt.verify(token,'supersecretkey123')
        // console.log(data)
        next()
    }
    catch{
        const result = ({
            statusCode:401,
            status:false,
            message:"Please Login to View & Create Contacts"
          })
          res.status(result.statusCode).json(result)
    }
}

app.post('/register', (req,res)=>{
    dataServices.register(req.body.pname, req.body.email, req.body.phone, req.body.dob, req.body.uname, req.body.pwrd).then(result=>{
        res.status(result.statusCode).json(result)
    })
})

app.post('/login', (req,res)=>{
    dataServices.login(req.body.uname, req.body.pwrd).then(result=>{
        res.status(result.statusCode).json(result)
    })
})

app.post('/save', jwtMiddleWare, (req,res)=>{
    dataServices.saveContact(req.body.uname, req.body.uId, req.body.fname, req.body.lname, req.body.email, req.body.phone, req.body.dob, req.body.img, req.body.label).then(result=>{
        res.status(result.statusCode).json(result)
    })
})

app.post('/show', jwtMiddleWare, (req,res)=>{
    dataServices.showContacts(req.body.uId).then(result=>{
        res.status(result.statusCode).json(result)
    })
})

app.post('/fav', jwtMiddleWare, (req,res)=>{
    dataServices.favContacts(req.body.uId).then(result=>{
        res.status(result.statusCode).json(result)
    })
})


app.post('/update', jwtMiddleWare, (req,res)=>{
    dataServices.updateCall(req.body.uId, req.body.eId).then(result=>{
        res.status(result.statusCode).json(result)
    })
})

app.post('/updatecontact', jwtMiddleWare, (req,res)=>{
    dataServices.updateContact(req.body.uId, req.body.eId, req.body.fname, req.body.lname, req.body.email, req.body.phone, req.body.dob, req.body.img, req.body.label).then(result=>{
        res.status(result.statusCode).json(result)
    })
})

app.post('/delete', jwtMiddleWare, (req,res)=>{
    dataServices.deleteContact(req.body.uId, req.body.eId).then(result=>{
        res.status(result.statusCode).json(result)
    })
})

const storage = multer.diskStorage({
    destination: './images',
    filename: (req, file, cb) => {
      return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
  });
  
const uploadImg = multer({ 
    storage: storage, 
    limits: {fileSize: 200*1024}, // 200 Kb limit
    fileFilter: function(req, file, cb){
        checkFileType(file, cb)
    }
    }).single('img');

 function checkFileType(file, cb){
    const filetypes = /jpg|png|gif|jpeg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
    if(mimetype && extname){
        return cb(null, true)
    }
    else{
        cb("Error: Images Only")
    }
 }

 function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            success: 0,
            message: err.message
        })
    }
}

app.post('/upload', (req,res)=>{
    uploadImg(req, res, (err)=>{
        if(err){
            res.status(422).json({
                statusCode:422,
                status:false,
                message:"File Too Large (Max: 200 KB) / Not a Image File"
            })
        }
        else{
            res.status(200).json({ 
                statusCode:200,
                status:true,
                imgurl: `${baseUrl}image/${req.file.filename}`})
        }
    })
})

app.post('/contactimg', jwtMiddleWare, (req,res)=>{
    res.json({
        statusCode:200,
        status:true,
        imgurl:`${baseUrl}image/contactImage.png`})
})


app.listen(port, ()=>{
    console.log(`server started at ${port}`)
})