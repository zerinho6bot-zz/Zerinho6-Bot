const Locales = require("../locales"),
Discord = require("discord.js");

module.exports = {
	SetUpT: class {
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
	}
};