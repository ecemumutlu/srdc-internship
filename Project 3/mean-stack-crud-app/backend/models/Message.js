const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//pagination//
var mongoosePaginate = require('mongoose-paginate');




// Define collection and schema
let MessageSchema = new Schema({
    sender: {
      type: String
    },
    receiver: {
      type: String
    },
    subject: {
      type: String
    },
    date: {
      type: Date
    },
    messageContent: {
      type: String
    }
  }, {
   collection: 'messages'
})

MessageSchema.plugin(mongoosePaginate);

var Model = mongoose.model('Model',  MessageSchema); // Model.paginate()


const Message = module.exports = mongoose.model('Message', MessageSchema);


module.exports.getMessageById = function(id,callback){
  Message.findById(id,callback);
}

module.exports.getMessageBySender = function(sender,callback){
  const query = {sender: sender};
  Sender.findOne(query,callback);
}

module.exports.addMessage = function(newMessage,callback){
  newMessage.save(callback);
}


