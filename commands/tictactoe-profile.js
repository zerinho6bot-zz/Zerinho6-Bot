const { tictactoeProfiles } = require("../local_storage");
exports.run = ({ message, args, t, zSend, zEmbed }) => {
	let user = null;

	if (message.mentions.users.first()) {
		user = tictactoeProfiles[message.mentions.users.first().id];
	}

	if (user === null) {
		if (args[0]) {
			if (isNaN(args[0])) {
				zSend("tictactoe-profile:argsNotNumber", true);
				return;
			}
			user = args[0];
		} else {
			user = message.author.id;
		}
		user = tictactoeProfiles[user];
	}

	if(!tictactoeProfiles[user]) {
		zSend("tictactoe-profile:userNotFound", true);
		return;
	}

	zEmbed.setTitle(`${t("tictactoe-profile:profileOf")} ${user.tag}`);
	zEmbed.setDescription(`**${t("tictactoe-profile:wins")}**: ${user.wins}\n**${t("tictactoe-profile:loses")}**: ${user.loses}\n**${t("tictactoe-profile:draws")}**: ${user.draws}\n**${t("tictactoe-profile:matchs")}**: ${user.matchs}`);

	zSend(zEmbed);
};
