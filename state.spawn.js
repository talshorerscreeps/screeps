module.exports.name = "spawn";

module.exports.setup = function(creep) {
}

module.exports.cleanup = function(memory) {
}

module.exports.run = function(creep, done) {
	if (!creep.spawning)
		done(creep);
}
