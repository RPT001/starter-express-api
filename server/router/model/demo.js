'use strict';
const _0x1fc5f1 = _0xccf1;
(function(_0x55c88f, _0x3e3080) {
	const _0x164ffd = _0xccf1,
		_0x360d09 = _0x55c88f();
	while (!![]) {
		try {
			const _0x487366 = -parseInt("1NLJIuG") / 0x1 * (parseInt("1579516ziLjau") / 0x2) + -parseInt("6yfiuwQ") / 0x3 * (-parseInt("2154228RWpbIH") / 0x4) + parseInt("1279065mlvrUi") / 0x5 * (parseInt("6YhnvVo") / 0x6) + -parseInt("3983910YeBeWs") / 0x7 + parseInt("168vGoGSi") / 0x8 * (parseInt("42318cjifIe") / 0x9) + parseInt("375360opTOAP") / 0xa * (-parseInt("121VABIEP") / 0xb) + -parseInt("12ogZWow") / 0xc * (-parseInt("13935896DHCkgY") / 0xd);
			if (_0x487366 === _0x3e3080) break;
			else _0x360d09['push'](_0x360d09['shift']());
		} catch (_0x536227) {
			_0x360d09['push'](_0x360d09['shift']());
		}
	}
}(_0x4fa1, 0xb2ae5));
const {
	default: makeWASocket,
	makeWALegacySocket,
	downloadContentFromMessage
} = require("@adiwajshing/baileys"), {
	useSingleFileAuthState,
	makeInMemoryStore,
	fetchLatestBaileysVersion,
	AnyMessageContent,
	delay,
	MessageRetryMap,
	useMultiFileAuthState
} = require("@adiwajshing/baileys"), {
	DisconnectReason
} = require("@adiwajshing/baileys"), QRCode = require('qrcode'), lib = require("../../lib"), fs = require('fs');
let sock = [],
	qrcode = [],
	intervalStore = [];
