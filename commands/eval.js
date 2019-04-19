const { MESSAGE_UTILS } = require("../Utils");
exports.run = (bot, message, args, t) => {
	try {
		const EMBED = MESSAGE_UTILS.zerinhoEmbed(message.member),
		FULL_ARGUMENT = message.content.split(" ").slice(1).join(" ");

		EMBED.addField(t("eval:code"), `\`\`\`JavaScript\n${FULL_ARGUMENT}\`\`\``);
		EMBED.addField(t("eval:result"), `\`\`\`JavaScript\n${eval(FULL_ARGUMENT)}\`\`\``);
		message.channel.send(EMBED);
	} catch (e) {
		message.channel.send(e.toString());
	}
};