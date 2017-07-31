const fs = require('fs');
const Promise = require('bluebird');
const discordjs = Promise.promisify(require('discord.js'));
const debug = require('debug')('matrix-puppet:discord:client');

export const EventEmitter = require('events').EventEmitter;

import { download, entities } from 'matrix-puppet-bridge';

export interface AuthParams {
    token: string;
}

export class DiscordClient extends EventEmitter {
    configure(auth: AuthParams) {
        this.api = null;
        this.auth = auth;
        this.lastMsgId = null;
    }

    connect() {
        const client = new discordjs.Client();
        this.api = client;
        client.on('message', message => {
            debug('message', message);
        });

        client.login(this.auth.token);
    }
}
