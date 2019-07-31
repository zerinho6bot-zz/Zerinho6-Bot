const PackageJson = require("../../package.json");
const { BootUtils } = require("../Utils");
const EnvConfigs = BootUtils.envConfigs();

exports.run = async ({ message, bot, t, zEmbed }) => {
	zEmbed.addField("Discord.js", `\`\`\`JavaScript\n${require("discord.js").version}\`\`\``, true);
	zEmbed.addField(t("info:guilds"), `\`\`\`JavaScript\n${bot.guilds.size}\`\`\``, true);
	zEmbed.addField(t("info:users"), `\`\`\`JavaScript\n${bot.users.size}\`\`\``, true);
	zEmbed.addField(t("info:gitRepository"), `\`\`\`JavaScript\n${PackageJson.repository}\`\`\``, true);
	zEmbed.addField(t("info:reportBugsIt"), `\`\`\`JavaScript\n${PackageJson.bugs}\`\`\``, true);
	zEmbed.addField(t("info:defaultLanguage"), `\`\`\`JavaScript\n${EnvConfigs.LANGUAGE}\`\`\``, true);
	zEmbed.addField("RAM", `\`\`\`JavaScript\n${Math.round(process.memoryUsage().rss / 1024 / 1024)}(RSS)\`\`\``, true);
	zEmbed.addField(t("info:uptime"), `\`\`\`JavaScript\n${Math.floor(process.uptime() / 3600 % 24)}:${Math.floor(process.uptime() / 60 % 60)}:${Math.floor(process.uptime() % 60)}\`\`\``, true);
	zEmbed.addField(t("info:ownerID"), `\`\`\`JavaScript\n${EnvConfigs.OWNER}\`\`\``, true);

	const Msg = await message.channel.send(zEmbed);
	await Msg.react("ℹ");
	const COLLECTION = Msg.createReactionCollector((r, u) => r.emoji.name === "ℹ" && !u.bot && u.id === message.author.id, { time: 30000 });

	COLLECTION.on("collect", (r) => {
		zEmbed.addField(t("rpg:history"), `\`\`\`\n${t("info:history")}\`\`\``, true);
		Msg.edit(zEmbed);
	});
};
