const express = require('express')
const Task = require('../models/task')
const router = new express.Router()


router.get('/tasks', (req, res)=>{
    
    Task.find({}).then((tasks) => {
        res.send(tasks)
    }).catch((e)=>{
        res.status(400).send(e)
    })

})


router.get('/tasks/:id', (req,res) => {
    const _id = req.params.id

    Task.findById(_id).then((task) => {
        if (!task){
            return res.status(404).send('No such task entry with that id.')
        }
        res.send(task)
    }).catch((e)=> {
        res.status(500).send(e)
    })
})


router.post('/tasks', (req, res)=> {
    const new_task =  new Task(req.body)
    new_task.save().then(() => {
        console.log('new task: '+new_task)
        res.status(201).send(new_task)
        
    }).catch((e) => {
        console.log('Error:'+e)
        res.status(400).send(e)
    })

})

router.patch('/tasks/:id', async (req,res) => {
    const updates = Object.keys(req.body)
    console.log('updates')
    console.log(updates)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation =  updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation){
        return res.status(400).send({error: 'Invalid updates'})
    }

    try {
        // find the updated task by the id
        const updatedTask = await Task.findById(req.params.id)

        // update fields specified in task being patched 
        updates.forEach((update)=> updatedTask[update] =  req.body[update])

        // save the task
        await updatedTask.save()

        if(!updatedTask){
            return res.status(404).send()
        }

        return res.send(updatedTask)
    }catch(e){
        res.status(400).send()

    }

})

module.exports = router 