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
        });

        this.client.on('message', msg => {
            debug('message', msg.author.username, msg.content);
            this.handleDiscordMessage(msg);
        });


        return new Promise(() => {
            this.client.connect();
        });
    }

    getPayload(data): ThirdPartyPayload {
        let payload = <ThirdPartyPayload>{
            roomId: data.channel.id,
            senderId: undefined
        };

        if(data.author !== undefined) {
            payload.senderId = data.author.id;
            payload.senderName = data.author.username;
            payload.avatarUrl = data.author.avatarURL;
            if(payload.avatarUrl == null) {
                payload.avatarUrl = "https://vignette3.wikia.nocookie.net/drawntolife/images/f/f3/Discord_Link.png/revision/latest?cb=20160529154328";
            }
        }
        debug('payload', payload);
        return payload;
    }

    getUserData(id: string): Promise<UserData> {
        let user = this.client.getUser(id);
        let payload = <UserData> {
            name: id
        };
        if(user) {
            payload.name = user.username;
            payload.avatarUrl = user.avatarURL;
            if(payload.avatarUrl == null) {
                payload.avatarUrl = "https://vignette3.wikia.nocookie.net/drawntolife/images/f/f3/Discord_Link.png/revision/latest?cb=20160529154328";
            }
        }

        debug('getUserData', user.avatarURL, payload);

        return Promise.resolve(payload);
    }

    getRoomData(id: string): Promise<RoomData> {
        debug('fetching additional room data...');
        debug(id);
        let payload = {};
        let channel = this.client.findChannel(id);
        if(channel) {
            let topic = "No topic set";
            if(channel.type === "text") {
                if(channel.topic !== null)
                    topic = channel.topic;
            }

            let name = channel.type;
            if(channel.type == "text") {
                name = "[" + channel.guild.name + "] " + channel.name;
            } else if (channel.type = "dm") {
                channel.recipient.username;
            }
            debug('topic', topic);
            return Promise.resolve(<RoomData> {
                name: name,
                topic: topic,
                isDirect: (channel.type === "dm" ? false : true)
            });
        }
    }

    handleDiscordMessage(msg) {
        let payload =  <ThirdPartyMessagePayload>this.getPayload(msg);
        payload.text = msg.content;
        return this.puppetBridge.sendMessage(payload);
    }

    sendMessage(roomid: string, text: string): Promise<void> {
        debug('sendMessage', roomid, text);
        return new Promise(() => {
            this.client.sendMessage(roomid, text);
        });
    }
    sendImageMessage(roomid: string, image: any): Promise<void> {
        debug('sendImageMessage', roomid, image);
        return new Promise(() => {});
    }
}
