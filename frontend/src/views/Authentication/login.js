import { axiosInstance } from "utils/axiosInstance";
import validator from "utils/Validator";

class Login {
  // HTTP Requests URLs
  #login_url = "/auth/login";

  /**
   * @desciption Validate login user input fields
   * @param {EventTarget.HTMLElements} elements
   * @returns {Promise<string | object>}
   */
  validate = (elements) => {
    let { email, password } = elements;
    email.value = email.value.trim().toLowerCase(); // remove any trailing spaces and convert to lower case
    email.style.borderColor = "#6c7280"; // reset border to initial color in case it was red
    return new Promise((resolve, reject) => {
      if (!email || email.value === "" || !password || password.value === "") {
        reject("Please fill in all fields");
      } else {
        console.log(validator._validateEmail(email.value));
        if (!validator._validateEmail(email.value)) {
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

  /**
   * @description Send login request to the server to validate credentials
   * @param {EventTarget} e
   * @returns {Promise<object | unkown>}
   */
  handleLogin = (e) => {
    e.preventDefault();
    return new Promise((resolve, reject) => {
      this.validate(e.target.elements)
        .then((result) => {
          axiosInstance
            .post(this.#login_url, { ...result })
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
