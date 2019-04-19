const Locales = require("../locales");

module.exports = {
	SetUpT: class {
		constructor(){
			this.languages = Locales;
			this.defaultLanguage = this.languages[process.env.LANGUAGE];
			this.language = "";
		}
		/**
		* This function sets T to the expected language(Guild expecific language or bot default.)
		* @function
		* @param {string} language - The language code
		*/
		setT(language) {
			if (this.languages[language]) {
				this.language = this.languages[language];
			} else {
				this.language = this.defaultLanguage;
			}
		}

		/**
		* This function will return the string by the given path
		* @function
		* @param {string} path - The path to the expected value.
		* @example
		* //Returns the value of "commands" key from "help"
		* t("help:commands");
		* @returns {string}
		*/
		t(path) {
			const foundStr = path.split(/\.|\:/g).reduce((a, b) => a[b], this.language);

			if (foundStr) {
				return foundStr;
			} else {
				return "";
			}
		}
	},
	/**
	* @function
	* @returns {object}
	*/
	getLanguages: function(){
		return Locales;
	}
};