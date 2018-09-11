'use strict';

var Constants = {};

Constants.COINS = {
  BTC: 'btc',
  BCH: 'bch',
  SAFE: 'safe',
  BTCZ: 'btcz',
  ZCL: 'zcl',
  ANON: 'anon',
  ZEL: 'zel',
  RVN: 'rvn',
  LTC: 'ltc',
};

Constants.NETWORKS = {
  LIVENET: 'livenet'
//  TESTNET: 'testnet',
};

Constants.ADDRESS_FORMATS = ['copay', 'cashaddr', 'legacy', 'safeaddr', 'zcladdr', 'anonaddr', 'zeladdr', 'rvnaddr', 'btczaddr', 'ltcaddr'];

Constants.SCRIPT_TYPES = {
  P2SH: 'P2SH',
  P2PKH: 'P2PKH',
};
Constants.DERIVATION_STRATEGIES = {
  BIP44: 'BIP44',
  BIP45: 'BIP45',
};

Constants.PATHS = {
  REQUEST_KEY_BTC: "m/1'/0",
  REQUEST_KEY_BCH: "m/1'/0",
  REQUEST_KEY_BTCZ: "m/1'/0",
  REQUEST_KEY_ZEL: "m/1'/0",
  REQUEST_KEY_LTC: "m/1'/2",
  REQUEST_KEY_ZCL: "m/1'/147",
  REQUEST_KEY_ANON: "m/1'/0",
  REQUEST_KEY_RVN: "m/1'/175",
  REQUEST_KEY_SAFE: "m/1'/19165",
  TXPROPOSAL_KEY: "m/1'/1",
  REQUEST_KEY_AUTH: "m/2", // relative to BASE
};

Constants.BIP45_SHARED_INDEX = 0x80000000 - 1;

module.exports = Constants;
