const { MessageUtils } = require("../Utils");
const Discord = require("discord.js");
const Regex = /https\:\/\/discordapp.com\/channels\/([0-9]{16,18})\/([0-9]{16,18})\/([0-9]{16,18})/;

exports.run = async ({ bot, args, message, t, zSend, zEmbed }) => {
	const MatchedRegex = args[0].match(Regex);

	if (MatchedRegex === null) {
		zSend("render:wrongFormat", true);
		return;
	}

	if ([MatchedRegex[1], MatchedRegex[2], MatchedRegex[3]].every((elem) => isNaN(elem))) {
		zSend("render:incorrectID", true);
		return;
	}

	const Msg = await MessageUtils.findMessage(bot, message, MatchedRegex[1], MatchedRegex[2], MatchedRegex[3]);

	if (Msg === null) {
		zSend("render:messageNotFound", true);
		return;
	}

	if (Msg.channel.nsfw && !message.channel.nsfw) {
		zSend("render:tryingToMoveAMessageFromNsfwToNotNsfw", true);
		return;
	}

	if (Msg.embeds.length > 0) {
		const DataFrom = Msg.embeds[0];

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
		const Embed = new Discord.RichEmbed();
		//We don't use zerinhoEmbed from message Utils because if a user fetch message from a member that
		//isn't on the guild anymore, it won't return the member property which is required as argument for zerinhoEmbed. 
		Embed.setAuthor(Msg.author.username, Msg.author.avatarURL);
		if (Msg.content.length > 0) {
			Embed.setDescription(Msg.content);
		}

		if (Msg.attachments.size >= 1) {
			Embed.setImage(Msg.attachments.first().url);
		}

		Embed.setFooter(Msg.guild.name);
		zSend(Embed);
	}
};