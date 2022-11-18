// Imported packages
import { PrismaClient, Project, User } from "@prisma/client";
import { Request } from "express";
const prisma = new PrismaClient();
const sendResponse = require("../utils/sendResponse");
const exclude = require("../utils/exclude");

class InfoController {
  /**
   * @description Get user by id
   * @param request {Request}
   * @param response {Response}
   * @returns {void}
   */
  public async getUserById(request: Request, response: Response) {
    let { id } = request.query as any;
    if (id) {
      if (typeof id === "string") {
        try {
          id = parseInt(id);
        } catch (error) {
          sendResponse(response, false, "Invalid user id", error);
          return null;
        }
      }
      try {
        const user = exclude(
          await prisma.user.findUnique({
            where: {
              id: Number(id),
            },
            include: {
              projects: true,
            },
          }),
          ["password", "resetToken"],
        ) as User;
        if (user) {
          sendResponse(response, true, "User found", { user });
        }
      } catch (error) {
        sendResponse(response, false, "User not found", error);
      }
    } else {
      sendResponse(response, false, "User id cannot be null");
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
    if (username && username.length > 0) {
      try {
        const user = exclude(
          await prisma.user.findUnique({
            where: {
              username: username,
            },
            include: {
              projects: true,
            },
          }),
          ["password", "resetToken"],
        ) as User;
        if (user) {
          // if user was found
          console.log(user);
          sendResponse(response, true, "User found", { user });
        }
      } catch (error) {
        // if user was not found
        sendResponse(response, false, "User not found", error);
      }
    } else {
      sendResponse(response, false, "Username cannot be null");
    }
  }

  /**
   * @description Search for a user by username or name
   * @param request {Request}
   * @param response {Response}
   * @returns {void}
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

  /**
   * @description Get project by title
   * @param request {Request}
   * @param response {Response}
   * @returns {void}
   */
  public async getProjectByTitle(request: Request, response: Response) {
    const { title } = request.query as { title: string };
    // if title is not null
    if (title && title.length > 0) {
      try {
        // find the project
        const project = exclude(
          await prisma.project.findUnique({
            where: {
              title: title,
            },
          }),
          ["inviteToken"], // exclude invite token to not expose it
        ) as Project;
        if (project) {
          // if project is found
          sendResponse(response, true, "Project found", { project });
        } else {
          // if project was not found
          sendResponse(response, false, "Project not found");
        }
      } catch (error) {
        sendResponse(response, false, "Something went wrong", error);
      }
    } else {
      // if title is null
      sendResponse(response, false, "Title cannot be null");
    }
  }
}

module.exports = InfoController;
