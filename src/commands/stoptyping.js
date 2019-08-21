exports.run = ({ message, zSend }) => {
	zSend("stoptyping:CANYOUSTOPTYPINGHOLYSHIT", true);
	message.channel.stopTyping(true);
};
