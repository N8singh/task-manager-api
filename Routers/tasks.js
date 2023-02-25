const express = require('express')
const auth = require('../src/middlewares/auth')
const task = require('../src/models/tasks')
const router = new express.Router()

router.post('/tasks', auth, async (req,res) => {
    const task1 = new task({
        ...req.body,
        owner : req.user._id
    })

    try {
        await task1.save()
        res.status(201).send(task1)
    } catch (error) {
        res.status(404).send(error)
    }

    // task1.save().then(task => {
    //     res.status(201).send(task)
    // }).catch(e => {
    //     res.status(400).send(e)
    // })
})

router.get('/tasks', auth, async (req,res) => {
        // const Match = {
        //     owner : req.user._id,
        // }
        const Match = {}
        const sortobj = {}

        if(req.query.completed){
            Match.completed = req.query.completed ===  'true'
        }

        if(req.query.sort){
            const sortarr = req.query.sort.split('_')
            sortobj[sortarr[0]] = sortarr[1] === 'desc' ? -1 : 1
            // console.log(sortobj)
        }

    try {
        await req.user.populate({
           path: 'tasks',
           match : Match,
           options : {
           limit : req.query.limit,
           skip: req.query.skip,
           sort : sortobj
           }
        })
    

 //const tasks = await task.find(Match).setOptions({limit:req.query.limit,skip:req.query.skip}).sort(sortobj)
       res.status(201).send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }

    // task.find().then(task => {
    //     res.send(task)
    // }).catch(e => {
    //     res.status(500).send(e)
    // })
})

router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id

    try {
        const task1 = await task.findOne({_id, owner : req.user._id})
        
        if(!task1){
           throw new Error()
        }

        res.send(task1)
    } catch (error) {
        res.status(404).send('Authenticate nhi ho paya')
    }
})

    // task.findById(_id).then(task => {
    //     if(!task) {
    //     return    res.status(404).send()
    //     }
    //     res.send(task)

    // }).catch(e => {
    //     res.status(505).send(e)
    // })

router.patch('/tasks/:id', auth, async (req,res) => {

    const keys1 = Object.keys(req.body)
    const validKeys1 = ["description", "completed"]
    const validation1 = keys1.every(l => validKeys1.includes(l))

    if(!validation1) {
        return res.status(404).send('Key not found')
    }

    try {
        const task1 = await task.findOne({_id: req.params.id, owner: req.user._id})
        if(!task1){
            throw new Error()
        }
        keys1.forEach(key => task1[key] = req.body[key])
        await task1.save()
        //const task1 = await task.findByIdAndUpdate(req.params.id, req.body, {new :true, runValidators :true})
        res.send(task1)
    } catch (error) {
        res.status(400).send('Authentication failed and task not updated')
    }
})

router.delete('/tasks/:id', auth, async (req,res) => {

    try {
        const task1 = await task.findOneAndDelete({_id: req.params.id, owner : req.user._id})
        if(!task1){
            throw new Error()
        }
        res.status(201).send(task1)
    } catch (error) {
        res.status(404).send('Authenticate failed and task not found')
    }
})

module.exports = router