const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    region: { type: String },
    favorite: { type: String },
    level: { type: String },
    createTime: { type: Date },
    updateTime: { type: Date }
});


const PostSchema = new mongoose.Schema({
    title: { type: String },
    body: { type: String },
    user: { type: String },
    takenBy: { type: String },
    region: { type: String },
    createTime: { type: Date },
    updateTime: { type: Date },
    archive: {
        type: [Boolean],
        default: false
    }
});

const MessageSchema = new mongoose.Schema({
    users: {
        type: [String],
        required: true,
        default: [],
    },
    message: {
        type: new mongoose.Schema({
            direction: {
                type: Boolean,
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
        }, { _id: false }),
    },
})


const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);
const Message = mongoose.model('Message',MessageSchema);

// User.db.dropCollection('users');
// Post.db.dropCollection('posts');


//use to set up the default admin
// const user =  User.create({
//     username: "admin",
//     password: require('bcrypt').hashSync("admin",10),
//     email: "admin@test.com",
//     region: "all",
//     favorite: "nothing",
//     level: "admin",
//     createTime: Date()
// });

module.exports = { User, Post, Message }


