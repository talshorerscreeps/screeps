module.exports.name = "upgrade";

module.exports.setup = function(creep) {
}

module.exports.cleanup = function(memory) {
}

module.exports.run = function(creep, done) {
	if (creep.carry.energy == 0) {
		done(creep);
	} else if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
		creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
	}
}
