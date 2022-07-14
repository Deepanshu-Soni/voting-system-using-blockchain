const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname,'contracts', 'Election.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');

var input = {
    language: 'Solidity',
    sources: {
      'Election.sol': {
        content: source
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };

var output = JSON.parse(solc.compile(JSON.stringify(input)));

fs.ensureDir(buildPath);

for (var contractName in output.contracts['Election.sol']) {
  fs.outputJSONSync(
      path.resolve(buildPath,contractName+'.json'),
      output.contracts['Election.sol'][contractName]
  )
}