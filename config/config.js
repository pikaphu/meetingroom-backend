// 1. requires
const _ = require('lodash'); // _ helper for arrays, etc... like _.merge

// 2. check app running environment
if (process.env.NODE_ENV !== 'production') {
    // if not production build then use config from .env file
    require('dotenv').config() // dev, local
}
console.log('Load ENV, OVERRIDE:', process.env.NODE_ENV, process.env.NODE_ENV_OVERRIDE);

// 3. load main environment 
const config = require('./config.json'); // get main config file
const defaultConfig = config.development; // set default config to dev

//console.log(process.env)
const environment = process.env.NODE_ENV || 'development'; // check which app environment running with NODE_ENV 
const environmentConfig = config[environment]; // select using config from app environment
let finalConfig = _.merge(defaultConfig, environmentConfig); // Now we have default config and loaded config

// 4. load another environment
var dbEnv, dbconfig
try {
    // load target env
    dbEnv = 'database.' + environment + '.json'
    dbconfig = require('./' + dbEnv)

} catch (error) {
    // if cannot load file then use default
    console.log('DB Config Error-1! try dev:');
    try {
        dbEnv = 'database.development.json'
        dbconfig = require('./' + dbEnv)
    } catch (error) {
        console.log('DB Config Error-2! none');
    }
}

finalConfig = _.merge(finalConfig, dbconfig)

// Final. setup config
global.myConfig = finalConfig;

// log global.gConfig
// console.log(`global.gConfig: ${JSON.stringify(global.myConfig, undefined, global.myConfig.json_indentation)}`);

// -- Additional config for my machine --
if (process.env.NODE_ENV_OVERRIDE && process.env.NODE_ENV !== 'production') {
    require('./my-override-config.js') // override current config
}