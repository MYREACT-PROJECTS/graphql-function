const mongoose = require('mongoose')

const contacts = mongoose.Schema({
    name:  String,
    phone: String,

});


module.exports= mongoose.model("CONTACTS",contacts)