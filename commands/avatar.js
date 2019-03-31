const { MESSAGE_UTILS } = require("../Utils");
exports.run = (bot, message, args, timer, t) => {
	const ZeroEmbed = MESSAGE_UTILS.zerinhoEmbed(message.mentions.members.first() || message.member);

	if (args[0] === t("avatar:server")) {
		ZeroEmbed.setImage(message.guild.iconURL ? message.guild.iconURL() : "https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png");
	} else {
		ZeroEmbed.setImage(message.mentions.users.first() ? message.mentions.users.first().displayAvatarURL({size:2048}) : message.author.displayAvatarURL({size:2048}));
	}

	message.channel.send(ZeroEmbed);
};