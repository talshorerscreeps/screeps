module.exports.setup = function(creep) {
	var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
		filter: (structure) => (
			structure.energy != 0 &&
			(structure.structureType == STRUCTURE_EXTENSION ||
			structure.structureType == STRUCTURE_SPAWN)
	)});
	if (target === null)
		return true;
	else
		creep.memory.target = target.id;
}

module.exports.cleanup = function(memory) {
	memory.target = undefined;
}

module.exports.run = function(creep) {
	if (creep.carry.energy == creep.carryCapacity) {
		return true;
	} else {
		var target = Game.getObjectById(creep.memory.target);
		if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
			creep.moveTo(target, {
				visualizePathStyle: {stroke: '#ffffff'},
			});
		else
			return this.setup(creep);
	}
}
