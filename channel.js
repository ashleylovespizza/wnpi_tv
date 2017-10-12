"use strict";
module.exports = class Channel {

	constructor (number, name, result) {
		this.number = number;
		this.name = name;
		this.content = result;
	}

	toString () {
		return `${this.name}`
	}
	print () {
		console.log( this.toString() );
	}
}
