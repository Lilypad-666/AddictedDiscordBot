const jsonEditor = require("edit-json-file");

module.exports = function(key, value) {
	var file = jsonEditor("./config.json");
	file.set(key, value);
	file.save();
}