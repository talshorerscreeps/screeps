module.exports.setup = function(creep) {
}

module.exports.cleanup = function(memory) {
}

module.exports.run = function(creep) {
	return !creep.spawning;
}
