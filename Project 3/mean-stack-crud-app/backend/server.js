const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
const config = require('./config/database')




// Connecting with mongo db
mongoose.connect(config.database)
mongoose.connection.on('connected',() => {
  console.log('Connected to database ' + config.database);
});
mongoose.connection.on('error',(err) => {
  console.log('Database error: ' + err );
});

//Create and
const userRoute = require('../backend/routes/user.route')

const database = require('./config/database')
const app = express()

//CORS Middleware
app.use(cors({credentials: true, origin: true}))

//Body parser middleware
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);

const session = require('express-session');
// After you declare "app"
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'bla bla bla'
 }));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use('/user.route',userRoute);

/*
app.use(cors())
app.use(express.static(path.join(__dirname, 'dist/mean-stack-crud-app')))
app.use('/', express.static(path.join(__dirname, 'dist/mean-stack-crud-app')))
app.use('/api', employeeRoute)
*/




//Set static folder
app.use(express.static(path.join(__dirname, 'public')))


app.use(express.static(path.join(__dirname, 'dist/mean-stack-crud-app')))
app.use('/', express.static(path.join(__dirname, 'dist/mean-stack-crud-app')))
app.use('/api', userRoute)


// Create port
const port = process.env.PORT || 4000

//Start server
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})


//Index Route
app.get('/',(req,res) => {
  res.send('Invalid endpoint');
})


// Find 404 and hand over to error handler
app.use((req, res, next) => {
  next(createError(404))
})
// error handler
app.use(function (err, req, res, next) {
  console.error(err.message) // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500 // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send(err.message) // All HTTP requests must have a response, so let's send back an error with its status code and message
})


app.delete("/user.route/delete/:id", (req, res, next)=>{
  console.log(req.params.id);
  res.status(200).json({
    message:"User deleted!"
  });
});
