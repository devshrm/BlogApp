const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcrypt');

module.exports = function(passport){
    passport.use(new LocalStrategy(function(username,password,done){
        const query = {username:username};
        User.findOne(query , function(err,user){
            if(err)throw err;
            if(!user){
                return done(null,false, {message:'User Not Found'});

            }

            bcrypt.compare(password, user.password,(err, check)=>{
                if(err)throw err;
                if(check){
                    return done(null, user);
                }else{
                    return done(null, false,{message:'Wrond Password'});
                }
            });

        });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}

