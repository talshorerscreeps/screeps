module.exports.setup = function(creep) {
	var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
		filter: (structure) => (
			structure.energy < structure.energyCapacity &&
			(structure.structureType == STRUCTURE_EXTENSION ||
			structure.structureType == STRUCTURE_SPAWN ||
			structure.structureType == STRUCTURE_TOWER)
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
	if (creep.carry.energy == 0) {
		return true;
	} else {
		var target = Game.getObjectById(creep.memory.target);
		if (target.energy == target.energyCapacity)
			return this.setup(creep);
		if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
			creep.moveTo(target, {
				visualizePathStyle: {stroke: '#ffffff'},
			});
	}
}
