 const mongoose =  require('mongoose')
//const mongoose = require('../db/mongoose')

const taskSchema =  new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true, 
        unique: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // create a user reference
    }
},
{
    timestamps: true // this creates the updatedAt and createdAt columns in each db document
})

const Task = mongoose.model('Task',  taskSchema)

// const t = new Task({
//     description: ' my first task '
// })

// t.save().then(() => {
//     console.log(t)
// }).catch((error)=> {
//     console.log('Error'+ error)
// })
module.exports = Task;