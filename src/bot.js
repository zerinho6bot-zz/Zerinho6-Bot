'use strict';
require("dotenv").config();
const Discord = require("discord.js");
const { GuildStats } = require("./local_storage");
const { STORAGE_UTILS, BOOT_UTILS } = require("./Utils");
const Bot = new Discord.Client({ messageCacheMaxSize: 30, messageCacheLifeTime: 300, messageSweepInterval: 350});
const ServerStats = new STORAGE_UTILS.ServerStats(GuildStats, Bot);
const EnvVariables = BOOT_UTILS.envConfigs();

Bot.on("message", (message) => {
	if (message.author.bot || !message.content.startsWith(EnvVariables.PREFIX) || message.channel.type === "dm" || !message.channel.permissionsFor(Bot.user.id).has("SEND_MESSAGES") || !message.content.split(" ").slice(EnvVariables.PREFIX.length)) {
		return;
	}
	require("./message.js").run(Bot, message);
});

Bot.on("error", (error) => {
	console.log(error);
});

Bot.login(EnvVariables.TOKEN).then(() => {
	BOOT_UTILS.wowSuchGraphics(Bot);
	ServerStats.updateServersStats(true);
	
	setTimeout(() => {
		ServerStats.updateServersStats(true);
	}, 86400000);//24h
});