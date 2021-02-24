const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const nameSchema = new Schema({
    name : {
        type:String,
        required : true
    },
},{timestamps:true})

const Name = mongoose.model('name',nameSchema);
module.exports = Name

