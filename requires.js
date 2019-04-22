module.exports = {
	//commands
	"set-language": require("./commands/set-language.js"),
	ram: require("./commands/ram.js"),
	avatar: require("./commands/avatar.js"),
	help: require("./commands/help.js"),
	ping: require("./commands/ping.js"),
	tictactoe: require("./commands/tictactoe.js"),
	"tictactoe-profile": require("./commands/tictactoe-profile.js"),
	"tictactoe-match": require("./commands/tictactoe-match.js"),
	embed: require("./commands/embed.js"),
	"bot-invite": require("./commands/bot-invite.js"),
	eval: require("./commands/eval.js"),
	stoptyping: require("./commands/stoptyping.js"),
	userinfo: require("./commands/userinfo.js"),
	serverinfo: require("./commands/serverinfo.js"),
	render: require("./commands/render.js")
};