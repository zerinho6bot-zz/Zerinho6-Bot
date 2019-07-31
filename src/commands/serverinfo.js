const Moment = require("moment");

exports.run = ({ message, t, zSend, zEmbed }) => {
	const VerificationMessages = {
		"0": t("serverinfo:unrestricted"), 
		"1": t("serverinfo:needEmail"),
		"2": t("serverinfo:waitFiveMinutesOnDiscord"),
		"3": t("serverinfo:waitTenMinutesOnTheServer"),
		"4": t("serverinfo:heyYouGuysDontHavePhones")
	};
	const Guild = message.guild;

	zEmbed.setThumbnail(Guild.iconURL ? Guild.iconURL : `https://guild-default-icon.herokuapp.com/${Guild.nameAcronym}`);
	zEmbed.addField(t("serverinfo:guildName"), Guild.name, true);
	zEmbed.addField(t("serverinfo:memberCount"), Guild.memberCount, true);

	const Owner = Guild.owner.user;
	zEmbed.addField(t("serverinfo:guildRegion"), Guild.region, true);
	zEmbed.addField(t("serverinfo:guildID"), Guild.id, true);
	zEmbed.addField(t("serverinfo:guildCreatedAt"), Moment(Guild.createdAt).format("LL"), true);
	zEmbed.addField(t("serverinfo:roleAmount"), Guild.roles.size, true);
	zEmbed.addField(t("serverinfo:guildOwner"), `${Owner.tag}(${Owner.id})`, true);
	zEmbed.addField(t("serverinfo:verificationLevel"), VerificationMessages[Guild.verificationLevel], true);

	if (Guild.splash !== null) {
		zEmbed.setImage(Guild.splash);
	}
	if (Guild.verified) {
		zEmbed.setDescription(t("serverinfo:thisGuildIsVerified"));
	}
	zSend(zEmbed);
};
