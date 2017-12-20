module.exports.next = function(creep) {
	if (creep.carry.energy == 0)
		return "harvest";
	else
		return "upgrade";
}
