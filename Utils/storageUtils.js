const Fs = require("fs");
const { guildStats, guildWantingStats } = require("../local_storage");

module.exports = {
	/**
	* @function
	* @param {string} path - The path to the file.(Do only one dot, it starts from the main folder)
	* @param {string} content - The content of the file with the new changes.
	* @returns {boolean}
	*/
	write: function (path, content) {
		Fs.writeFile(path, JSON.stringify(content, null, 4), (error) => {
			if (error) {
				console.log(error);
			}

			try {
				delete require.cache[require.resolve(`.${path}`)];
			} catch (e) {
				console.log(e);
			}
		});
		return true;
	},
	/** 
	 * This class contains function to check if there's server data(members, roles and channels count) by year/month.
	 * @class
	 * @param {object} data
	 * @param {object} bot - The Discord bot instance.
	 */
	ServerStats: class {
		constructor(data, bot) {
			this.data = data;
			this.date = new Date();
			this.bot = bot;
			this.currentDay = this.date.getDate();
			this.currentYear = this.date.getFullYear();
			this.currentMonth = this.date.getMonth();
		}

		/**
		 * Returns a string with the actual member count, the difference since the last data and a status icon.
		 * @function
		 * @param {object} year - The year key.
		 * @param {(string|number)} month - The month related number.(0 to 11)
		 * @returns {object} 
		 */
		getDataFromMonth(year, month) {
			return year[month];
		}

		/**
		 * Returns a list of with month related number as keys.
		 * @function
		 * @param {(string|number)} id
		 * @param {(string|number)} year - The year number.
		 * @returns {object}
		 */
		getDataFromYear(id, year) {
			return this.data[id][year];
		}

		getDataFromServer(id) {
			return this.data[id];
		}

		/**
		 * Checks if there's data in x month from x year.
		 * @function
		 * @param {(string|number)} id
		 * @param {(string|number)} year - The year number. 
		 * @param {(string|number)} month - The month related number.(0 to 11)
		 * @returns {boolean}
		 */
		isComparationFromMonthAvailable(id, year, month) {
			if (!this.data[id][year]) {
				return false;
			}

			if (!this.data[id][year][month]) {
				return false;
			}
			return true;
		}

		/**
		 * Returns a discord emoji related with the diffence.
		 * @function
		 * @param {number} difference - Any number.
		 * @returns {string} - chartWithDownWards if negative, noMouth if 0 and chartWithUpdawards if positive.
		 */
		getStatus(difference) {
			return 0 > difference ? ":chart_with_upwards_trend:" : difference === 0 ? ":no_mouth:" : ":chart_with_downwards_trend:";
		}

		/**
		 * Returns the gain since the oldData.
		 * @function
		 * @param {number} oldData
		 * @param {number} newData
		 * @returns {number}
		 */
		getDifference(oldData, newData) {
			const DataDifference = newData - oldData;

			return DataDifference;
		}
		/**
		 * Check if guild wants stats.
		 * @function
		 * @param {(string|number)} id
		 * @returns {boolean} 
		 */
		guildWantsStats(id) {
			if (!guildWantingStats.servers[id]) {
				return false;
			}
			return true;
		}

		/**
		 * Check if guild was already updated this month.
		 * @function
		 * @param {(string|number)} id
		 * @returns {boolean} 
		 */
		isGuildUpdated(id) {
			if (!guildWantingStats[id]) {
				return false;
			}

			if (guildWantingStats[id].lastMonthUpdated !== this.date.getMonth()) {
				return false;
			}
			return true;
		}

		/**
		 * Write the current year inside the id key. (WARNING: IF THE SERVER IS NEW, USE writeServer FIRST!!)
		 * @function
		 * @param {object} key - The data file. 
		 * @param {(string|number)} id
		 * @returns {object} - The key object updated. 
		 */
		writeYear(key, id) {
			key[id][this.currentYear] = {};
			/*
			data {
				"guildId": {

				}
			}
			would become...
			data {
				"guildId": {
					"2019": {

					}
				}
			}
			*/
			return key;
		}

		/**
		 * Write the current month inside the id and current year. (WARNING: IF THE SERVER IS NEW, USE writeYear FIRST!!)
		 * @function
		 * @param {object} key - The data file. 
		 * @param {(string|number)} id
		 * @returns {object} - The key updated.
		 */
		writeMonth(key, id) {
			key[id][this.currentYear][this.currentMonth] = {
				membersCount: 0,
				rolesCount: 0,
				channelsCount: 0
			};
			//Explanation of what it would look like in line 144.
			return key;
		}

		/**
		 * Write the server id as key inside the data file. (It's recommended to not execute those functions, use writeIfNotAvailable, it'll save you time)
		 * @function
		 * @param {object} key - The data file. 
		 * @param {(string|number)} id
		 * @returns {object} - The key updated.
		 */
		writeServer(key, id) {
			key[id] = {};
			return key;
		}

		/**
		 * Check execute/if's needed any write function.(writeServer, writeYear, writeMonth)
		 * @function
		 * @param {(string|number)} id 
		 * @returns {object} - The data file updated
		 */
		writeIfNotAvailable(id) {

			let key = this.data;

			if (!key[id]) {
				key = this.writeServer(key, id);
			}

			if (!key[id][this.currentYear]) {
				key = this.writeYear(key, id);
			}

			if (!key[id][this.currentYear][this.currentMonth]) {
				key = this.writeMonth(key, id);
			}

			return key;
		}

		/**
		 * Update the server stats.(../local_storage/guild_stats.json and guild_wanting_stats.json)
		 * @function
		 * @param {boolean} [caresAboutDay] - If true, it'll check if a update was already made today.
		 */
		updateServersStats(caresAboutDay) {

			if (caresAboutDay) {
				if (this.currentDay === guildWantingStats.setupConfigs.lastDayChecked) {
					return;
				}
			}

			const Servers = guildWantingStats.servers;
			const ServersIds = Object.keys(Servers);
			console.log(ServersIds);
			if (ServersIds.length === 0) {
				return;
			}

			for (let i = 0; i < ServersIds.length; i++) {
				try {
					const Guild = this.bot.guilds.get(ServersIds[i]);
					if (this.isGuildUpdated(Guild.id)) {
						return;
					}

					const CheckedStats = this.writeIfNotAvailable(Guild.id);
					const Property = CheckedStats[Guild.id][this.currentYear][this.currentMonth];

					Property.membersCount = Guild.memberCount;
					Property.rolesCount = Guild.roles.size;
					Property.channelsCount = Guild.channels.size;
					guildWantingStats.servers[Guild.id].lastMonthUpdated = this.currentMonth;
				} catch (e) {
					//The bot's probaly not at the guild anymore.
					delete guildWantingStats.servers[ServersIds[i]];
					delete guildStats[ServersIds[i]];
				}
			}
			
			guildWantingStats.setupConfigs.lastDayChecked = this.currentDay;

			//If there's another way to acess the write function, please tell me.
			const { STORAGE_UTILS } = require("./");
			STORAGE_UTILS.write("./local_storage/guild_stats.json", guildStats);
			STORAGE_UTILS.write("./local_storage/guild_wanting_stats.json", guildWantingStats);
		}
	}
};