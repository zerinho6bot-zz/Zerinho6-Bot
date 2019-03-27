const Locales = require("../locales"),
Discord = require("discord.js");

module.exports = {
	setUpT: class {
		constructor(){
			this.languages = Locales;
			this.defaultLanguage = this.languages[process.env.LANGUAGE];
			this.language = "";
		}

		setT(language) {
			if (this.languages[language]) {
				this.language = this.languages[language];
			} else {
				this.language = this.defaultLanguage;
			}
		}

		t(path) {
			let str = path.split("."),
			foundStr = this.language[str[0]][str[1]];

			if (foundStr) {
				return foundStr;
			} else {
				return "";
			}
		}
	},
	getLanguages: function(){
		return Locales;
	},
	zerinhoEmbed: function(member){
		const zeroEmbed = new Discord.MessageEmbed();

		zeroEmbed.setAuthor(member.user.tag, member.user.displayAvatarURL({size:2048}));
		zeroEmbed.setColor(member.displayHexColor);
		zeroEmbed.setTimestamp();

		return zeroEmbed;
	}
};