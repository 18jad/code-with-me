import qs from "qs";
import { axiosInstance } from "utils/axiosInstance";

class Login {
  // eslint-disable-next-line no-useless-escape
  #emailFilter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  #login_url = "/auth/login";

  validateEmail = (email) => {
    return !!this.#emailFilter.test(email);
  };

  validate = (elements) => {
    const { email, password } = elements;
    email.style.borderColor = "#6c7280";
    return new Promise((resolve, reject) => {
      if (!email || email.value === "" || !password || password.value === "") {
        reject("Please fill in all fields");
      } else {
        if (!this.validateEmail(email.value)) {
          reject("Please enter a valid email address");
          email.style.borderColor = "#c64d43";
        } else {
          resolve({
            email: email.value,
            password: password.value,
          });
        }
      }
    });
  };

  handleLogin = (e) => {
    e.preventDefault();
    return new Promise((resolve, reject) => {
      this.validate(e.target.elements)
        .then((result) => {
          axiosInstance
            .post(this.#login_url, qs.stringify(result))
            .then((response) => {
              if (response.status === 200 && response.data.success) {
                const { user } = response.data;
                resolve({ response, user });
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
}
export default Login;
