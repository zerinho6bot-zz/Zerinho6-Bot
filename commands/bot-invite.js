const { USER_UTILS } = require("../Utils");
const REGEX = /<@\!?(.*)\>/;

exports.run = async ({ bot, args, t, zSend, zEmbed }) => {
	const MATCHED_REGEX = args[0].match(REGEX);

	if (MATCHED_REGEX === null) {
		if (isNaN(args[0]) && !args[0].length >= 16 && 18 >= !args.length) {
			zSend("bot-invite:IdOrMentionNotDetected", true);
			return;
		}
	}

	const ID = MATCHED_REGEX === null ? args[0] : MATCHED_REGEX[1];
	const USER = await USER_UTILS.searchUser(bot, ID);

	if (USER === null) {
		zSend("bot-invite:CouldntFindThatUser", true);
		return;
	}

	if (!USER.bot) {
		zSend("bot-invite:userIsntBot", true);
		return;
	}

	zEmbed.setAuthor(USER.username + USER.discriminator, USER.displayAvatarURL({size: 2048}));
	zEmbed.setThumbnail(USER.displayAvatarURL({size: 2048}));
	zEmbed.addField(t("bot-invite:invite"), `https://discordapp.com/oauth2/authorize?&client_id=${USER.id}&scope=bot&permissions=8`);
	
	zSend(zEmbed);
};