const {
	setStatus
} = require("../../database/index"), {
	autoReply
} = require("./autoreply"), {
	formatReceipt
} = require("../helper"), axios = require("axios"), MAIN_LOGGER = require("../../lib/pino"), logger = MAIN_LOGGER["child"]({}), useStore = !process["argv"]['includes']('--no-store'), msgRetryCounterMap = () => MessageRetryMap = {}, connectToWhatsApp = async (_0x36542a, _0x4fe36c = null) => {
	const _0x31dd01 = _0x1fc5f1;
	if (typeof qrcode[_0x36542a] !== "undefined") return _0x4fe36c !== null && _0x4fe36c['emit']("qrcode", {
		'token': _0x36542a,
		'data': qrcode[_0x36542a],
		'message': "Qrcode updated, please scann with your Whatsapp Device"
	}), {
		'status': ![],
		'sock': sock[_0x36542a],
		'qrcode': qrcode[_0x36542a],
		'message': "Please scann qrcode"
	};
	try {
		let _0x2be7da = sock[_0x36542a]["user"]['id']['split'](':');
		_0x2be7da = _0x2be7da[0x0] + "@s.whatsapp.net";
		const _0x2d3023 = await getPpUrl(_0x36542a, _0x2be7da);
		return _0x4fe36c !== null && _0x4fe36c["emit"]("connection-open", {
			'token': _0x36542a,
			'user': sock[_0x36542a]['user'],
			'ppUrl': _0x2d3023
		}), {
			'status': !![],
			'message': 'Already\x20connected'
		};
	} catch (_0x1d9b12) {
		_0x4fe36c !== null && _0x4fe36c['emit']("message", {
			'token': _0x36542a,
			'message': 'Try\x20to\x20connecting\x20' + _0x36542a
		}), console['log']('Try\x20to\x20connecting\x20' + _0x36542a);
	}
	const {
		state: _0x14d8fe,
		saveCreds: _0xdf6961
	} = await useMultiFileAuthState('./credentials/' + _0x36542a), _0x4405e6 = await getChromeLates();
	console['log']("using Chrome v" + _0x4405e6?.["data"]?.['versions'][0x0]?.["version"] + ", isLatest: " + (_0x4405e6?.["data"]?.["versions"]["length"] > 0x0 ? !![] : ![]));
	const {
		version: _0x45992e,
		isLatest: _0x4604e8
	} = await fetchLatestBaileysVersion();
	return console["log"]("using WA v" + _0x45992e["join"]('.') + ", isLatest: " + _0x4604e8), sock[_0x36542a] = makeWASocket({
		'version': _0x45992e,
		'browser': ['M\x20Pedia', "Chrome", _0x4405e6?.["data"]?.["versions"][0x0]?.["version"]],
		'logger': logger,
		'printQRInTerminal': !![],
		'auth': _0x14d8fe
	}), sock[_0x36542a]['ev']['on']('messages.upsert', _0x1a3be0 => {
		autoReply(_0x1a3be0, sock[_0x36542a]);
	}), sock[_0x36542a]['ev']['on']('connection.update', async _0x527dc9 => {
		const _0x1c9822 = _0x31dd01,
			{
				connection: _0x4811cc,
				qr: _0x7164cf,
				lastDisconnect: _0x158f27
			} = _0x527dc9;
		if (_0x4811cc === "close") {
			if (_0x158f27['error']?.["output"]?.["statusCode"] !== DisconnectReason["loggedOut"]) {
				if (_0x158f27["error"]?.["output"]?.["payload"]?.['message'] === 'Stream\x20Errored\x20(restart\x20required)') {
					delete qrcode[_0x36542a], connectToWhatsApp(_0x36542a, _0x4fe36c);
					if (_0x4fe36c != null) _0x4fe36c["emit"]("message", {
						'token': _0x36542a,
						'message': "Reconnecting"
					});
				} else {
					if (_0x158f27["error"]?.['output']?.["payload"]?.["message"] === "QR refs attempts ended") {
						delete qrcode[_0x36542a];
						if (_0x4fe36c != null) _0x4fe36c["emit"]("message", {
							'token': _0x36542a,
							'message': _0x158f27["error"]["output"]["payload"]["message"],
							'error': _0x158f27["error"]['output']["payload"]['error']
						});
					}
				}
			} else _0x158f27["error"]?.["output"]?.["statusCode"] === 0x191 && (setStatus(_0x36542a, 'Disconnect'), console["log"]("Connection closed. You are logged out."), _0x4fe36c !== null && _0x4fe36c["emit"]('message', {
				'token': _0x36542a,
				'message': "Connection closed. You are logged out."
			}), clearConnection(_0x36542a));
		}
		_0x7164cf && QRCode['toDataURL'](_0x7164cf, function(_0x5b031e, _0x4f2b70) {
			const _0xb0e13b = _0x1c9822;
			_0x5b031e && console["log"](_0x5b031e), qrcode[_0x36542a] = _0x4f2b70, _0x4fe36c !== null && _0x4fe36c["emit"]("qrcode", {
				'token': _0x36542a,
				'data': _0x4f2b70,
				'message': "Qrcode updated, please scann with your Whatsapp Device"
			});
		});
		if (_0x4811cc === "open") {
			setStatus(_0x36542a, 'Connected');
			let _0x45598d = sock[_0x36542a]["user"]['id']["split"](':');
			_0x45598d = _0x45598d[0x0] + "@s.whatsapp.net";
			const _0x595ce4 = await getPpUrl(_0x36542a, _0x45598d);
			_0x4fe36c !== null && _0x4fe36c["emit"]("connection-open", {
				'token': _0x36542a,
				'user': sock[_0x36542a]['user'],
				'ppUrl': _0x595ce4
			}), delete qrcode[_0x36542a];
		}
	}), sock[_0x36542a]['ev']['on']("creds.update", _0xdf6961), {
		'sock': sock[_0x36542a],
		'qrcode': qrcode[_0x36542a]
	};
};
async function connectWaBeforeSend(_0x3aa644) {
	const _0xf47d06 = _0x1fc5f1;
	let _0x5e252a = undefined,
		_0x11d43c;
	_0x11d43c = await connectToWhatsApp(_0x3aa644), await _0x11d43c["sock"]['ev']['on']("connection.update", _0x438f9e => {
		const {
			connection: _0x1b890a,
			qr: _0x30416c
		} = _0x438f9e;
		_0x1b890a === 'open' && (_0x5e252a = !![]), _0x30416c && (_0x5e252a = ![]);
	});
	let _0x27d7c0 = 0x0;
	while (typeof _0x5e252a === "undefined") {
		_0x27d7c0++;
		if (_0x27d7c0 > 0x4) break;
		await new Promise(_0x2b1637 => setTimeout(_0x2b1637, 0x3e8));
	}
	return _0x5e252a;
}
const sendText = async (_0x5800c8, _0x37eb22, _0x317fa1) => {
	const _0x4371f2 = _0x1fc5f1;
	try {
		const _0x1e237c = await sock[_0x5800c8]["sendMessage"](formatReceipt(_0x37eb22), {
			'text': _0x317fa1
		});
		return _0x1e237c;
	} catch (_0x58cb9c) {
		return console["log"](_0x58cb9c), ![];
	}
}, sendMessage = async (_0xf61396, _0x1b8dd7, _0xf723a6) => {
	const _0x2a0d54 = _0x1fc5f1;
	try {
		const _0x26dca2 = JSON['parse'](_0xf723a6);
		let _0x515dba = ![];
		_0x1b8dd7['length'] > 0xe ? (_0x1b8dd7 = _0x1b8dd7 + "@g.us", _0x515dba = !![]) : (_0x515dba = await isExist(_0xf61396, formatReceipt(_0x1b8dd7)), console["log"](formatReceipt(_0x1b8dd7)));
		if (_0x515dba) {
			const _0x5d0696 = await sock[_0xf61396]["sendMessage"](formatReceipt(_0x1b8dd7), JSON["parse"](_0xf723a6));
			return _0x5d0696;
		} else return ![];
	} catch (_0x2dac8a) {
		return console["log"](_0x2dac8a), ![];
	}
};

