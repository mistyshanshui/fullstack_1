const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, minlength:3},
    name: {type: String},
    passwordhash: {type: String, required:true, minlength:3}
})

const User = mongoose.model('User', userSchema)

module.exports = User