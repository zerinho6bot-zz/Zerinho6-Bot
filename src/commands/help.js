const { CommandUtils, BootUtils, MessageUtils } = require("../Utils");
const { CommandNeeds } = require("../local_storage");
const EnvVariables = BootUtils.envConfigs();

exports.run = async ({ message, args, t, zSend, zEmbed, zSendAsync }) => {
	const ArgsLower = args[0] ? args[0].toLowerCase() : "";

	function renderCommands() {
		return `${CommandUtils.getAvailableCommandsForUser(message)}`;
	}

	function renderArguments(command) {
		let argument = "";

		const Keys = Object.keys(t(`help:${command}.description.argumentOptions`));
		const Values = Object.values(t(`help:${command}.description.argumentOptions`));

		Keys.forEach((e, index) => {
			argument += `🔹 ${t(`help:${Keys[index]}`)}: **${Values[index]}**\n`;
		});

		return "\n" + t(`help:argumentOptions`) + "\n" + argument;
	}

	//Oh boy, time to mess things up.
	if (!Object.keys(t(`help:${ArgsLower}`)).length > 0) {

		zEmbed.addField(t("help:commands"), renderCommands());
		zEmbed.setDescription(`**${t("please:prefixLiteral")}**: \`${EnvVariables.PREFIX}\`\n${t("please:CPW")} ${EnvVariables.PREFIX}avatar\n\n${t("help:wantToKnowMore")} ${EnvVariables.PREFIX}help ${t("help:command")}\n\n${t("help:exclusiveCommandsWarning")}\n\n**${t("updates:version")}**: ${t("updates:ver")}\n\n${t("updates:changelog")}`);
		
		const Msg = await zSendAsync(zEmbed);
		await Msg.react("ℹ");
		zSend("help:pressTheReactionForFullCommandList", true);
		const COLLECTION = Msg.createReactionCollector((r, u) => r.emoji.name === "ℹ" && !u.bot && u.id === message.author.id, { time: 30000 });

		COLLECTION.on("collect", (r) => {
			zEmbed.fields[0] = {
				name: "Commands",
				value: CommandUtils.getEveryCommand().join(", ") + `\n\n${t("help:formatExplanation")}`,
				inline: true
			}
			Msg.edit(zEmbed);
		});
	} else {
		zEmbed.setTitle(ArgsLower.charAt(0).toUpperCase() + ArgsLower.slice(1));
		zEmbed.setImage(t(`help:${ArgsLower}.image`));
		zEmbed.setDescription(`${t(`please:source`)}: ${t(`help:${ArgsLower}.description.actualDescription`)}\n${renderArguments(ArgsLower)}`);

		let commandAsks = CommandNeeds[ArgsLower];

		if (commandAsks === undefined || commandAsks.options === undefined) {
			zSend(zEmbed);
			return;
		}

		commandAsks = commandAsks.options;
		const Keys = Object.keys(commandAsks);
		const Values = Object.values(commandAsks);

		function getString(key, value) {
			switch(key) {
				case "userNeed":
					return `${t("permissionsExplanations:userNeed")} ${value}`;
				case "needArg":
					return typeof value === "number" ? `${t("permissionsExplanations:needArgs")} ${value}` : t("permissionsExplanations:needArg");
				case "needMention":
					return Array.isArray(value) ? `${t("permissionsExplanations:needMentions")} ${value.join(", ")}` : `${t("permissionsExplanations:needMention")} ${value}`;
				case "specificGuild":
					return Array.isArray(value) ? `${t("permissionsExplanations:specificGuilds")} ${value.join(", ")}` :`${t("permissionsExplanations:specificGuild")} ${value}`;
				case "specificChannel":
					return Array.isArray(value) ? `${t("permissionsExplanations:specificChannels")} ${value.join(", ")}` : `${t("permissionsExplanations:specificChannel")} ${value}`;
				case "specificAuthor":
					return Array.isArray(value) ? `${t("permissionsExplanations:specificAuthors")} ${value.join(", ")}` : `${t("permissionsExplanations:specificAuthor")} ${value}`;
				case "specificRole":
					return isNaN(value) ? `${t("permissionsExplanations:specificRoleName")} ${value}` : `${t("permissionsExplanations:specificRole")} ${value}`;
				case "needAttch":
					return typeof value === "number" ? `${t("permissionsExplanations:needAttachs")} ${value}` : t("permissionsExplanations:needAttch");
				default:
				return t(`permissionsExplanations:${key}`) === "" ? t(`permissionsExplanations:unknown`) : t(`permissionsExplanations:${key}`);
			}
		}

		for (let i = 0; i < Keys.length; i++) {
			commandAsks[Keys[i]] = getString(Keys[i], Values[i]);
		}

		zEmbed.addField(t("help:needs"), MessageUtils.beautify(commandAsks));

		zSend(zEmbed);
	}
};
