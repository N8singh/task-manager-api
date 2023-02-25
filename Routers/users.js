const express = require('express')
const router = new express.Router()
const auth = require('../src/middlewares/auth')
const multer = require('multer')
const sharp = require('sharp')
const {welcomeEmail,departEmail} = require('../src/emails/accounts')

const user = require('../src/models/users')


const uploads = multer({
    limits : {
        fileSize : 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('File must be an image'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/avatar', auth, uploads.single('avatar'), async (req,res) => {
    try {
        const buffer = await sharp(req.file.buffer).resize(400,400).png().toBuffer()
        req.user.avatar = buffer
        await req.user.save()
        res.send('image uploaded')
    } catch (error) {
        res.send('Nhi hua upload')
    }
} , (error,req,res,next) => {
    res.status(400).send({error: error.message})
})
// router.get('/test', (req,res) => {
//     res.send('This is refactorted')
// })
router.delete('/users/me/avatar', auth, async (req,res) => {
    
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send('image deleted')
    } catch (error) {
        res.status(404).send('Not deleted')
    }
   
})

router.get('/users/:id/avatar', async (req,res) => {
    try {
        const user1 = await user.findById(req.params.id)
        if(!user1 || !user1.avatar){
            throw new Error()
        }

        res.set({'Content-Type': 'image/png'})
        res.send(user1.avatar)
    } catch (error) {
        res.status(404).send('Image not found')
    }
})
router.post('/users', async (req,res) => {
    const user1 = new user(req.body)
    const token = await user1.generateToken(user1._id)
    welcomeEmail(user1.email,user1.name)
 
    try {
     res.status(201).send({user1,token})
        
    } catch (error) {
        res.status(404).send(error)
    }
    
 
 //    user1.save().then(result => {
 //        res.status(201).send(result)
 //    }).catch(err => {
 //        res.status(400).send(err)
 //    })
 })

 router.post('/users/login', async (req,res) => {

  try {
      const found = await user.findByCredential(req.body.email,req.body.password)
      //console.log('USer found', found)
      const token = await found.generateToken()
      //console.log('New user tokens array', found.tokens)
      res.send({found,token})
      
  } catch (error) {
      res.status(500).send("Login nhi ho paya")
  }  

 })

 router.post('/users/logout', auth, async (req,res) => {
     try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        //console.log('Token removed is ', req.token)
   
        await req.user.save()

        //console.log("After removal, tokens array is ", req.user.tokens)

        res.send('Logout successful')
        
         
     } catch (error) {
         res.status(401).send(error)
     }
    
 })

 router.post('/users/logoutall', auth, async (req,res) => {
    
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token === ''
        })
        await req.user.save()
        //console.log("Updated token array post LA",req.user.tokens)
        res.status(201).send('Logout successful')

    } catch (error) {
        res.status(500).send('Logout failed')
    }

 })
 
 router.get('/users/me', auth, async (req,res) => {
 
    res.send(req.user)

    //  try{
    //      const users = await user.find()
    //      res.status(201).send(users)
    //  }
    //  catch(e){
    //      res.status(500).send(e)
    //  }
 })
 
//  router.get('/users/:id', async (req,res) => {
//      const _id = req.params.id
 
//      try {
//          const user1 = await user.findById(_id)
//          res.status(201).send(user1)
//      } catch (error) {
//          res.status(404).send(error)
//      }
//      // user.findById(_id).then(result => {
//      //     res.send(result)
//      // }).catch(e => {
//      //     res.status(500).send(e)
//      // })
//  })
 
 router.patch('/users/me', auth, async (req,res) => {
 
     const keys = Object.keys(req.body)
     const validkeys = ["name","age","email","password"]
     const validation = keys.every(l => validkeys.includes(l))
 
     if(!validation){
         return res.status(404).send('Field not found')
     }
 
     try {
         const user1 = req.user

         keys.forEach(key => user1[key] = req.body[key])
         await user1.save()
         //const user1 = await user.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators : true})
         res.status(201).send(user1)
     } catch (error) {
         res.status(400).send(error)
     }
 })
 
 router.delete('/users/me', auth, async (req,res) => {
     try {

         //const user1 = await user.findByIdAndDelete(req.user._id)
        await req.user.remove()
        departEmail(req.user.email,req.user.name)
         res.send(req.user)

     } catch (e) {
         res.send(e)
     }
 })



module.exports = router