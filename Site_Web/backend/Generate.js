const bcrypt = require("bcrypt");

let pasrd = bcrypt.hashSync("12345", 9);

console.log(pasrd);
