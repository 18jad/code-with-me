const { exec } = require("child_process");
const childProcces = require("child_process");
const path = require("path");

const checkNode = (): Promise<Object> => {
  return new Promise((resolve, reject): void => {
    childProcces.exec(
      "node --version",
      (err: any, stdout: any, stderr: any): void => {
        err
          ? reject({
              message: "Node is not available on the server",
              proccess_error: err,
              stderr: stderr,
            })
          : resolve({
              message: "Node is available on the server",
              stdout: stdout,
            });
      },
    );
  });
};

const excuteJsFile = (id: string, file: string): Promise<Object> => {
  // Project directory on server
  let projectDir = path.join(__dirname, `../../public/projects/${id}/${file}`);
  return new Promise((resolve, reject): void => {
    checkNode()
      .then(() => {
        childProcces.exec(
          `node "${projectDir}"`,
          (err: any, stdout: any, stderr: any): void => {
            err
              ? reject({
                  message: "Error while executing the file",
                  proccess_error: err,
                  stderr: stderr,
                })
              : resolve({
                  message: "File executed successfully",
                  stdout: stdout,
                });
          },
        );
      })
      .catch((error) => {
        resolve(error);
      });
  });
};

module.exports = {
  excuteJsFile,
};
