const express = require('express');
const app = express();
const userRoute = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database')
const Message = require('../models/Message');
const Activity = require('../models/Activity');
let User = require('../models/User');

userRoute.post('/register',passport.authenticate('jwt', {session: false})
,(req,res,next) => {
  User.getUserById(req.header('UserID') , (err, user) =>{
    if(err){
      throw err;
    }
    if(!user){
      return res.status(200).json({success: false, msg: 'User not found'});
    }

  let newUser = new User({
    userType: req.body.userType,
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    surname: req.body.surname,
    gender: req.body.gender,
    birthdate: req.body.birthdate,
    email: req.body.email
    });

    User.addUser(newUser, (err,user) => {
      if(err){
        res.json({success: false, msg:'Failed to register user'});
      }
      else{
        res.json({success: true, msg: 'User registered'});
      }
    });
  })

});


//Authenticate
userRoute.post('/authenticate',(req,res,next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username , (err, user) =>{
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password , (err,isMatch)=> {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 604800
         });

        res.status(200).json({
          success: true,
          token: 'Bearer '+ token,
          user: {
            id: user._id,
            userType: user.userType,
            username: user.username,
            name: user.name,
            surname: user.surname,
            gender: user.gender,
            birthdate: user.birthdate,
            email: user.email
          }
        });
      }
      else{
        return res.json({success: false, msg: 'Wrong password'});
      }
    })
  })
});


//Profile
//get in içinde bu vardı çıkardım:  passport.authenticate('jwt', {session: false}),
userRoute.route('/profile').get(passport.authenticate('jwt', {session: false}),(req,res,next) => {
  User.getUserById(req.header('UserID') , (err, user) =>{
    if(err){
      throw err;
    }
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }
    res.status(200).json({
      success: true ,msg: user
    })
    //res.json({success: true,user: req.user});

  })
});




// Employee model
// Add Employee
userRoute.route('/create').post(passport.authenticate('jwt', {session: false}),(req, res, next) => {
  User.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});
// Get All Employees

userRoute.route('/').get(passport.authenticate('jwt', {session: false}),(req, res) => {
  User.getUserById(req.header('UserID') , (err, user) =>{
    if(err){
      throw err;
    }
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }
    User.find((error, data) => {
      if (error) {
        return next(error)
      } else {
        res.status(200).json({
          success: true ,msg: data
        })
      }
    })
  })


})


// Get single employee
userRoute.route('/read/:id').get(passport.authenticate('jwt', {session: false}),(req, res) => {
  User.getUserById(req.header('UserID') , (err, user) =>{
    if(err){
      throw err;
    }
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }
    User.findById(req.params.id, (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.status(200).json({
          success: true ,msg: data
        })
      }
    })
  })

})

// Update employee
userRoute.route('/update/:id').put(passport.authenticate('jwt', {session: false}),(req, res, next) => {
  User.getUserById(req.header('UserID') , (err, user) =>{
    if(err){
      throw err;
    }
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }
    User.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.status(200).json({
          success: true ,msg: data
        })
        console.log('Data updated successfully')
      }
    })

  })

})


// Update employee
userRoute.route('/update2/:id').put(passport.authenticate('jwt', {session: false}),(req, res, next) => {

  User.getUserById(req.header('UserID') , (err, user) =>{
    if(err){
      throw err;
    }
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }
    User.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.status(200).json({
          success: true ,msg: data
        })
        console.log('Data updated successfully')
      }
    })

  })

})


// Delete employee
userRoute.route('/delete/:id').delete(passport.authenticate('jwt', {session: false}),(req, res, next) => {


  User.getUserById(req.header('UserID') , (err, user) =>{
    if(err){
      return next(err);
    }
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }
    User.findOneAndDelete({ _id : req.params.id}, (error, data1) => {
      console.log(req.params.id);
      if (error) {
        return next(error);
      } else {
        res.status(200).json({
          success: true ,msg: data1
        })
      }
    })
  })



})

//------------------------------------MESSAGES-------------------------------------//

//Send message
userRoute.route('/create-message').post(passport.authenticate('jwt', {session: false}),(req,res,next) => {
  User.getUserById(req.header('UserID') , (err, user) =>{
    if(err){
      return next(err);
    }
    if(!user){
      return res.status(200).json({success: false, msg: 'User not found'});
    }

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
  })

});



