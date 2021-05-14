const express = require('express')
const User =  require('../models/user')
const router =  new express.Router()
const auth =  require('../middleware/auth')


// Login user  
router.post('/users/login', async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token =  await user.generateAuthToken()
        res.send({user, token})
        //res.send({user: user.getPublicProfile(), token})
    }catch (e){
        //console.log("Error:"+e)
        res.status(400).send(e)
    }
})


// Log out current user session/token
router.post('/users/logout', auth, async (req, res)=> {
    try{
            req.user.tokens = req.user.tokens.filter((token_record) => {
                                            return token_record.token !== req.token
            })

        await req.user.save()

        res.send()
    }catch(e){
        res.status(500).send()
    }

})

// Log out all user's tokens/sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()

        res.status(200).send()
    } catch(e){
        res.status(500).send()

    }
})


// create/sign up new user
router.post('/users', async (req, res)=> {
    const user = new User(req.body)
    try{
        await user.save()
        const token =  await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)

    }
    // user.save().then(() => {
    //     console.log(user)
    //     res.status(201).send(user)
        
    // }).catch((e) => {
    //     console.log('Error:'+e)
    //     res.status(400).send(e)
        
    // })
    
})


// list all users
router.get('/users', auth, async (req, res) => {
    try{
        const users = await User.find({})
        res.status(200).send(users)
    }catch(e){
        res.status(500).send()
    }
})

// get the profile of the authenticated user
router.get( '/users/me', auth, async (req, res) => {
    res.send(req.user)

})

// get user by id
router.get('/users/:id', async (req,res) =>{
    const _id = req.params.id
    try{
        const user  =  await User.findById( _id)
        if (!user) {
            return res.status(404).send('No such user entry with that id.')
        }
        res.status(200).send(user)
    }catch(e){ console.log('error', e)
        res.status(500).send()
    }
     
})

// update the user record for the selected id
//router.patch('/users/:id', async (req,res) => {

router.patch('/users/me', auth, async (req,res) => {
    const updates = Object.keys(req.body)

    const allowedUpdates = ['name', 'email', 'password','age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try{
        // ensure that control doesn't bypass the middleware
        // when updating user by the selected id
        // const user = await User.findById(req.user._id)
        // updates.forEach((update) => user[update] = req.body[update]  )
        // await user.save()
        // if(!user){
        //     return res.status(404).send()
        // }
        // res.send(user)
        // update each user field in the req
        updates.forEach((update) => req.user[update] = req.body[update] )

        await req.user.save()

        res.send(req.user)
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators: true})

    }catch(e){
        console.log("Error:"+e)
        res.status(400).send(e)
    }
})

// delete a given user by id
// to allow ability to delete by id
//router.delete('/users/:id', auth,  async (req, res)=>{

// delete only current user's entry
router.delete('/users/me', auth,  async (req, res)=>{
    try{
        // to allow ability to delete by id
        //const user = await User.findByIdAndDelete(req.params._id)

        // const user = await User.findByIdAndDelete(req.user._id)

        // if (!user){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }

})

const multer = require('multer')
const upload =  multer({
    //dest: 'avatars',  // adding this tells multer to upload the file to this dir
    limits: 1000000,
    fileFilter(req, file, callback){
        if ( !file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error('Invalid file extension. Accepted options: .jpg, .jpeg, .png'))
        } 
 
        // true = upload succeeded ; false otherwise
        callback(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer   // store the user's avatar to the avatar param
    await req.user.save()
    res.status(200).send()

}, (error, req, res, next)=>{ // this will return in case of an error during upload
    res.status(400).send({error: error.message})
})


router.delete('/users/me/avatar', auth, async(req, res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send()
}, (error, req,res, next)=> {
    res.status(400).send({error: error.message})
})
module.exports = router