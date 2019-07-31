module.exports = {
	/**
	* @async
	* @function
	* @param {object} bot - The Discord bot instance.
	* @param {string} id - The id of the user that will be searched.
	* @returns {object}
	*/
	searchUser: async function(bot, id) { 
		try {
			const FindUser = await bot.fetchUser(id);
			return FindUser || null; 
		} catch (e) {
			return null;
		}
	}
};