const { TictactoeMatchs } = require("../local_storage");

function draw(map) {
	const Emojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];
	let mapString = "";

	for (let i = 0; i < map.length; i++) {
		const ActualHouse = map[i];

		mapString += ActualHouse === 0 ? Emojis[i] : ActualHouse === 1 ? ":x:" : ":o:";
		mapString += (i === 2 || i === 5 || i === 8) ? "\n": " | ";
	}

	return mapString;
}

exports.run = ({ args, t, zSend, zEmbed }) => {
	
	if (!TictactoeMatchs[args[0]]) {
		zSend("tictactoe-match:matchNotFound", true);
		return;
	}

	const Match = TictactoeMatchs[args[0]];

	zEmbed.setTitle(`${Match.p1.tag} ${t("tictactoe-match:vs")} ${Match.p2.tag}`);
	zEmbed.setDescription(`${draw(Match.map)}\n\n${t("tictactoe:theMatchTaken.part1")} ${Match.time} ${t("tictactoe:theMatchTaken.part2")}\n${t("tictactoe-match:theWinnerWas")} ${Match.winner === 3 ? t("tictactoe-match:noOne") : Match.winner === 1 ? Match.p1.tag : Match.p2.tag}.`);
	zEmbed.addField(`${t("tictactoe-match:movimentsOf")} ${Match.p1.tag}`, Match.p1.moves.join(", "));
	zEmbed.addField(`${t("tictactoe-match:movimentsOf")} ${Match.p2.tag}`, Match.p2.moves.join(", "));

	zSend(zEmbed);
};
