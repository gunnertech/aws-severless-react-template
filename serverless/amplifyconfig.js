const fs = require('fs');


module.exports.env = () => {
  const contents = fs.readFileSync('../amplify/src/aws-exports.js', 'utf8').split(/\r|\n/)
    .map(line => line.trim())
    .filter(line =>
      !!line.startsWith('"') && !!line.match(/:/)
    )
    .map(line => line.replace(/,$/, ""))
    .join(",")
  return JSON.parse('{' + contents + '}');
}