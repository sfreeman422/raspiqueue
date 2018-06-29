const bcrypt = require('bcrypt');

module.exports = class User {
  constructor(params) {
    this.userName = params.userName;
    this.password = this.generateHash(params.password);
    this.email = params.email;
    this.generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    this.validPassword = password => bcrypt.compareSync(password, this.password);
  }
};
