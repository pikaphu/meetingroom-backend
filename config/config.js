// 1. requires
const _ = require('lodash'); // _ helper for arrays, etc... like _.merge

// 2. check app running environment
if (process.env.NODE_ENV !== 'production') {
    // if not production build then use config from .env file
    require('dotenv').config()
}
// process.env.NODE_ENV = 'development

// 3. load main environment 
const config = require('./config.json'); // get main config file
const defaultConfig = config.development; // set default config to dev
const environment = process.env.NODE_ENV || 'development'; // check which app environment running with NODE_ENV 
const environmentConfig = config[environment]; // select using config from app environment
let finalConfig = _.merge(defaultConfig, environmentConfig); // Now we have default config and loaded config

// 4. load another environment
const dbEnv = 'database.' + environment + '.json'
const dbconfig = require('./' + dbEnv)
finalConfig = _.merge(finalConfig, dbconfig)

// Final. setup config
global.myConfig = finalConfig;

// log global.gConfig
// console.log(`global.gConfig: ${JSON.stringify(global.myConfig, undefined, global.myConfig.json_indentation)}`);