const EMOJIS = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];
const { MESSAGE_UTILS, STORAGE_UTILS } = require("../Utils");
const MATCH_ID = Date.now().toString(36);
const { tictactoeMatchs, tictactoeProfiles } = require("../local_storage");
const PlayersPlaying = new Set();

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
			this.finished = false;
			this.description = `${this.player1.emoji} ${t("tictactoe:turn")} (${this.player1.tag})\n\n${this.draw()}`;
		}

		draw() {
			let mapString = "";

			for (let i = 0; i < this.map.length; i++) {
				const ActualHouse = this.map[i];

				mapString += ActualHouse === 0 ? EMOJIS[i] : ActualHouse === 1 ? this.player1.emoji : this.player2.emoji;
				mapString += (i === 2 || i === 5 || i === 8) ? "\n" : " | ";
			}

			return mapString;
		}

		check() {
			const FirstHouseToCheck = [0,3,6,0,1,2,0,2];
			const SecondHouseToCheck = [1,4,7,3,4,5,4,4];
			const ThirdHouseToCheck = [2,5,8,6,7,8,8,6];

			for (let i = 0; i < FirstHouseToCheck.length; i++) {
				if ([this.map[FirstHouseToCheck[i]], this.map[SecondHouseToCheck[i]], this.map[ThirdHouseToCheck[i]]].every((elem) => elem === 1)) {
					return 1;
				}

				if ([this.map[FirstHouseToCheck[i]], this.map[SecondHouseToCheck[i]], this.map[ThirdHouseToCheck[i]]].every((elem) => elem === 2)) {
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

			const turnEqualsX = this.turn === this.x;

			turnEqualsX ? this.player1.moves = this.player1.moves.concat(house + 1) : this.player2.moves = this.player2.moves.concat(house + 1);
			this.map[house] = turnEqualsX ? 1 : 2;
			this.turn = turnEqualsX ? this.o : this.x;
			this.description = `${turnEqualsX ? this.player1.emoji : this.player2.emoji} ${t("tictactoe:turn")} (${this.turn === this.x ? this.player1.tag : this.player2.tag}).\n\n${this.draw()}`;

			const Winner = this.check();

			if (Winner !== 0) {
				this.finished = true;
				this.winner = Winner;

				const playerWhoWon = Winner === 1 ? this.player1 : this.player2;
				this.description = (Winner === 3 ? `:loudspeaker: ${t("tictactoe:draw")}` : `${playerWhoWon.emoji} - ${playerWhoWon.tag} ${t("tictactoe:winner")}!`) + `\n\n${this.draw()}`;
				return true;
			}
			return false;
		}

		updatePlayersOnlineStats() {
			for(let i = 0; i < this.players.length; i++) {
				const Player = this.players[i];

				if(!tictactoeProfiles[Player.id]) {
					tictactoeProfiles[Player.id] = {
						tag: "",
						wins: 0,
						loses: 0,
						matchs: 0,
						draws: 0
					};
				}

				const actualPlayer = tictactoeProfiles[Player.id];
				actualPlayer.tag = Player.tag;
				actualPlayer.matchs++;
				actualPlayer.wins = this.winner === i + 1 ? actualPlayer.wins + 1 : actualPlayer.wins;
				actualPlayer.loses = this.winner !== i + 1 ? actualPlayer.loses + 1 : actualPlayer.loses;
				actualPlayer.draws = this.winner === 3 ? actualPlayer.draws + 1 : actualPlayer.draws;
				STORAGE_UTILS.write("./local_storage/tictactoe-profiles.json", tictactoeProfiles);
			}
		}

		uploadMatch(time){
			tictactoeMatchs[MATCH_ID] = {
				time: 0,
				map: [],
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
			MATCH.p1.moves = this.player1.moves;
			MATCH.p2.moves = this.player2.moves;
			MATCH.p1.tag = this.player1.tag;
			MATCH.p2.tag = this.player2.tag;
			MATCH.winner = this.winner;
			STORAGE_UTILS.write("./local_storage/tictactoe-matchs.json", tictactoeMatchs);
		}

		/**
		* This function checks if the (number related) player have a username or nickname of zerinho6 for p1 or topera for p2.
		* @function
		* @param {number} n - The number related to the player(1 or 2(It can actually be anything else than 1 😄))
		*/
		checkIfPlayerActivesEasterEgg(n) {
			const Member = n === 1 ? message.member : message.mentions.members.first();
			const NameToCheck = n === 1 ? "zerinho6" : "topera";

			if (Member.nickname !== null && Member.nickname.toLowerCase().includes(NameToCheck)) {
				return true;
			} else if (Member.user.username.toLowerCase().includes(NameToCheck)) {
				return true;
			}

			return false;
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

	if (PlayersPlaying.has(message.author.id) || PlayersPlaying.has(message.mentions.members.first().id)) {
		zSend("tictactoe:oneOfThePlayersIsAlreadyPlaying", true);
		return;
	}

	const GAME = new TicTacToe(message.author, message.mentions.users.first());
	
	PlayersPlaying.add(message.author.id);
	PlayersPlaying.add(message.mentions.members.first().id);

	zEmbed.setDescription(GAME.description);
	//Again, we can't use zSend here because zSend doesn't return the message.
	const MSG = await message.channel.send(zEmbed);

	if (GAME.checkIfPlayerActivesEasterEgg(1)) {
		GAME.zerinho = true;
		GAME.player1.emoji = "<:zerinicon:317871174266912768>";
	}

	if (GAME.checkIfPlayerActivesEasterEgg(2)) {
		GAME.topera = true;
		GAME.player2.emoji = "<:Toperaicon:317871116934840321>";
	}

	if (GAME.zerinho && GAME.topera) {
		GAME.secret = true;
	}

	for (let i = 0; i < EMOJIS.length; i++) {
		await MSG.react(EMOJIS[i]);
	}

	const COLLECTION = MSG.createReactionCollector((r, u) => r.emoji.name === r.emoji.name && !u.bot, {time: 300000});
	COLLECTION.on("collect", (r) => {
		if (r.users.last().id !== GAME.turn) {
			return;
		}

		r.users.forEach((u) => {
			r.remove(u);
		});

		if (GAME.play(EMOJIS.indexOf(r.emoji.name))) {
			COLLECTION.stop();
		}

		zEmbed.setDescription(GAME.description);
		MSG.edit(zEmbed);
	});

	COLLECTION.on("end", () => {
		PlayersPlaying.add(message.author.id);
		PlayersPlaying.add(message.mentions.members.first().id);
		
		if (!GAME.finished) {
			message.channel.send(t("tictactoe:timeExpired"));
			return;
		}

		const ResultEmbed = MESSAGE_UTILS.zerinhoEmbed(message.member);
		const TIME = Math.floor((new Date() - GAME.time) / 1000);
		const Players = GAME.Players;

		ResultEmbed.setTitle(t("tictactoe:results"));
		ResultEmbed.setDescription(`${t("tictactoe:theMatchTaken.part1")} ${TIME} ${t("tictactoe:theMatchTaken.part2")}.${GAME.secret ? "\n\nWith the love of zerinho6 and topera\n<:zerinicon:317871174266912768> :heart: <:Toperaicon:317871116934840321>" : ""}`);
		ResultEmbed.setFooter(`${t("tictactoe:matchCode")}: ${MATCH_ID}`);
		
		for (let i = 0; i < 2; i++) {

			ResultEmbed.addField(Players[i].tag, `${t("tictactoe:matchResult")}: ${GAME.getMatchResult(i + 1)}\n${t("tictactoe:moves")}: ${Players[i].moves.join(", ")}`);
		}

		zSend(ResultEmbed);
		GAME.updatePlayersOnlineStats();
		GAME.uploadMatch(TIME);
	});
};
