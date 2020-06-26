#!/usr/bin/env node

const amplifystage = require("./stage");
const fs = require('fs-extra');
const yaml = require('js-yaml');



const stage = amplifystage.stage();
const contents = fs.readFileSync(`../react-client/.env.${stage}`, 'utf8');
const options = contents.split("\n").reduce((obj, currentValue) => !currentValue.split('=')[0] ? obj : ({
    ...obj,
    [currentValue.split('=')[0]]: currentValue.split('=')[1].replace(/('|")/g,"")
  }),{})

fs.writeFileSync("./resources/hosting.yml", yaml.safeDump(Object.entries(options).map(([key, value]) => ({Name: key, Value: value}) )))
    