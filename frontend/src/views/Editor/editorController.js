const { axiosUser, axiosInstance } = require("utils/axiosInstance");

export class EditorController {
  // eslint-disable-next-line no-useless-escape
  #emailFilter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  #check_url = "/project/check_allowed";
  #share_url = "/project/send_invitation";
  #allowd_url = "/project/allow_user";
  #update_url = "/project/update_project";
  #creat_file_url = "/project/create_file";
  #save_file_url = "/project/save_file";
  #read_file_url = "/project/read_file";
  #github_access = "/github/get_access_token";
  #push_url = "/github/push";

  constructor(octokit) {
    this.octokit = octokit;
  }

  checkIfAllowed(project_id) {
    return new Promise((resolve, reject) => {
      axiosUser
        .get(`${this.#check_url}?projectTitle=${project_id}`)
        .then((result) => {
          resolve(result.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  shareProject(e) {
    e.preventDefault();
    const { link, email } = e.target.elements;
    console.log(link.value, email.value);
    return new Promise((resolve, reject) => {
      if (!this.#emailFilter.test(email.value)) {
        reject("Please enter a valid email");
      } else {
        if (link.value === "") {
          reject("Please enter a valid link");
        } else {
          axiosUser
            .post(this.#share_url, {
              link: link.value,
              email: email.value,
            })
            .then((result) => {
              resolve(result.data);
            })
            .catch((error) => {
              reject(error);
            });
        }
      }
    });
  }

  allowUser(inviteToken) {
    return new Promise((resolve, reject) => {
      axiosUser
        .post(this.#allowd_url, {
          invitationToken: inviteToken,
        })
        .then((result) => {
          resolve(result.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  updateProjectStructure(title, structure) {
    return new Promise((resolve, reject) => {
      axiosUser
        .post(this.#update_url, {
          title,
          fileStructure: structure,
        })
        .then((result) => {
          resolve(result.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  createFile(title, file_name) {
    return new Promise((resolve, reject) => {
      axiosUser
        .post(this.#creat_file_url, {
          title,
          file_name,
        })
        .then((result) => {
          resolve(result.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  saveFile(title, file_name, file_content) {
    return new Promise((resolve, reject) => {
      axiosUser
        .post(this.#save_file_url, {
          title,
          file_name,
          file_content,
        })
        .then((result) => {
          resolve(result.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  readFile(title, file_name) {
    return new Promise((resolve, reject) => {
      axiosUser
        .get(`${this.#read_file_url}?title=${title}&file_name=${file_name}`)
        .then((result) => {
          resolve(result.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  githubAccessToken(code) {
    return new Promise((resolve, reject) => {
      axiosInstance
        .get(`${this.#github_access}?code=${code}`)
        .then((result) => {
          resolve(result.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  githubUserData(token) {
    return new Promise((resolve, reject) => {
      this.octokit.rest.users
        .getAuthenticated()
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  }

  pushCodeToGithub(e, projectTitle, authUser, access_token) {
    e.preventDefault();
    const { commit_message, repository_name } = e.target.elements;
    const { email: owner_email, login: owner_username } = authUser;
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(this.#push_url, {
          access_token,
          repository_name: repository_name.value,
          commit_message: commit_message.value,
          project_title: projectTitle,
          owner_email,
          owner_username,
        })
        .then((result) => {
          resolve(result.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
