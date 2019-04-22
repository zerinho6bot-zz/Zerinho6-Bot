const { USER_UTILS } = require("../Utils"),
Moment = require("moment")
exports.run = async ({ bot, args, message, t, zSend, zEmbed }) => {
	let user = message.author;

	if (!isNaN(args[0]) && args[0].length >= 16 && 18 >= args.length) {
		const SearchedUser = await USER_UTILS.searchUser(bot, args[0]);

		user = SearchedUser === null ? user : SearchedUser;
	}

	zEmbed.addField(t("userinfo:tag"), user.username + user.discriminator, true);
	zEmbed.addField(t("help:id"), user.id, true);
	zEmbed.addField(t("userinfo:accountCreatedIn"), Moment(user.createdAt).format("LL"), true);

	const member = message.guild.member(user);
	if (member !== null) {
		zEmbed.addField(t("userinfo:hexColor"), member.displayHexColor, true);
		zEmbed.addField(t("userinfo:roleAmount"), member.roles.size > 1 ? member.roles.size : t("userinfo:noRole"), true);
		zEmbed.addField(t("userinfo:joinedAt"), Moment(user.createdAt).format("LL"), true);
	}
	zEmbed.setThumbnail(user.displayAvatarURL({size: 2048}));
	zSend(zEmbed);
};
