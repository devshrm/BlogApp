const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const User = require('../models/user');

router.get('/blogs/create' , (req,res)=>{
    res.render('create',{title:'Create Blog'});
});


router.get('/blogs' ,ensureAuthenticated, (req,res)=>{
    Blog.find().sort({createdAt: -1}).then((result)=>{
        res.render('index' , {title:'All Blogs' , blogs: result})
    })
    .catch((err)=>{
        console.log(err);
    })
});

//POST
router.post('/blogs' , (req,res)=>{
    const blog = new Blog(req.body);
    blog.id = req.user._id;
    User.findById(req.user._id).then(
        result => {
            blog.name = result.name;
            blog.save()
        .then((result)=>{
            res.redirect('/blogs');
        }).catch((err)=>console.log(err));
        }
    )

    
});



router.get('/blogs/:id' , (req,res)=>{
    const id = req.params.id;
    Blog.findById(id)
        .then(result => {
            res.render('details' , {blog: result , title: 'Blogg'});
        }).catch(err=>console.log('err'));
});
 

router.delete('/blogs/:id' , (req,res)=>{
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
        .then(result =>{
            res.json({redirect: '/blogs' });
        }).catch(err=>console.log(err));
});

function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/users/login');
    }
}

module.exports = router;
