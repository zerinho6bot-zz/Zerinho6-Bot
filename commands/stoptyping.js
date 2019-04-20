exports.run = (bot, message, args, t, zSend, zEmbed) => {
	zSend("stoptyping:CANYOUSTOPTYPINGHOLYSHIT", true);
	message.channel.stopTyping(true);
};