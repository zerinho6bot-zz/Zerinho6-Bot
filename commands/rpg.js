const EMOJIS = {
	dagger: "🗡",
	crossedSword: "⚔",
	shield: "🛡",
	candle: "🕯",
	candy: "🍬",
	"nauseated_face": "🤢"
};
const EMOJIS_ARR = ["🗡", "🛡", "🕯", "🍬", "🤢"]; //Order: Dagger, shield, candle, candy and nauseated_face.
const PlayersPlaying = new Set();
exports.run = async ({ bot, message, t, zSend }) => {
	class ZeroBattle {
		constructor(p1, p2) {
			this.p1 = {
				name: p1.username,
				hp: 200,
				wasPlayerDamagedLastTurn: false,
				wasPlayerHealedLastTurn: false,
				effects: [],
				icon: "<:zerinicon:317871174266912768>",
				userObject: p1,
				damageBlocked: 0,
				damageDealt: 0,
				damageDealtFromNausea: 0,
				actionsLog: {
					dagger: 0,
					shield: 0,
					candle: 0,
					candy: 0,
					"nauseated_face": 0
				},
				actions: {
					dagger: 1,
					shield: 0,
					candle: 0,
					candy: 0,
					"nauseated_face": 0
				}
			};
			this.p2 = {
				name: p2.username,
				hp: 200,
				wasPlayerDamagedLastTurn: false,
				PlayerNoticedDamage: false,
				wasPlayerHealedLastTurn: false,
				PlayerNoticedHeal: false,
				effects: [],
				icon: "<:Toperaicon:317871116934840321>",
				userObject: p2,
				damageBlocked: 0,
				damageDealt: 0,
				damageDealtFromNausea: 0,
				actionsLog: {
					dagger: 0,
					shield: 0,
					candle: 0,
					candy: 0,
					"nauseated_face": 0
				},
				actions: {
					dagger: 0,
					shield: 0,
					candle: 0,
					candy: 0,
					"nauseated_face": 0
				}
			};
			this.history = [];
			this.Playerturn = this.p1;
			this.turn = this.Playerturn.userObject.id;
			this.winner = null;
		}

		passTurn() {
			if (this.Playerturn.PlayerNoticedDamage) {
				this.Playerturn.PlayerNoticedDamage = false;
				this.Playerturn.wasPlayerDamagedLastTurn = false;
			}

			if (this.Playerturn.PlayerNoticedHeal) {
				this.Playerturn.PlayerNoticedHeal = false;
				this.Playerturn.wasPlayerHealedLastTurn = false;
			}

			this.Playerturn.PlayerNoticedDamage = this.Playerturn.wasPlayerDamagedLastTurn;
			this.Playerturn.PlayerNoticedHeal = this.Playerturn.wasPlayerHealedLastTurn;
			this.Playerturn = this.turn === this.p1.userObject.id ? this.p2 : this.p1;
			this.turn = this.Playerturn.userObject.id;
			this.tickEffects(this.Playerturn);

			// update the actions cooldowns
			const Keys = Object.keys(this.Playerturn.actions);
			for (let i = 0; i < Keys.length; i++) {
				let action = this.Playerturn.actions[Keys[i]];
				this.Playerturn.actions[Keys[i]] = action === 0 ? action : action - 1;
			}

			if (this.Playerturn.actions.shield === 1 && this.Playerturn.effects.includes("shield")) {
				this.Playerturn.effects = this.Playerturn.effects.filter((name) => name !== "shield");
			}
		}

		isActionAvailable(action) {
			if (this.Playerturn.actions[action] !== 0) {
				message.channel.send(`${this.Playerturn.name}, ${t("rpg:thatActionStillOnCooldown")}.`).then((msg) => {
					try {
						setTimeout(() => {
							msg.delete();
						}, 3000);
					} catch (e) {
						console.log(e);
					}
				});
				return false;
			}
			return true;
		}

		addHistory(action) {
			if (this.history.length === 5) {
				this.history.shift();
			}
			this.history.push(`${this.Playerturn.icon}${EMOJIS[action]}`);
		}

		addToPlayerHistory(player, action) {
			player.actionsLog[action]++;
		}

		tickEffects(player) {

			if (player.effects.length === 0) {
				return;
			}

			for (let i = 0; i < player.effects.length; i++) {
				switch (player.effects[i]) {
					case "nauseated_face":
					player.hp -= 6;
					player.wasPlayerDamagedLastTurn = true;
					if (this.turn === this.p1.userObject) {
						this.p2.damageDealtFromNausea += 6;
					} else {
						this.p1.damageDealtFromNausea += 6;
					}
					break;
				}
			}
		}

		putActionOnCooldown(action) {
			this.Playerturn.actions[action] = 3;
		}

		act(action) {
			if (!this.isActionAvailable(action)) {
				return false;
			}

			const TARGET = this.turn === this.p1.userObject.id ? this.p2 : this.p1;
			const actions = {
				"dagger": 30,
				"candle": 15
			};
			const DAMAGE = actions[action];

			switch (action) {
				case "dagger":
				if (TARGET.effects.includes("shield")) {
					const DAMAGE_WEAK = DAMAGE / 2;
					const DAMAGE_SUPERWEAK = DAMAGE / 3;

					TARGET.hp -= DAMAGE_WEAK;
					TARGET.damageBlocked += DAMAGE_WEAK;
					TARGET.effects = TARGET.effects.filter((name) => name !== "shield");
					TARGET.wasPlayerDamagedLastTurn = true;
					TARGET.damageDealt += DAMAGE_SUPERWEAK;
					this.Playerturn.hp -= DAMAGE_SUPERWEAK;
					this.Playerturn.wasPlayerDamagedLastTurn = true;
					this.Playerturn.damageDealt += DAMAGE_WEAK;
				} else {
					TARGET.hp -= DAMAGE;
					TARGET.wasPlayerDamagedLastTurn = true;
					this.Playerturn.damageDealt += DAMAGE;
				}
				break;
				case "candle":
				TARGET.wasPlayerDamagedLastTurn = true;
				TARGET.hp -= DAMAGE;
				break;
				case "nauseated_face":
				TARGET.effects.push("nauseated_face");
				break;
				case "shield":
				this.Playerturn.effects.push("shield");
				break;
				case "candy":
				if (this.Playerturn.effects.includes("nauseated_face")) {
					this.Playerturn.effects = this.Playerturn.effects.filter((name) => name !== "nauseated_face");
				}
				this.Playerturn.hp = (this.Playerturn.hp + 20) > 200 ? 200 : this.Playerturn.hp + 20;
				this.Playerturn.wasPlayerHealedLastTurn = true;
				break; 
			}

			this.putActionOnCooldown(action);
			this.addHistory(action);
			this.addToPlayerHistory(this.Playerturn, action);

			if (0 >= TARGET.hp) {
				this.winner = this.turn;
				return true;
			}
			this.passTurn();
			return false;
		}

		draw() {

			function displayActions(player) {
				const Keys = Object.keys(player.actions);
				const Values = Object.values(player.actions);
				let stringToDisplay = "";

				for (let i = 0; i < Keys.length; i++) {
					stringToDisplay += ` -${t("rpg:" + Keys[i])}: ${Values[i]}${Values[i] === 0 ? "" : ":x:"}\n`;
				}

				return stringToDisplay;
			}

			function displayEffects(player) {
				if (player.effects.length === 0) {
					return "";
				}

				let stringOfEffectsIcons = "";
				const ICONS = {
					shield: "🛡",
					"nauseated_face": "🤢"
				};

				player.effects.forEach((e) => {
					stringOfEffectsIcons += ICONS[e];
				});

				return stringOfEffectsIcons;
			}

			function displayHealth(player) {
				let healthString = "";

				if (player.wasPlayerHealedLastTurn) {
					healthString = `**${player.hp}**`;
				} else if (player.wasPlayerDamagedLastTurn) {
					healthString = `_${player.hp}_`;
				} else {
					healthString = player.hp;
				}

				return healthString;
			}

			function displayStats(player) {
				return `${player.name}\n${t("rpg:hp")}: ${displayHealth(player)} ${displayEffects(player)}\n${t("rpg:actions")}:\n${displayActions(player)}`;
			}

			const ANNOUNCER = `     ----- ${t("rpg:turnOf")} ${this.Playerturn.name} -----`;
			// A emoji is equal to like, 3 characters, that's why we do this  \/
			const BANNER = `${ANNOUNCER}\n${" ".repeat((ANNOUNCER.length / 2) - 3)}${this.p1.icon} ${EMOJIS["crossedSword"]} ${this.p2.icon}`;

			return `${BANNER}\n\n${displayStats(this.p1)}\n\n${displayStats(this.p2)}\n\n${this.history.length > 0 ? `${t("rpg:history")}: ${this.history.join(", ")}` : ""}`;
		}

		//Game Over
		drawResults() {

			function getActionTimesUsedFromPlayer(player) {
				const Keys = Object.keys(player.actionsLog);
				const Values = Object.values(player.actionsLog);
				let stringWithKeysAndValues = "";

				for (let i = 0; i < Keys.length; i++) {
					stringWithKeysAndValues += ` -${t("rpg:" + Keys[i])}: ${Values[i]} ${t("rpg:time(s)")}\n`;
				}

				return stringWithKeysAndValues;
			}

			function getDamageAndHealedHistoryFromPlayer(player) {
				return ` -${t("rpg:damageDealt(DaggerAndShield)")}: ${player.damageDealt}\n -${t("rpg:damageDealtFromNausea")}: ${player.damageDealtFromNausea}\n -${t("rpg:damageDealtFromCandle")}: ${15 * player.actionsLog.candle}\n -${t("rpg:damageBlocked")}: ${player.damageBlocked}\n -${t("rpg:healthRestored")}: ${20 * player.actionsLog.candy}`;
			}

			function getResultsFromPlayer(player) {
				return `${player.name}\nHp: ${player.hp}\n${t("rpg:timesThatYouUsedEachAction")}:\n${getActionTimesUsedFromPlayer(player)}\n${t("rpg:damageDealtAndRestoredHistory")}:\n${getDamageAndHealedHistoryFromPlayer(player)}`;
			}
			return `${t("rpg:history")}: ${this.history.join(", ")}\n\n     ${t("tictactoe:winner")}: ${this.winner === this.p1.userObject.id ? this.p1.name : this.winner === this.p2.userObject.id ? this.p2.name: t("rpg:noOne")}\n\n${getResultsFromPlayer(this.p1)}\n\n${getResultsFromPlayer(this.p2)}`;
		}
	}

	if (message.mentions.members.first().id === message.author.id) {
		zSend("tictactoe:selfMention", true);
		return;
	}

	if (message.mentions.members.first().bot) {
		zSend("tictactoe:botMention", true);
	}

	if (PlayersPlaying.has(message.author.id) || PlayersPlaying.has(message.mentions.members.first().id)) {
		zSend("tictactoe:oneOfThePlayersIsAlreadyPlaying", true);
		return;
	}

	const GAME = new ZeroBattle(message.author, message.mentions.users.first());

	PlayersPlaying.add(message.author.id);
	PlayersPlaying.add(message.mentions.members.first().id);

	const MSG = await message.channel.send(GAME.draw());

	for (let i = 0; i < EMOJIS_ARR.length; i++) {
		await MSG.react(EMOJIS_ARR[i]);
	}

	const COLLECTION = MSG.createReactionCollector((r, u) => EMOJIS_ARR.includes(r.emoji.name) && !u.bot, {time: 300000});

	function getActionName(emoji) {
		switch(emoji) {
			case "🗡":
			return "dagger";

			case "🕯":
			return "candle";

			case "🤢":
			return "nauseated_face";

			case "🛡":
			return "shield";

			case "🍬":
			return "candy";

			default:
			return;

		}
	}

	COLLECTION.on("collect", (r) => {
		if (r.users.last().id !== GAME.turn) {
			return;
		}

		if (GAME.act(getActionName(r.emoji.name))) {
			COLLECTION.stop();
		} else {
			MSG.edit(GAME.draw());
		}

		r.users.forEach((u) => {
			if (u.id !== bot.user.id) {
				r.remove(u);
			}
		});
	});

	COLLECTION.on("end", () => {
		PlayersPlaying.delete(message.author.id);
		PlayersPlaying.delete(message.mentions.members.first().id);
		if (GAME.winner === null) {
			zSend("tictactoe:timeExpired", true);
		}

		MSG.edit(GAME.drawResults());
	});
};
