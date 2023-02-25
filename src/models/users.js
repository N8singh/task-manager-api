
//const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const tasks = require('./tasks')

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        unique : true,
        trim : true,
        required : true,
        lowercase : true,
        validate (value) {
            if(!validator.isEmail(value)){
                throw new Error ("Email is invalid")
            }
        }
    },

    password : {
        required : true,
        type : String,
        trim : true,
        minLength : 6,
        validate(value) {

            if(validator.contains(value.toLowerCase(),"password")){
                throw new Error("Please select a strong password")
            }
        }

    },
    age : {
        type : Number,
        default : 0,
        validate(value) {
            if(value < 0) {
                throw new Error("Age must be a positive number")
            }
        }
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }],
    avatar : {
        type :Buffer
    }
},{
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'tasks',
    localField : '_id',
    foreignField : 'owner'
})


userSchema.methods.toJSON = function() {
    const user = this
    const userObj = user.toObject()

    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar

    return userObj


}
userSchema.methods.generateToken = async function() {
const user1 = this
const tok = jwt.sign({_id : user1._id.toString()},process.env.JWT_SECRET)
user1.tokens = user1.tokens.concat({token:tok})
console.log('New token added', tok)
await user1.save()
return tok
}

userSchema.statics.findByCredential = async (email,password) => {
    const user1 = await User.findOne({email})

    if(!user1){
        const mes1 = 'Please register first'
        return mes1
    }
    console.log('Entered password is ', password)
    console.log('User ka password hai ',user1.password)

    if(password===user1.password){
        const isMatch = true
        console.log('MAtch is ', isMatch)
        return user1
    }
    else{
        const isMatch = false
        console.log('MAtch is ', isMatch)
        const mes = 'Invalid password'
        return mes

    }
    //const isMatch = await bcrypt.compare(password,user1.password)
   
}


// userSchema.pre('save', async function (next){
//     const user = this
//     const newp = await bcrypt.hash(user.password,8)
//     user.password = newp

//     next()
// }
// )

userSchema.pre('remove', async function(next) {
    const user1 = this
    await tasks.deleteMany({owner: user1._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User