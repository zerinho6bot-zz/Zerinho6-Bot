const { COMMAND_UTILS, LANGUAGE_UTILS, MESSAGE_UTILS } = require("./Utils");
const { guildLanguage } = require("./local_storage");
const SetUpT = new LANGUAGE_UTILS.SetUpT();
const COMMANDS = COMMAND_UTILS.getCommandList();

exports.run = function (bot, message) {

	const args = message.content.split(" ");
	const commandName = args[0].slice(process.env.PREFIX.length);

	if (!COMMANDS.includes(commandName)) {
		return;
	}
	
	const setT = SetUpT.setT(guildLanguage[message.guild.id] ? guildLanguage[message.guild.id].language : process.env.LANGUAGE);
	const T = SetUpT.t.bind(SetUpT);
	const UserCD = MESSAGE_UTILS.applyCooldown(message.author.id);
	const zSend = MESSAGE_UTILS.zerinhoConfigSend(message, T);

	if (UserCD > 0) {
		if (UserCD === 4) {
			zSend(`${T("utils:cooldownWarning")} ${process.env.COOLDOWN/1000} ${T("utils:seconds")}`);
		}
		return;
	}

	if (!message.channel.permissionsFor(bot.user.id).has("EMBED_LINKS")) {
		zSend("utils:needEmbedLinks", true);
		return;
	}

	const PermissionStr = COMMAND_UTILS.checkCommandPermissions(message, commandName, T);
	if (PermissionStr === "") {
		const zEmbed = MESSAGE_UTILS.zerinhoEmbed(message.member);
		console.log(`Executing command: ${commandName}, by user ${message.author.username} on guild ${message.guild.name}, RAM: ${Math.round(process.memoryUsage().rss / 1024 / 1024)}`)
		COMMAND_UTILS.getCommandRequirer(commandName).run({
			bot: bot,
			message,
			args: args.slice(1),
			t: T,
			zSend,
			zEmbed
		});
	} else {
		zSend(PermissionStr);
	}
};