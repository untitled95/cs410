const jwt = require('jsonwebtoken');
const Path = require('path');
const Fs = require('fs');
const SECRET = Fs.readFileSync(Path.join(__dirname, "..", 'key'), 'utf8');
const { User, Post } = require('../models');

/**
 * decide who is the user login to the app. Mid-ware
 *
 * @typedef ExpressHandler
 */
const auth = async (req, res, next) => {
    try {
        const raw = String(req.headers.authorization).split(' ').pop();
        const { id } = jwt.verify(raw, SECRET);
        req.user = await User.findById(id);
        next()
    } catch (err) {
        res.sendStatus(403);
    }
}

const usersHandler = async (req, res) => {
    const users = await User.find()
    res.send(users);
}

const postsHandler = async (req, res) => {
    const posts = await Post.find();
    res.send(posts);
}

const registerHandler = async (req, res) => {

    const existenceUser = await User.exists({ username: req.body.username });
    const existenceEmail = await User.exists({ email: req.body.email });

    if (existenceUser || existenceEmail) {
        res.sendStatus(422);
        return;
    }

    const user = new User({
        username: req.body.username,
        password: require('bcrypt').hashSync(req.body.password, 10),
        email: req.body.email,
        region: "",
        favorite: "",
        level: "normal",
        createTime: Date()
    });


    await user.save();
    res.sendStatus(200);


}

const loginHandler = async (req, res) => {
    const user = await User.findOne({
        username: req.body.username
    });
    console.log(req.body);
    if (!user) {
        return res.status(422).send({
            message: 'wrong combination'
        })
    }

    const isPasswordValid = require('bcrypt').compareSync(
        req.body.password,
        user.password
    )
    if (!isPasswordValid) {
        return res.status(422).send({
            message: 'wrong combination'
        })
    }
    //generate token
    const token = jwt.sign({
        id: String(user._id),
    }, SECRET,{
        expiresIn: '24h'
    });

    res.send({
        user,
        token
    });
}


const updateHandler = async (req, res) => {
    const user = await User.findOne({
        username: req.user.username
    });
    if (req.body.region) {
        user.region = req.body.region;
    }

    if (req.body.favorite) {
        user.favorite = req.body.favorite;
    }

    user.updateTime = new Date();

    await user.save();
    res.status(200).send(user);
}



const passwordHandler = async (req, res) => {

    var tempUser = req.user;

    await User.deleteOne({
        username: req.user.username
    });

    if (req.body.password) {
        tempUser.password = req.body.password;
    }
    const user = new User({
        username: tempUser.username,
        password: require('bcrypt').hashSync(tempUser.password, 10),
        email: tempUser.email,
        region: tempUser.region,
        favorite: tempUser.favorite,
        level: tempUser.level,
        createTime: tempUser.createTime
    });

    user.updateTime = new Date();
    await user.save();
    res.sendStatus(200);
}


const profileHandler = async (req, res) => {
    if (req.user.level != "admin") {
        res.send(req.user);
    } else {
        const users = await User.find()
        res.send(users);
    }
}



const postHandler = async (req, res) => {

    const user = await User.findOne({
        username: req.user.username
    })
    if (req.body.title == "" || req.body.body == "") {
        res.sendStatus(403);
        return;
    }

    const post = new Post({
        title: req.body.title,
        body: req.body.body,
        user: user.username,
        region: req.body.region,
        payRate: req.body.payRate
    });

    post.createTime = new Date();
    await post.save();
    res.status(200).send(post);

}

const delPostHandler = async (req, res) => {
    const post = await Post.findOne({
        _id: req.body._id
    });
    if (!post) {
        res.sendStatus(404);
        return;
    }
    if (req.user.level != "admin" && req.user.username != post.user) {
        res.sendStatus(403);
        return;
    }

    await Post.deleteOne({
        _id: req.body._id
    });

    res.sendStatus(200);

}

const editPostHandler = async (req, res) => {


    const post = await Post.findOne({
        _id: req.body._id
    });

    if (!post) {
        res.sendStatus(404);
        return;
    }

    if (req.user.username != post.user) {

        res.sendStatus(403);
        return;
    }
    if (req.body.title) {
        post.title = req.body.title;
    }
    if (req.body.body) {
        post.body = req.body.body;
    }
    if (req.body.region) {
        post.region = req.body.region;
    }

    if (Number(req.body.payRate) == 0) {

        post.payRate = 0;

    }
    if (req.body.payRate) {

        post.payRate = Number(req.body.payRate);

    }
    post.updateTime = new Date();

    await post.save();
    res.send(post);

}

const viewPostHandler = async (req, res) => {
    const post = await Post.find({
        user: req.user.username
    });
    res.send(post);
}


// const forgetPasswordHandler = async(req,res)=>{
    
//     const user = await User.findOne({
//         username: req.body.username
//     });
//     if(user.email===req.body.email){
//         user.password = 
//     }
// }

module.exports = {
    auth,
    profileHandler,
    usersHandler,
    postsHandler,
    registerHandler,
    loginHandler,
    updateHandler,
    passwordHandler,
    postHandler,
    delPostHandler,
    editPostHandler,
    viewPostHandler,
    // forgetPasswordHandler
};