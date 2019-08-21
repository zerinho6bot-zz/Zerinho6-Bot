const Emojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];
const { MessageUtils, StorageUtils } = require("../Utils");
const MatchId = Date.now().toString(36);
const { TictactoeMatchs, TictactoeProfiles } = require("../local_storage");
const PlayersPlaying = new Set();

exports.run = async function({ message, t, zSend, zEmbed, zSendAsync }) {
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

		/**
		 * @function
		 * @returns {string}
		 */
		draw() {
			let mapString = "";

			for (let i = 0; i < this.map.length; i++) {
				const ActualHouse = this.map[i];

				mapString += ActualHouse === 0 ? Emojis[i] : ActualHouse === 1 ? this.player1.emoji : this.player2.emoji;
				mapString += (i === 2 || i === 5 || i === 8) ? "\n" : " | ";
			}

			return mapString;
		}

		/**
		 * @function
		 * @returns {number}
		 */
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

		/**
		 * @function
		 * @param {number} playerN - The player number.
		 * @returns {string}
		 */
		getMatchResult(playerN){
			if (this.winner === 3) {
				return t("tictactoe:draw");
			}

			return this.winner === playerN ? t("tictactoe:winner") : t("tictactoe:loser");
		}

		/**
		 * @function
		 * @param {Array<string>} house - The array of 9 elements where everything inside it is a number.
		 * @returns {boolean}
		 */
		play(house) {
			if (this.map[house] !== 0) {
				return false;
			}

			const TurnEqualsX = this.turn === this.x;

			TurnEqualsX ? this.player1.moves = this.player1.moves.concat(house + 1) : this.player2.moves = this.player2.moves.concat(house + 1);
			this.map[house] = TurnEqualsX ? 1 : 2;
			this.turn = TurnEqualsX ? this.o : this.x;
			this.description = `${TurnEqualsX ? this.player1.emoji : this.player2.emoji} ${t("tictactoe:turn")} (${this.turn === this.x ? this.player1.tag : this.player2.tag}).\n\n${this.draw()}`;

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

		/**
		 * Updates the player stats on local_storage/tictactoe-profiles.json
		 * @function
		 */
		updatePlayersOnlineStats() {
			for(let i = 0; i < this.players.length; i++) {
				const Player = this.players[i];

				if(!TictactoeProfiles[Player.id]) {
					TictactoeProfiles[Player.id] = {
						tag: "",
						wins: 0,
						loses: 0,
						matchs: 0,
						draws: 0
					};
				}

				const ActualPlayer = TictactoeProfiles[Player.id];
				ActualPlayer.tag = Player.tag;
				ActualPlayer.matchs++;
				ActualPlayer.wins = this.winner === i + 1 ? ActualPlayer.wins + 1 : ActualPlayer.wins;
				ActualPlayer.loses = this.winner !== i + 1 ? ActualPlayer.loses + 1 : ActualPlayer.loses;
				ActualPlayer.draws = this.winner === 3 ? ActualPlayer.draws + 1 : ActualPlayer.draws;
				StorageUtils.write("./local_storage/tictactoe-profiles.json", TictactoeProfiles);
			}
		}

		/**
		 * Saves the match in local_storage/tictactoe-matchs.json
		 * @function
		 * @param {number} time - How much the match has gone in seconds
		 */
		uploadMatch(time){
			TictactoeMatchs[MatchId] = {
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

			const Match = TictactoeMatchs[MatchId];
			Match.time = time;
			Match.map = this.map;
			Match.p1.moves = this.player1.moves;
			Match.p2.moves = this.player2.moves;
			Match.p1.tag = this.player1.tag;
			Match.p2.tag = this.player2.tag;
			Match.winner = this.winner;
			StorageUtils.write("./local_storage/tictactoe-matchs.json", TictactoeMatchs);
		}

		/**
		* This function checks if the (number related) player have a username or nickname of zerinho6 for p1 or topera for p2.
		* @function
		* @param {number} n - The number related to the player(1 or 2(It can actually be anything else than 1 😄))
		* @returns {boolean}
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

	const Game = new TicTacToe(message.author, message.mentions.users.first());
	
	PlayersPlaying.add(message.author.id);
	PlayersPlaying.add(message.mentions.members.first().id);

	zEmbed.setDescription(Game.description);

	const Msg = await zSendAsync(zEmbed);
	console.log(Msg)
	if (Game.checkIfPlayerActivesEasterEgg(1)) {
		Game.zerinho = true;
		Game.player1.emoji = "<:zerinicon:317871174266912768>";
	}

	if (Game.checkIfPlayerActivesEasterEgg(2)) {
		Game.topera = true;
		Game.player2.emoji = "<:Toperaicon:317871116934840321>";
	}

	if (Game.zerinho && Game.topera) {
		Game.secret = true;
	}

	for (let i = 0; i < Emojis.length; i++) {
		await Msg.react(Emojis[i]);
	}

	const Collection = Msg.createReactionCollector((r, u) => r.emoji.name === r.emoji.name && !u.bot, {time: 300000});
	Collection.on("collect", (r) => {
		if (r.users.last().id !== Game.turn) {
			return;
		}

		r.users.forEach((u) => {
			r.remove(u);
		});

		if (Game.play(Emojis.indexOf(r.emoji.name))) {
			Collection.stop();
		}

		zEmbed.setDescription(Game.description);
		Msg.edit(zEmbed);
	});

	Collection.on("end", () => {
		PlayersPlaying.add(message.author.id);
		PlayersPlaying.add(message.mentions.members.first().id);
		
		if (!Game.finished) {
			zSend("tictactoe:timeExpired", true);
			return;
		}

		const ResultEmbed = MessageUtils.zerinhoEmbed(message.member);
		const Time = Math.floor((new Date() - Game.time) / 1000);
		const Players = Game.players;

		ResultEmbed.setTitle(t("tictactoe:results"));
		ResultEmbed.setDescription(`${t("tictactoe:theMatchTaken.part1")} ${Time} ${t("tictactoe:theMatchTaken.part2")}.${Game.secret ? "\n\nWith the love of zerinho6 and topera\n<:zerinicon:317871174266912768> :heart: <:Toperaicon:317871116934840321>" : ""}`);
		ResultEmbed.setFooter(`${t("tictactoe:matchCode")}: ${MatchId}`);
		
		for (let i = 0; i < 2; i++) {
			ResultEmbed.addField(Players[i].tag, `${t("tictactoe:matchResult")}: ${Game.getMatchResult(i + 1)}\n${t("tictactoe:moves")}: ${Players[i].moves.join(", ")}`);
		}

		zSend(ResultEmbed);
		Game.updatePlayersOnlineStats();
		Game.uploadMatch(Time);
	});
};
