// Imported packages
import { PrismaClient, User } from "@prisma/client";
import { Request } from "express";
const prisma = new PrismaClient();
const sendResponse = require("../utils/sendResponse");

class InfoController {
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

module.exports = InfoController;
