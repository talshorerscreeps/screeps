module.exports.totalCost = function(parts) {
	return _.reduce(_.map(parts, a => BODYPART_COST[a]), (a, b) => (a + b));
}
