"use strict";

class Message {
    constructor(id, channelName, content) {
        this.id = id;
        this.channel = channelName;
        this.content = content;
    }
}

module.exports = Message;