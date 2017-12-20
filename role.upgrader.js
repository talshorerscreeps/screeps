module.exports.name = "upgrader";

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

var done = function(creep) {
	common.getByName(states, creep.memory.state).cleanup(creep.memory);
	var newState;
	if (creep.carry.energy == 0)
		newState = stateHarvest;
	else
		newState = stateUpgrade;
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
