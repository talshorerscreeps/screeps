module.exports.name = "worker";

var doUpgradeStep = function(creep) {
	if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
		creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
	}
}

if (Memory.sourceHarvesterCount === undefined)
	Memory.sourceHarvesterCount = {};

var common = require("common");

var stateSpawn = require("state.spawn");
var stateHarvest = require("state.harvest");
var stateUpgrade = require("state.upgrade");
var stateIdle = require("state.idle");

var states = [
	stateSpawn,
	stateHarvest,
	stateUpgrade,
	stateIdle,
];

module.exports.setup = function(creep) {
	console.log("setup", module.exports.name);
	common.creepEnterState(creep, stateSpawn);
}

module.exports.cleanup = function(memory) {
	console.log("cleanup", module.exports.name);
	common.getByName(states, memory.state).cleanup(memory);
}

var done = function(creep) {
	common.getByName(states, creep.memory.state).cleanup(creep.memory);
	if (common.creepInState(creep, stateSpawn)) {
		common.creepEnterState(creep, stateHarvest);
	} else if (common.creepInState(creep, stateHarvest)) {
		common.creepEnterState(creep, stateUpgrade);
	} else if (common.creepInState(creep, stateUpgrade)) {
		common.creepEnterState(creep, stateHarvest);
	}
}

module.exports.run = function (creep) {
	creep.say(creep.memory.state);
	common.getByName(states, creep.memory.state).run(creep, done);
}
