const {
    db,
    dbQuery
} = require('../../database/index');
require('dotenv').config();

const {
    default: makeWASocket,
    downloadContentFromMessage
} = require('@adiwajshing/baileys'), 
axios = require('axios'),
fs = require('fs');
async function removeForbiddenCharacters(string) {
    let not_allowed = ['/', '?', '&', '=', '\"'];
    for (let raw_data of not_allowed) {
        string = string.split(raw_data).join('');
    }
    return string;
}

async function getRecentMessage(token){
    
    const path = "./credentials/"+token+"/last_data.json";
    var m = JSON.parse(fs.readFileSync(path).toString());
    return m
}

const autoReply = async (req, res) => {
 
    try {
        if (!req.messages) return;
        req = req.messages[0];
        if (req.key.remoteJid === 'status@broadcast') return;
        const type = Object.keys(req.message || {})[0],
            get_res_msg = type === 'conversation' && req.message.conversation ? req.message.conversation : type == 'imageMessage' && req.message.imageMessage.caption ? req.message.imageMessage.caption : type == 'videoMessage' && req.message.videoMessage.caption ? req.message.videoMessage.caption : type == 'extendedTextMessage' && req.message.extendedTextMessage.text ? req.message.extendedTextMessage.text : type == 'messageContextInfo' && req.message.listResponseMessage?. ['title'] ? req.message.listResponseMessage.title : type == 'messageContextInfo' ? req.message.buttonsResponseMessage.selectedDisplayText : '',
            reply_msg = get_res_msg.toLowerCase(),
            filtered_reply_msg = await removeForbiddenCharacters(reply_msg),
            remote_number = req.key.remoteJid.split('@')[0];
        let img_url;
        if (type === 'imageMessage') {
            const _0x4d9312 = await downloadContentFromMessage(req.message.imageMessage, 'image');
            let img_url_from_sender = Buffer.from([]);
            for await (const _0x22bad4 of _0x4d9312) {
                img_url_from_sender = Buffer.concat([img_url_from_sender, _0x22bad4]);
            }
            img_url = img_url_from_sender.toString('base64');
        } else urlImage = null;
        if (req.key.fromMe === true) return; 
        let message;
        const get_reply_msg_db = await dbQuery('SELECT * FROM autoreplies WHERE keyword = \"' + filtered_reply_msg + '" AND device = ' + res.user.id.split(':')[0] + ' LIMIT 1');

        //Welcome Message by Average_coder
        var self_number = res.user.id.split(':')[0];
        var m = await getRecentMessage(self_number)
        const path = "./credentials/"+self_number+"/last_data.json";
        if(m != 0){
            const welcome_data = await dbQuery("SELECT * FROM autoreplies WHERE keyword LIKE '%WELCOM_MSG-^^>>^^%' AND device = " + res.user.id.split(':')[0] + ' LIMIT 1');
            if(welcome_data != ''){
                let hour = welcome_data[0].keyword.split('|')[0]
                if((req.messageTimestamp - m[remote_number]) > hour*60*60){
                    await res.sendMessage(req.key.remoteJid, JSON.parse(welcome_data[0].reply)).catch(err => {
                            console.log(err)
                    });
                }  
            }
            //console.log(req.messageTimestamp - m[remote_number])
            m[remote_number] = req.messageTimestamp
            fs.writeFileSync(path, JSON.stringify(m));
        }
        //---average_coder--

        if (get_reply_msg_db.length == 0) {
			console.log("No Auto Reply")
            const self_number = res.user.id.split(':')[0];
            const get_wh = await dbQuery('SELECT webhook FROM numbers WHERE body = ' + self_number + ' LIMIT 1'),
                webhook_url = get_wh[0].webhook;
            if (webhook_url === null) return;
            const webhook_resp = await sendWebhook({
                'command': reply_msg,
                'bufferImage': img_url,
                'from': remote_number,
                'url': webhook_url
            });
            if (webhook_resp === false) return;
            message = JSON.stringify(webhook_resp);
        } else {
			console.log("Auto Reply") 
			message = process.env.TYPE_SERVER === 'hosting' ? get_reply_msg_db[0].reply : JSON.stringify(get_reply_msg_db[0].reply);
			var p_message = JSON.parse(message);
        	await res.sendMessage(req.key.remoteJid, JSON.parse(p_message)).catch(err => {
				console.log(err)
			});
		}
    } catch (error) {
        console.log(error);
    }
};


async function sendWebhook({
    command,
    bufferImage,
    from,
     url
}) {
    try {
        const message = {
                'message': command,
                'bufferImage': bufferImage,
                'from': from
            },
            type = {
                'Content-Type': 'application/json; charset=utf-8'
            },
            result = await axios.post(url, message, type).catch(() => {
                return false;
            });
        return result.data;
    } catch (error) {
        return console.log(error), false;
    }
}


module.exports = {'autoReply': autoReply};