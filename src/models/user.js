const { builtinModules } = require("module")
const mongoose  = require('mongoose')
const validator = require('validator');
const bcrypt = require('bcryptjs')

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
     }

 })

 userSchema.statics.findByCredentials = async (email, password) => {
     const user = await User.findOne({email }) // short for {email:email}

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
    console.log('just before saving...')
    // checks if the user password got updated
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    
    next()
 })

const User = mongoose.model('User', userSchema)

module.exports = User