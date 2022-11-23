import Cookies from "cookies-js";
import qs from "qs";
import routes from "routes";
import { axiosInstance, axiosUser } from "utils/axiosInstance";
export class ProfileController {
  #edit_profile_url = "/user/edit_profile";
  #create_project_url = "/project/create_project";
  #search_url = "/info/search";
  #fetch_user_url = "/info/info_username";
  #check_like_url = "/user/check_like";
  #update_like_url = "/user/update_user_like";
  #collab_projects_url = "/user/collabed_projects";
  #upload_image_url = "/user/upload_profile";
  #usernameFilter = /^[a-z](?:_?[a-z0-9]+){2,}$/gim;
  #titleFilter = /^(?=.*[a-zA-Z]+.*)[A-Za-z0-9_-]{4,20}$/;

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

  validateTitle = (title) => {
    let cleanTitle = title.trim();
    return !!(
      cleanTitle &&
      cleanTitle.length > 3 &&
      cleanTitle.length <= 20 &&
      this.#titleFilter.test(cleanTitle)
    );
  };

  validateDescription = (description) => {
    let cleanDescription = description.trim();
    return !!(
      cleanDescription &&
      cleanDescription.length > 9 &&
      cleanDescription.length <= 80
    );
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
          const avatar = e.target.elements?.avatar?.files[0];
          axiosUser
            .put(this.#edit_profile_url, qs.stringify(result))
            .then(async (response) => {
              if (response.status === 200 && response.data.success) {
                let newProfile;
                if (avatar) {
                  newProfile = await axiosUser
                    .post(
                      this.#upload_image_url,
                      { avatar },
                      {
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                      },
                    )
                    .then((r) => {
                      return r;
                    });
                }
                const { updatedUser: user } = response.data;
                user.avatar = newProfile.data.url;
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

  /**
   * @description Logout logged in user, expire the cookie, make routes strictly protected and redirect to login page
   * @param {useNavigate: react-route-dom} navigate
   * @returns {void}
   */
  logout = (navigate) => {
    Cookies.expire("persist:user");
    routes.forEach((route) => {
      route.condition = !!(route.path === "/authenticate");
    });
    navigate("/authenticate");
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

  createProject = (e) => {
    e.preventDefault();
    return new Promise((resolve, reject) => {
      const { title, description } = e.target.elements;
      if (!this.validateTitle(title.value)) {
        reject(
          "Title must be between 4 and 20 characters, contains only letter, number, underscore and hyphen",
        );
      } else {
        if (!this.validateDescription(description.value)) {
          reject(
            "Please enter a valid description, character range is between 10 and 80",
          );
        } else {
          axiosUser
            .post(this.#create_project_url, {
              title: title.value,
              description: description.value,
            })
            .then((response) => {
              if (response.status === 200 && response.data.success) {
                resolve(response);
              } else {
                reject(response);
              }
            })
            .catch((error) => {
              reject(error);
            });
        }
      }
    });
  };

  checkIfLiked(id, userId) {
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(`${this.#check_like_url}?id=${id}&userId=${userId}`)
        .then((response) => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  updateLike(userId) {
    return new Promise((resolve, reject) => {
      axiosUser
        .put(this.#update_like_url, {
          userId,
        })
        .then((response) => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getCollabProjects() {
    return new Promise((resolve, reject) => {
      axiosUser
        .get(this.#collab_projects_url)
        .then((response) => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
