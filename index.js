require('dotenv').load();

const getRawData = require('./src/get-raw-data');
const splitUpData = require('./src/split-up-data');

async function run() {
  console.log("Pulling raw activity data from Netflix\n---\n");
  await getRawData();
  console.log("\n---\n");
  console.log("Splitting activity per day...");
  await splitUpData();
  console.log(" - Complete")
  console.log("\nNetflix activity data retrived. Please see the output directory");
};

run();
