// Imported packages
import { PrismaClient, Project, User } from "@prisma/client";
import { Request } from "express";
const AuthUser = require("./auth.controller");
const prisma = new PrismaClient();
const sendResponse = require("../utils/sendResponse");
const jwt = require("jsonwebtoken");

const userCheck = new AuthUser();

class UserController {
  private readonly titleFilter = /^(?=.*[a-zA-Z]+.*)[A-Za-z0-9_-]{4,20}$/;

  /**
   * @description Extract jwt token from request header
   * @param request {Request}
   * @returns {string} token
   */
  private getToken(request: Request) {
    return request.headers.authorization?.split(" ")[1];
  }

  /**
   * @description Decode jwt token and return user info
   * @param request {Request}
   * @returns {Promise<Userinfo>} user details stored in jwt token
   */
  private async decodeToken(request: Request) {
    return new Promise((resolve, reject) => {
      const token = this.getToken(request);
      if (token) {
        jwt.verify(
          token,
          process.env.JWT_SECRET_KEY,
          (err: any, decoded: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(decoded);
            }
          },
        );
      } else {
        reject("No token provided");
      }
    });
  }

  /**
   * @description Exclude properties from prisma request
   * @param user {User} user object
   * @param keys {string[]} keys to exclude
   * @returns {User} user object without excluded keys
   */
  private exclude<User, Key extends keyof User>(
    user: any,
    ...keys: any[]
  ): Omit<User, Key> {
    for (let key of keys) {
      delete user[key];
    }
    return user;
  }

  /**
   * @description Get user by id
   * @param request {Request}
   * @param response {Response}
   * @returns {void}
   */
  public async getUserById(request: Request, response: Response) {
    let { id } = request.query as any;
    if (typeof id === "string") {
      try {
        id = parseInt(id);
      } catch (error) {
        sendResponse(response, false, "Invalid user id", error);
        return null;
      }
    }
    try {
      const user = this.exclude(
        await prisma.user.findUnique({
          where: {
            id: Number(id),
          },
        }),
        "password",
      ) as User;
      if (user) {
        user.resetToken = "";
        sendResponse(response, true, "User found", { user });
      }
    } catch (error) {
      sendResponse(response, false, "User not found", error);
    }
  }

  /**
   * @description Get user by id
   * @param request {Request}
   * @param response {Response}
   * @returns {void}
   */
  public async getUserByUsername(request: Request, response: Response) {
    let { username } = request.query as any;
    console.log(username);
    try {
      const user = this.exclude(
        await prisma.user.findUnique({
          where: {
            username: username,
          },
        }),
        "password",
      ) as User;
      if (user) {
        user.resetToken = "";
        sendResponse(response, true, "User found", { user });
      }
    } catch (error) {
      sendResponse(response, false, "User not found", error);
    }
  }

  /**
   * @description Validate title length and characters
   * @param title {string} project title
   * @returns {boolean} true if title is valid
   */
  public validateTitle(title: string) {
    const titleLength: number = Number(title?.length);
    return (
      titleLength >= 3 &&
      titleLength <= 20 && // min is 3 characters and max is 20 characters and it should be unique
      this.titleFilter.test(title) // it should contain only letters, numbers, underscores and hyphens
    );
  }

  /**
   * @description Validate description length
   * @param description {string} project description
   * @returns {boolean} true if description is valid
   */
  public validateDescription(description: string) {
    const descriptionLength: number = Number(description?.length);
    return descriptionLength > 10 && descriptionLength < 80; // min is 10 characters and max is 80 characters
  }

  /**
   * @description Validate headline length
   * @param headline {string} user headline
   * @returns {boolean} true if headline is valid
   */
  public validateHeadline(headline: string) {
    const headlineLength: number = Number(headline?.length);
    return headlineLength > 10 && headlineLength < 100; // min is 10 characters and max is 100 characters
  }

  /**
   * @description Check if title already exists in database
   * @param title {string} project title
   * @returns {Promise<boolean>} true if title is found
   */
  public async checkTitle(title: string) {
    const foundProject = await prisma.project.findFirst({
      where: {
        title: title,
      },
    });
    return Boolean(foundProject) ? true : false;
  }

  /**
   * @description Validate all project fields
   * @param data {Request} project data
   * @returns {Promise<boolean>} true if all project inputs are valid
   */
  public async validate(data: Request) {
    const { title, description } = data.body as Project;
    return new Promise((resolve, reject) => {
      if (title && this.validateTitle(title)) {
        this.checkTitle(title).then((found: boolean) => {
          if (!found) {
            if (description && this.validateDescription(description)) {
              resolve({ title, description });
            } else {
              reject(
                "Invalid description. Min is 10 characters and max is 80 characters",
              );
            }
          } else {
            reject("Title already exists");
          }
        });
      } else {
        reject(
          "Invalid title. Min is 4 characters and max is 20 characters, it should contain only letters, numbers, underscores (_) and hyphens (-)",
        );
      }
    });
  }

  /**
   * @description Validate fields and create a new project
   * @param request {Request}
   * @param response {Response}
   * @returns {void} Create the project
   */
  public async createProject(request: Request, response: Response) {
    this.decodeToken(request)
      .then((token: any) => {
        const { id } = token;
        this.validate(request)
          .then((result) => {
            const { title, description } = result as Project;
            const project = prisma.project
              .create({
                data: {
                  title: title,
                  description: description,
                  fileStructure: JSON.parse(
                    `{"type":"folder","name":"${title}","path":"/projects/${title}","files":[]}`,
                  ),
                  author: {
                    connect: {
                      id: id,
                    },
                  },
                },
              })
              .then((project) => {
                sendResponse(response, true, "Project created", { project });
              })
              .catch((error) => {
                sendResponse(response, false, "Project not created", error);
              });
          })
          .catch((error) => {
            sendResponse(response, false, error);
          });
      })
      .catch((error) => {
        sendResponse(response, false, "Unauthorized user", error);
      });
  }

  /**
   * @description Edit logged in user profile name, username, headline and image
   * @param request {Request}
   * @param response {Response}
   * @returns {void} Edit user profile details
   */
  // TODO: Add image edit and update functionality
  public async editProfile(request: Request, response: Response) {
    this.decodeToken(request)
      .then(async (token: any) => {
        const { id } = token;
        const { name, username, headline } = request.body as User;
        const validateUsername = userCheck.validateUsername(username);
        if (validateUsername) {
          const checkUsername = await userCheck.checkUsername(username);
          // if username is not taken OR if username is the same as the current logged in user (means he didn't change it)
          if (!checkUsername || username === token.username) {
            const validateHeadline = this.validateHeadline(headline as string);
            if (validateHeadline) {
              prisma.user
                .update({
                  where: {
                    id: id,
                  },
                  data: {
                    name: name,
                    username: username,
                    headline: headline,
                  },
                })
                .then((user) => {
                  sendResponse(response, true, "Profile updated", { user });
                })
                .catch((error) => {
                  sendResponse(response, false, "Something went wrong", error);
                });
            } else {
              sendResponse(
                response,
                false,
                "Invalid headline. Min is 10 characters and max is 100 characters",
              );
            }
          } else {
            sendResponse(response, false, "Username already exists");
          }
        } else {
          sendResponse(response, false, "Invalid username format");
        }
      })
      .catch((error) => {
        sendResponse(response, false, "Unauthorized user", error);
      });
  }

  /**
   * @description Search for a user by username or name
   * @param request {Request}
   * @param response {Response}
   */
  public async searchUser(request: Request, response: Response) {
    const { query } = request.query as { query: string };
    // check if query is not empty
    if (query && query.length > 0) {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              username: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          username: true,
          headline: true,
          avatar: true,
          projects: true,
          password: false,
        },
      });
      sendResponse(response, true, "Query excuted", { users });
    } else {
      sendResponse(response, false, "Query is empty");
    }
  }
}

module.exports = UserController;
