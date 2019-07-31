const { GuildLanguage } = require("../local_storage");
const { LANGUAGE_UTILS, STORAGE_UTILS } = require("../Utils");
const LanguageList = LANGUAGE_UTILS.getLanguages();
const LanguageListLiteral = Object.keys(LanguageList).join(", ");

exports.run = ({ message, args, t, zSend, zEmbed }) => {

	if (!args[0]) {
		zEmbed.addField(t("set-language:languageList"), LanguageListLiteral);
		zSend(zEmbed);
		return;
	}

	if (!Object.keys(LanguageList).includes(args[0])) {
		zEmbed.setDescription(LanguageListLiteral);
		zSend("set-language:languageNotExist", true);
		zSend(zEmbed);
		return;
	}

	const Guild = message.guild;
	
	if (GuildLanguage[Guild.id]) {
		if (args[0] === GuildLanguage[Guild.id].language) {
			zSend("set-language:languageIsDefault", true);
			return;
		}

		GuildLanguage[Guild.id].language = args[0];
	} else {
		GuildLanguage[Guild.id] = {
			language: ""
		};
		GuildLanguage[Guild.id].language = args[0];
	}

	const Result = STORAGE_UTILS.write("./local_storage/guild_language.json", GuildLanguage);
	if (Result) {
		zSend("set-language:languageDone", true);
	} else {
		zSend("set-language:languageError", true);
	}
};
