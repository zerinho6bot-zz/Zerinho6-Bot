const REGEX = /(.*?)\s\|\s(.*)/;

function reachedLimit(name, value) {
	return name > 256 || value > 1024;
}
exports.run = (bot, message, args, t, zSend, zEmbed) => {
	const FULL_ARGUMENT = message.content.split(" ").slice(1).join(" "),
	MATCH = FULL_ARGUMENT.match(REGEX);

	if (MATCH !== null) {
		if (reachedLimit(MATCH[1], MATCH[2])) {
			zSend("enbed:fieldContainsTooMuch", true);
			return;
		}
		zEmbed.addField(MATCH[1],MATCH[2]);
	} else {
		zEmbed.setDescription(FULL_ARGUMENT);
	}

	if (message.attachments.size >= 1) {
		zEmbed.setImage(message.attachments.first().url);
	}

	zSend(zEmbed);
};