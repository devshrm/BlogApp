const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

router.get('/register' , (req,res)=>{
    res.render('register');
});

router.post('/register' , (req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    const newUser = new User({
        name:name,
        email:email,
        username:username,
        password:password
    });

    bcrypt.genSalt(10 , (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save()
             .then((result) =>{
                     req.flash('success','Registered');
                     res.redirect('/users/login');
        }).catch(err=>console.log(err));
        });
    });
});

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/blogs',
        failureRedirect:'/users/login',
        failureFlash:false

    })(req,res,next);
});

router.get('/login' , (req,res)=>{
    res.render('login');
});

router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/users/login');
});

module.exports = router;
