const express = require('express');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
  useMongoClient: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

// Index Route
app.get('/', (req, res) => {
  res.render('index', {
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

// Calorie Calculator Route
app.get('/calculateCalorie', (req, res) => {
  res.render('calc');
});

// Idea Index Page
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({date:'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas:ideas
      });
    });
});

// Add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

// Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea:idea
    });
  });
});

// Process Form
app.post('/ideas', (req, res) => {
  let errors = [];
  if(!req.body.Gender){
    errors.push({text:'Please Add your Gender'});
  }
  if(!req.body.activity){
    errors.push({text:'Please Add your activity'});
  }
  if(!req.body.Name){
    errors.push({text:'Please Add your Name'});
  }
  if(!req.body.Age){
    errors.push({text:'Please Add Your Age'});
  }
  if(!req.body.Height){
    errors.push({text:'Please add some Height'});
  }
  if(!req.body.Weight){
    errors.push({text:'Please add some Weight'});
  }

  if(errors.length > 0){
    res.render('ideas/add', {
      errors: errors,
      Gender: req.body.Gender,
      activity: req.body.activity,
      Name: req.body.Name,
      Age: req.body.Age,
      Weight: req.body.Weight,
      Height: req.body.Height,
    });
  } else {
    const newUser = {
      Gender: req.body.Gender,
      activity: req.body.activity,
      Name: req.body.Name,
      Age: req.body.Age,
      Weight: req.body.Weight,
      Height: req.body.Height,
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        res.redirect('/ideas');
      })
  }
});

// Edit Form process
app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    // new values
    idea.Gender =  req.body.Gender,
    idea.activity+ req.body.activity,
    idea.Name= req.body.Name,
    idea.Age = req.body.Age;
    idea.Height = req.body.Height;
    idea.Weight = req.body.Weight;

    idea.save()
      .then(idea => {
        res.redirect('/ideas');
      })
  });
});

// Delete Idea
app.delete('/ideas/:id', (req, res) => {
  Idea.remove({_id: req.params.id})
    .then(() => {
      res.redirect('/ideas');
    });
});

const port = 5000;

app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});