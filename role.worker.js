module.exports.name = "worker";

var common = require("common");

var stateSpawn = require("state.spawn");
var stateHarvest = require("state.harvest");
var stateUpgrade = require("state.upgrade");
var stateCharge = require("state.charge");
var stateBuild = require("state.build");
var stateIdle = require("state.idle");

var states = [
	stateSpawn,
	stateHarvest,
	stateUpgrade,
	stateCharge,
	stateBuild,
	stateIdle,
];

var done = function(creep) {
	common.getByName(states, creep.memory.state).cleanup(creep.memory);
	var newState;
	if (creep.carry.energy == 0) {
		newState = stateHarvest;
	} else if (common.creepInState(creep, stateHarvest)) {
		newState = stateCharge;
	} else if (common.creepInState(creep, stateCharge)) {
		newState = stateBuild;
	} else if (common.creepInState(creep, stateBuild)) {
		newState = stateUpgrade;
	}
	common.creepEnterState(creep, newState, done);
}

module.exports.setup = function(creep) {
	console.log("setup", module.exports.name);
	common.creepEnterState(creep, stateSpawn, done);
}

module.exports.cleanup = function(memory) {
	console.log("cleanup", module.exports.name);
	common.getByName(states, memory.state).cleanup(memory);
}

module.exports.run = function (creep) {
	creep.say(creep.saying);
	common.getByName(states, creep.memory.state).run(creep, done);
}
