// Imported packages
import { PrismaClient, Project } from "@prisma/client";
import { Request } from "express";
const UserController = require("./user.controller");
const prisma = new PrismaClient();
const sendResponse = require("../utils/sendResponse");
const jwt = require("jsonwebtoken");

const userController = new UserController();

const decodeToken = (request: Request) => userController.decodeToken(request);

class ProjectController {
  private readonly titleFilter = /^(?=.*[a-zA-Z]+.*)[A-Za-z0-9_-]{4,20}$/;

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
   * @description Validate description length
   * @param description {string} project description
   * @returns {boolean} true if description is valid
   */
  public validateDescription(description: string) {
    const descriptionLength: number = Number(description?.length);
    return descriptionLength > 10 && descriptionLength < 80; // min is 10 characters and max is 80 characters
  }

  /**
   * @description Validate fields and create a new project, then increase project counter and return the project data
   * @param request {Request}
   * @param response {Response}
   * @returns {void} Create the project
   */
  public async createProject(request: Request, response: Response) {
    decodeToken(request)
      .then((token: any) => {
        const { id } = token;
        this.validate(request)
          .then((result: any) => {
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
                // Increase project counter when project is created
                prisma.user
                  .update({
                    where: {
                      id: id,
                    },
                    data: {
                      projectsCount: {
                        increment: 1,
                      },
                    },
                  })
                  .then(() => {
                    sendResponse(response, true, "Project created", {
                      project,
                    });
                  })
                  .catch((error) => {
                    sendResponse(
                      response,
                      false,
                      "Something went wrong",
                      error,
                    );
                  });
              })
              .catch((error) => {
                sendResponse(response, false, "Project not created", error);
              });
          })
          .catch((error: any) => {
            sendResponse(response, false, error);
          });
      })
      .catch((error: any) => {
        sendResponse(response, false, "Unauthorized user", error);
      });
  }

  /**
   * @description Validate invite token
   * @param token {string} invite token
   * @returns {Promise<boolean>} true if token is valid
   */
  private async validateInviteToken(token: string) {
    const project = await prisma.project.findUnique({
      where: {
        inviteToken: token,
      },
      select: {
        id: true,
      },
    });
    return project ? true : false;
  }

  /**
   * @description Allow user to access a project and edit the files
   * @param request {Request}
   * @param response {Response}
   * @returns {void}
   */
  public async allowUser(request: Request, response: Response) {
    decodeToken(request)
      .then(async (token: any) => {
        if (token) {
          const { id } = token as { id: number };
          const { invitationToken } = request.body as {
            invitationToken: string;
          };
          const validateToken = await this.validateInviteToken(invitationToken);
          if (id && invitationToken && validateToken) {
            const { allowedUsers } = (await prisma.project.findUnique({
              where: {
                inviteToken: invitationToken,
              },
              select: {
                allowedUsers: true,
              },
            })) as {
              allowedUsers: any[];
            };
            // If user is already allowed do nothing
            if (allowedUsers.includes(id)) {
              sendResponse(response, false, "User already allowed");
              return null;
            }
            // Filter the array from duplicated values if there's any and add the new user id
            const uniqueUsers = Array.from(
              (new Set<number[]>([...allowedUsers, id]) as any).values(),
            ) as number[];
            prisma.project
              .update({
                where: {
                  inviteToken: invitationToken,
                },
                data: {
                  allowedUsers: {
                    set: uniqueUsers, // change allowed user array ids to the new one
                  },
                },
              })
              .then((result) => {
                sendResponse(
                  response,
                  true,
                  "User allowed successfully",
                  result,
                );
              })
              .catch((error) => {
                sendResponse(response, false, "Something went wrong", error);
              });
          } else {
            sendResponse(response, false, "Invalid invitation link");
          }
        } else {
          sendResponse(response, false, "Unauthorized user");
        }
      })
      .catch((error: any) => {
        sendResponse(response, false, "Unauthorized user", error);
      });
  }

  /**
   * @description Check if user is allowed to access the project and edit the files
   * @param request {Request}
   * @param response {Response}
   * @returns {void}
   */
  public async checkIfAllowed(request: Request, response: Response) {
    decodeToken(request)
      .then(async (token: any) => {
        if (token) {
          const { id } = token as { id: number };
          const { projectTitle } = request.query as { projectTitle: string };
          const project = (await prisma.project.findUnique({
            where: {
              title: projectTitle,
            },
          })) as {
            allowedUsers: any[];
            authorId: number;
          };
          const allowedUsers =
            (project?.allowedUsers as unknown as number[]) || undefined;
          if (
            project &&
            (project?.authorId === id ||
              (allowedUsers &&
                typeof allowedUsers === "object" &&
                allowedUsers?.includes(id)))
          ) {
            sendResponse(response, true, "User allowed", { project });
          } else {
            // If project is not found
            if (!allowedUsers) {
              sendResponse(response, false, "Project not found");
              return null;
            }
            sendResponse(response, false, "User not allowed");
          }
        } else {
          sendResponse(response, false, "Unauthorized user");
        }
      })
      .catch((error: any) => {
        sendResponse(response, false, "Unauthorized user", error);
      });
  }
}

module.exports = ProjectController;
