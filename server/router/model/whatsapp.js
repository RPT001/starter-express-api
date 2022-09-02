'use strict';
const {
    db,
    dbQuery
} = require('../../database/index');
require('dotenv').config();


const {default: makeWASocket,makeWALegacySocket,downloadContentFromMessage} = require('@adiwajshing/baileys'), 

{  useSingleFileAuthState, fetchLatestBaileysVersion, AnyMessageContent, delay, MessageRetryMap, useMultiFileAuthState
} = require('@adiwajshing/baileys'),

{ DisconnectReason } = require('@adiwajshing/baileys'), QRCode = require('qrcode'), lib = require('../../lib'), fs = require('fs');

let sock = [],
    qrcode = [],
    intervalStore = [];
const {setStatus} = require('../../database/index'), {autoReply} = require('./autoreply'), {formatReceipt} = require('../helper'), axios = require('axios'), MAIN_LOGGER = require('../../lib/pino'), logger = MAIN_LOGGER.child({}), useStore = !process.argv.includes('--no-store'), msgRetryCounterMap = () => MessageRetryMap = {}, 

connectToWhatsApp = async (sender, response = null) => {
   
    if (typeof qrcode[sender] !== 'undefined') return response !== null && response.emit('qrcode', {
        'token': sender,
        'data': qrcode[sender],
        'message': 'Qrcode updated, please scan with your Whatsapp Device'
    }), {
        'status': false,
        'sock': sock[sender],
        'qrcode': qrcode[sender],
        'message': 'Please scan qrcode'
    };
    try {
        let number = sock[sender].user.id.split(':');
        number = number[0] + '@s.whatsapp.net';
        const profile_url = await getPpUrl(sender, number);
        return response !== null && response.emit('connection-open', {
            'token': sender,
            'user': sock[sender].user,
            'ppUrl': profile_url
        }), {
            'status': true,
            'message': 'Already connected'
        };
    } catch (error) {
        response !== null && response.emit('message', {
            'token': sender,
            'message': 'Try to connecting ' + sender
        }), console.log('Try to connecting ' + sender);
    }
    const {
        state,
        saveCreds
    } = await useMultiFileAuthState('./credentials/' + sender), browser = await getChromeLates();
    console.log('using Chrome v' + browser?. ['data']?. ['versions'][0x0]?. ['version'] + ', isLatest: ' + (browser?. ['data']?. ['versions'].length > 0x0 ? !![] : false));
    const {
        version,
        isLatest
    } = await fetchLatestBaileysVersion();
    return console.log('using WA v' + version.join('.') + ', isLatest: ' + isLatest), 

    sock[sender] = makeWASocket({ 
        'version': version,
        'browser': ['bizWapi', 'Chrome', browser?. ['data']?. ['versions'][0x0]?. ['version']],
        'logger': logger,
        'printQRInTerminal': false,
        'auth': state,
    }),

     sock[sender].ev.on('messages.upsert', message => {
        let number = sock[sender].user.id.split(':')[0];
        var remote_id = message.messages[0].key.remoteJid.split('@')[0]
        var path = "./credentials/"+number+"/last_data.json";
        if (!fs.existsSync(path)) {
            let m = '{'+'"'+ remote_id +'"'+':'+ message.messages[0].messageTimestamp +"}"
            fs.writeFileSync(path, m, {flag: "a"});
            console.log('File Created')
        }
        // else{
        //     var m = JSON.parse(fs.readFileSync(path).toString());
        //     m[remote_id] = message.messages[0].messageTimestamp
        //     fs.writeFileSync(path, JSON.stringify(m));
        // }
        autoReply(message, sock[sender]);
        }),
  
     sock[sender].ev.on('connection.update', async update => {
        const 
            {   connection,
                 qr,
                lastDisconnect
            } = update;
        if (connection === 'close') {
            if (lastDisconnect.error?. ['output']?. ['statusCode'] !== DisconnectReason.loggedOut) {
                if (lastDisconnect.error?. ['output']?. ['payload']?. ['message'] === 'Stream Errored (restart required)') {
                    delete qrcode[sender], connectToWhatsApp(sender, response);
                    if (response != null) response.emit('message', {
                        'token': sender,
                        'message': 'Reconnecting'
                    });
                } else {
                    if (lastDisconnect.error?. ['output']?. ['payload']?. ['message'] === 'QR refs attempts ended') {
                        delete qrcode[sender];
                        if (response != null) response.emit('message', {
                            'token': sender,
                            'message': lastDisconnect.error.output.payload.message,
                            'error': lastDisconnect.error.output.payload.error
                        });
                    }
                }
            } else lastDisconnect.error?. ['output']?. ['statusCode'] === 0x191 && (setStatus(sender, 'Disconnect'), console.log('Connection closed. You are logged out.'), response !== null && response.emit('message', {
                'token': sender,
                'message': 'Connection closed. You are logged out.'
            }), clearConnection(sender));
        }
        qr && QRCode.toDataURL(qr, function (_0x182750, _0x38dc31) {
            
            _0x182750 && console.log(_0x182750), qrcode[sender] = _0x38dc31, response !== null && response.emit('qrcode', {
                'token': sender,
                'data': _0x38dc31,
                'message': 'Qrcode updated, please scan with your Whatsapp Device'
            });
        });
        if (connection === 'open') {
            setStatus(sender, 'Connected');
            let number = sock[sender].user.id.split(':');
            number = number[0] + '@s.whatsapp.net';
            const dp_url = await getPpUrl(sender, number);
            response !== null && response.emit('connection-open', {
                'token': sender,
                'user': sock[sender].user,
                'ppUrl': dp_url
            }), delete qrcode[sender];
        }
    }), sock[sender].ev.on('creds.update', saveCreds), {
        'sock': sock[sender],
        'qrcode': qrcode[sender]
    };
    
};

