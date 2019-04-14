const { MESSAGE_UTILS } = require("../Utils"),
REGEX = /(.*?)\s\|\s(.*)/;

function reachedLimit(name, value) {
	return name > 256 || value > 1024;
}
exports.run = (bot, message, args, t) => {
	const EMBED = MESSAGE_UTILS.zerinhoEmbed(message.member),
	FULL_ARGUMENT = message.content.split(" ").slice(1).join(" "),
	MATCH = FULL_ARGUMENT.match(REGEX);

	if (MATCH !== null) {
		if (reachedLimit(MATCH[1], MATCH[2])) {
			message.channel.send(t("enbed:fieldContainsTooMuch"));
			return;
		}
		EMBED.addField(MATCH[1],MATCH[2]);
	} else {
		EMBED.setDescription(FULL_ARGUMENT);
	}

	if (message.attachments.size >= 1) {
		EMBED.setImage(message.attachments.first().url);
	}

	message.channel.send(EMBED);
};