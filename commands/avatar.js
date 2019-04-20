exports.run = (bot, message, args, t, zSend, zEmbed) => {
	if (args[0] === t("avatar:server")) {
		zEmbed.setImage(message.guild.iconURL ? message.guild.iconURL() : "https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png");
	} else {
		zEmbed.setImage(message.mentions.users.first() ? message.mentions.users.first().displayAvatarURL({size:2048}) : message.author.displayAvatarURL({size:2048}));
	}

	zSend(zEmbed);
};