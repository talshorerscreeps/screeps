module.exports.build = function(energyCapacityAvailable) {
	var parts = [MOVE, CARRY, WORK];
	var mult = Math.floor(energyCapacityAvailable /
		require("common").totalCost(parts));
	var ret = [];
	for (var i = 0; i < mult; i++)
		ret = ret.concat(parts);
	return ret;
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