function _0x4fa1() {
	const _0xce7035 = ['image', 'QR\x20refs\x20attempts\x20ended', ',\x20isLatest:\x20', 'doc', '@adiwajshing/baileys', '3983910YeBeWs', '@g.us', 'audio', 'axios', '1579516ziLjau', 'status', 'Connection\x20closed.\x20You\x20are\x20logged\x20out.', 'logout', 'exports', 'statusCode', '1279065mlvrUi', 'application/zip', 'close', 'url', 'entries', 'using\x20WA\x20v', '121VABIEP', 'existsSync', 'using\x20Chrome\x20v', 'message', 'src/public/temp/', 'credentials/', '../helper', '2154228RWpbIH', 'video', 'slice', '1NLJIuG', 'connection-open', 'split', '168vGoGSi', 'application/mp3', 'connection.update', '../../lib/pino', 'version', '@s.whatsapp.net', 'https://versionhistory.googleapis.com/v1/chrome/platforms/linux/channels/stable/versions', 'join', 'Wrong\x20Parameterss', '13935896DHCkgY', '12ogZWow', 'Please\x20add\x20your\x20won\x20role\x20of\x20mimetype', 'json', 'argv', 'creds.update', 'Unauthorized', 'undefined', 'application/excel', 'send', 'log', 'mp3', '375360opTOAP', 'loggedOut', '42318cjifIe', '6yfiuwQ', 'length', 'user', './credentials/', '../../lib', 'child', 'pdf', '../../database/index', 'xlsx', 'application/msword', 'groupFetchAllParticipating', 'Chrome', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'sendMessage', 'xls', './autoreply', 'Disconnect', 'profilePictureUrl', 'readFileSync', 'get', 'sock', 'Qrcode\x20updated,\x20please\x20scann\x20with\x20your\x20Whatsapp\x20Device', 'output', 'parse', 'data', '\x20Connection\x20failed,please\x20scan\x20first', 'Nothing\x20deleted', 'versions', 'payload', 'open', 'displayText', 'emit', 'error', 'Please\x20scann\x20qrcode', 'qrcode', 'Reconnecting', '6YhnvVo', 'map', 'docx', 'Connection\x20failed'];
	_0x4fa1 = function() {
		return _0xce7035;
	};
	return _0x4fa1();
}

