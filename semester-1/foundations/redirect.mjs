const old={algebra:'formulas',trigonometry:'trigonometry',graphs:'graphs',units:'units',logs:'logs'};
const skill=old[location.hash.slice(1)];
location.replace(skill?`/foundations/?skill=${skill}`:'/foundations/');
