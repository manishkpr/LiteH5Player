import DecryptAES128 from './src/decrypter';

// Shove both of these into the global scope
var context = (typeof window !== 'undefined' && window) || global;

var oldmtn = context.oldmtn;
if (!oldmtn) {
  oldmtn = context.oldmtn = {};
}

// Begin Tools
oldmtn.DecryptAES128 = DecryptAES128;
// End Tools


var decrypter = new oldmtn.DecryptAES128();
decrypter.test1();