const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define collection and schema
let ActivitySchema = new Schema({

    userId: {
      type: String
    },
    username: {
      type: String
    },
    operation: {
      type: String
    },
    date: {
      type: Date
    },
    description: {
      type: String
    }
  }, {
   collection: 'activities'
})


const Activity = module.exports = mongoose.model('Activity', ActivitySchema);

module.exports.getActivityById = function(id,callback){
  Activity.findById(id,callback);
}

module.exports.getActivityByUsername = function(username,callback){
  const query = {username: username};
  Activity.findOne(query,callback);
}

module.exports.addActivity = function(newActivity,callback){
  newActivity.save(callback);
}


