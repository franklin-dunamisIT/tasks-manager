const express =  require('express')

// this is required to connect to the db
require('./db/mongoose')

const User = require('./models/user')
const Task = require('./models/task')
const taskRoute = require('./routes/task')
const userRoute = require('./routes/user')
const app =  express()

 
// Maintenance mode 
// app.use( (req, res, next) => {
//     res.status(503).send('Site is in maintenance mode. Please try again later. Thanks for your patience.')

// })

// lib for file upload
const multer = require('multer')
const upload =  multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(doc|docx)$/)){
            return callback(new Error('Please upload a Word Document'))
        }

        callback(undefined, true)
        // callback(new Error('File must be a PDF')) // send back error on upload
        // callback(undefined, true) // allow the upload
        // callback(undefined, false) // reject the upload
    }
})
// const errorMiddleware = (req, res,next) =>{
//     throw new Error('From my middleware')
// }

//
app.post('/upload', upload.single('upload'), (req, res)=>{
    res.send()
    // this will catch any error by multer
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

// this makes req.body available in th code especially when testing with Postman
// makes it possible to parse the data in request
app.use(express.json())


// Registering routes
app.use(taskRoute)
app.use(userRoute)


const port = process.env.PORT || 3000

app.listen(port, () =>{
    console.log('Server is running on port '+ port)

})


const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const myFunction = async () => {
    const pet = {
        name: 'Hal'
    }

    // this defines the behaviour of JSON.stringify on an instance
    pet.toJSON = function () {
        console.log(this)
        return {}
    }

    console.log(JSON.stringify(pet))

    // provide token to client
    //const token = jwt.sign({ _id: 'abc123'}, 'thisismyfirstnodejscourse', { expiresIn: '250 seconds'})
    // format of the jwt token
    // <p1>.<p2>.<p3> : <header>.<payload/body i.e. data to encode><signature used to verify the token> 
    //console.log(token)

    // this decodes and returns the token using the encoding secret
    //const data = jwt.verify(token, 'thisismyfirstnodejscourse')
    //console.log(data)
    // const pwd = 'Readingright'
    // const hashedPwd =  await bcrypt.hash(pwd, 8)


    // console.log(pwd)
    // console.log(hashedPwd)

    // const isMatch = await bcrypt.compare('pwd', hashedPwd)
    // console.log(isMatch)
}

//myFunction() 


const main = async () => {
    const task = await Task.findById('6040026a02050cbe2522b3e2')

    // this will populate/sub in the user id for the entire user record
    //await task.populate('owner').execPopulate() 
    //console.log(task.owner)

    // const user = await User.findById('6040015e5fb887bd816f1a3f')
    // await user.populate('tasks').execPopulate()
    // console.log(user.tasks)
}

main()