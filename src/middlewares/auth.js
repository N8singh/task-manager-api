const jwt = require('jsonwebtoken')
const user = require('../models/users')


const auth = async (req,res,next) => {

    try {
    const token = req.header('Authorization').replace('Bearer ',"")
   //console.log("Token to be verifies is ", token)
    const isMatch = jwt.verify(token,process.env.JWT_SECRET)

    const user1 =  await user.findOne({_id : isMatch._id, 'tokens.token' : token})

    if(!user1) {
        throw new Error()
    }
    req.token = token
    req.user = user1

    next()
        
    } catch (error) {
        res.status(404).send('Authentication failed')
    }

    
 
}

module.exports = auth