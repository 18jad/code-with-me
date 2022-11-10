// Imported packages
import { PrismaClient, User } from "@prisma/client";
import { Request } from "express";
const AuthUser = require("./auth.controller");
const prisma = new PrismaClient();
const sendResponse = require("../utils/sendResponse");
const jwt = require("jsonwebtoken");

const userCheck = new AuthUser();

class UserController {
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
   * @description Validate headline length
   * @param headline {string} user headline
   * @returns {boolean} true if headline is valid
   */
  public validateHeadline(headline: string) {
    const headlineLength: number = Number(headline?.length);
    return headlineLength > 10 && headlineLength < 100; // min is 10 characters and max is 100 characters
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
   * @description Check if user already liking another user
   * @param id {number | string} logged in user id
   * @param userId {number | string} likked user id
   * @returns {Promise<boolean>} true if user is already liked
   */
  public async checkIfLiked(id: number | string, userId: number | string) {
    if (typeof userId === "number" || typeof userId === "string") {
      const user = await prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
        select: {
          likes: true,
        },
      });
      let likes = user?.likes as unknown as number[];
      return { likedUsers: likes, isLiked: likes?.includes(Number(id)) };
    } else {
      return false;
    }
  }

  /**
   * @description Like or unlike another user, based on your current status
   * @param request {Request}
   * @param response {Response}
   * @returns {void} Like a user
   */
  public async updateUserLike(request: Request, response: Response) {
    this.decodeToken(request)
      .then(async (token: any) => {
        if (token) {
          const { id } = token as { id: number };
          const { userId } = request.body as { userId: number };
          const { likedUsers, isLiked } = (await this.checkIfLiked(
            id,
            userId,
          )) as any;
          if (isLiked) {
            // Already liked, so unlike
            // Remove the logged in user id from user id likes array, and delete any duplicated if there is any
            const uniqueLikes = Array.from(
              new Set(
                likedUsers.filter((uid: number) => {
                  return uid !== id;
                }),
              ),
            ) as number[];
            prisma.user
              .update({
                where: {
                  id: Number(userId),
                },
                data: {
                  likes: {
                    set: uniqueLikes,
                  },
                  likesCount: {
                    decrement: 1, // decrement likes counter by 1
                  },
                },
              })
              .then((result) => {
                sendResponse(response, true, "User unliked successfully", {
                  result,
                });
              })
              .catch((error) => {
                sendResponse(response, false, "Something went wrong", error);
              });
          } else {
            // Not liked, like the user
            // Add the logged in user id to the user id likes array, and delete any duplicated if there is any
            const uniqueLikes = Array.from(
              (new Set<number[]>([...likedUsers, id]) as any).values(),
            ) as number[];
            console.log(uniqueLikes, id, [...likedUsers, id]);
            prisma.user
              .update({
                where: {
                  id: Number(userId),
                },
                data: {
                  likes: {
                    set: uniqueLikes,
                  },
                  likesCount: {
                    increment: 1, // increase likes counter by 1
                  },
                },
              })
              .then((result) => {
                sendResponse(response, true, "User liked successfully", {
                  result,
                });
              })
              .catch((error) => {
                sendResponse(response, false, "Something went wrong", error);
              });
          }
        }
      })
      .catch((error) => {
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
    this.decodeToken(request)
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
      .catch((error) => {
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
    this.decodeToken(request)
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
      .catch((error) => {
        sendResponse(response, false, "Unauthorized user", error);
      });
  }

  // create a seperate file for project page method and controller
  // create send invitation by email
}

module.exports = UserController;
