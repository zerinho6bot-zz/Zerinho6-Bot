/* global Set */
const cooldown = new Set();
const cooldownWarning = new Set();
const Discord = require("discord.js");

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
		const ZeroEmbed = new Discord.MessageEmbed()

		ZeroEmbed.setAuthor(member.user.tag, member.user.displayAvatarURL({size:2048}));
		ZeroEmbed.setColor(member.displayHexColor);
		ZeroEmbed.setTimestamp();

		return ZeroEmbed;
	},
	/**
	*
	* @function
	* @param {object} message - The message object
	* @param {object} t - The t function
	* @returns {object} Returns the zerinhoSend function
	*/
	zerinhoConfigSend: function(message, t) {
		/**
		* @function
		* @param {(string|object)} content - The content to send.
		* @param {boolean} [literal=false] - If the content is a path-to-string for the translate function
		*/
		return function zerinhoSend(content, literal) {
			//If literal is true, then it'll use the content as param for the translate function, else it'll just use the content as the message, literally.
			content = literal ? t(content) : content;

			message.channel.startTyping(6);
			message.channel.send(content);
			message.channel.stopTyping(true);
		};
	}
};