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

	if (MSG.embeds.length > 0) {
		const DataFrom = MSG.embeds[0];

		zEmbed.fields = DataFrom.fields;
		zEmbed.title = DataFrom.title;
		zEmbed.description = DataFrom.description;
		zEmbed.url = DataFrom.url;
		zEmbed.timestamp = DataFrom.timestamp;
		zEmbed.color = DataFrom.color;
		zEmbed.video = DataFrom.video;
		zEmbed.image = DataFrom.image;
		zEmbed.thumbnail = DataFrom.thumbnail;
		zEmbed.author = DataFrom.author;

		zSend(zEmbed);
	} else {
		const EMBED = new Discord.RichEmbed();
		//We don't use zerinhoEmbed from message Utils because if a user fetch message from a member that
		//isn't on the guild anymore, it won't return the member property which is required as argument for zerinhoEmbed. 
		EMBED.setAuthor(MSG.author.username, MSG.author.avatarURL);
		if (MSG.content.length > 0) {
			EMBED.setDescription(MSG.content);
		}

		if (MSG.attachments.size >= 1) {
			EMBED.setImage(MSG.attachments.first().url);
		}

		EMBED.setFooter(MSG.guild.name);
		zSend(EMBED);
	}
};