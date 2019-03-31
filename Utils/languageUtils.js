const Locales = require("../locales");

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
			const foundStr = path.split(/\.|\:/g).reduce((a, b) => a[b], this.language);

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