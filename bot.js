require("dotenv").config();

const Discord = require("discord.js"),
Bot = new Discord.Client(),
Time = new Date();

Bot.on("ready", () => {
	console.log(`Took: ${Math.round(new Date() - Time)}ms to load.\n\nReady to rock.`);
});

Bot.on("message", require("./message.js").run);

Bot.on("error", (error) => {
	console.log(error);
});

Bot.login(process.env.TOKEN);