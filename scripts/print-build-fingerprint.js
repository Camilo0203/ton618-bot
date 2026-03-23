"use strict";

const { getBuildInfo } = require("../src/utils/buildInfo");

const info = getBuildInfo();
console.log(info.fingerprint);
