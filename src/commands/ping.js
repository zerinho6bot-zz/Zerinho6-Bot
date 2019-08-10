exports.run = ({ t, zSendAsync }) => {
	const DateBeforeSend = new Date();
	//zSend doesn't return the message after it's use, so I can't put zSend().then().
	zSendAsync("ping:ping", true).then((message) => {
		message.edit(`${t("ping:pong")} \`${new Date() - DateBeforeSend}\`${t("ping:ms")}`);
	});
};
