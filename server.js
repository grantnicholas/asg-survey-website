//Module dependencies:

var express = require("express");
var app = express();


var bodyParser = require("body-parser");
var mongo = require('mongodb');
var monk = require('monk');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var nodemailer = require('nodemailer');
var passwordHash = require('password-hash');
var db = monk('mongodb://testgrant:admin@ds041160.mongolab.com:41160/asg-data');

var homeController = require('./routes/home');
var userController = require('./routes/user');
var dataController = require('./routes/data');

app.set("port", (process.env.PORT || 8000) );
app.set("views", __dirname + "/views");
app.set("view engine", "jade");
app.use(express.static("public", __dirname + "/public"));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieSession({
  name: 'asg-express-cookie',
  secret: 'ourSecret'
}));

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: 'cihl.robot@gmail.com',
      pass: 'robot<>robot'
  }
});


app.use(function(req,res,next){
    //req.db = db;
    req.transporter = transporter;
    req.passwordHash = passwordHash;
    req.db = db;
    next();
});

//Application routes.
 
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/register', userController.getRegister);
app.post('/register', userController.postRegister);
app.get('/data', dataController.getData);
app.get('/data/:dname', dataController.getPDF);


app.listen(app.get("port"), app.get("ipaddr"), function() {
  console.log("Server up and running. Go to http://" + /*app.get("ipaddr") +*/ ":" + app.get("port"));
});

module.exports = app;

