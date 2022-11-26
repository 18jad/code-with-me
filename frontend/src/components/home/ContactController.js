import { axiosInstance } from "utils/axiosInstance";

export class ContactController {
  // eslint-disable-next-line no-useless-escape
  #emailFilter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  #send_email_url = "/user/contact_me";

  /**
   * @description Checks if the length of the string OR array is between the min and max values
   * @param {number} min
   * @param {number} max
   * @returns {function(string|Array): boolean}
   */
  checkLength(min, max) {
    return (value) => {
      if (typeof value === "string") {
        return (
          value &&
          value !== undefined &&
          value.trim().length >= min &&
          value.length <= max
        );
      } else {
        return (
          value &&
          value !== undefined &&
          value.length >= min &&
          value.length <= max
        );
      }
    };
  }

  // Validate name input value
  validateName(name) {
    return this.checkLength(2, 30)(name);
  }

  // Validate email input value
  validateEmail(email) {
    return this.checkLength(5, 200)(email) && !!this.#emailFilter.test(email);
  }

  // Validate message input value
  validateMessage(message) {
    return this.checkLength(10, 2000)(message);
  }

  // Validate subject input value
  validateSubject(subject) {
    return this.checkLength(5, 100)(subject);
  }

  validate(elements) {
    const { name, email, subject, message } = elements;
    return new Promise((resolve, reject) => {
      if (this.validateName(name.value)) {
        if (this.validateEmail(email.value)) {
          if (this.validateSubject(subject.value)) {
            if (this.validateMessage(message.value)) {
              resolve({
                name: name.value,
                email: email.value,
                subject: subject.value,
                message: message.value,
              });
            } else {
              reject("Message must be between 10 and 2000 characters");
            }
          } else {
            reject("Subject must be between 5 and 100 characters");
          }
        } else {
          reject("Email is not valid");
        }
      } else {
        reject("Please enter a valid name, between 2 and 30 characters");
      }
    });
  }

  sendEmail(e) {
    e.preventDefault();
    const elements = e.target.elements;
    return new Promise((resolve, reject) => {
      this.validate(elements)
        .then((data) => {
          axiosInstance
            .post(this.#send_email_url, data)
            .then((response) => {
              if (response.status === 200) {
                resolve(response.data);
              }
              e.target.reset();
            })
            .catch((error) => {
              resolve(error);
            });
        })
        .catch((error) => {
          resolve(error);
        });
    });
  }
}
