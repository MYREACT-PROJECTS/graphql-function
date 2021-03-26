const mongoose= require ('mongoose');

const auths = mongoose.Schema({
    name: String,
    email:String,
    password:String,
    type:Number,
})

module.exports= mongoose.model("AUTH",auths)