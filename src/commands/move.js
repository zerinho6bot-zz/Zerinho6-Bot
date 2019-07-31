const { MESSAGE_UTILS } = require("../Utils");
const Regex = /https\:\/\/discordapp.com\/channels\/([0-9]{16,18})\/([0-9]{16,18})\/([0-9]{16,18})/;
const ChannelRegex = /<#([0-9]{16,18})>/;
const Discord = require("discord.js");

exports.run = async ({ bot, message, args, t, zSend, zEmbed }) => {
	const MatchedRegex = args[0].match(Regex);

	if (MatchedRegex === null) {
		zSend("render:wrongFormat", true);
		return;
	}

	if ([MatchedRegex[1], MatchedRegex[2], MatchedRegex[3]].every((elem) => isNaN(elem))) {
		zSend("render:incorrectID", true);
		return;
	}

	if (MatchedRegex[1] !== message.guild.id) {
		zSend("move:theMessageIsFromAnotherServer", true);
		return;
	}

	const ChannelId = args[1].match(ChannelRegex) === null ? args[1] : args[1].match(ChannelRegex)[1];
	if (isNaN(ChannelId)) {
		zSend("tictactoe-profile:argsNotNumber", true);
		return;
	}

	const Guild = message.guild;
	if (!Guild.channels.has(ChannelId)) {
		zSend("move:aChannelWithThatIdDoesntExistOnThisGuild", true);
		return;
	}

	const Channel = Guild.channels.get(ChannelId);

	if (!Channel.permissionsFor(bot.user.id).has("SEND_MESSAGES")) {
		zSend("move:missingSendMessagePermissionOnTheChannel", true);
		return;
	}

	const Msg = await MESSAGE_UTILS.findMessage(bot, message, MatchedRegex[1], MatchedRegex[2], MatchedRegex[3]);
	const Author = message.author;
	if (Msg === null) {
		zSend("render:messageNotFound", true);
		return;
	}

	//I know I've already made a check for that, but never trust the user.
	if (Msg.guild.id !== Guild.id) {
		zSend("move:theMessageIsFromAnotherServer", true);
		return;
	}

	if (!Msg.channel.permissionsFor(Author.id).has("MANAGE_MESSAGES")) {
		zSend("move:youDontHavePermissionToDeleteMessage", true);
		return;
	}

	if (!Msg.channel.permissionsFor(Author.id).has("VIEW_CHANNEL")) {
		zSend("move:youDontHavePermissionToSeeMessages", true);
		return;
	}

	if (!Msg.channel.permissionsFor(bot.user.id).has("MANAGE_MESSAGES")) {
		zSend("move:missingManageMessagePermissionOnTheChannel", true);
		return;
	}

	if (Msg.channel.nsfw && !message.channel.nsfw) {
		zSend("render:tryingToMoveAMessageFromNsfwToNotNsfw", true);
		return;
	}

	try {
		Msg.delete();
	} catch (e) {
		zSend("move:couldntDeleteTheMessage", true);
		return;
	}

	Channel.send(`${t("move:messageSentBy")} ${Msg.author.username} ${t("move:movedFrom")} ${Msg.channel.name} ${t("move:by")} ${message.author.username}.`);
	if (!Msg.embeds.length > 0) {
		Channel.send(Msg.content);

		if (Msg.attachments.size >= 1) {
			Channel.send(new Discord.Attachment(Msg.attachments.first().url));
		}

		return;
	}

	if (!Channel.permissionsFor(bot.user.id).has("EMBED_LINKS")) {
		zSend("move:missingEmbedLinksPermissionOnTheChannel", true);
		return;
	}

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
	Channel.send(zEmbed);
};