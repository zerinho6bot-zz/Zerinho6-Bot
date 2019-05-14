const { MESSAGE_UTILS } = require("../Utils");
const Discord = require("discord.js");
const REGEX = /https\:\/\/discordapp.com\/channels\/([0-9]{16,18})\/([0-9]{16,18})\/([0-9]{16,18})/;

exports.run = async ({ bot, args, message, t, zSend, zEmbed }) => {
	const MatchedRegex = args[0].match(REGEX);

	if (MatchedRegex === null) {
		zSend("render:wrongFormat", true);
		return;
	}

	if ([MatchedRegex[1], MatchedRegex[2], MatchedRegex[3]].every((elem) => isNaN(elem))) {
		zSend("render:incorrectID", true);
		return;
	}

	const MSG = await MESSAGE_UTILS.findMessage(bot, message, MatchedRegex[1], MatchedRegex[2], MatchedRegex[3]);

	if (MSG === null) {
		zSend("render:messageNotFound", true);
		return;
	}

	if (MSG.channel.nsfw && !message.channel.nsfw) {
		zSend("render:tryingToMoveAMessageFromNsfwToNotNsfw", true);
		return;
	}

	if (MSG.embeds.length !== 0) {
		zEmbed = MSG.embeds[0];
		zSend(zEmbed);
	}

	if (MSG.embeds.length === 0) {
		const EMBED = MESSAGE_UTILS.zerinhoEmbed(MSG.member);

		if (MSG.content.length > 0) {
			EMBED.setDescription(MSG.content);
		}

		if (MSG.attachments.size >= 1) {
			EMBED.setImage(MSG.attachments.first().url);
		}

		EMBED.setFooter(MSG.guild.name);
		zSend(EMBED);
	} else {
		if (MSG.content.length > 0) {
			zSend(MSG.content);
		}

		if (MSG.attachments.size >= 1) {
			zSend(new Discord.MessageAttachment(MSG.attachments.first().url));
		}
	}
};