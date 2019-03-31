require("dotenv").config();

const Discord = require("discord.js"),
bot = new Discord.Client(),
time = new Date();

bot.on("ready", () => {
	console.log(`Took: ${Math.round(new Date() - time)}ms to load.\n\nReady to rock.`);

	setInterval(() => {
		console.log(`RAM: ${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB(By rss)\n----- -----`);
	}, 30000);
});

bot.on("message", require("./message.js").run);

bot.on("error", (error) => {
	console.log(error);
});

bot.login(process.env.TOKEN);