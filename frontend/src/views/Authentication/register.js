import qs from "qs";
import { axiosInstance } from "utils/axiosInstance";

class Register {
  // eslint-disable-next-line no-useless-escape
  #emailFilter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  #registeration_url = "/auth/register";

  constructor(toaster, setIsLogin) {
    this.toaster = toaster;
    this.setIsLogin = setIsLogin;
  }

  validateEmail = (email) => {
    return !!this.#emailFilter.test(email);
  };

  validatePassword = (password) => {
    return !!(password.length >= 8);
  };

  validateConfirmPassword = (password, confirmPassword) => {
    return !!(password === confirmPassword);
  };

  validate = (elements) => {
    const { name, username, email, password, passwordConfirm } = elements;
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
        if (!this.validateEmail(email.value)) {
          reject("Please enter a valid email address");
        } else {
          if (!this.validatePassword(password.value)) {
            reject("Password must be at least 8 characters");
          } else {
            if (
              !this.validateConfirmPassword(
                password.value,
                passwordConfirm.value,
              )
            ) {
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

  handleRegister = (e) => {
    e.preventDefault();
    this.validate(e.target.elements)
      .then((result) => {
        axiosInstance
          .post(this.#registeration_url, qs.stringify(result))
          .then((response) => {
            if (response.status === 200 && response.data.success) {
              this.toaster(`${response.data.message}, please login.`);
              setTimeout(() => {
                this.setIsLogin(true);
              }, 2000);
            } else {
              this.toaster(response.message, true);
            }
          })
          .catch((error) => {
            this.toaster(error.response.data.error, true);
          });
      })
      .catch((error) => {
        this.toaster(error, true);
      });
  };
}

export default Register;
