const { Message } = require('../models');


const sendHandler = async (req, res) => {
    const user1 = req.user.username;
    const user2 = req.body.username;
    const msg = req.body.message;

    const messages = await Message.findOne({
         $or: [
            {users: [user1,user2]},
            {users: [user2,user1]}
         ]
    });

    if (messages) {
        const message = messages.message;
        message.push({
            direction: messages.users[0] === user1 && messages.users[1] === user2,
            content: msg,
            time: new Date(),
        })
        await messages.save();
    }
    else {
        const message = new Message({
            users: [user1, user2],
            message: {
                direction: true,
                content: msg,
                time: new Date()
            }
        })
    
        await message.save();
    }
    const allMessages = await Message.findOne({
        $or: [
            {users: [user1,user2]},
            {users: [user2,user1]}
         ]
    });

    res.status(200).send(allMessages);
}

const getMessagesHandler = async (req, res) => {
    const user1 = req.user.username;
    const user2 = req.body.username;

    
    const messages = await Message.findOne({
        $or: [
            {users: [user1,user2]},
            {users: [user2,user1]}
         ]
    });

    res.status(200).send(messages);
}




module.exports = {
    sendHandler,
    getMessagesHandler,
};