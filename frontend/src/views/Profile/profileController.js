import qs from "qs";
import { axiosInstance, axiosUser } from "utils/axiosInstance";

export class ProfileController {
  #edit_profile_url = "/user/edit_profile";
  #search_url = "/info/search";
  #fetch_user_url = "/info/info_username";
  #usernameFilter = /^[a-z](?:_?[a-z0-9]+){2,}$/gim;

  /**
   * @description Validate username length and format
   * @param {string} username
   * @returns {boolean}
   */
  validateUsername = (username) => {
    return !!(username && this.#usernameFilter.test(username));
  };

  /**
   * @description Validate name length
   * @param {string} name
   * @returns {boolean}
   */
  validateName = (name) => {
    return !!(name && name.length > 2);
  };

  /**
   * @description Validate user inputs
   * @param {HTMLEventElements} elements
   * @returns {Promise}
   */
  #validate = (elements) => {
    const { name, username, headline = "" } = elements;
    return new Promise((resolve, reject) => {
      if (!name || name.value === "" || !username || username.value === "") {
        reject("Please fill in all fields");
      } else {
        if (!this.validateUsername(username.value)) {
          reject(
            "Please enter a valid username, minimum 3 characters and should contains only letters, numbers and underscore",
          );
        } else {
          if (!this.validateName(name.value)) {
            reject("Please enter a valid name. Minimum is 2 characters");
          } else {
            resolve({
              name: name.value,
              username: username.value,
              headline: headline.value,
            });
          }
        }
      }
    });
  };

  /**
   * @description Handle user profile update
   * @param {HTMLEvent} e
   * @returns {Promise}
   */
  editProfile = (e) => {
    e.preventDefault();
    return new Promise((resolve, reject) => {
      this.#validate(e.target.elements)
        .then((result) => {
          axiosUser
            .put(this.#edit_profile_url, qs.stringify(result))
            .then((response) => {
              if (response.status === 200 && response.data.success) {
                const { updatedUser: user } = response.data;
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

  searchUser = (username) => {
    return new Promise((resolve, reject) => {
      if (!username) {
        reject("Query cannot be empty");
      } else {
        axiosInstance
          .get(this.#search_url, {
            params: { query: username },
          })
          .then((response) => {
            if (response.status === 200 && response.data.success) {
              const { users } = response.data;
              resolve(users);
            } else {
              reject(response.message);
            }
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  };

  fetchUser = (username) => {
    return new Promise((resolve, reject) => {
      if (!username) {
        reject("Username cannot be empty");
      } else {
        axiosUser
          .get(`${this.#fetch_user_url}?username=${username}`)
          .then((response) => {
            if (response.status === 200 && response.data.success) {
              const { user } = response.data;
              resolve(user);
            } else {
              reject(response.message);
            }
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  };
}
