const mongoose = require('mongoose');

const User = require('../common/User');
const System = require('../common/System');
const RRPair = require('./RRPair');
const constants = require('../../lib/util/constants');

const serviceSchema = new mongoose.Schema({
  sut: {
    type: System.schema,
    required: [true, constants.REQUIRED_SUT_ERR]
  },
  user: User.schema,
  name: { 
    type: String,
    required: [true, constants.REQUIRED_SERVICE_NAME_ERR],
    index: true
  },
  type: {
    type: String,
    required: [true, constants.REQUIRED_SERVICE_TYPE_ERR]
  },
  basePath: { 
    type: String,
    required: [true, constants.REQUIRED_BASEPATH_ERR],
    index: true
  },
  matchTemplates: [mongoose.Schema.Types.Mixed],
  rrpairs: {
    type: [RRPair.schema],
    required: [true, constants.REQUIRED_RRPAIRS_ERR]
  },
  delay: {
    // force integer only
    type: Number,
    default: 0,
    validate: {
      validator: function (v) {
        if (Number.isInteger(v) && v >= 0)
          return true;
          else return false;
      },
      message: '{VALUE}'+constants.NOT_VALID_INTEGER+'({PATH}).'
    }
  },
  delayMax: {
    // force integer only
    type: Number,
    default: 0,
    validate: {
      validator: function (v) {
        if (Number.isInteger(v) && v >= 0)
          return true;
          else return false;
      },
      message: '{VALUE}'+constants.NOT_VALID_INTEGER+'({PATH}).'
    }
  },
  txnCount: {
    type: Number,
    default: 0,
    get: function(v) { return Math.round(v); },
    set: function(v) { return Math.round(v); }
  },
  running: {
    type: Boolean,
    default: true
  },
  lastUpdateUser:{
    type: User.schema
  }, liveInvocation: {
    enabled: Boolean,
    liveFirst: {
      type: Boolean,
      required: [function () {
                  return this.liveInvocation.enabled;
                },
                constants.LIVE_OR_VIRTUAL_NOT_ERR
                ]
    },
    remoteHost: {
      type: String,
      required: [function () {
                  return this.liveInvocation.enabled;
                },
                constants.REMOTE_HOST_NOT_ERR
                ]
    },
    remotePort: {
      type: Number,
      required: [function () {
                  return this.liveInvocation.enabled;
                },
                constants.REMOTE_PORT_NOT_ERR
                ]
    },
    remoteBasePath: String,
    failStatusCodes: [Number],
    failStrings: [String],
    ssl: Boolean
  }
},{timestamps:{createdAt:'createdAt',updatedAt:'updatedAt'}});

serviceSchema.set('usePushEach', true);
module.exports = mongoose.model('Service', serviceSchema);