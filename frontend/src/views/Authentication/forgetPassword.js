import qs from "qs";
import { axiosInstance } from "utils/axiosInstance";
import validator from "utils/Validator";

class ForgetController {
  // HTTP Requests URLs
  #forget_url = "/auth/generate_reset";
  #validate_url = "/auth/verify_token";
  #reset_url = "/auth/reset_password";

  /**
   * @desciption Validate reset password user input fields
   * @param {EventTarget.HTMLElements} elements
   * @returns {Promise<string | object>}
   */
  validate = (elements) => {
    const { email } = elements;
    email.style.borderColor = "#6c7280";
    return new Promise((resolve, reject) => {
      if (!email || !email.value || !validator._validateEmail(email.value)) {
        reject("Please enter a valid email address");
        email.style.borderColor = "#c64d43";
      } else {
        resolve({
          email: email.value,
        });
      }
    });
  };

  /**
   * @description Validate the reset password token to see if it's valid token or expired/invalid
   * @param {string} token
   * @returns {Promise<string | object>}
   */
  validateResetToken = (token) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(this.#validate_url, qs.stringify({ token }))
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            resolve(response.data);
          } else {
            reject(response.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  /**
   * @description Handle reset password email request
   * @param {EventTarget} e
   * @returns
   */
  handleForget = (e) => {
    e.preventDefault();
    return new Promise((resolve, reject) => {
      this.validate(e.target.elements)
        .then((result) => {
          axiosInstance
            .post(this.#forget_url, qs.stringify(result))
            .then((response) => {
              if (response.status === 200 && response.data.success) {
                resolve(response.data);
              } else {
                reject(response.message);
              }
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  /**
   * @description Handle password reseting and changing
   * @param {EventTarget} e
   * @param {string} token
   * @returns
   */
  handleReset = (e, token) => {
    e.preventDefault();
    return new Promise((resolve, reject) => {
      const { password } = e.target.elements;
      const validatePassowrd = validator._validatePassword(password.value);
      if (validatePassowrd) {
        axiosInstance
          .post(
            this.#reset_url,
            qs.stringify({ password: password.value, token }),
          )
          .then((response) => {
            if (response.status === 200 && response.data.success) {
              resolve(response.data);
            } else {
              reject(response.message);
            }
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        reject("Password must be at least 8 characters");
      }
    });
  };
}

export default ForgetController;
