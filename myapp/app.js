var createError = require('http-errors');
const axios = require("axios").default;
var express = require('express');
var dotenv = require("dotenv");
var mongoose = require("mongoose");
var path = require('path');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const bodyParser = require('body-parser');
const { Axios } = require('axios');
const router = require('./routes/index');
const port = process.env.PORT ||  8888;
var urlEncodedParser = bodyParser.urlencoded({extended: false});
const mongo = require("mongodb").MongoClient;

var db = mongoose.connection;

var quote, author, name, email, qOne, qTwo, qThree, qFour, qFive;
var result;


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.get("/", (req, res) => {
  res.render("index", {
    quote: quote,
    author: author
  });
})

app.post("/", urlEncodedParser, (req, res) => {

  console.log(req.body);
  qOne = req.body.flexRadioDefault;
  qTwo = req.body.question2;
  qThree = req.body.question3;
  qFour = req.body.question4;
  qFive = req.body.question5


  name = req.body.fname;
  email = req.body.email

  if (name && email) {
    console.log(name + '\n' + email);
  }

  if (qOne === "Yes") {
    result = {
      school: "Realism",
      link: "https://philpapers.org/rec/SHAMRA",
      description: "Realism about a certain kind of thing (like numbers or morality)" +
                    "is the thesis that this kind of thing has mind-independent existence",
      imageLink: "https://cdn.pixabay.com/photo/2017/05/09/17/37/sculpture-2298848_960_720.jpg"
    }
    console.log(result);
  } else {
    result = {
      school: "Determinism",
      link: "https://philpapers.org/rec/LOEDAC-3",
      description: "Determinism is the philosophical view that all events" +
                   "are determined completely by previously existing causes.",
      imageLink: "https://cdn.pixabay.com/photo/2017/05/13/10/46/black-and-white-2309273_960_720.jpg"
    }
  }

  if (name) {
    res.render("success", {
      name: name,
      email: email,
      result: result
    })
  

    mongoose.connect("mongodb://localhost:27017/test");
    var conn = mongoose.connection;
    conn.on("connected", function() {
      console.log("Database connected successfully");
    })

    conn.on("disconnected", function() {
      console.log("database disconnected successfully");
    })

    conn.on('error', console.error.bind(console, 'connection error:'));

    
    db.once('open', function() {
      console.log("Connection Successful!");
       
      // define Schema
      var BookSchema = mongoose.Schema({
        name: String,
        email: String,
        questionOne: String,
        questionTwo: String,
        questionThree: String,
        questionFour: String,
        questionFive: String,

      });
   
      // compile schema to model
      var Book = mongoose.model('Book', BookSchema, 'bookstore');
   
      // a document instance
      var book1 = new Book({ 
        name: name, 
        email: email,
        questionOne: qOne,
        questionTwo: qTwo,
        questionThree: qThree,
        questionFour: qFour,
        questionFive: qFive      
      });
   
      // save model to database
      book1.save(function (err, book) {
        if (err) return console.error(err);
        console.log(book.name + " saved to bookstore collection.");
      });
       
  });


    


  } else if (req.body) {
    res.render("quiz");
  }
})

app.post("/quiz", (req, res) => {
  console.log(req.body);
  console.log("render!!!");
})

app.get("/", (req, res) => {
  res.render("quiz", {title: "quiz"});
})

app.get("/", (req, res) => {
  res.render("success", {title: "success"})
})


app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function getQuote() {
  axios.get("https://stoicquotesapi.com/v1/api/quotes/random")
    .then(function (response) {
      quote = response.data.body;
      author = response.data.author;
      console.log(quote + '\n' + author);
    })
    .catch(function (err) {
      console.error(err);
    })
}

getQuote();
//


module.exports = app;