const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/express-auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});


const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        unique: true,
        required: true
    },
    password: {
        type: String
    },
    region: {type: String},
    favorite: {type: String},
    level: {type: String},
    createTime: {type: Date},
    updateTime: {type: Date}
});


const PostSchema = new mongoose.Schema({
    title: {type: String},
    body: {type: String},
    Category: {type: mongoose.SchemaTypes.ObjectId,ref: 'Category'},
    user: {type: mongoose.SchemaTypes.ObjectId,ref:'User'},
    createTime: {type: Date},
    updateTime: {type: Date}
});

const CategorySchema = new mongoose.Schema({
    name: {type: String}
})


const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);
const Category = mongoose.model('Category', CategorySchema);

// User.db.dropCollection('users');
// Post.db.dropCollection('posts');


//use to set up the default admin
// const user =  User.create({
//     username: "admin",
//     password: require('bcrypt').hashSync("admin",10),
//     region: "all",
//     favorite: "nothing",
//     level: "admin",
//     createTime: Date()
// });

module.exports = { User,Post,Category }


