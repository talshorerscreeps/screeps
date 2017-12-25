module.exports.loop = function () {
  if (Memory.units === undefined) {
    require("bootstrap");
  }
  global.Units = {}
  for (var unit of Memory.units)
    Units[unit] = require("unit." + Memory[unit].module);
  for (var unit of Memory.units)
    Units[unit].run(unit);
}
