const { COMMAND_UTILS, LANGUAGE_UTILS, MESSAGE_UTILS, BOOT_UTILS } = require("./Utils");
const { guildLanguage } = require("./local_storage");
const TranslationClass = new LANGUAGE_UTILS.InitTranslationClass();
const COMMANDS = COMMAND_UTILS.getCommandList();
const EnvVariables = BOOT_UTILS.envConfigs();

exports.run = function (bot, message) {

	const Args = message.content.split(" ");
	const CommandName = Args[0].toLowerCase().slice(EnvVariables.PREFIX.length);

	if (!COMMANDS.includes(CommandName)) {
		return;
	}
	
	TranslationClass.DefineLanguageForTranslation(guildLanguage[message.guild.id] ? guildLanguage[message.guild.id].language : EnvVariables.LANGUAGE);
	
	const Translate = TranslationClass.Translate.bind(TranslationClass);
	const UserCooldown = MESSAGE_UTILS.applyCooldown(message.author.id);
	const FastSend = MESSAGE_UTILS.zerinhoConfigSend(message.channel, Translate);

	if (UserCooldown > 0) {
		if (UserCooldown === 4) {
			FastSend(`${Translate("utils:cooldownWarning")} ${EnvVariables.COOLDOWN/1000} ${Translate("utils:seconds")}`);
		}
		return;
	}

	if (!message.channel.permissionsFor(bot.user.id).has("EMBED_LINKS")) {
		FastSend("utils:needEmbedLinks", true);
		return;
	}

	const checkMissingPermission = COMMAND_UTILS.checkCommandPermissions(message, CommandName, Translate);
	if (checkMissingPermission === "") {
		const FastEmbed = MESSAGE_UTILS.zerinhoEmbed(message.member);
		console.log(`Executing command: ${CommandName}, by user ${message.author.username} on guild ${message.guild.name}, RAM: ${Math.round(process.memoryUsage().rss / 1024 / 1024)}`);
		COMMAND_UTILS.getCommandRequirer(CommandName).run({
			bot: bot,
			message,
			args: Args.slice(1),
			t: Translate,
			zSend: FastSend,
			zEmbed: FastEmbed
		});
	} else {
		FastSend(checkMissingPermission);
	}
};