async function sendMedia(_0x36bc34, _0x2862ab, _0x540afd, _0xe54ced, _0x13e0ba, _0x8dce8a) {
	const _0x56a10f = _0x1fc5f1,
		_0x3f1855 = formatReceipt(_0x2862ab);
	try {
		if (_0x540afd == "image") var _0x4d7479 = await sock[_0x36bc34]["sendMessage"](_0x3f1855, {
			'image': _0xe54ced ? {
				'url': _0xe54ced
			} : fs["readFileSync"]("src/public/temp/" + _0x13e0ba),
			'caption': _0x8dce8a ? _0x8dce8a : null
		});
		else {
			if (_0x540afd == "video") var _0x4d7479 = await sock[_0x36bc34]['sendMessage'](_0x3f1855, {
				'video': _0xe54ced ? {
					'url': _0xe54ced
				} : fs["readFileSync"]("src/public/temp/" + _0x13e0ba),
				'caption': _0x8dce8a ? _0x8dce8a : null
			});
			else {
				if (_0x540afd == "audio") var _0x4d7479 = await sock[_0x36bc34]["sendMessage"](_0x3f1855, {
					'audio': _0xe54ced ? {
						'url': _0xe54ced
					} : fs["readFileSync"]('src/public/temp/' + _0x13e0ba),
					'caption': _0x8dce8a ? _0x8dce8a : null
				});
				else {
					if (_0x540afd == "pdf") var _0x4d7479 = await sock[_0x36bc34]["sendMessage"](_0x3f1855, {
						'document': {
							'url': _0xe54ced
						},
						'mimetype': 'application/pdf'
					}, {
						'url': _0xe54ced
					});
					else {
						if (_0x540afd == "xls") var _0x4d7479 = await sock[_0x36bc34]['sendMessage'](_0x3f1855, {
							'document': {
								'url': _0xe54ced
							},
							'mimetype': "application/excel"
						}, {
							'url': _0xe54ced
						});
						else {
							if (_0x540afd == 'xls') var _0x4d7479 = await sock[_0x36bc34]["sendMessage"](_0x3f1855, {
								'document': {
									'url': _0xe54ced
								},
								'mimetype': "application/excel"
							}, {
								'url': _0xe54ced
							});
							else {
								if (_0x540afd == "xlsx") var _0x4d7479 = await sock[_0x36bc34]["sendMessage"](_0x3f1855, {
									'document': {
										'url': _0xe54ced
									},
									'mimetype': "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
								}, {
									'url': _0xe54ced
								});
								else {
									if (_0x540afd == "doc") var _0x4d7479 = await sock[_0x36bc34]['sendMessage'](_0x3f1855, {
										'document': {
											'url': _0xe54ced
										},
										'mimetype': "application/msword"
									}, {
										'url': _0xe54ced
									});
									else {
										if (_0x540afd == "docx") var _0x4d7479 = await sock[_0x36bc34]['sendMessage'](_0x3f1855, {
											'document': {
												'url': _0xe54ced
											},
											'mimetype': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
										}, {
											'url': _0xe54ced
										});
										else {
											if (_0x540afd == 'zip') var _0x4d7479 = await sock[_0x36bc34]["sendMessage"](_0x3f1855, {
												'document': {
													'url': _0xe54ced
												},
												'mimetype': "application/zip"
											}, {
												'url': _0xe54ced
											});
											else {
												if (_0x540afd == "mp3") var _0x4d7479 = await sock[_0x36bc34]["sendMessage"](_0x3f1855, {
													'document': {
														'url': _0xe54ced
													},
													'mimetype': "application/mp3"
												}, {
													'url': _0xe54ced
												});
												else return console["log"]("Please add your won role of mimetype"), ![];
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
		return _0x4d7479;
	} catch (_0x13d6de) {
		return console['log'](_0x13d6de), ![];
	}
}

function _0xccf1(_0x2a8bb4, _0xe7e91e) {
	const _0x4fa1a0 = _0x4fa1();
	return _0xccf1 = function(_0xccf1fe, _0x3b63f3) {
		_0xccf1fe = _0xccf1fe - 0x115;
		let _0x3635e5 = _0x4fa1a0[_0xccf1fe];
		return _0x3635e5;
	}, _0xccf1(_0x2a8bb4, _0xe7e91e);
}

async function sendButtonMessage(_0x492c98, _0x58c374, _0xd4e6cd, _0x1ec98a, _0xab6aed, _0x3445cf) {
	const _0x14e93a = _0x1fc5f1;
	let _0x432557 = "url";
	try {
		const _0x3d7760 = _0xd4e6cd["map"]((_0x25013a, _0x55b06d) => {
			const _0x26f241 = _0x14e93a;
			return console["log"](_0x25013a), {
				'buttonId': _0x55b06d,
				'buttonText': {
					'displayText': _0x25013a["displayText"]
				},
				'type': 0x1
			};
		});
		if (_0x3445cf) var _0x143b2a = {
			'image': _0x432557 == "url" ? {
				'url': _0x3445cf
			} : fs["readFileSync"]('src/public/temp/' + _0x3445cf),
			'caption': _0x1ec98a,
			'footer': _0xab6aed,
			'buttons': _0x3d7760,
			'headerType': 0x4
		};
		else var _0x143b2a = {
			'text': _0x1ec98a,
			'footer': _0xab6aed,
			'buttons': _0x3d7760,
			'headerType': 0x1
		};
		const _0x5b85b7 = await sock[_0x492c98]['sendMessage'](formatReceipt(_0x58c374), _0x143b2a);
		return _0x5b85b7;
	} catch (_0x42ebb0) {
		return console["log"](_0x42ebb0), ![];
	}
}
async function sendTemplateMessage(_0x239a79, _0xb06672, _0x3d94ae, _0x45275d, _0x501fa0, _0x255da2) {
	const _0x50faf8 = _0x1fc5f1;
	try {
		console["log"](_0x3d94ae);
		if (_0x255da2) var _0x5d4bb4 = {
			'caption': _0x45275d,
			'footer': _0x501fa0,
			'templateButtons': _0x3d94ae,
			'image': {
				'url': _0x255da2
			}
		};
		else var _0x5d4bb4 = {
			'text': _0x45275d,
			'footer': _0x501fa0,
			'templateButtons': _0x3d94ae
		};
		const _0x388e66 = await sock[_0x239a79]['sendMessage'](formatReceipt(_0xb06672), _0x5d4bb4);
		return _0x388e66;
	} catch (_0x37c6c2) {
		return console['log'](_0x37c6c2), ![];
	}
}
async function sendListMessage(_0xb529e6, _0x2083e0, _0x439c58, _0x528501, _0x1c4379, _0x536fb6, _0xfbf559) {
	const _0x59c6c3 = _0x1fc5f1;
	try {
		const _0x53579e = {
				'text': _0x528501,
				'footer': _0x1c4379,
				'title': _0x536fb6,
				'buttonText': _0xfbf559,
				'sections': [_0x439c58]
			},
			_0xc047e4 = await sock[_0xb529e6]["sendMessage"](formatReceipt(_0x2083e0), _0x53579e);
		return _0xc047e4;
	} catch (_0x3b446f) {
		return console["log"](_0x3b446f), ![];
	}
}
async function fetchGroups(_0x326321) {
	const _0x41ae16 = _0x1fc5f1;
	try {
		let _0x272090 = await sock[_0x326321]["groupFetchAllParticipating"](),
			_0x1ea200 = Object["entries"](_0x272090)["slice"](0x0)["map"](_0x5a7aee => _0x5a7aee[0x1]);
		return _0x1ea200;
	} catch (_0x2deee4) {
		return ![];
	}
}
async function isExist(_0x202539, _0x108740) {
	const _0x1b004a = _0x1fc5f1;
	if (typeof sock[_0x202539] === 'undefined') {
		const _0x397d1e = await connectWaBeforeSend(_0x202539);
		if (!_0x397d1e) return ![];
	}
	try {
		if (_0x108740['includes']("@g.us")) return !![];
		else {
			const [_0x3fe5ea] = await sock[_0x202539]['onWhatsApp'](_0x108740);
			return console["log"](_0x3fe5ea?.['exists'] || ![]), _0x3fe5ea;
		}
	} catch (_0x41a510) {
		return ![];
	}
}
async function getPpUrl(_0x44deae, _0x3c352e, _0x420471) {
	const _0x36de70 = _0x1fc5f1;
	let _0x37fd06;
	try {
		return _0x420471 ? _0x37fd06 = await sock[_0x44deae]["profilePictureUrl"](_0x3c352e, "image") : _0x37fd06 = await sock[_0x44deae]["profilePictureUrl"](_0x3c352e), _0x37fd06;
	} catch (_0x3e93ca) {
		return 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png';
	}
}
async function deleteCredentials(_0xef17cd, _0x1efac1 = null) {
	const _0xf83b55 = _0x1fc5f1;
	_0x1efac1 !== null && _0x1efac1["emit"]("message", {
		'token': _0xef17cd,
		'message': 'Logout\x20Progres..'
	});
	try {
		if (typeof sock[_0xef17cd] === "undefined") {
			const _0xfaf315 = await connectWaBeforeSend(_0xef17cd);
			_0xfaf315 && (sock[_0xef17cd]["logout"](), delete sock[_0xef17cd]);
		} else sock[_0xef17cd]["logout"](), delete sock[_0xef17cd];
		return delete qrcode[_0xef17cd], clearInterval(intervalStore[_0xef17cd]), setStatus(_0xef17cd, "Disconnect"), _0x1efac1 != null && (_0x1efac1["emit"]("Unauthorized", _0xef17cd), _0x1efac1["emit"]("message", {
			'token': _0xef17cd,
			'message': "Connection closed. You are logged out."
		})), fs["existsSync"]('./credentials/' + _0xef17cd) && fs['rmSync']('./credentials/' + _0xef17cd, {
			'recursive': !![],
			'force': !![]
		}, _0x16c927 => {
			if (_0x16c927) console['log'](_0x16c927);
		}), {
			'status': !![],
			'message': 'Deleting\x20session\x20and\x20credential'
		};
	} catch (_0x4f7e2d) {
		return console['log'](_0x4f7e2d), {
			'status': !![],
			'message': "Nothing deleted"
		};
	}
}
async function getChromeLates() {
	const _0x2fa971 = _0x1fc5f1,
		_0xe8617 = await axios["get"]("https://versionhistory.googleapis.com/v1/chrome/platforms/linux/channels/stable/versions");
	return _0xe8617;
}

function clearConnection(_0x363f56) {
	const _0xf8f0b4 = _0x1fc5f1;
	clearInterval(intervalStore[_0x363f56]), delete sock[_0x363f56], delete qrcode[_0x363f56], setStatus(_0x363f56, "Disconnect"), fs['existsSync']("./credentials/" + _0x363f56) && (fs['rmSync']("./credentials/" + _0x363f56, {
		'recursive': !![],
		'force': !![]
	}, _0x474ed5 => {
		if (_0x474ed5) console['log'](_0x474ed5);
	}), console['log']("credentials/" + _0x363f56 + '\x20is\x20deleted'));
}
async function initialize(_0x2bf722, _0x376ae4) {
	const _0x4f0f1b = _0x1fc5f1,
		{
			token: _0x400bdd
		} = _0x2bf722['body'];
	if (_0x400bdd) {
		const _0xa4fdab = require('fs'),
			_0x113036 = "./credentials/" + _0x400bdd;
		if (_0xa4fdab["existsSync"](_0x113036)) {
			sock[_0x400bdd] = undefined;
			const _0x32d3b5 = await connectWaBeforeSend(_0x400bdd);
			return _0x32d3b5 ? _0x376ae4['status'](0xc8)["json"]({
				'status': !![],
				'message': 'Connection\x20restored'
			}) : _0x376ae4["status"](0xc8)['json']({
				'status': ![],
				'message': "Connection failed"
			});
		}
		return _0x376ae4["send"]({
			'status': ![],
			'message': _0x400bdd + " Connection failed,please scan first"
		});
	}
	return _0x376ae4['send']({
		'status': ![],
		'message': "Wrong Parameterss"
	});
}

module["exports"] = {
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