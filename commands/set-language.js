const { guildLanguage } = require("../local_storage");
const { LANGUAGE_UTILS, STORAGE_UTILS } = require("../Utils");
const LANGUAGE_LIST = LANGUAGE_UTILS.getLanguages();
const LANGUAGE_LIST_LITERAL = Object.keys(LANGUAGE_LIST).join(", ");

exports.run = ({ message, args, t, zSend, zEmbed }) => {

	if (!args[0]) {
		zEmbed.addField(t("set-language:languageList"), LANGUAGE_LIST_LITERAL);
		zSend(zEmbed);
		return;
	}

	if (!Object.keys(LANGUAGE_LIST).includes(args[0])) {
		zEmbed.setDescription(LANGUAGE_LIST_LITERAL);
		zSend("set-language:languageNotExist", true);
		zSend(zEmbed);
		return;
	}

	if (guildLanguage[message.guild.id]) {
		if (args[0] === guildLanguage[message.guild.id].language) {
			zSend("set-language:languageIsDefault", true);
			return;
		}

		guildLanguage[message.guild.id].language = args[0];
	} else {
		guildLanguage[message.guild.id] = {
			language: ""
		};
		guildLanguage[message.guild.id].language = args[0];
	}

	const result = STORAGE_UTILS.write("./local_storage/guild_language.json", guildLanguage);
	if (result) {
		zSend("set-language:languageDone", true);
	} else {
		zSend("set-language:languageError", true);
	}
};
