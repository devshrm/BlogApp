const mongoose = require('mongoose');
const { modelName } = require('./blog');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }

});

const User = mongoose.model('User' , userSchema);
module.exports = User;