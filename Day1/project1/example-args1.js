var storage = require('node-persist');
storage.initSync();

var crypto = require('crypto-js')

var argv = require('yargs')
	.command('adduser', 'Greets the user', function (yargs) {
		yargs.options({
			name: {
				demand: true,
				alias: 'n',
				description: 'Your first name goes here',
				type: 'string'
			},
			lastname: {
				demand: true,
				alias: 'l',
				description: 'Your last name goes here',
				type: 'string'
			},
			projectName: {
				demand: true,
				alias: 'p',
				description: 'Your project name goes here',
				type: 'string'
			},
			location: {
				demand: true,
				alias: 'a',
				description: 'Your location goes here',
				type: 'string'
			},
			employmentType: {
				demand: false,
				alias: 'e',
				description: 'Your employment type goes here',
				type: 'string'
			},
			masterPassword : {
				demand : true,
				alias : 'm',
				description : 'Master password',
				type : 'string'
			}
		}).help('help');
	})
	.command('getUser', 'Get an existing account', function (yargs) {
		yargs.options({
			name: {
				demand: true,
				alias: 'n',
				description: 'Account name',
				type: 'string'
			},
			masterPassword: {
				demand: true,
				alias: 'm',
				description: 'Master password',
				type: 'string'
			}
		}).help('help');
	})
	.help('help')
	.argv;
var command = argv._[0];

console.log(argv);



if (command === 'adduser') {
	try {
	var createdAccount = createAccount({
		name: argv.name,
		lastname: argv.lastname,
		projectName : argv.projectName,
		location : argv.location,
		employmentType : argv.employmentType },argv.masterPassword);
	console.log('Account created!');
	console.log(createdAccount);
}catch (e) {
	console.log(e);
		console.log('Unable to create account.');
	}
}else if (command === 'getUser') {
	try {
		var fetchedAccount = getAccount(argv.name, argv.masterPassword);

		if (typeof fetchedAccount === 'undefined') {
			console.log('Account not found');
		} else {
			console.log('Account found!');
			console.log(fetchedAccount);
		}
	} catch (e) {
		console.log('Unable to fetch account.');
	}
}

function getAccounts (masterPassword) {
	// use getItemSync to fetch accounts
	var encryptedAccount = storage.getItemSync('employee');
	var accounts = [];

	// decrypt
	if (typeof encryptedAccount !== 'undefined') {
		var bytes = crypto.AES.decrypt(encryptedAccount, masterPassword);
		accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
	}

	// return accounts array
	return accounts;
}

function saveAccounts (accounts, masterPassword) {
	// encrypt accounts
	var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);

	// setItemSync
	storage.setItemSync('employee', encryptedAccounts.toString());

	// return accounts
	return accounts;
}

function createAccount (account, masterPassword) {
	var accounts = getAccounts(masterPassword);

	accounts.push(account);

	saveAccounts(accounts, masterPassword);

	return account;
}

function getAccount (accountName, masterPassword) {
	var accounts = getAccounts(masterPassword)
	var matchedAccount;

	accounts.forEach(function (account) {
		if (account.name === accountName) {
			matchedAccount = account;
		}
	});

	return matchedAccount;
}
