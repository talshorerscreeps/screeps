module.exports.setup = function(creep) {
	var targets = creep.room.find(FIND_STRUCTURES, {
		filter: (structure) => {
			return structure.energy < structure.energyCapacity &&
				(structure.structureType == STRUCTURE_EXTENSION ||
				structure.structureType == STRUCTURE_SPAWN ||
				structure.structureType == STRUCTURE_TOWER);
		}
	});
	if (targets.length > 0)
		creep.memory.target = targets[0].id;
	else
		return true;
}

module.exports.cleanup = function(memory) {
	memory.target = undefined;
}

module.exports.run = function(creep) {
	if (creep.carry.energy == 0) {
		return true;
	} else {
		target = Game.getObjectById(creep.memory.target);
		if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			creep.moveTo(target, {
				visualizePathStyle: {stroke: '#ffffff'},
			});
		} else {
			return true;
		}
	}
}
