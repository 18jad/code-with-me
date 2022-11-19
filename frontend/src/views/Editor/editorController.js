const { axiosUser } = require("utils/axiosInstance");

export class EditorController {
  // eslint-disable-next-line no-useless-escape
  #emailFilter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  #check_url = "/project/check_allowed";
  #share_url = "/project/send_invitation";
  #allowd_url = "/project/allow_user";

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
}
