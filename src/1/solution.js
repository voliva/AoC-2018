
module.exports = inputLines => {
  return inputLines.reduce((acc, line) => acc + parseInt(line), 0);;
};
