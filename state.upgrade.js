module.exports.setup = function(creep) {
}

module.exports.cleanup = function(memory) {
}

module.exports.run = function(creep) {
	if (creep.carry.energy == 0) {
		return true;
	} else if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
		creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
	}
}
