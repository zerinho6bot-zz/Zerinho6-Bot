const { CommandUtils, LanguageUtils, MessageUtils, BootUtils } = require("./Utils");
const { GuildLanguage } = require("./local_storage");
const TranslationClass = new LanguageUtils.InitTranslationClass();
const Commands = CommandUtils.getCommandList();
const EnvVariables = BootUtils.envConfigs();

exports.run = async function (bot, message) {

	const Args = message.content.split(" ");
	const CommandName = Args[0].toLowerCase().slice(EnvVariables.PREFIX.length);

	if (!Commands.includes(CommandName)) {
		return;
	}

	const Guild = message.guild;
	const Author = message.author;
	const Channel = message.channel;

	TranslationClass.DefineLanguageForTranslation(GuildLanguage[Guild.id] ? GuildLanguage[Guild.id].language : EnvVariables.LANGUAGE);
	
	const Translate = TranslationClass.Translate.bind(TranslationClass);
	const UserCooldown = MessageUtils.applyCooldown(Author.id);
	const FastSend = MessageUtils.zerinhoConfigSend(Channel, Translate);
	const AsyncFastSend = await MessageUtils.zerinhoConfigSend(Channel, Translate, message)

	if (UserCooldown > 0) {
		if (UserCooldown === 4) {
			FastSend(`${Translate("utils:cooldownWarning")} ${EnvVariables.COOLDOWN/1000} ${Translate("utils:seconds")}`);
		}
		return;
	}

	if (!Channel.permissionsFor(bot.user.id).has("EMBED_LINKS")) {
		FastSend("utils:needEmbedLinks", true);
		return;
	}

	const checkMissingPermission = CommandUtils.checkCommandPermissions(message, CommandName, Translate);
	if (checkMissingPermission === "") {
		const FastEmbed = MessageUtils.zerinhoEmbed(message.member);
		console.log(`Executing command: ${CommandName}, by user ${Author.username} on guild ${Guild.name}, RAM: ${Math.round(process.memoryUsage().rss / 1024 / 1024)}`);
		CommandUtils.getCommandRequirer(CommandName).run({
			bot: bot,
			message,
			args: Args.slice(1),
			t: Translate,
			zSend: FastSend,
			zEmbed: FastEmbed,
			zSendAsync: AsyncFastSend
		});
	} else {
		FastSend(checkMissingPermission);
	}
};