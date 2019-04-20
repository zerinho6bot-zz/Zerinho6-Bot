const { tictactoeProfiles } = require("../local_storage");
exports.run = (bot, message, args, t, zSend, zEmbed) => {
	let user = null;

	if (message.mentions.users.first()) {
		if (!tictactoeProfiles[message.mentions.users.first().id]) {
			zSend("tictactoe-profile:userNotFound", true);
			return;
		}

		user = tictactoeProfiles[message.mentions.users.first().id];
	}

	if (user === null) {
		if (isNaN(args[0])) {
			zSend("tictactoe-profile:argsNotNumber", true);
			return;
		}

		if(!tictactoeProfiles[args[0]]) {
			zSend("tictactoe-profile:userNotFound", true);
			return;
		}

		user = tictactoeProfiles[args[0]];
	}

	zEmbed.setTitle(`${t("tictactoe-profile:profileOf")} ${user.tag}`);
	zEmbed.setDescription(`**${t("tictactoe-profile:wins")}**: ${user.wins}\n**${t("tictactoe-profile:loses")}**: ${user.loses}\n**${t("tictactoe-profile:draws")}**: ${user.draws}\n**${t("tictactoe-profile:matchs")}**: ${user.matchs}`);

	zSend(zEmbed);
};