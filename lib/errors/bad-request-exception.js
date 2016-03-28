"use strict";

class BadRequestException extends Error {
    constructor(...args) {
        super(...args);
    }
}

module.exports = BadRequestException;