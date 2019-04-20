/* global Set */
const cooldown = new Set(),
cooldownWarning = new Set(),
Discord = require("discord.js");

module.exports = {
	/**
	* This function will return 0 if the user isn't on CD, it'll return 3 if it's on CD and i'll return 4 if it was warned that it's on CD but still trying.
	* @function
	* @param {string} id - The message author ID
	* @retuns {number}
	*/
	applyCooldown: function(id) {

		const applyCDWarning = () => {
			cooldownWarning.add(id);

			setTimeout(() => {
				cooldownWarning.delete(id);
			}, process.env.COOLDOWN);
		};

		if (id === process.env.OWNER) {
			return 0;
		}

		if (cooldownWarning.has(id)) {
			return 3;
		}

		if (cooldown.has(id)) {
			applyCDWarning();

			return 4;
		}

		cooldown.add(id);
		setTimeout(() => {
			cooldown.delete(id);
		}, process.env.COOLDOWN);

		return 0;
	},
	/**
	* Returns a embed with default options
	* @function
	* @param {object} member - The message member
	* @returns {object}
	*/
	zerinhoEmbed: function(member){
		const zeroEmbed = new Discord.MessageEmbed();

		zeroEmbed.setAuthor(member.user.tag, member.user.displayAvatarURL({size:2048}));
		zeroEmbed.setColor(member.displayHexColor);
		zeroEmbed.setTimestamp();

		return zeroEmbed;
	},
	zerinhoConfigSend: function(message, t) {
		return function zerinhoSend(content, literal) {
			content = literal ? t(content) : content;

			message.channel.startTyping(6);
			message.channel.send(content);
			message.channel.stopTyping(true);
		};
	}
};