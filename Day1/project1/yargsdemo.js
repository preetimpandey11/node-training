var argv = require('yargs').argv;
var command = argv._[0];

console.log(argv);

if( command === 'details'){
  if(typeof argv.country !== 'undefined' && typeof argv.name !== 'undefined' && typeof argv.city !== 'undefined' && typeof argv.postalCode !=='undefined' ){
  console.log("Hello "+argv.name);
  console.log("Country "+argv.country);
  console.log("City "+argv.city);
  console.log("Postal code "+argv.postalCode);
  }else { console.log("Hello world");
}

}
