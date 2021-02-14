 const mongoose =  require('mongoose')
//const mongoose = require('../db/mongoose')

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

// const t = new Task({
//     description: ' my first task '
// })

// t.save().then(() => {
//     console.log(t)
// }).catch((error)=> {
//     console.log('Error'+ error)
// })
module.exports = Task;