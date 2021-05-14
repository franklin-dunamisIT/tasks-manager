// CRUD create read update delete
const mongodb =  require('mongodb')
const { default: validator } = require('validator')
//const { string } = require('yargs')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

// using destructing method - can be replaced with lines 3-5
// const {MongoClient, ObjectID} =  require('mongodb')
const id = new ObjectID()
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'
  
MongoClient.connect(connectionURL, { useNewUrlParser: true}, (error, client) => {
    if(error){
        return console.log('Unable to connect to database!')
    }

    const db = client.db(databaseName)


    // insert/create
    //db.collection('tasks').insertMany([
        // {
        //     description: 'Create a task for opening new note',
        //     completed: false
        // }, 
        // {
        //     description: 'Task to update existing note',
        //     completed: true
        // }, 
        // {
        //     description: 'Task to delete note',
        //     completed: true
        // }

        // ], (error, result) => {
        //     if(error){
        //         return console.log('Unable to insert task')
        //     }

        //     console.log(result.ops)

        // })
    db.collection('users').insertOne({
        _id: id,
        name: 'Tom',
        age: 10

    }, (error, result) => {
        if(error){
            return console.log('Unable to insert user')
        }

         console.log(result.ops)

     })

    // Read 
    // db.collection('users').findOne({ _id : new ObjectID('5fea3638ad9e0f691cebdb3d')}, (error, user)=> {
    //     if (error){
    //         console.log('Unable to fetch user')
    //         return
    //     }

    //     if ( user == null){
    //         console.log('No such user found')
    //         return
    //     }

    //     console.log(user)
    // })

    // db.collection('users').find({age: 27}).toArray((error, users) => {
    //     console.log(users)
    // })

    // db.collection('users').find({age: 27}).count( (error,count)=> {
    //     console.log(count)
    // })

    // db.collection('tasks').findOne({_id: ObjectID("5fea3ae5649b2969640c8735")}, (error,result)=> {
    //     console.log(result)
    // })

    // db.collection('tasks').find({completed:false}).toArray((error,tasks) => {
    //     console.log(tasks)
    // })

    // Update
    // update func returns a promise
    // db.collection('users').updateOne({
    //     _id: new ObjectID('5fea36ba5fce09692ef7e096')
    // }, {
    //     // set the name field for the selected document
    //     // $set: {
    //     //     name: 'Nero'
    //     // }

    //     // increment the value of the field on the selected document
    //     $inc: {
    //         age: 1
    //     }
    // }).then( (result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })
    // db.collection('tasks').updateMany({
    //     completed: false
    // }, 
    // {aa
    //     $set: {
    //         completed: true
    //     }

    // }).then((result) => {
    //     console.log(result)
    // }).catch((error)=> {
    //     console.log(error)
    // })
 
    // db.collection('users').deleteMany({
    //     age: 24
    // }).then((result)=> {
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })
 
    // db.collection('tasks').deleteOne({
    //     _id: new ObjectID('5fea3ae5649b2969640c8735')
    // }).then((result) => {
    //     console.log(result.deletedCount)
    // }).catch((error)=> {
    //     console.log(error)
    // })
})