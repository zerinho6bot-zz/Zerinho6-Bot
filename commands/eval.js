exports.run = (bot, message, args, t, zSend, zEmbed) => {
	try {
		const FULL_ARGUMENT = message.content.split(" ").slice(1).join(" ");

		zEmbed.addField(t("eval:code"), `\`\`\`JavaScript\n${FULL_ARGUMENT}\`\`\``);
		zEmbed.addField(t("eval:result"), `\`\`\`JavaScript\n${eval(FULL_ARGUMENT)}\`\`\``);
		zSend(zEmbed);
	} catch (e) {
		zSend(e.toString());
	}
};