module.exports.name = "upgrade";

if (Memory.sourceHarvesterCount === undefined)
	Memory.sourceHarvesterCount = {};

module.exports.setup = function(creep) {
}

module.exports.cleanup = function(memory) {
}

module.exports.run = function(creep, done) {
	if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
		creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
	}
	if (creep.carry.energy == 0)
		done(creep);
}
