if (Memory.refCount === undefined)
	Memory.refCount = {};

module.exports.count = function(id) {
	if (Memory.refCount[id] === undefined)
		return 0;
	return Memory.refCount[id];
}

module.exports.get = function(id) {
	if (Memory.refCount[id] === undefined)
		Memory.refCount[id] = 1;
	else
		Memory.refCount[id]++;
}

module.exports.put = function(id) {
	if (Memory.refCount[id] == 1)
		Memory.refCount[id] = undefined;
	else
		Memory.refCount[id]--;
}
