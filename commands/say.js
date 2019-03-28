exports.run = (bot, message, args, timer, t) => {
	let start = new Date();

	message.channel.send(`${message.author.username} ${t("say.userSaid")}: ${message.content.split(" ").slice(1).join(" ")}`).then((message) => {
		message.channel.send(`\`Debug\`:\nRAM: ${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB\u200B(By rss)\nPing: ${new Date() - start}ms\nMessage.js to Here: ${new Date - timer}ms`);
	});
};