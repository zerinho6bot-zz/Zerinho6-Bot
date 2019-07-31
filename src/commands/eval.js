//Bot is exported but not used because we want it to exist when executing the FullArgument
exports.run = ({ bot, message, t, zSend, zEmbed }) => {
	try {
		const FullArgument = message.content.split(" ").slice(1).join(" ");

		zEmbed.addField(t("eval:code"), `\`\`\`JavaScript\n${FullArgument}\`\`\``);
		zEmbed.addField(t("eval:result"), `\`\`\`JavaScript\n${eval(FullArgument)}\`\`\``);
		zSend(zEmbed);
	} catch (e) {
		zSend(String(e));
	}
};
