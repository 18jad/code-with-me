const { axiosUser } = require("utils/axiosInstance");

export class EditorController {
  #check_url = "/project/check_allowed";

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
}
