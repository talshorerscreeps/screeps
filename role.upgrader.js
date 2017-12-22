module.exports.build = function(energyCapacityAvailable) {
	return require("common").largeBody(
		[MOVE, CARRY, WORK], energyCapacityAvailable, 2);
}

module.exports.next = function(creep) {
	if (creep.carry.energy == 0)
		return "harvest";
	else
		return "upgrade";
}
