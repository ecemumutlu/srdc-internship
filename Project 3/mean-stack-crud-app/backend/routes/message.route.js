const express = require('express');
const app = express();
const messageRoute = express.Router();
// Message model
let Message = require('../models/Message');
// Add Message
messageRoute.route('/create').post((req, res, next) => {
  Message.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});
// Get All Messages
messageRoute.route('/').get((req, res) => {
  Message.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})
// Get single message
messageRoute.route('/read/:id').get((req, res) => {
  Message.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Update message
messageRoute.route('/update/:id').put((req, res, next) => {
  Message.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  })
})
// Delete message
messageRoute.route('/user.route/delete/:id').delete((req, res, next) => {
  Message.findOneAndDelete(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})



//Send message
messageRoute.post('/create-message',(req,res,next) => {
  let newMessage = new Message({
    sender: req.body.sender,
    receiver: req.body.receiver,
    subject: req.body.subject,
    date: req.body.date,
    messageContent: req.body.messageContent
    });

    Message.addMessage(newMessage, (err,user) => {
      if(err){
        res.json({success: false, msg:'Failed to send message'});
      }
      else{
        res.json({success: true, msg: 'Message sent succesfully'});
      }
    });
});

module.exports = messageRoute;

