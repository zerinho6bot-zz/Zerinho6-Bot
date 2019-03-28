/* global Set */
const cooldown = new Set(),
cooldownWarning = new Set(),
Discord = require("discord.js");

module.exports = {
	/*
	* This function will apply a cooldown to the given user id, it'll return true if it hasn't a cooldown already, and false if it has.
	* @function
	* @param {string} id - The message author ID
	* @retuns {boolean}
	*/
	applyCooldown: function(id) {

		let applyCDWarning = () => {
			cooldownWarning.add(id);

			setTimeout(() => {
				cooldownWarning.delete(id);
			}, process.env.COOLDOWN);
		}

		if (id === process.env.OWNER) {
			return "";
		}

		if (cooldownWarning.has(id)) {
			return "dnd";
		}

		if (cooldown.has(id)) {
			applyCDWarning();

			return "wait you need to blablalba, fuck that shit.";
		}

		cooldown.add(id);
		setTimeout(() => {
			cooldown.delete(id);
		}, process.env.COOLDOWN);

		return "";
	},
	zerinhoEmbed: function(member){
		const zeroEmbed = new Discord.MessageEmbed();

		zeroEmbed.setAuthor(member.user.tag, member.user.displayAvatarURL({size:2048}));
		zeroEmbed.setColor(member.displayHexColor);
		zeroEmbed.setTimestamp();

		return zeroEmbed;
	}
}
