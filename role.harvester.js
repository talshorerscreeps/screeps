module.exports.name = "harvester";

var common = require("common");

var doUpgradeStep = function(creep) {
	if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
		creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
	}
}

module.exports.setup = function(creep) {
	console.log("setup", module.exports.name);
}

var unrefSource = function(memory) {
	if (memory.source != undefined) {
		common.deref(memory.source);
		memory.source = undefined;
	}
}

module.exports.cleanup = function(memory) {
	console.log("cleanup", module.exports.name);
	unrefSource(memory);
}

module.exports.run = function (creep) {
	if (creep.memory.upgrading) {
		doUpgradeStep(creep);
		if (creep.carry.energy == 0) {
			creep.memory.upgrading = false;
		}
	} else if (creep.carry.energy < creep.carryCapacity) {
		if (creep.memory.source === undefined) {
			var sources = creep.room.find(FIND_SOURCES);
			var best = sources[0].id;
			for (idx in sources) {
				var id = sources[idx].id;
				if (common.refCount(id) < common.refCount(best))
					best = id;
			}
			creep.memory.source = best;
			common.ref(creep.memory.source);
			Memory.sourceHarvesterCount[creep.memory.source]++;
		}
		var source = Game.getObjectById(creep.memory.source);
		if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
			creep.moveTo(source, {
				visualizePathStyle: {stroke: '#ffaa00'},
			});
		}
	} else {
		unrefSource(creep.memory);
		var targets = creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.energy < structure.energyCapacity &&
					(structure.structureType == STRUCTURE_EXTENSION ||
					structure.structureType == STRUCTURE_SPAWN ||
					structure.structureType == STRUCTURE_TOWER);
			}
		});
		if (targets.length > 0) {
			if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(targets[0], {
					visualizePathStyle: {stroke: '#ffffff'},
				});
			}
		} else {
			creep.memory.upgrading = true;
			doUpgradeStep(creep);
		}
	}
}
