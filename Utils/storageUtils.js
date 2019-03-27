const Fs = require("fs");

module.exports = {
	write: function(path, content) {
		Fs.writeFile(path, JSON.stringify(content, null, 4), (error) => {
			if (error) {
				console.log(error);
				console.log("What the fuck, log the fucking error");
				return false;
			}

			delete require.cache[require.resolve(`.${path}`)];
		});
		return true;
	}
}