#!/usr/bin/env node

var PORT = 13231;

console.log('Server started at port ' + PORT + '...');
var Locker = require('locker-server'),
  locker = new Locker();

locker.listen(PORT);
