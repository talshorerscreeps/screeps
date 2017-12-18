module.exports.getByName = function(arr, name) {
	for (var idx in arr) {
		var val = arr[idx];
		if (name == val.name) {
			return val;
		}
	}
	return undefined;
}

module.exports.creepInState = function(creep, state) {
	return creep.memory.state == state.name;
}

module.exports.creepEnterState = function(creep, state, done) {
	console.log(creep.name, creep.memory.state, "->", state.name);
	creep.memory.state = state.name;
	state.setup(creep);
	state.run(creep, done);
}

if (Memory.refCount === undefined)
	Memory.refCount = {};

module.exports.refCount = function(id) {
	if (Memory.refCount[id] === undefined)
		Memory.refCount[id] = 0;
	return Memory.refCount[id];
}

module.exports.ref = function(id) {
	if (Memory.refCount[id] === undefined)
		Memory.refCount[id] = 1;
	else
		Memory.refCount[id]++;
}

module.exports.deref = function(id) {
	Memory.refCount[id]--;
}
