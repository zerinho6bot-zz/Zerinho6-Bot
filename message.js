/* global Set */
const { COMMAND_UTILS, LANGUAGE_UTILS, MESSAGE_UTILS } = require("./Utils"),
COMMANDS = COMMAND_UTILS.getCommandList();

module.exports.run = function (message) {
	if (message.channel.type === "dm" || message.author.bot || !message.channel.permissionsFor(this.user.id).has("SEND_MESSAGES") || !message.content.startsWith(process.env.PREFIX)) {
		return;
	}

	const args = message.content.split(" "),
	commandName = args[0].slice(process.env.PREFIX.length).toLowerCase();
	
	if (!commandName) {
		return;
	}

	if (!COMMANDS.includes(commandName)) {
		return;
	}

	const { guildLanguage } = require("./local_storage"),
	setUpT = new LANGUAGE_UTILS.SetUpT(),
	setT = setUpT.setT(guildLanguage[message.guild.id] ? guildLanguage[message.guild.id].language : process.env.LANGUAGE),
	t = setUpT.t
	permissionStr = COMMAND_UTILS.checkCommandPermissions(message, commandName, t),
	userCD = MESSAGE_UTILS.applyCooldown(message.author.id);

	if (userCD.length > 0) {
		if (userCD.length > 3) {
			message.reply(`${t("utils:cooldownWarning")} ${process.env.COOLDOWN/1000} ${t("utils:seconds")}`);
		}
		return;
	}

	if (!permissionStr.length > 0) {
		COMMAND_UTILS.getCommandRequirer(commandName).run(this, message, args.slice(1), t.bind(setUpT));
	} else {
		message.reply(permissionStr);
	}
};