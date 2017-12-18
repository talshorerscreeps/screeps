module.exports.name = "charge";

module.exports.setup = function(creep) {
	var targets = creep.room.find(FIND_STRUCTURES, {
		filter: (structure) => {
			return structure.energy < structure.energyCapacity &&
				(structure.structureType == STRUCTURE_EXTENSION ||
				structure.structureType == STRUCTURE_SPAWN ||
				structure.structureType == STRUCTURE_TOWER);
		}
	});
	if (targets.length > 0) {
		creep.memory.target = targets[0].id;
	}
}

module.exports.cleanup = function(memory) {
	memory.target = undefined;
}

module.exports.run = function(creep, done) {
	if (creep.memory.target === undefined || creep.carry.energy == 0) {
		done(creep);
	} else {
		target = Game.getObjectById(creep.memory.target);
		if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			creep.moveTo(target, {
				visualizePathStyle: {stroke: '#ffffff'},
			});
		} else {
			creep.memory.target = undefined;
		}
	}
}
