exports.run = (bot, message, args, timer, t) => {
	message.channel.send(`RSS: ${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`);
	message.channel.send(`heapUsed: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
};