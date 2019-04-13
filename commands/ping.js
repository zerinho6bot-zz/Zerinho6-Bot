exports.run = (bot, message, args, t) => {
	const starter = new Date();

	message.channel.send(t("ping:ping")).then((message) => {
		message.edit(`${t("ping:pong")} \`${new Date() - starter}\`${t("ping:ms")}`);
	});
};