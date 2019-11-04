const { User, Post, Message } = require('../models');


const sendHandler = async (req, res) => {
    const user1 = req.user.username;
    const user2 = req.body.username;
    const msg = req.body.message;

    const messages = Message.find({ users: { $all: [user1, user2] } });
    const messagesBack = Message.find({ users: { $all: [user2, user1] } });
    
    if(messages){
        messages.message.direction = true;
        messages.message.content = msg;
        message.add()
    }else if(messageBack){

    }
    console.log(req.user.username);
    res.sendStatus(200);
}

const getMessagesHandler = async (req, res) => {
    const user1 = req.user.username;
    const user2 = req.body.username;
    const messages = Message.find({ users: { $all: [user1, user2] } })
    res.status(200).send(messages);
}




module.exports = {
    sendHandler,
    getMessagesHandler,
};