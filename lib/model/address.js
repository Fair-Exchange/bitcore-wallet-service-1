'use strict';

var $ = require('preconditions').singleton();
var _ = require('lodash');

var Common = require('../common');
var Constants = Common.Constants,
  Defaults = Common.Defaults,
  Utils = Common.Utils;

function Address() {};

Address.create = function(opts) {
  opts = opts || {};

  var x = new Address();

  $.checkArgument(Utils.checkValueInCollection(opts.coin, Constants.COINS));

  x.version = '1.0.0';
  x.createdOn = Math.floor(Date.now() / 1000);
  x.address = opts.address;
  x.walletId = opts.walletId;
  x.isChange = opts.isChange;
  x.path = opts.path;
  x.publicKeys = opts.publicKeys;
  x.coin = opts.coin;
  if (x.coin == 'btc') {
    x.network = require('bitcore-lib').Address(x.address).toObject().network;
  } else if (x.coin == 'bch') {
    x.network = require('bitcore-lib-cash').Address(x.address).toObject().network;
  } else if (x.coin == 'safe') {
    x.network = require('bitcore-lib-safecoin').Address(x.address).toObject().network;
  } else if (x.coin == 'btcz') {
    x.network = require('bitcore-lib-btcz-mini').Address(x.address).toObject().network;
  } else if (x.coin == 'zcl') {
    x.network = require('bitcore-lib-zcl-mini').Address(x.address).toObject().network;
  } else if (x.coin == 'anon') {
    x.network = require('bitcore-lib-anon-mini').Address(x.address).toObject().network;
  } else if (x.coin == 'zel') {
    x.network = require('bitcore-lib-zel-mini').Address(x.address).toObject().network;
  } else if (x.coin == 'rvn') {
    x.network = require('bitcore-lib-rvn-mini').Address(x.address).toObject().network;
  } else if (x.coin == 'ltc') {
    x.network = require('bitcore-lib-ltc-mini').Address(x.address).toObject().network;
  }
  x.type = opts.type || Constants.SCRIPT_TYPES.P2SH;
  x.hasActivity = undefined;
  return x;
};

Address.fromObj = function(obj) {
  var x = new Address();

  x.version = obj.version;
  x.createdOn = obj.createdOn;
  x.address = obj.address;
  x.walletId = obj.walletId;
  x.coin = obj.coin || Defaults.COIN;
  x.network = obj.network;
  x.isChange = obj.isChange;
  x.path = obj.path;
  x.publicKeys = obj.publicKeys;
  x.type = obj.type || Constants.SCRIPT_TYPES.P2SH;
  x.hasActivity = obj.hasActivity;
  return x;
};

Address._deriveAddress = function(scriptType, publicKeyRing, path, m, coin, network) {
  $.checkArgument(Utils.checkValueInCollection(scriptType, Constants.SCRIPT_TYPES));
  var BA;
  var BHD;
  if (coin == 'btc') {
    BA = require('bitcore-lib').Address;
    BHD = require('bitcore-lib').HDPublicKey;
  } else if (coin == 'bch') {
    BA = require('bitcore-lib-cash').Address;
    BHD = require('bitcore-lib-cash').HDPublicKey;
  } else if (coin == 'safe') {
    BA = require('bitcore-lib-safecoin').Address;
    BHD = require('bitcore-lib-safecoin').HDPublicKey;
  } else if (coin == 'btcz') {
    BA = require('bitcore-lib-btcz-mini').Address;
    BHD = require('bitcore-lib-btcz-mini').HDPublicKey;
  } else if (coin == 'zcl') {
    BA = require('bitcore-lib-zcl-mini').Address;
    BHD = require('bitcore-lib-zcl-mini').HDPublicKey;
  } else if (coin == 'anon') {
    BA = require('bitcore-lib-anon-mini').Address;
    BHD = require('bitcore-lib-anon-mini').HDPublicKey;
  } else if (coin == 'zel') {
    BA = require('bitcore-lib-zel-mini').Address;
    BHD = require('bitcore-lib-zel-mini').HDPublicKey;
  } else if (coin == 'rvn') {
    BA = require('bitcore-lib-rvn-mini').Address;
    BHD = require('bitcore-lib-rvn-mini').HDPublicKey;
  } else if (coin == 'ltc') {
    BA = require('bitcore-lib-ltc-mini').Address;
    BHD = require('bitcore-lib-ltc-mini').HDPublicKey;
  }

  var publicKeys = _.map(publicKeyRing, function(item) {
    var xpub = new BHD(item.xPubKey);
    return xpub.deriveChild(path).publicKey;
  });

  var bitcoreAddress;
  switch (scriptType) {
    case Constants.SCRIPT_TYPES.P2SH:
      bitcoreAddress = BA.createMultisig(publicKeys, m, network);
      break;
    case Constants.SCRIPT_TYPES.P2PKH:
      $.checkState(_.isArray(publicKeys) && publicKeys.length == 1);
      bitcoreAddress = BA.fromPublicKey(publicKeys[0], network);
      break;
  }

  return {
    address: bitcoreAddress.toString(),
    path: path,
    publicKeys: _.invoke(publicKeys, 'toString'),
  };
};

Address.derive = function(walletId, scriptType, publicKeyRing, path, m, coin, network, isChange) {
  var raw = Address._deriveAddress(scriptType, publicKeyRing, path, m, coin, network);
  return Address.create(_.extend(raw, {
    coin: coin,
    walletId: walletId,
    type: scriptType,
    isChange: isChange,
  }));
};


module.exports = Address;