//Auto Connect after restart
async function crash_start(){
    var active_numbers = [];
    active_numbers = await dbQuery('SELECT * FROM numbers where status = 1')
    active_numbers.forEach(myFunction);
    function myFunction(number) {
        connectToWhatsApp(number.body)
    }
}
crash_start()

async function connectWaBeforeSend(token) {
   
    let name = undefined,
        message;
    message = await connectToWhatsApp(token), await message.sock.ev.on('connection.update', update => {
        const {
            connection,
            qr
        } = update;
        connection === 'open' && (name = true), qr && (name = false);
    });
    let count = 0;
    while (typeof name === 'undefined') {
        count++;
        if (count > 4) break;
        await new Promise(_0x2a4b16 => setTimeout(_0x2a4b16, 0x3e8));
    }
    return name;
}
const sendText = async (token, receiver, message) => {
    
    try {
        const result = await sock[token].sendMessage(formatReceipt(receiver), {
            'text': message
        });
        return result;
    } catch (error) {
        return console.log(error), false;
    }
}, 
sendMessage = async (token, receiver, msg) => {
    try {
        const _0x523010 = JSON.parse(msg);
        let can_send = false;
        receiver.length > 0xe ? (receiver = receiver + '@g.us', can_send = true) : can_send = await isExist(token, formatReceipt(receiver));
        if (can_send) {
            const result = await sock[token].sendMessage(formatReceipt(receiver), JSON.parse(msg));
            return result;
        }
        return false;
    } catch (error) {
        return console.log(error), false;
    }
};


