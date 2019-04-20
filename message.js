const { COMMAND_UTILS, LANGUAGE_UTILS, MESSAGE_UTILS } = require("./Utils"),
COMMANDS = COMMAND_UTILS.getCommandList();

exports.run = function (message) {
	if (message.author.bot || !message.content.toLowerCase().startsWith(process.env.PREFIX) || message.channel.type === "dm" || !message.channel.permissionsFor(this.user.id).has("SEND_MESSAGES")) {
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
	SetUpT = new LANGUAGE_UTILS.SetUpT(),
	setT = SetUpT.setT(guildLanguage[message.guild.id] ? guildLanguage[message.guild.id].language : process.env.LANGUAGE),
	T = SetUpT.t,
	PermissionStr = COMMAND_UTILS.checkCommandPermissions(message, commandName, T.bind(SetUpT)),
	UserCD = MESSAGE_UTILS.applyCooldown(message.author.id),
	Zsend = MESSAGE_UTILS.zerinhoConfigSend(message, T.bind(SetUpT));

	if (UserCD > 0) {
		if (UserCD === 4) {
			Zsend(`${SetUpT.t("utils:cooldownWarning")} ${process.env.COOLDOWN/1000} ${SetUpT.t("utils:seconds")}`);
		}
		return;
	}

	if (!message.channel.permissionsFor(this.user.id).has("EMBED_LINKS")) {
		Zsend("utils:needEmbedLinks", true);
		return;
	}
	
	if (!PermissionStr.length > 0) {
		COMMAND_UTILS.getCommandRequirer(commandName).run(this, message, args.slice(1), T.bind(SetUpT), Zsend, MESSAGE_UTILS.zerinhoEmbed(message.member));
	} else {
		Zsend(PermissionStr);
	}
};