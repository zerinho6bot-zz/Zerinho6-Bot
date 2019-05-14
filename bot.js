'use strict';
require("dotenv").config();
const Discord = require("discord.js");
const Bot = new Discord.Client({ messageCacheMaxSize: 30, messageCacheLifeTime: 300, messageSweepInterval: 350});
const Time = new Date();

Bot.on("message", (message) => {
	if (message.author.bot || !message.content.startsWith(process.env.PREFIX) || message.channel.type === "dm" || !message.channel.permissionsFor(Bot.user.id).has("SEND_MESSAGES") || !message.content.split(" ").slice(process.env.PREFIX.length)) {
		return;
	}
	require("./message.js").run(Bot, message);
});

Bot.on("error", (error) => {
	console.log(error);
});

Bot.login(process.env.TOKEN).then(console.log(`Took: ${Math.round(new Date() - Time)}ms to load.\n\nReady to rock`))