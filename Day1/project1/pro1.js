console.log("starting password manager");

var storage = require('node-persist');
storage.initSync();

storage.setItemSync('accounts',[{
  username: 'Preeti',
  balance : 100
}]);

var accounts = storage.getItemSync('accounts');
console.log(typeof accounts);
accounts.push({
  username : 'Pandey',
  balance : 500
});
storage.setItemSync('accounts',accounts);

console.log(accounts);
