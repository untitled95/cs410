const handlers = require('./handlers');
const msgHandles = require('./msgHandles');
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");


mongoose.connect('mongodb://localhost:27017/express-auth', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});


app.use(bodyParser.json());
/**
 * for test purpose
 * this api only debugging purpose, do not use this one in production 
 */
app.get('/api/users', handlers.usersHandler);
app.get('/api/posts', handlers.postsHandler);
// app.get('/api/posts',async (req,res)=>{
//     const posts = await Post.find();
//     res.send(posts);
// });


/**
 * user relative functions
 */
app.post('/api/register', handlers.registerHandler);
app.post('/api/login', handlers.loginHandler);
app.post('/api/update', handlers.auth, handlers.updateHandler);
app.post('/api/changePwd', handlers.auth, handlers.passwordHandler);
app.get('/api/profile', handlers.auth, handlers.profileHandler); //admin can saw all user profiles, normal user can only saw their own profile.

/**
 * post relative functions.
 */
app.post('/api/post', handlers.auth, handlers.postHandler);
app.post('/api/delPost', handlers.auth, handlers.delPostHandler);
app.post('/api/editPost', handlers.auth, handlers.editPostHandler);
app.get('/api/viewPosts', handlers.auth, handlers.viewPostHandler);



/**
 * message relative functions
 */
app.post('/api/send', handlers.auth, msgHandles.sendHandler);
app.post('/api/messages',handlers.auth,msgHandles.getMessagesHandler);




module.exports = {
    app
}
