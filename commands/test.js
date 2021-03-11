module.exports = {
	info: {
		name: "test",
		usage: "test",
		explanation: "Test command",
		permissions: 2
	},
	run: function(client, message, args) {
		var variables = client.variables;
		var functions = client.functions;

		return [ "test1", "test2", "test3" ];
	}
}