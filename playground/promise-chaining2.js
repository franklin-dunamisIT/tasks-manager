require('../src/db/mongoose')
const Task = require('../src/models/task')

Task.findByIdAndDelete({_id: '6040020fb0b4d8be0e62ec15'} ).then((task)=>{
    console.log('deleted task='+task)
  
    return Task.countDocuments({completed: true})
}).then((count)=>{
    console.log(count)
}).catch((e)=> {
    console.log(e)
})


const deleteTaskAndCount = async (id)=>{
    await Task.findByIdAndDelete({_id:id})
    const count = Task.countDocuments({completed: false})

    return count
}


deleteTaskAndCount('6040f4154d70f3cc2c1b83ae').then((count)=>{
    console.log('incomplete tasks count', count)

}).catch((e)=>{
    console.log('Error:', e)
})

