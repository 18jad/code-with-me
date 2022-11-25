import qs from "qs";
import { axiosInstance } from "utils/axiosInstance";
import validator from "utils/Validator";

class Register {
  #registeration_url = "/auth/register";

  constructor(toaster, setIsLogin) {
    this.toaster = toaster;
    this.setIsLogin = setIsLogin;
  }

  validate = (elements) => {
    let { name, username, email, password, passwordConfirm } = elements;
    [email, username, password, passwordConfirm].forEach((element) => {
      element.style.borderColor = "#6c7280";
    });
    email = email.trim().toLowerCase();
    username = username.trim().toLowerCase();
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
