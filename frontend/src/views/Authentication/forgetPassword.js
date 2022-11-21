import qs from "qs";
import { axiosInstance } from "utils/axiosInstance";
import Register from "./register";

class ForgetController {
  #forget_url = "/auth/generate_reset";
  #validate_url = "/auth/verify_token";
  #reset_url = "/auth/reset_password";
  // eslint-disable-next-line no-useless-escape
  #emailFilter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  validate = (elements) => {
    const { email } = elements;
    email.style.borderColor = "#6c7280";
    return new Promise((resolve, reject) => {
      if (!email || !email.value || !this.#emailFilter.test(email.value)) {
        reject("Please enter a valid email address");
        email.style.borderColor = "#c64d43";
      } else {
        resolve({
          email: email.value,
        });
      }
    });
  };

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

  handleReset = (e, token) => {
    e.preventDefault();
    return new Promise((resolve, reject) => {
      const { password } = e.target.elements;
      const validatePassowrd = new Register().validatePassword(password.value);
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
