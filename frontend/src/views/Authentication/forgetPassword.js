import qs from "qs";
import { axiosInstance } from "utils/axiosInstance";

class ForgetController {
  #forget_url = "/auth/generate_reset";
  #validate_url = "/auth/verify_token";
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
}

export default ForgetController;
