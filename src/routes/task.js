const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()


// // fetch all tasks owned by the authenticated user
// router.get('/tasks' , auth, async (req, res) => {
//     try{
//         const tasks = await Task.find({'owner': req.user._id})

//         // no tasks found
//         if (!tasks){
//             return res.status(404).send()
//         }

//         res.status(200).send(tasks)
//     }catch(e){
//         res.status(400).send(e)
//     }

// })

// Adding filters to the get method
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20 (skip = number of items to skip)
// GET /tasks?sortBy=createdAt:asc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed ){
        match.completed =  req.query.completed === 'true'
    }

    if (req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'asc' ? '1' : '-1' 
    }

    try{
        await req.user.populate({
            path: 'tasks',
            match, // shorthand of match: match
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort  // shorthand for sort:sort
            }
        }).execPopulate()

        res.send(req.user.tasks)

    }catch(e){
        res.status(500).send()

    }
})


// retrieve the given task owned by the authenticated user
router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id

    try{
        const task = await Task.findOne({_id, owner: req.user._id})

        if (!task){
            return res.status(404).send()
        }

        res.send(task)
    }catch(e){
        res.status(400).send(e)
     }

})

// Create a new task
router.post('/tasks', auth, async (req, res)=> {
    const task = new Task({
        ...req.body, // Es6 operator to copy over all req.body to the new Task
        owner: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }

})

// Update a task given the id (a task can only be deleted by the user who created it)
router.patch('/tasks/:id', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation =  updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation){
        return res.status(400).send({error: 'Invalid updates'})
    }

    try {
        // find the updated task by the id
        //const updatedTask = await Task.findById(req.params.id)
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if(!task){
            return res.status(404).send()
        }

        // update fields specified in task being patched 
        updates.forEach((update)=> task[update] =  req.body[update])
     
        // save the task
        await task.save()

        return res.send(task)
    }catch(e){
        res.status(400).send()

    }

})

// Delete a task given the id (a task can only be deleted by the user who created it)
router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        //console.log(req.params.id, req.user._id)
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if (!task){
            res.status(404).send()
        }
         
        return res.send(task)
    } catch(e){
        res.status(400).send(e)
    }
})

module.exports = router 