async function sendMedia(token, receiver, type, media_url, media_path, caption) {

    const clean_receiver = formatReceipt(receiver);
    try {
        if (type == 'image') var msg = await sock[token].sendMessage(clean_receiver, {
            'image': media_url ? {
                'url': media_url
            } : fs.readFileSync('src/public/temp/' + media_path),
            'caption': caption ? caption : null
        });
        else {
            if (type == 'video') var msg = await sock[token].sendMessage(clean_receiver, {
                'video': media_url ? {
                    'url': media_url
                } : fs.readFileSync('src/public/temp/' + media_path),
                'caption': caption ? caption : null
            });
            else {
                if (type == 'audio') var msg = await sock[token].sendMessage(clean_receiver, {
                    'audio': media_url ? {
                        'url': media_url
                    } : fs.readFileSync('src/public/temp/' + media_path),
                    'caption': caption ? caption : null
                });
                else {
                    if (type == 'pdf') var msg = await sock[token].sendMessage(clean_receiver, {
                        'document': {
                            'url': media_url
                        },
                        'mimetype': 'application/pdf'
                    }, {
                        'url': media_url
                    });
                    else {
                        if (type == 'xls') var msg = await sock[token].sendMessage(clean_receiver, {
                            'document': {
                                'url': media_url
                            },
                            'mimetype': 'application/excel'
                        }, {
                            'url': media_url
                        });
                        else {
                            if (type == 'xls') var msg = await sock[token].sendMessage(clean_receiver, {
                                'document': {
                                    'url': media_url
                                },
                                'mimetype': 'application/excel'
                            }, {
                                'url': media_url
                            });
                            else {
                                if (type == 'xlsx') var msg = await sock[token].sendMessage(clean_receiver, {
                                    'document': {
                                        'url': media_url
                                    },
                                    'mimetype': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                                }, {
                                    'url': media_url
                                });
                                else {
                                    if (type == 'doc') var msg = await sock[token].sendMessage(clean_receiver, {
                                        'document': {
                                            'url': media_url
                                        },
                                        'mimetype': 'application/msword'
                                    }, {
                                        'url': media_url
                                    });
                                    else {
                                        if (type == 'docx') var msg = await sock[token].sendMessage(clean_receiver, {
                                            'document': {
                                                'url': media_url
                                            },
                                            'mimetype': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                        }, {
                                            'url': media_url
                                        });
                                        else {
                                            if (type == 'zip') var msg = await sock[token].sendMessage(clean_receiver, {
                                                'document': {
                                                    'url': media_url
                                                },
                                                'mimetype': 'application/zip'
                                            }, {
                                                'url': media_url
                                            });
                                            else {
                                                if (type == 'mp3') var msg = await sock[token].sendMessage(clean_receiver, {
                                                    'document': {
                                                        'url': media_url
                                                    },
                                                    'mimetype': 'application/mp3'
                                                }, {
                                                    'url': media_url
                                                });
                                                else return console.log('Please add your won role of mimetype'), false;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return msg;
    } catch (error) {
        return console.log(error), false;
    }
}


async function sendButtonMessage(token, receiver, button, caption, footer, image_url) {
  
    let url = 'url';
    try {
        const button_obj = button.map((caption_text, button_id) => {
            return {
                'buttonId': button_id,
                'buttonText': {
                    'displayText': caption_text.displayText
                },
                'type': 1
            };
        });
        if (image_url) var msg = {
            'image': url == 'url' ? {
                'url': image_url
            } : fs.readFileSync('src/public/temp/' + image_url),
            'caption': caption,
            'footer': footer,
            'buttons': button_obj,
            'headerType': 4
        };
        else var msg = {
            'text': caption,
            'footer': footer,
            'buttons': button_obj,
            'headerType': 1
        };
        const result = await sock[token].sendMessage(formatReceipt(receiver), msg);
        return result;
    } catch (error) {
        return console.log(error), false;
    }
}
async function sendTemplateMessage(token, receiver, template_button, caption, footer, image_url) { 
    let url = 'url';
    try {
        if (image_url) var msg = {
            'caption': caption,
            'footer': footer,
            'templateButtons': template_button,
            'image': url == 'url' ? {
                'url': image_url
            } : fs.readFileSync('src/public/temp/' + image_url)
        };
        else var msg = {
            'text': caption,
            'footer': footer,
            'templateButtons': template_button,
        };
        const result = await sock[token].sendMessage(formatReceipt(receiver), msg);
        return result;
    } catch (error) {
        return console.log(error), false;
    }
}
async function sendListMessage(token, receiver, list, text, footer, title, _button_text) {
   
    try {
        const _0x1e141c = {
                'text': text,
                'footer': footer,
                'title': title,
                'buttonText': _button_text,
                'sections': [list]
            },
            result = await sock[token].sendMessage(formatReceipt(receiver), _0x1e141c);
        return result;
    } catch (error) {
        return console.log(error), false;
    }
}
async function fetchGroups(token) {

    try {
        let phone_book = await sock[token].groupFetchAllParticipating(),
            contacts = Object.entries(phone_book).slice(0).map(entries => entries[0x1]);
        return contacts;
    } catch (error) {
        return false;
    }
}
async function isExist(token, number) {
    if (typeof sock[token] === 'undefined') {
        const isExist_no = await connectWaBeforeSend(token);
        if (!isExist_no) return false;
    }
    try {
        if (number.includes('@g.us')) return true;
        else {
            const [result] = await sock[token].onWhatsApp(number);
            return result;
        }
    } catch (err) {
        return false;
    }
}
async function getPpUrl(token, number, result) {
    
    let dp_pic;
    try {
        return result ? dp_pic = await sock[token].profilePictureUrl(number, 'image') : dp_pic = await sock[token].profilePictureUrl(number), dp_pic;
    } catch (_0x4426c9) {
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png';
    }
}
async function deleteCredentials(token, msg = null) {
    
    msg !== null && msg.emit('message', {
        'token': token,
        'message': 'Logout Progres..'
    });
    try {
        if (typeof sock[token] === 'undefined') {
            const _0x11f88b = await connectWaBeforeSend(token);
            _0x11f88b && (sock[token].logout(), delete sock[token]);
        } else sock[token].logout(), delete sock[token];
        return delete qrcode[token], clearInterval(intervalStore[token]), setStatus(token, 'Disconnect'), msg != null && (msg.emit('Unauthorized', token), msg.emit('message', {
            'token': token,
            'message': 'Connection closed. You are logged out.'
        })), fs.existsSync('./credentials/' + token) && fs.rmSync('./credentials/' + token, {
            'recursive': true,
            'force': true
        }, result => {
            if (result) console.log(result);
        }), {
            'status': true,
            'message': 'Deleting session and credential'
        };
    } catch (error) {
        return console.log(error), {
            'status': true,
            'message': 'Nothing deleted'
        };
    }
}
async function getChromeLates() {
    var    result = await axios.get('https://versionhistory.googleapis.com/v1/chrome/platforms/linux/channels/stable/versions');
    return result;
}

function clearConnection(token) {
    clearInterval(intervalStore[token]), delete sock[token], delete qrcode[token], setStatus(token, 'Disconnect'), fs.existsSync('./credentials/' + token) && (fs.rmSync('./credentials/' + token, {
        'recursive': true,
        'force': true
    }, result => {
        if (result) console.log(result);
    }), console.log('credentials/' + token + ' is deleted'));
}

async function initialize(req, res) {
    const 
        {
         token
        } = req.body;
    if (token) {
        const fs = require('fs'),
            path = './credentials/' + token;
        if (fs.existsSync(path)) {
            if (typeof sock[token] === 'undefined') {
                const _0x2b524c = await connectWaBeforeSend(token);
                return _0x2b524c ? res.send({
                    'status': true,
                    'message': token + ' connection was established'
                }) : res.send({
                    'status': false,
                    'message': token + ' Connection failed, please scan first'
                });
            }
            return res.send({
                'status': true,
                'message': token + ' connection was established'
            });
        }
        return res.send({
            'status': false,
            'message': token + ' Connection failed, please scan first'
        });
    }
    return res.send({
        'status': false,
        'message': 'Wrong Parameterss'
    });
}
module.exports = {
    'connectToWhatsApp': connectToWhatsApp,
    'sendText': sendText,
    'sendMedia': sendMedia,
    'sendButtonMessage': sendButtonMessage,
    'sendTemplateMessage': sendTemplateMessage,
    'sendListMessage': sendListMessage,
    'isExist': isExist,
    'getPpUrl': getPpUrl,
    'fetchGroups': fetchGroups,
    'deleteCredentials': deleteCredentials,
    'sendMessage': sendMessage,
    'initialize': initialize,
    'connectWaBeforeSend': connectWaBeforeSend
};