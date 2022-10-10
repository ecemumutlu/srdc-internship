const express = require('express');
const app = express();
const activityRoute = express.Router();
// Message model
let Activity = require('../models/Activity');
// Add Message
activityRoute.route('/create').post((req, res, next) => {
  Activity.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});
// Get All Messages
activityRoute.route('/').get((req, res) => {
  Activity.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})



// Get single message
activityRoute.route('/read/:id').get((req, res) => {
  Activity.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Update message
activityRoute.route('/update/:id').put((req, res, next) => {
  Activity.findByIdAndUpdate(req.params.id, {
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
activityRoute.route('/user.route/delete/:id').delete((req, res, next) => {
  Activity.findOneAndDelete(req.params.id, (error, data) => {
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
activityRoute.post('/add-activity',(req,res,next) => {
  let newActivity = new Activity({
    userId: req.body.userId,
    username: req.body.username,
    operation: req.body.operation,
    date: req.body.date,
    description: req.body.description,
    });

    Activity.addActivity(newActivity, (err,activity) => {
      if(err){
        res.json({success: false, msg:'Failed to add activity'});
      }
      else{
        res.json({success: true, msg: 'Activity added succesfully'});
      }
    });
});

module.exports = activityRoute;

