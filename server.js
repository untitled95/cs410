const { User, Post, Category } = require('./models');
const Path = require('path');
const Fs = require('fs');

//bad practice, need to be separate
const SECRET = Fs.readFileSync(Path.join(__dirname, 'key'), 'utf8');
const express = require("express");
const jwt = require('jsonwebtoken');
const app = express();


app.use(express.json());

//this api only debugging purpose, do not use this one in production 
app.get('/api/users', async (req, res) => {
    const users = await User.find()
    res.send(users);
});

app.post('/api/register', async (req, res) => {
    // console.log(req.body);

    const user = new User({
        username: req.body.username,
        password: require('bcrypt').hashSync(req.body.password, 10),
        region: req.body.region,
        favorite: req.body.favorite,
        level: "normal",
        createTime: Date()
    });

    await user.save();
    res.send(user);
});


app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        username: req.body.username
    });
    if (!user) {
        return res.status(422).send({
            message: 'Username not found'
        })
    }

    const isPasswordValid = require('bcrypt').compareSync(
        req.body.password,
        user.password
    )
    if (!isPasswordValid) {
        return res.status(422).send({
            message: 'wrong password'
        })
    }
    //generate token
    const token = jwt.sign({
        id: String(user._id),
    }, SECRET);

    res.send({
        user,
        token
    });
});

// decide who is the user login to the app
const auth = async (req, res, next) => {
    const raw = String(req.headers.authorization).split(' ').pop();
    const { id } = jwt.verify(raw, SECRET);
    req.user = await User.findById(id);
    next()
}



//only for admin
app.get('/api/admin/profiles', auth, async (req, res) => {
    if (req.user.level != "admin") {
        res.sendStatus(403);
    } else {
        const users = await User.find()
        res.send(users);
    }
})



app.get('/api/profile', auth, async (req, res) => {

    res.send(req.user);
})




app.get('/api/update', auth, async (req, res) => {

    try {

        const user = await User.findOne({
            username: req.user.username,
        });


        if(req.body.region){
            user.region = req.body.region;
        }

        if(req.body.favorite){
            user.favorite = req.body.favorite;
        }

        user.updateTime = new Date();

        await user.save();
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(404);
    };
    // console.log(req.user.username, req.user.region);
    // console.log(req.body);
})

app.get('/api/changePwd', auth, async (req, res) => {
    try{
        const user = await User.findOne({
            username: req.user.username
        })

        if(req.body.password){
            user.password = require('bcrypt').hashSync(req.body.password, 10)
        }

        user.updateTime = new Date();
        await user.save();
        res.sendStatus(200);
    }catch (err) {
        res.sendStatus(404);
    };
    
})

// for normal user to post
app.post('/api/post',auth, async (req,res)=>{
    try{
        const user = await User.findOne({
            username: req.user.username
        })
        
        
        const post = new Post({
            title: req.body.title,
            body: req.body.body,
            user: user.username,
            
        });
        
        post.createTime = new Date();
        await post.save(); 
        res.sendStatus(200);
    }catch (err) {
        res.sendStatus(403);
    };
})




app.get('/api/posts', async (req, res) => {

    // await Post.insertMany([
    //     {title: 'post1', body: 'body1', createTime: Date()},
    //     {title: 'post2', body: 'body2', createTime: Date()}
    // ])
    // const posts = await Post.find({
    //     archive: false
    // });

    const posts = await Post.find();
    res.send(posts);
})

app.listen(80, () => {
    console.log('http://localhost:80')
});