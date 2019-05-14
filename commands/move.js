const { MESSAGE_UTILS } = require("../Utils");
const REGEX = /https\:\/\/discordapp.com\/channels\/([0-9]{16,18})\/([0-9]{16,18})\/([0-9]{16,18})/;
const CHANNEL_REGEX = /<#([0-9]{16,18})>/;
const Discord = require("discord.js");

exports.run = async ({ bot, message, args, t, zSend, zEmbed }) => {
	const MATCHED_REGEX = args[0].match(REGEX);

	if (MATCHED_REGEX === null) {
		zSend("render:wrongFormat", true);
		return;
	}

	if ([MATCHED_REGEX[1], MATCHED_REGEX[2], MATCHED_REGEX[3]].every((elem) => isNaN(elem))) {
		zSend("render:incorrectID", true);
		return;
	}

	if (MATCHED_REGEX[1] !== message.guild.id) {
		zSend("move:theMessageIsFromAnotherServer", true);
		return;
	}

	const ChannelID = args[1].match(CHANNEL_REGEX) === null ? args[1] : args[1].match(CHANNEL_REGEX)[1];
	if (isNaN(ChannelID)) {
		zSend("tictactoe-profile:argsNotNumber", true);
		return;
	}

	if (!message.guild.channels.has(ChannelID)) {
		zSend("move:aChannelWithThatIdDoesntExistOnThisGuild", true);
		return;
	}

	const CHANNEL = message.guild.channels.get(ChannelID);

	if (!CHANNEL.permissionsFor(bot.user.id).has("SEND_MESSAGES")) {
		zSend("move:missingSendMessagePermissionOnTheChannel", true);
		return;
	}

	const MSG = await MESSAGE_UTILS.findMessage(bot, message, MATCHED_REGEX[1], MATCHED_REGEX[2], MATCHED_REGEX[3]);

	if (MSG === null) {
		zSend("render:messageNotFound", true);
		return;
	}

	//I know I've already made a check for that, but never trust the user.
	if (MSG.guild.id !== message.guild.id) {
		zSend("move:theMessageIsFromAnotherServer", true);
		return
	}

	if (!MSG.channel.permissionsFor(message.author.id).has("MANAGE_MESSAGES")) {
		zSend("move:youDontHavePermissionToDeleteMessage", true);
		return;
	}

	if (!MSG.channel.permissionsFor(message.author.id).has("VIEW_CHANNEL")) {
		zSend("move:youDontHavePermissionToSeeMessages", true);
		return;
	}

	if (!MSG.channel.permissionsFor(bot.user.id).has("MANAGE_MESSAGES")) {
		zSend("move:missingManageMessagePermissionOnTheChannel", true);
		return;
	}

	if (MSG.channel.nsfw && !message.channel.nsfw) {
		zSend("render:tryingToMoveAMessageFromNsfwToNotNsfw", true);
		return;
	}

	try {
		MSG.delete();
	} catch(e) {
		zSend("move:couldntDeleteTheMessage", true);
		return;
	}

	CHANNEL.send(`${t("move:messageSentBy")} ${MSG.author.username} ${t("move:movedFrom")} ${MSG.channel.name} ${t("move:by")} ${message.author.username}.`);
	if (!MSG.embeds.length > 0) {
		CHANNEL.send(MSG.content);

		if (MSG.attachments.size >= 1) {
			CHANNEL.send(new Discord.Attachment(MSG.attachments.first().url));
		}

		return;
	}

	if (!CHANNEL.permissionsFor(bot.user.id).has("EMBED_LINKS")) {
		zSend("move:missingEmbedLinksPermissionOnTheChannel", true);
		return;
	}

	zEmbed = MSG.embeds[0];
	CHANNEL.send(zEmbed);
};