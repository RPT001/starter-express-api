'use strict';
const wa = require("./whatsapp"),
    lib = require('../../lib'),
    {
        dbQuery
    } = require("../../database"),
    {
        asyncForEach,
        formatReceipt
    } = require('../helper'),
    createInstance = async (req, res) => {
        const token = req.body;
        if (conn) try {
            const qr_code = await wa.connectToWhatsApp(conn, req.io),
                status = qr_code?. ['status'],
                message = qr_code?. ['message'];
            return res.send({
                'status': status ?? "processing",
                'qrcode': qr_code?. ["qrcode"],
                'message': message ? message : "Processing"
            });
        } catch (err) {
            return console.log(err), res.send({
                'status': false,
                'error': err
            });
        }
        res.status(403).end('Token needed');
    }, 
    sendText = async (req, res) => {
        const 
            {   token,
                number,
                text
            } = req.body;
        if (token && number && text) {
            let isExist_no = await wa.isExist(token, formatReceipt(number));
            if (!isExist_no) return res.send({
                'status': false,
                'message': 'The destination Number not registered in whatsapp or your sender not connected'
            });
            const result = await wa.sendText(token, number, text);
            if (result) return res.send({
                'status': true,
                'data': result
            });
            return res.send({
                'status': false,
                'message': "Check your whatsapp connection"
            });
        }
        res.send({
            'status': false,
            'message': 'Check your parameter'
        });
    }, 
    sendMedia = async (req, res) => {
        const 
            {   token,
                number,
                type,
                url,
                fileName,
                caption
            } = req.body;
        if (token && number && type && url && caption) {
            let isExist_no = await wa.isExist(token, formatReceipt(number));
            if (!isExist_no) return res.send({
                'status': false,
                'message': 'The destination Number not registered in whatsapp or your sender not connected'
            });
            const result = await wa.sendMedia(token, number, type, url, fileName, caption);
            if (result) return res.send({
                'status': true,
                'data': result
            });
            return res.send({
                'status': false,
                'message': 'Check your connection'
            });
        }
        res.send({
            'status': false,
            'message': "Check your parameter"
        });
    }, 
    sendButtonMessage = async (req, res) => {
        const 
            {   token,
                number,
                button,
                message,
                footer,
                image
            } = req.body,
            button_obj = JSON.parse(button);
        //if (token && number && button && message && footer) {
        if (token && number && button && message) {
            let isExist_no = await wa.isExist(token, formatReceipt(number));
            if (!isExist_no) return res.send({
                'status': false,
                'message': "The destination Number not registered in whatsapp or your sender not connected"
            });
            const result = await wa.sendButtonMessage(token, number, button_obj, message, footer, image);
            if (result) return res.send({
                'status': true,
                'data': result
            });
            return res.send({
                'status': false,
                'message': 'Check your connection'
            });
        }
        res.send({
            'status': false,
            'message': "Check your parameter"
        });
    }, 
    sendTemplateMessage = async (req, res) => {
        const {token, number, button, text, footer, image} = req.body;
        if (token && number && button && text) {
            let isExist_no = await wa.isExist(token, formatReceipt(number));
            if (!isExist_no) return res.send({
                'status': false,
                'message': "The destination Number not registered in whatsapp or your sender not connected"
            });
            const result = await wa.sendTemplateMessage(token, number, JSON.parse(button), text, footer, image);
            if (result) return res.send({
                'status': true,
                'data': result
            });
            return res.send({
                'status': false,
                'message': "Check your connection"
            });
        }
        res.send({
            'status': false,
            'message': "Check your parameter"
        });
    }, 
    sendListMessage = async (req, res) => {
        const 
            {
                token,
                number,
                list,
                text,
                footer,
                title,
                buttonText
            } = req.body;
        if (token && number && list && text && footer && title && buttonText) {
            let isExist_no = await wa.isExist(token, formatReceipt(number));
            if (!isExist_no) return res.send({
                'status': false,
                'message': "The destination Number not registered in whatsapp or your sender not connected"
            });
            const result = await wa.sendListMessage(token, number, JSON.parse(list), text, footer, title, buttonText);
            if (result) return res.send({
                'status': true,
                'data': result
            });
            return res.send({
                'status': false,
                'message': "Check your connection"
            });
        }
        res.send({
            'status': false,
            'message': "Check your parameter"
        });
    }, 
    fetchGroups = async (req, res) => {
        const 
            {
                token
            } = req.body;
        if (token) {
            const result = await wa.fetchGroups(token);
            if (result) return res.send({
                'status': true,
                'data': result
            });
            return res.send({
                'status': false,
                'message': "Check your connection"
            });
        }
        res.send({
            'status': false,
            'message': "Check your parameter"
        });
    }, 
    blast = async (req, res) => {
        const 
            data = req.body.data,
            message = JSON.parse(data),
            _0x133795 = req.body.delay;

        function _0x67ae62(_0x193a4c) {
            return new Promise(_0x92d969 => {
                setTimeout(() => {
                    _0x92d969('');
                }, _0x193a4c);
            });
        }
        const isExist_no = await wa.isExist(message[0].sender, formatReceipt(message[0].sender));
        if (!isExist_no) return res.send({
            'status': false,
            'message': "Check your whatsapp connection"
        });
        return asyncForEach(message, async request_data => {
            const 
                {
                    sender,
                    receiver,
                    message,
                    campaign_id
                } = request_data;
            if (sender && receiver && message) {
                const result = await wa.sendMessage(sender, receiver, message);
                if (result) {
                    const _0x11bc35 = await dbQuery("UPDATE blasts SET status = 'success' WHERE receiver = '" + receiver + '\' AND campaign_id = \'' + campaign_id + '\'');
                } else {
                    const _0x2321b7 = await dbQuery('UPDATE blasts SET status = \'failed\' WHERE receiver = \'' + receiver + "' AND campaign_id = '" + campaign_id + '\'');
                }
            }
            await _0x67ae62(req.body.delay * 1000);
        }), res.send({
            'status': true,
            'message': "blast in progress, you can check the report at history blast page"
        });
    }, deleteCredentials = async (req, res) => {
        const token = req.body;
        if (token) {
            const request = await wa.deleteCredentials(token);
            if (request) return res.send({
                'status': true,
                'data': request
            });
            return res.send({
                'status': false,
                'message': "Check your connection"
            });
        }
        res.send({
            'status': false,
            'message': "Check your parameter"
        });
    };
module.exports = {
    'createInstance': createInstance,
    'sendText': sendText,
    'sendMedia': sendMedia,
    'sendButtonMessage': sendButtonMessage,
    'sendTemplateMessage': sendTemplateMessage,
    'sendListMessage': sendListMessage,
    'deleteCredentials': deleteCredentials,
    'fetchGroups': fetchGroups,
    'blast': blast
};