// Get All Messages
userRoute.route('/get-messages/:limit/:sort/:sortDir/:skip').get(passport.authenticate('jwt', {session: false}),(req, res) => {
  let sortP = req.params.sort;
  let sortD = req.params.sortDir;
  let limitP = +req.params.limit;
  let skipP = req.params.skip * limitP;



  User.getUserById(req.header('UserID') , (err, user) =>{
    if(err){
      return next(err);
    }
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }
    Message.count((error,data1) =>{
      if (error) {
        return next(error)
      } else {
        Message.find((error, data) => {
          if (error) {
            return next(error)
          } else {
            res.status(200).json({success: true, msg: data, size: data1});
          }
        }).sort({sortP: sortD}).limit(limitP).skip(skipP);
      }
    })


  })

})

userRoute.route('/get-activities').get(passport.authenticate('jwt', {session: false}),(req, res) => {
  User.getUserById(req.header('UserID') , (err, user) =>{
    if(err){
      return next(err);
    }
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }
    Activity.find((error, data) => {
      if (error) {
        return next(error)
      } else {
        res.status(200).json({success: true, msg: data});
      }
    })

  })

})



// Get All Messages
userRoute.route('/get-inbox/:limit/:sort/:sortDir/:skip').get(passport.authenticate('jwt', {session: false}),(req, res) => {

  let sortP = req.params.sort;
  let sortD = req.params.sortDir;
  let limitP = +req.params.limit;
  let skipP = req.params.skip * limitP;

  User.getUserById(req.header('UserID') , (err, user) =>{
    if(err){
      return next(err);
    }
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    Message.count({receiver: req.header('Username')},(error,data1) =>{
      if (error) {
        return next(error)
      }
      else{
        Message.find({receiver: req.header('Username') },(error, data) => {
          if (error) {
            return next(error)
          } else {
            res.status(200).json({success: true, msg: data, size: data1});
          }
          }
        ).sort({sortP: sortD}).limit(limitP).skip(skipP);
      }
    })
  })
})



userRoute.route('/get-outbox/:limit/:sort/:sortDir/:skip').get(passport.authenticate('jwt', {session: false}),(req, res) => {

  let sortP = req.params.sort;
  let sortD = req.params.sortDir;
  let limitP = +req.params.limit;
  let skipP = req.params.skip * limitP;

  User.getUserById(req.header('UserID') , (err, user) =>{
    if(err){
      return next(err);
    }
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    Message.count({sender: req.header('Username')},(error,data1) =>{
      if (error) {
        return next(error)
      }
      else{
        Message.find({sender: req.header('Username') },(error, data) => {
          if (error) {
            return next(error)
          } else {
            res.status(200).json({success: true, msg: data, size: data1});
          }
          }
        ).sort({sortP: sortD}).limit(limitP).skip(skipP);
      }
    })
  })

})


// Get single message
userRoute.route('/read/:id').get(passport.authenticate('jwt', {session: false}),(req, res) => {
  Message.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Update message
userRoute.route('/update/:id').put(passport.authenticate('jwt', {session: false}),(req, res, next) => {
  Message.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  })
})
// Delete message
userRoute.route('/delete/:id').delete(passport.authenticate('jwt', {session: false}),(req, res, next) => {
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



//---------------------------------------ACTIVITIES-----------------------------------//


//Add activity
userRoute.post('/add-activity',(req,res,next) => {

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



// Get All Messages
userRoute.route('/get-activities/:limit/:sort/:sortDir/:skip').get(passport.authenticate('jwt', {session: false}),(req, res) => {
  let sortP = req.params.sort;
  let sortD = req.params.sortDir;
  let limitP = +req.params.limit;
  let skipP = req.params.skip * limitP;


  User.getUserById(req.header('UserID') , (err, user) =>{
    if(err){
      return next(err);
    }
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }
    Activity.count((error,data1) =>{
      if (error) {
        return next(error)
      }
      else{
        Activity.find((error, data) => {
          if (error) {
            return next(error)
          } else {
            res.status(200).json({success: true, msg: data, size: data1})
          }
        }).sort(`${sortP} : ${sortD}`).limit(`${limitP}`).skip(`${skipP}`);
      }
    })

  })





})






// Get single message
userRoute.route('/read/:id').get(passport.authenticate('jwt', {session: false}),(req, res) => {
  Activity.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Update message
userRoute.route('/update/:id').put(passport.authenticate('jwt', {session: false}),(req, res, next) => {
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
userRoute.route('/delete/:id').delete(passport.authenticate('jwt', {session: false}),(req, res, next) => {
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




module.exports = userRoute;
