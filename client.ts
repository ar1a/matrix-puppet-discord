const fs = require('fs');
const Promise = require('bluebird');
const discordjs = require('discord.js');
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

    findChannel(id: string) {
        return this.api.channels.get(id);
    }

    sendMessage(id: string, text: string) {
        return new Promise(() => {
            debug('sending', text,'to',id);
            this.findChannel(id).send(text);
        })
    }

    getUser(id: string) {
        return this.api.users.get(id);
    }

    connect() {
        const client = new discordjs.Client();
        this.api = client;
        client.on('message', message => {
            this.emit('message', message);
        });

        client.on('ready', () => {
            this.emit('ready');
        })

        return client.login(this.auth.token);
    }
}
