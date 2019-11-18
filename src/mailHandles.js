const {User} =  require('../models');
var crypto = require('crypto');

// var transporter = nodemailer.createTransport({
//     service: '163',
//     auth: {
//       user: 'niuxiangwei1995@163.com',
//       pass: '######'
//     }
//     // service: 'gmail',
//     // auth: {
//     //   user: 'company2.cs510@gmail.com',
//     //   pass: 'Cs410510!!'
//     // }
// });

// const verifyMail = async (req, res) => {
//     var msg;
//     transporter.verify(function(error, success) {
//         if (error) {
//             console.log(error);
//             msg = "error!"
//         } else {
//             console.log("Server is ready to take our messages");
//             msg = "okay!"
//         }
//     });
//     res.status(200).send(msg);
// }

// var sendMailSuc;
// function sendMail2(toEmail, sub, content){
//     var mailOptions = {
//         from: 'niuxiangwei1995@163.com',
//         //from: 'company2.cs510@gmail.com',
//         to: toEmail,
//         subject: sub,
//         text: content
//     };
    
//     transporter.sendMail(mailOptions, function(error, info){
//         if (error) {
//             console.log(error);
//             return res.status(200).send({
//                 message: 'Cannot send the email'
//             });
//         } else {
//             console.log('Email sent: ' + info.response);
//             return res.status(200).send({
//                 message: 'Send the email Sucessfully!'
//             });
//         }
//     });
// }

const reqPassReset = async (req, res) => {
    const user = await User.findOne({
        username: req.body.username
    })
    //console.log(user);
    //check email address
    if (!user){
        res.sendStatus(403);
        return;
    }
    const toEmail = user.email;
    if (toEmail != req.body.email){
        res.sendStatus(403);
        return;
    }
    // get token
    const token = await crypto.randomBytes(48).toString('hex');

    console.log(token);

    // save user reset pwd info to db
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    user.save();

    // const hostName = 'localhost:3000';
    // const msg = 'You are requested the reset of the password for your account.\n\n' +
    // 'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
    // 'http://' + hostName + '/reset/' +token + '\n\n' +
    // 'If you did not request this, please ignore this email and your password will remain unchanged.\n'

    //sendMail2(toEmail, 'Password Reset', msg);

    return res.status(200).send({
        Token: token
    });
    
}

const updatePass = async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.body.resetPasswordToken
        })

        if (!user){
            res.sendStatus(404);
            return;
        }

        const expires = await (user.resetPasswordExpires >= Date.now()) ? false : true;

        if (expires){
            res.sendStatus(403);
            return;
        }

        user.password = require('bcrypt').hashSync(req.body.password, 10);
        user.updateTime = new Date();
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save();
        //sendMail2(user.email, 'Password Reset Confirmation', 'Your Password Has Changed!!');
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(400);
    }
}

module.exports = {
    //verifyMail,
    reqPassReset,
    updatePass
};