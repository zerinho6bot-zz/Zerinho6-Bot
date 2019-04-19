const Fs = require("fs");
module.exports = {
	/**
	* @function
	* @param {string} path - The path to the file(Do only one dot, it starts from the main folder)
	* @param {string} content - The content of the file with the new changes
	* @returns {boolean}
	*/
	write: function(path, content) {
		Fs.writeFile(path, JSON.stringify(content, null, 4), (error) => {
			if (error) {
				console.log(error);
			}

			delete require.cache[require.resolve(`.${path}`)];
		});
		return true;
	}
};