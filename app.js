const path = require('path');
const express = require('express');
const morgan  = require('morgan');
const mongoose = require('mongoose');
const app = express();
const Blog = require('./models/blog');
const { render } = require('ejs');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const blogR = require('./routes/blogR.js');
const userR = require('./routes/userR.js');
const config = require('./config/database');
const passport = require('passport');
app.set('view engine' , 'ejs');

mongoose.connect('mongodb://localhost/BlogApp' , {useNewUrlParser:true, useUnifiedTopology:true}).then(app.listen(3000)).catch((err)=> console.log(err));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*',(req,res,next)=>{
    res.locals.user = req.user || null;
    next();
});

app.get('/about' , (req,res)=>{
    res.render('about',{title : 'About'});
    
});

app.use(blogR);
app.use('/users',userR);

app.get('/',(req,res)=>{
    res.redirect('/users/login');
});

app.use((req,res) =>{
    res.status(404).render('404' , {title : '404'});
});