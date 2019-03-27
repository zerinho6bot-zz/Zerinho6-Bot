require("dotenv").config();
const Discord = require("discord.js"),
bot = new Discord.Client();

let time = new Date();

bot.on("ready", () => {
	console.log(`Took: ${Math.round(new Date() - time)}ms to load.\n\nReady to rock.`);
});

bot.on("message", require("./message.js").run);

bot.on("error", (error) => {
	console.log(error);
});

bot.login(process.env.TOKEN);