module.exports = {
	/**
	* @async
	* @function
	* @param {string} id - The id of the user that will be searched
	* @returns {(object|boolean)}
	*/
	searchUser: async function(bot, id) { 
		try {
			const finduser = await bot.users.fetch(id);

			return finduser ? finduser : null; 
		} catch (e) {
			return null;
		}
	}
};