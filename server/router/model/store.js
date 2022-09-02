'use strict';

const fs = require('fs'), 
    chats = (req, res) => {
        const {
            token,
            type,
            jid
        } = req.body;
        if (token && type) try {
            const data = fs.readFileSync('credentials/' + token + '/multistore.js', {
                'encoding': 'utf8'
            });
            let user = JSON.parse(data);
            if (type === "chats") user = user.chats;
            else {
                if (type === "contacts") user = user.contacts;
                else {
                    if (type === "messages") jid ? user = user.messages[jid] : user = user.messages;
                    else return res.send({
                        'status': false,
                        'message': "Unknown type"
                    });
                }
            }
            if (typeof user === "undefined") return res.send({
                'status': false,
                'message': "Data Not Found"
            });
            return res.send(message.length > 0 ? user.reverse() : user);
        } catch (error) {
            return process.env.NODE_ENV !== 'production' ? console.log(error) : null, res.send({
                'status': false,
                'error': error
            });
        }
        res.send({
            'status': false,
            'error': "wrong parameters"
        });
    };
module.exports = {
    'chats': chats
};