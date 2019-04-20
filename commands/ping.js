exports.run = ({ message }) => {
	const starter = new Date();
	//zSend doesn't return the message after it's use, so I can't put zSend().then().
	message.channel.send(t("ping:ping")).then((message) => {
		message.edit(`${t("ping:pong")} \`${new Date() - starter}\`${t("ping:ms")}`);
	});
};
