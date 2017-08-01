import {
    ThirdPartyAdapter,

    download, entities,

    ThirdPartyPayload, ThirdPartyMessagePayload, ThirdPartyImageMessagePayload,
    UserData, RoomData
} from 'matrix-puppet-bridge';

import { DiscordClient } from './client';
const path = require('path');
const debug = require('debug')('matrix-puppet:discord');
const fs = require('fs');

export class Adapter extends ThirdPartyAdapter {
    public serviceName = 'Discord';
    private client: DiscordClient;
    startClient(): Promise<void> {
        this.client = new DiscordClient();
        this.client.configure(this.config);
        debug('startClient');

        this.client.on('ready', () => {
            debug('logged in!');
        })

        this.client.on('message', msg => {
            debug('message', msg.author.username, msg.content);
        })


        return new Promise(() => {
            this.client.connect();
        });
    }

    sendMessage(roomid: string, text: string): Promise<void> {
        debug('sendMessage', roomid, text);
        return new Promise(() => {});
    }
    sendImageMessage(roomid: string, image: any): Promise<void> {
        debug('sendImageMessage', roomid, image);
        return new Promise(() => {});
    }
}
