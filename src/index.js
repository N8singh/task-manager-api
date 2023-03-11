const express = require('express')
require('./db/mongoose')
const userRouter = require("../Routers/users")
const taskRouter = require("../Routers/tasks")

const app = express()

const port = process.env.PORT
 

// app.use((req,res,next) => {
//     if(req.method === 'GET'){
// res.send('GET methods wont work')
//     }else{
//         next()
//     }
// })

// app.use((req,res,next) => {

//     res.status(503).send("Maintenance mode. App will start shortky")
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=> {
    console.log(`Server is up and running at port ${port}`)
})

//JWT example

// const jwt = require('jsonwebtoken')

// const myfunc = async() => {
//     const token = jwt.sign({_id: "124qwer"}, 'bisalkatoken', {expiresIn: '10 seconds'})
//     console.log('Token is ',token)

//     const tok1 = jwt.verify(token,'bisalkatoken')
//     console.log(tok1)

// }

// myfunc()

//toJSON function example

// const pet = {
//     name: "Coca"
// }

// pet.toJSON = function() {
//     return {}
// }

// console.log(JSON.stringify(pet))

//Populate example- user/task relation

// const Tasks = require('./models/tasks')
// const user = require('./models/users')

// const task1 = async() => {
//     const task1 = await Tasks.findById('63f37e5ca00867b51bdbca33')
//     await task1.populate('owner')
//     const actor = task1.owner
//     console.log(actor)
// }

// task1()

// const mytasks = async() => {
//     const user1 = await user.findById('63f37e3ba00867b51bdbca2e')
//     await user1.populate('tasks')
//     console.log(user1.tasks)

// }

// mytasks()

//multer example

// const multer = require('multer')

// const upload = multer({
//     dest : 'images/',
//     limits : {
//         fileSize : 30000
//     },
//     fileFilter(req,file,cb){
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//            return cb(new Error('FIle mist be a word doc'))
//         }
//         cb(undefined, true)
//     }
// })

// app.post('/uploads', upload.single('img'), (req,res) => {
//     res.send('Upload success!')
// })