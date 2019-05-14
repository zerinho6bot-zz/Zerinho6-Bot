const Moment = require("moment");

exports.run = ({ message, t, zSend, zEmbed }) => {
	const verificationMessages = {
		"0": t("serverinfo:unrestricted"), 
		"1": t("serverinfo:needEmail"),
		"2": t("serverinfo:waitFiveMinutesOnDiscord"),
		"3": t("serverinfo:waitTenMinutesOnTheServer"),
		"4": t("serverinfo:heyYouGuysDontHavePhones")
	};

	zEmbed.setThumbnail(message.guild.iconURL ? message.guild.iconURL : `https://guild-default-icon.herokuapp.com/${message.guild.nameAcronym}`);
	zEmbed.addField(t("serverinfo:guildName"), message.guild.name, true);
	zEmbed.addField(t("serverinfo:memberCount"), message.guild.memberCount, true);

	const OWNER = message.guild.owner.user;
	zEmbed.addField(t("serverinfo:guildRegion"), message.guild.region, true);
	zEmbed.addField(t("serverinfo:guildID"), message.guild.id, true);
	zEmbed.addField(t("serverinfo:guildCreatedAt"), Moment(message.guild.createdAt).format("LL"), true);
	zEmbed.addField(t("serverinfo:roleAmount"), message.guild.roles.size, true);
	zEmbed.addField(t("serverinfo:guildOwner"), `${OWNER.tag}(${OWNER.id})`, true);
	zEmbed.addField(t("serverinfo:verificationLevel"), verificationMessages[message.guild.verificationLevel], true);

	if (message.guild.splash !== null) {
		zEmbed.setImage(message.guild.splash);
	}
	if (message.guild.verified) {
		zEmbed.setDescription(t("serverinfo:thisGuildIsVerified"));
	}
	zSend(zEmbed);
};
