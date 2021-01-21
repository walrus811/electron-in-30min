const { app } = require('electron');
const APP_NAME = "filterc"
exports.DEFAULT_PATH = require("path").join(require("os").homedir(), APP_NAME);
exports.DEFAULT_OUTPUT_PATH = require("path").join(require("os").homedir(), APP_NAME, "output");
exports.DEFAULT_JOB_LIST = require("path").join(require("os").homedir(), APP_NAME, "job");
exports.DEFAULT_JOB_LIST_FILE = require("path").join(require("os").homedir(), APP_NAME, "job", "job.json");