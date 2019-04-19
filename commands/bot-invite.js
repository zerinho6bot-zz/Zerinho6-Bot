const { MESSAGE_UTILS, USER_UTILS } = require("../Utils"),
REGEX = /<@\!?(.*)\>/;

exports.run = async (bot, message, args, t) => {
	const MATCHED_REGEX = args[0].match(REGEX);

	if (MATCHED_REGEX === null) {
		if (isNaN(args[0]) && !args[0].length >= 16 && 18 >= !args.length) {
			message.channel.send(t("bot-invite:IdOrMentionNotDetected"));
			return;
		}
	}

	const ID = MATCHED_REGEX === null ? args[0] : MATCHED_REGEX[1],
	USER = await USER_UTILS.searchUser(bot, ID);

	if (USER === null) {
		message.channel.send(t("bot-invite:CouldntFindThatUser"));
		return;
	}

	if (!USER.bot) {
		message.channel.send(t("bot-invite:userIsntBot"));
		return;
	}

	const EMBED = MESSAGE_UTILS.zerinhoEmbed(message.member);

	EMBED.setAuthor(USER.username + USER.discriminator, USER.displayAvatarURL({size: 2048}));
	EMBED.setThumbnail(USER.displayAvatarURL({size: 2048}));
	EMBED.addField(t("bot-invite:invite"), `https://discordapp.com/oauth2/authorize?&client_id=${USER.id}&scope=bot&permissions=8`);
	
	message.channel.send(EMBED);
};