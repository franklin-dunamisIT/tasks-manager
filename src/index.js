const express =  require('express')
// this is required to connect to the db
require('./db/mongoose')
const User = require('./models/user')
//const Task = require('./models/task')
const app =  express()
const taskRoute = require('./routes/task')
const userRoute = require('./routes/user')

// Registering routes
app.use(taskRoute)
app.use(userRoute)


const port = process.env.PORT || 3000

// this parses the data in request
app.use(express.json())



app.listen(port, () =>{
    console.log('Server is running on port '+ port)

})


const bcrypt = require('bcryptjs')

const myFunction = async () => {
    const pwd = 'Readingright'
    const hashedPwd =  await bcrypt.hash(pwd, 8)

    console.log(pwd)
    console.log(hashedPwd)

    const isMatch = await bcrypt.compare('pwd', hashedPwd)
    console.log(isMatch)
}

//myFunction()