import { axiosInstance } from "utils/axiosInstance";
import validator from "utils/Validator";

class Register {
  // HTTP Requests URLs
  #registeration_url = "/auth/register";

  /**
   * @desciption Validate register user input fields
   * @param {EventTarget.HTMLElements} elements
   * @returns {Promise<string | object>}
   */
  validate = (elements) => {
    let { name, username, email, password, passwordConfirm } = elements;
    [email, username, password, passwordConfirm].forEach((element) => {
      element.style.borderColor = "#6c7280";
    });
    email.value = email.value.trim().toLowerCase();
    username.value = username.value.trim().toLowerCase();
    return new Promise((resolve, reject) => {
      if (
        !email ||
        email.value === "" ||
        !name ||
        name.value === "" ||
        !username ||
        username.value === "" ||
        !password ||
        password.value === "" ||
        !passwordConfirm ||
        passwordConfirm.value === ""
      ) {
        reject("Please fill in all fields");
      } else {
        if (!validator._validateEmail(email.value)) {
          reject("Please enter a valid email address");
          email.style.borderColor = "#c64d43";
        } else {
          if (!validator._validatePassword(password.value)) {
            password.style.borderColor = "#c64d43";
            reject("Password must be at least 8 characters");
          } else {
            if (
              !validator._validateConfirmPassword(
                password.value,
                passwordConfirm.value,
              )
            ) {
              password.style.borderColor = "#c64d43";
              passwordConfirm.style.borderColor = "#c64d43";
              reject("Passwords do not match");
            } else {
              resolve({
                name: name.value,
                email: email.value,
                username: username.value,
                password: password.value,
              });
            }
          }
        }
      }
    });
  };

  /**
   * @description Send register request to the server and create a new user if no conflicts found
   * @param {EventTarget} e
   * @returns {Promise<object | unkown>}
   */
  handleRegister = (e) => {
    e.preventDefault();
    return new Promise((resolve, reject) => {
      this.validate(e.target.elements)
        .then((result) => {
          axiosInstance
            .post(this.#registeration_url, { ...result })
            .then((response) => {
              if (response.status === 200 && response.data.success) {
                resolve(`${response.data.message}, please login.`);
              } else {
                reject(response.message);
              }
            })
            .catch((error) => {
              reject(error.response.data.error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}

export default Register;
