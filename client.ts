import * as discordjs from 'discord.js';
// const Promise = require('bluebird');
// const discordjs = require('discord.js');
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

    sendMessage(id: string, text: string): Promise<void> {
        return new Promise(() => {
            debug('sending', text,'to',id);
            this.findChannel(id).send(text);
        });
    }

    sendImageMessage(id: string, image: any): Promise<void> {
        return new Promise(() => {
            this.findChannel(id).send('\ufff0', {
                files: [
                    {
                    attachment: image.url,
                    name: image.text.slice(0,-2)
                }
                ]
            });
        });
    }

    getUser(id: string) {
        return this.api.users.get(id);
    }

    connect() {
        const client = new discordjs.Client();
        this.api = client;
        client.on('message', message => {
            if(message.author.id === client.user.id) {
                if(message.content.slice(-1) !== '\ufff0')
                    this.emit('sent', message);
            } else {
                this.emit('message', message);
            }
        });

        client.on('ready', () => {
            this.emit('ready');
        })

        return client.login(this.auth.token);
    }
}
