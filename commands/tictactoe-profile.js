const { MESSAGE_UTILS } = require("../Utils"),
{ tictactoeProfiles } = require("../local_storage");
exports.run = (bot, message, args, t) => {
	let user = null;

	if (message.mentions.users.first()) {
		if (!tictactoeProfiles[message.mentions.users.first().id]) {
			message.channel.send(t("tictactoe-profile:userNotFound"));
			return;
		}

		user = tictactoeProfiles[message.mentions.users.first().id]
	}

	if (user === null) {
		if (isNaN(args[0])) {
			message.channel.send(t("tictactoe-profile:argsNotNumber"));
			return;
		}

		if(!tictactoeProfiles[args[0]]) {
			message.channel.send(t("tictactoe-profile:userNotFound"));
			return;
		}

		user = tictactoeProfiles[args[0]];
	}
	const ZeroEmbed = MESSAGE_UTILS.zerinhoEmbed(message.member);

	ZeroEmbed.setTitle(`${t("tictactoe-profile:profileOf")} ${user.tag}`);
	ZeroEmbed.setDescription(`**${t("tictactoe-profile:wins")}**: ${user.wins}\n**${t("tictactoe-profile:loses")}**: ${user.loses}\n**${t("tictactoe-profile:draws")}**: ${user.draws}\n**${t("tictactoe-profile:matchs")}**: ${user.matchs}`);

	message.channel.send(ZeroEmbed);
};