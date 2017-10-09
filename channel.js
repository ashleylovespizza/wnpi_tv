module.exports = class Channel {

	constructor (number, name) {
		this.number = number;
		this.name = name;

	}

	toString () {
		return `${this.name}`
	}
	print () {
		console.log( this.toString() );
	}
}
