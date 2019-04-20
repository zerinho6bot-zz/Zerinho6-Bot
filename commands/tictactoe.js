const EMOJIS = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'],
{ STORAGE_UTILS } = require("../Utils"),
MATCH_ID = Date.now().toString(36),
{ tictactoeMatchs, tictactoeProfiles } = require("../local_storage");

exports.run = async function({ bot, message, t, zSend, zEmbed }) {
	class TicTacToe {
		constructor(p1,p2) {
			this.player1 = {
				tag: p1.tag,
				id: p1.id,
				moves: [],
				result: "",
				emoji: ":x:"
			};
			this.player2 = {
				tag: p2.tag,
				id: p2.id,
				moves: [],
				result: "",
				emoji: ":o:"
			};
			this.time = new Date();
			this.x = this.player1.id;
			this.o = this.player2.id;
			this.turn = this.x;
			this.map = [0,0,0,0,0,0,0,0,0];
			this.winner = 0;
			this.players = [this.player1, this.player2];
			this.zerinho = false;
			this.topera = false;
			this.secret = 0;
			this.watchers = 0;
			this.finished = false;
			this.description = `${this.player1.emoji} ${t("tictactoe:turn")} (${this.player1.tag})\n\n${this.draw()}`;
		}

		draw() {
			let mapS = "";

			for (let i = 0; i < this.map.length; i++) {
				const ActualHouse = this.map[i];

				mapS += ActualHouse === 0 ? EMOJIS[i] : ActualHouse === 1 ? this.player1.emoji : this.player2.emoji;
				mapS += (i === 2 || i === 5 || i === 8) ? "\n": " | ";
			}

			return mapS;
		}

		check() {
			const first = [0,3,6,0,1,2,0,2],
			second = [1,4,7,3,4,5,4,4],
			third = [2,5,8,6,7,8,8,6];

			for (let i = 0; i < first.length; i++) {
				if ([this.map[first[i]], this.map[second[i]], this.map[third[i]]].every((elem) => elem === 1)) {
					return 1;
				}

				if ([this.map[first[i]], this.map[second[i]], this.map[third[i]]].every((elem) => elem === 2)) {
					return 2;
				}
			}

			if (this.map.every((elem) => elem !== 0)) {
				return 3;
			}

			return 0;
		}

		getMatchResult(playerN){
			if (this.winner === 3) {
				return t("tictactoe:draw");
			}

			return this.winner === playerN ? t("tictactoe:winner") : t("tictactoe:loser");
		}

		play(house) {
			if (this.map[house] !== 0) {
				return false;
			}

			let turnEqualsX = this.turn === this.x;

			turnEqualsX? this.player1.moves = this.player1.moves.concat(house) : this.player2.moves = this.player2.moves.concat(house);
			this.map[house] = turnEqualsX ? 1 : 2;
			this.turn = turnEqualsX ? this.o : this.x;
			this.description = `${turnEqualsX ? this.player1.emoji : this.player2.emoji} ${t("tictactoe:turn")} (${this.turn === this.x ? this.player1.tag : this.player2.tag}).\n\n${this.draw()}`;

			const winner = this.check();

			if (winner !== 0) {
				this.finished = true;
				this.winner = winner;

				let playerWhoWon = winner === 1 ? this.player1 : this.player2;
				this.description = (winner === 3 ? `:loudspeaker: ${t("tictactoe:draw")}` : `${playerWhoWon.emoji} - ${playerWhoWon.tag} ${t("tictactoe:winner")}!`) + `\n\n${this.draw()}`;
				return true;
			}
			return false;
		}

		updatePlayersOnlineStats() {
			for(let i = 0; i < this.players.length; i++) {
				let player = this.players[i];

				if(!tictactoeProfiles[player.id]) {
					tictactoeProfiles[player.id] = {
						tag: "",
						wins: 0,
						loses: 0,
						matchs: 0,
						draws: 0
					};
				}

				const actualPlayer = tictactoeProfiles[player.id];

				actualPlayer.tag = player.tag;
				actualPlayer.matchs++;
				actualPlayer.wins = this.winner === i+1 ? actualPlayer.wins + 1 : actualPlayer.wins;
				actualPlayer.loses = this.winner !== i+1 ? actualPlayer.loses + 1 : actualPlayer.loses;
				actualPlayer.draws = this.winner === 3 ? actualPlayer.draws + 1 : actualPlayer.draws;

				STORAGE_UTILS.write("./local_storage/tictactoe-profiles.json", tictactoeProfiles);
			}
		}

		uploadMatch(time){
			tictactoeMatchs[MATCH_ID] = {
				time: 0,
				map: [],
				watchers: 0,
				p1: {
					moves: [],
					tag: ""
				},
				p2: {
					moves: [],
					tag: ""
				},
				winner: 0
			};

			const MATCH = tictactoeMatchs[MATCH_ID];

			MATCH.time = time;
			MATCH.map = this.map;
			MATCH.watchers = this.watchers;
			MATCH.p1.moves = this.player1.moves;
			MATCH.p2.moves = this.player2.moves;
			MATCH.p1.tag = this.player1.tag;
			MATCH.p2.tag = this.player2.tag;
			MATCH.winner = this.winner;

			STORAGE_UTILS.write("./local_storage/tictactoe-matchs.json", tictactoeMatchs);
		}
	}

	if (message.mentions.members.first().id === message.author.id) {
		zSend("tictactoe:selfMention", true);
		return;
	}

	if (message.mentions.members.first().bot) {
		zSend("tictactoe:botMention", true);
		return;
	}

	const GAME = new TicTacToe(message.author, message.mentions.users.first());

	let watchers = [];
	zEmbed.setDescription(GAME.description);
	zEmbed.setFooter(t("tictactoe:watchingAd"));
	//Again, we can't use zSend here because zSend doesn't return the message.
	const MSG = await message.channel.send(EMBED);

	if (message.member.nickname.toLowerCase().includes("zerinho6")) {
		GAME.zerinho = true;
		GAME.player1.emoji = "<:zerinicon:317871174266912768>";
	}

	if (message.mentions.members.first().nickname.toLowerCase().includes("topera")) {
		GAME.topera = true;
		GAME.player2.emoji = "<:Toperaicon:317871116934840321>";
	}

	if (GAME.zerinho && GAME.topera) {
		GAME.secret = true;
	}

	for (let i = 0; i < EMOJIS.length; i++) {
		MSG.react(EMOJIS[i]);
	}
	MSG.react("👀");

	const COLLECTION = MSG.createReactionCollector((r, u) => (EMOJIS.includes(r.emoji.name) || r.emoji.name === r.emoji.name) && !u.bot, {time: 600000});
	COLLECTION.on("collect", (r, u) => {

		if (r.emoji.name === "👀") {

			if (watchers.includes(message.author.id) || u.id === GAME.x || u.id === GAME.o) {
				return;
			} else {
				watchers = watchers.concat(message.author.id);
			}
			GAME.watchers++;

			let newEmbed = zEmbed;
			zEmbed.fields.length !== 0 ? newEmbed.spliceField(0,1,t("tictactoe:watchers"),`${GAME.watchers} ${t("tictactoe:peopleWatching")}`) : newEmbed.addField(t("tictactoe:watchers"), `${GAME.watchers} ${t("tictactoe:peopleWatching")}`);
			MSG.edit(newEmbed);
			return;
		}

		if (u.id !== GAME.turn) {
			return;
		}

		r.users.remove(GAME.turn);
		r.users.remove(bot.user.id);

		if (GAME.play(EMOJIS.indexOf(r.emoji.name))) {
			COLLECTION.stop();
		}

		zEmbed.setDescription(GAME.description);
		MSG.edit(zEmbed);
	});

	COLLECTION.on("end", (r) => {
		if (!GAME.finished) {
			message.channel.send(t("tictactoe:timeExpired"));
			return;
		}

		const ResultEmbed = MESSAGE_UTILS.zerinhoEmbed(message.member),
		TIME = Math.floor((new Date() - GAME.time) / 1000);

		ResultEmbed.setTitle(t("tictactoe:results"));
		ResultEmbed.setDescription(`${t("tictactoe:theMatchTaken.part1")} ${TIME} ${t("tictactoe:theMatchTaken.part2")}${GAME.watchers !== 0 ? `...\n\n${t("tictactoe:theMatchTaken.part3")} **${GAME.watchers}** ${t("tictactoe:theMatchTaken.part4")}` : "."} ${GAME.secret ? "\n\nWith the love of zerinho6 and topera\n<:zerinicon:317871174266912768> :heart: <:Toperaicon:317871116934840321>" : ""}`);
		ResultEmbed.setFooter(`${t("tictactoe:matchCode")}: ${MATCH_ID}`);
		for (let i = 0; i < 2; i++) {
			let players = GAME.players;

			ResultEmbed.addField(players[i].tag, `${t("tictactoe:matchResult")}: ${GAME.getMatchResult(i + 1)}\n${t("tictactoe:moves")}: ${players[i].moves.join(", ")}`);
		}

		zSend(ResultEmbed);
		GAME.updatePlayersOnlineStats();
		GAME.uploadMatch(TIME);
	});
};
