const Regex = /(.*?)\s\|\s(.*)/;

function reachedLimit(name, value) {
	return name > 256 || value > 1024;
}

exports.run = ({ message, zSend, zEmbed }) => {
	const FullArgument = message.content.split(" ").slice(1).join(" ");
	const MatchedRegex = FullArgument.match(Regex);

	if (MatchedRegex !== null) {
		if (reachedLimit(MatchedRegex[1], MatchedRegex[2])) {
			zSend("enbed:fieldContainsTooMuch", true);
			return;
		}
		zEmbed.addField(MatchedRegex[1],MatchedRegex[2]);
	} else {
		zEmbed.setDescription(FullArgument);
	}

	if (message.attachments.size >= 1) {
		zEmbed.setImage(message.attachments.first().url);
	}

	zSend(zEmbed);
};
