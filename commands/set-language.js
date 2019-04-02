const { guildLanguage } = require("../local_storage"),
{ LANGUAGE_UTILS, STORAGE_UTILS, MESSAGE_UTILS } = require("../Utils"),
LANGUAGE_LIST = LANGUAGE_UTILS.getLanguages(),
LANGUAGE_LIST_LITERAL = Object.keys(LANGUAGE_LIST).join(", ");

exports.run = (bot, message, args, t) => {
	const ZeroEmbed = MESSAGE_UTILS.zerinhoEmbed(message.member);

	if (!args[0]) {
		ZeroEmbed.addField(t("set-language:languageList"), LANGUAGE_LIST_LITERAL);

		message.channel.send(ZeroEmbed);
		return;
	}

	if (!Object.keys(LANGUAGE_LIST).includes(args[0])) {
		ZeroEmbed.setDescription(LANGUAGE_LIST_LITERAL);

		message.channel.send(t("set-language:languageNotExist"));
		message.channel.send(ZeroEmbed);
		return;
	}

	if (guildLanguage[message.guild.id]) {
		if (args[0] === guildLanguage[message.guild.id].language) {
			message.channel.send(t("set-language:languageIsDefault"));
			return;
		}

		guildLanguage[message.guild.id].language = args[0];
	} else {
		guildLanguage[message.guild.id] = {
			language: ""
		};
		guildLanguage[message.guild.id].language = args[0];
	}

	let result = STORAGE_UTILS.write("./local_storage/guild_language.json", guildLanguage);

	if (result) {
		message.channel.send(t("set-language:languageDone"));
		return;
	} else {
		message.channel.send(t("set-language:languageError"));
		return;
	}
};