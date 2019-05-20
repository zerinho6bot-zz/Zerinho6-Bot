exports.run = ({ bot, t, zSend, zEmbed }) => {
	zEmbed.addField("Discord.js", `\`\`\`JavaScript\n${require("discord.js").version}\`\`\``, true);
	zEmbed.addField(t("info:guilds"), `\`\`\`JavaScript\n${bot.guilds.size}\`\`\``, true);
	zEmbed.addField(t("info:users"), `\`\`\`JavaScript\n${bot.users.size}\`\`\``, true);
	zEmbed.addField(t("info:gitRepository"), `\`\`\`JavaScript\n${require("../package.json").repository}\`\`\``, true);
	zEmbed.addField(t("info:reportBugsIt"), `\`\`\`JavaScript\n${require("../package.json").bugs}\`\`\``, true);
	zEmbed.addField(t("info:defaultLanguage"), `\`\`\`JavaScript\n${process.env.LANGUAGE}\`\`\``, true);
	zEmbed.addField("RAM", `\`\`\`JavaScript\n${Math.round(process.memoryUsage().rss / 1024 / 1024)}(RSS)\`\`\``, true);
	zEmbed.addField(t("info:uptime"), `\`\`\`JavaScript\n${Math.floor(process.uptime() / 3600 % 24)}:${Math.floor(process.uptime() / 60 % 60)}:${Math.floor(process.uptime() % 60)}\`\`\``, true);
	zEmbed.addField(t("info:ownerID"),`\`\`\`JavaScript\n${process.env.OWNER}\`\`\``, true);
	zEmbed.addField(t("rpg:history"), `\`\`\`\n${t("info:history")}\`\`\``, true);

	zSend(zEmbed);
};
