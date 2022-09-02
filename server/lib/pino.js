'use strict';
const path = require("path"),
    pino = require('pino'),
    logger = pino({
        'transport': {
            'target': "pino-pretty",
            'options': {
                'translateTime': "SYS:standard",
                'ignore': 'hostname,pid',
                'singleLine': false,
                'colorize': true,
                'levelFirst': true,
                'append': true,
                'mkdir': true
            }
        },
        'level': "info"
    });
module["exports"] = logger;