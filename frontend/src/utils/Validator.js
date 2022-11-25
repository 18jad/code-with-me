/* eslint-disable no-useless-escape */
class Validator {
  "use strict";

  #emailTest =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  #emailQuotedTest =
    /^"([-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~\.\(\),:;<>@\[\] ]|(\\\\)|(\\"))*"@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  /**
   * @description Check if email address is valid or not
   * @param {string} email
   * @returns {boolean}
   */
  _validateEmail(email) {
    email = email.toLowerCase();
    if (!email || email.length <= 10) return false;
    if (email.length > 256) return false;
    if (!this.#emailTest.test(email) && !this.#emailQuotedTest.test(email))
      return false;

    const [_, local, domain] = email.match(/(.*)@(.*)/);
    if (local.length > 64) return false;
    if (
      domain.split(".").some((part) => {
        return part.length > 63;
      })
    )
      return false;
    return true;
  }

  /**
   * @description Validate password length
   * @param {string} password
   * @returns {boolean}
   */
  _validatePassword = (password) => {
    return !!(password && password.length >= 8);
  };

  /**
   * @description Compare password and confirm password then validating them
   * @param {string} password
   * @param {string} confirmPassword
   * @returns {boolean}
   */
  _validateConfirmPassword = (password, confirmPassword) => {
    return (
      this._validatePassword(password) &&
      this._validatePassword(confirmPassword) &&
      !!(password === confirmPassword)
    );
  };
}

const validator = new Validator();

export default validator;
