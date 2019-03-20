'use strict';
require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();

var _ = require('lodash');
var $ = require('preconditions').singleton();
var log = require('npmlog');
log.debug = log.verbose;

var Insight = require('./blockchainexplorers/insight');
var Common = require('./common');
var Constants = Common.Constants,
  Defaults = Common.Defaults,
  Utils = Common.Utils;

var PROVIDERS = {
  'insight': {
    'btc': {
      'livenet': [  'https://btc.safc.cc:443', /* 'https://blockexplorer.com:443',*/ 'http://95.216.45.94:3002' ]
//      'testnet': 'https://test-insight.bitpay.com:443',
    },
//    'bch': {
//      'livenet': 'https://bch-insight.bitpay.com:443'
//      'testnet': 'https://test-bch-insight.bitpay.com:443',
//    },
    'safe': {
      'livenet': 'http://safe.safc.cc:3002'
    },
    'btcz': {
      'livenet': 'https://explorer.btcz.rocks:443'
    },
    'rito': {
      'livenet': 'https://rito.safc.cc:443' // 'http://95.216.45.94:3005'
    },
//    'zcl': {
//      'livenet': 'http://95.216.45.94:3007'
//    },
//    'anon': {
//      'livenet': 'http://95.216.45.94:3006'
//    },
    'zel': {
      'livenet': 'https://explorer2.zel.cash:443'
    },
    'zen': {
      'livenet': 'https://explorer.zen-solutions.io:443' // 'https://explorer.zensystem.io:443',
    },
    'rvn': {
      'livenet': 'https://rvn.safc.cc:443'
    },
    'ltc': {
      'livenet': 'https://ltc.safc.cc:443' // 'https://litecoinblockexplorer.nen:443' // 'https://insight.litecore.io:443',
    },
  },
};

function BlockChainExplorer(opts) {
  $.checkArgument(opts);

  var provider = opts.provider || 'insight';
  var coin = opts.coin || Defaults.COIN;
  var network = opts.network || 'livenet';

  $.checkState(PROVIDERS[provider], 'Provider ' + provider + ' not supported');
  $.checkState(_.contains(_.keys(PROVIDERS[provider]), coin), 'Coin ' + coin + ' not supported by this provider');
  $.checkState(_.contains(_.keys(PROVIDERS[provider][coin]), network), 'Network ' + network + ' not supported by this provider for coin ' + coin);

  var url = opts.url || PROVIDERS[provider][coin][network];

  var undf;
  if (coin != 'bch' && opts.addressFormat)
    opts.addressFormat = undf;
//    throw new Error('addressFormat only supported for bch');

  if (coin == 'bch' && !opts.addressFormat)
    opts.addressFormat = 'cashaddr';


  switch (provider) {
    case 'insight':
      return new Insight({
        coin: coin,
        network: network,
        url: url,
        apiPrefix: opts.apiPrefix,
        userAgent: opts.userAgent,
        addressFormat: opts.addressFormat,
      });
    default:
      throw new Error('Provider ' + provider + ' not supported.');
  };
};

module.exports = BlockChainExplorer;
