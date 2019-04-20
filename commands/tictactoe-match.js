const { MESSAGE_UTILS } = require("../Utils"),
{ tictactoeMatchs } = require("../local_storage");

function draw(map) {
	const EMOJIS = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];
	let mapS = "";

	for (let i = 0; i < map.length; i++) {
		const ActualHouse = map[i];

		mapS += ActualHouse === 0 ? EMOJIS[i] : ActualHouse === 1 ? ":x:" : ":o:";
		mapS += (i === 2 || i === 5 || i === 8) ? "\n": " | ";
	}

	return mapS;
}
exports.run = (bot, message, args, t, zSend, zEmbed) => {
	
	if (!tictactoeMatchs[args[0]]) {
		zSend("tictactoe-match:matchNotFound", true);
		return;
	}

	const MATCH = tictactoeMatchs[args[0]];

	zEmbed.setTitle(`${MATCH.p1.tag} ${t("tictactoe-match:vs")} ${MATCH.p2.tag}`);
	zEmbed.setDescription(`${draw(MATCH.map)}\n\n${t("tictactoe:theMatchTaken.part1")} ${MATCH.time} ${t("tictactoe:theMatchTaken.part2")}\n${t("tictactoe-match:theWinnerWas")} ${MATCH.winner === 3 ? t("tictactoe-match:noOne") : MATCH.winner === 1 ? MATCH.p1.tag : MATCH.p2.tag}.`);
	zEmbed.addField(`${t("tictactoe-match:movimentsOf")} ${MATCH.p1.tag}`, MATCH.p1.moves.join(", "));
	zEmbed.addField(`${t("tictactoe-match:movimentsOf")} ${MATCH.p2.tag}`, MATCH.p2.moves.join(", "));

	if (MATCH.watchers !== 0) {
		zEmbed.setFooter(`${t("tictactoe:theMatchTaken.part3")} ${MATCH.watchers} ${t("tictactoe:theMatchTaken.part4")}`);
	}

	zSend(zEmbed);
};