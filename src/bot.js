'use strict';
require("dotenv").config();
const Discord = require("discord.js");
const { GuildStats } = require("./local_storage");
const { StorageUtils, BootUtils } = require("./Utils");
const Bot = new Discord.Client({ messageCacheMaxSize: 30, messageCacheLifeTime: 300, messageSweepInterval: 350});
const ServerStats = new StorageUtils.ServerStats(GuildStats, Bot);
const EnvVariables = BootUtils.envConfigs();

Bot.on("message", (message) => {
	const Channel = message.channel;

	if (message.author.bot || !message.content.startsWith(EnvVariables.PREFIX) || Channel.type === "dm" || !Channel.permissionsFor(Bot.user.id).has("SEND_MESSAGES") || !message.content.split(" ").slice(EnvVariables.PREFIX.length)) {
		return;
	}
	require("./message.js").run(Bot, message);
});

Bot.on("error", (error) => {
	console.log(error);
});

Bot.login(EnvVariables.TOKEN).then(() => {
	BootUtils.wowSuchGraphics(Bot);
	ServerStats.updateServersStats(true);
	
	setTimeout(() => {
		ServerStats.updateServersStats(true);
	}, 86400000);//24h
});