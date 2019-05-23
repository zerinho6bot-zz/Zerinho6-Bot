const { USER_UTILS } = require("../Utils");
const Moment = require("moment");
exports.run = async ({ bot, args, message, t, zSend, zEmbed }) => {
	let user = message.author;

	if (!isNaN(args[0]) && args[0].length >= 16 && 18 >= args.length) {
		if (args[0] !== message.author.id) {
			const SearchedUser = await USER_UTILS.searchUser(bot, args[0]);

			if (SearchedUser === null) {
				zSend("bot-invite:CouldntFindThatUser", true);
				return;
			}
			user = SearchedUser;
		}
	}

	const Member = message.mentions.members.size > 0 ? message.mentions.members.first() : message.guild.member(user);
	if (Member !== null) {
		zEmbed.addField(t("userinfo:tag"), Member.user.username + Member.user.discriminator, true);
		zEmbed.addField(t("help:id"), Member.user.id, true);
		zEmbed.addField(t("userinfo:accountCreatedIn"), Moment(Member.user.createdAt).format("LL"), true);
		zEmbed.addField(t("userinfo:hexColor"), Member.displayHexColor, true);
		zEmbed.addField(t("userinfo:roleAmount"), Member.roles.size > 1 ? Member.roles.size : t("userinfo:noRole"), true);
		zEmbed.addField(t("userinfo:joinedAt"), Moment(user.createdAt).format("LL"), true);
		zEmbed.setThumbnail(Member.user.displayAvatarURL);
		zSend(zEmbed);
	} else {
		zSend(t("bot-invite:CouldntFindThatUser"));
		return;
	}
};
