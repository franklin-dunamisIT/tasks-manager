const jwt = require('jsonwebtoken')
const User = require('../models/user')

// Authenticate incoming user requests
const auth = async ( req, res, next) => {
    try{
        // read the header from the request
        const token = req.header('Authorization').replace('Bearer ', '')

        // verify the token in the header
        const decoded = jwt.verify(token , 'thisismyfirstnodejscourse')
     
        // search for a user with the id encoded in the token 
        // and check the tokens.token param to see if token still exists for that user
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token })
        
        if(!user){
            throw new Error()
        }

        // store the token to ease de-auth
        req.token = token
        // cache the authenticated user in the req param for future reference
        req.user = user

        // now that the user has been successfully authenticated, move on to the route handler
        next()
    }catch(e){
        //console.log("Error:"+e)
        res.status(401).send({error: 'Please authenticate' })

    }
    
}


module.exports = auth