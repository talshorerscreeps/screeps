module.exports.build = function(energyCapacityAvailable) {
	return require("common").largeBody(
		[MOVE, CARRY, WORK], energyCapacityAvailable);
}

module.exports.next = function(creep) {
	if (creep.carry.energy == 0)
		return "harvest";
	else if (creep.memory.state == "harvest")
		return "charge";
	else if (creep.memory.state == "charge")
		return "build";
	else if (creep.memory.state == "build")
		return "upgrade";
}
