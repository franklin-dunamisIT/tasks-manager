const { builtinModules } = require("module")
const mongoose  = require('mongoose')
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

// Create a schema like this so you can invoke middleware functions on 
// a user instance before storing into the db
const userSchema = new mongoose.Schema({
    name: {
         type: String,
         required: true,
         trim: true
     },
     password: {
          type: String,
          required: true,
          trim: true,
          minlength:  7,
          validate(value){
              // if(value.length < 7){
              //     throw new Error('Password must contain more than 6 characters.')
              // }

              if(value.toLowerCase().includes('password')){
                  throw new Error('Password can not contain the word \'password\'')
              }
          }
     },
     email: {
         type: String,
         unique: true,
         required: true,
         trim: true,
         lowercase: true,
         validate(value){
             if( !validator.isEmail(value)){
                 throw new  Error('Email is invalid')
             }
         }
     },
     age: {
         type: Number,
         default: 0,
         validate(value){
             if (value < 0){
                 throw new Error('Age must be a positive number')
             }
         }
     },
     tokens : [{
        token : {
            type: String,
            required: true
        }
     }],
     avatar : {
         type: Buffer // to store the user's avatar pic
     }

 }, {
    timestamps: true  // this creates the updatedAt and createdAt columns in each db document

 })

// used to define association between models/objects
 userSchema.virtual('tasks', {
    ref: 'Task',        // model to reference
    // def the association  fields between this model and the ref
    localField: '_id',  
    foreignField: 'owner'

 })

 // methods are accessible on the instance model
//userSchema.methods.getPublicProfile = function () {

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject() // return an object of the current user instance

    delete userObject.password
    delete userObject.tokens

    return userObject

}

 userSchema.methods.generateAuthToken = async function(){
    const user =  this
    const token = jwt.sign({_id: user._id.toString()}, 'thisismyfirstnodejscourse')

    // append the new token into the user's token array
    user.tokens = user.tokens.concat({token})

    // save the tokens to the user instance in the db
    await user.save()
    return token
 }

 // statics are accesible on the model
 userSchema.statics.findByCredentials = async (email, password) => {
     const user = await User.findOne({email }) // check if user with email exists . PS short for {email:email}
 
     if( !user ){
        throw new Error('Unable to login')
     }

     const isMatch = await bcrypt.compare(password, user.password)
     if (!isMatch){
         throw new Error('Unable to login')
     }

     return user
 }

 // this will be called before the save operation executes
 // hash the plain text password before storing in the db
 userSchema.pre('save', async function (next){
    const user = this 
    //console.log('just before saving...')
    // checks if the user password got updated
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }  
    next()
 })

 // this will be called before remove operation is invoked
 // before deleting a user record we first delete all the tasks created by that user
 userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner: user._id})

    next()
 })

const User = mongoose.model('User', userSchema)

module.exports = User