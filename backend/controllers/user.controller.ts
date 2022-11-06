// Imported packages
import { PrismaClient, Project, User } from "@prisma/client";
import { Request } from "express";
const prisma = new PrismaClient();
const sendResponse = require("../utils/sendResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

  public validateTitle(title: string) {
    const titleLength: number = Number(title?.length);
    return (
      titleLength >= 3 &&
      titleLength <= 20 && // min is 3 characters and max is 20 characters and it should be unique
      this.titleFilter.test(title) // it should contain only letters, numbers, underscores and hyphens
    );
  }

  public validateDescription(description: string) {
    const descriptionLength: number = Number(description?.length);
    return descriptionLength > 10 && descriptionLength < 80; // min is 10 characters and max is 100 characters
  }

  public async checkTitle(title: string) {
    const foundProject = await prisma.project.findFirst({
      where: {
        title: title,
      },
    });
    return Boolean(foundProject) ? true : false;
  }

  public async validate(data: Request) {
    const { title, description } = data.body as Project;
    return new Promise((resolve, reject) => {
      if (this.validateTitle(title)) {
        this.checkTitle(title).then((found: boolean) => {
          if (!found) {
            if (this.validateDescription(description)) {
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
}

module.exports = UserController;
