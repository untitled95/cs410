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

    const user = new User ({
        username: req.body.username,
        password: require('bcrypt').hashSync(req.body.password, 10),
        email: req.body.email,
        region: "",
        favorite: "",
        level: "normal",
        createTime: Date()
    });

    try {
        await user.save();
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(502);
    }

}

const loginHandler = async (req, res) => {
    const user = await User.findOne({
        username: req.body.username
    });
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
    }, SECRET);

    res.send({
        user,
        token
    });
}


const updateHandler = async (req, res) => {
    try {

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
    } catch (err) {
        res.sendStatus(404);
    };
}


const passwordHandler = async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.user.username
        })

        if (req.body.password) {
            user.password = require('bcrypt').hashSync(req.body.password, 10)
        }

        user.updateTime = new Date();
        await user.save();
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(404);
    };

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
    try {
        const user = await User.findOne({
            username: req.user.username
        })
        if(req.body.title == "" || req.body.body == ""){
            res.send("empty title or body");
            return;
        }
        const post = new Post({
            title: req.body.title,
            body: req.body.body,
            user: user.username,
            region: req.body.region
        });

        post.createTime = new Date();
        await post.save();
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(403);
    };
}
module.exports = {
    auth, profileHandler, usersHandler, postsHandler, registerHandler, loginHandler, updateHandler, passwordHandler, postHandler
};