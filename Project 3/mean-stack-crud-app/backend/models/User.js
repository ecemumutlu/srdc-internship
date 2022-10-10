const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const Schema = mongoose.Schema;
// Define collection and schema
let UserSchema = new Schema({
    userType: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    surname: {
      type: String
    },
    birthdate: {
      type: Date
    },
    gender: {
      type:  String
    },
    email: {
      type: String,
      required: true
    }
}, {
   collection: 'users'
})

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id,callback){
  const query = {_id: id};
  User.findById(query,callback);
}

module.exports.getUserByUsername = function(username,callback){
  const query = {username: username};
  User.findOne(query,callback);
}

module.exports.addUser = function(newUser,callback){
  bcrypt.genSalt(10, (err,salt) => {
    bcrypt.hash(newUser.password, salt, (err,hash) =>{
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}


module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword,hash, (err,isMatch) =>{
    if(err) throw err;
    callback(null, isMatch);
  })
}



