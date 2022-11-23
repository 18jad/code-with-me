// Imported packages
import { PrismaClient, User } from "@prisma/client";
import { Request } from "express";
const AuthUser = require("./auth.controller");
const prisma = new PrismaClient();
const sendResponse = require("../utils/sendResponse");
const jwt = require("jsonwebtoken");
const exclude = require("../utils/exclude");

// Variables
const userCheck = new AuthUser();
const jwt_secret = process.env.JWT_SECRET_KEY;
const jwt_expires = process.env.JWT_EXPIRES_IN;

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
                  // Generate new jwt token based on new informations
                  const newToken = jwt.sign(
                    {
                      id: user.id,
                      name: user.name,
                      username: user.username,
                      email: user.email,
                    },
                    jwt_secret,
                    {
                      expiresIn: jwt_expires,
                    },
                  );
                  const updatedUser = exclude(user, ["password"]);
                  sendResponse(response, true, "Profile updated", {
                    updatedUser,
                    newToken,
                  });
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
   * @description Upload user profile picture to the server, store new link in database
   * @param request {Request}
   * @param response {Response}
   * @returns {void}
   */
  public async uploadProfile(request: any, response: any) {
    const imageURL = `http://localhost:${process.env.PORT}/image/profiles/${request.file.originalname}`;
    this.decodeToken(request)
      .then(async (token: any) => {
        const { id } = token;
        prisma.user
          .update({
            where: {
              id: id,
            },
            data: {
              avatar: imageURL,
            },
          })
          .then((result) => {
            sendResponse(response, true, "Profile image uploaded", {
              result,
              url: imageURL,
            });
          })
          .catch((error) => {
            sendResponse(response, false, "Something went wrong", error);
          });
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
                select: {
                  id: true,
                  likes: true,
                  likesCount: true,
                  username: true,
                  headline: true,
                  projectsCount: true,
                  avatar: true,
                  projects: true,
                  name: true,
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
                select: {
                  id: true,
                  likes: true,
                  likesCount: true,
                  username: true,
                  headline: true,
                  avatar: true,
                  projectsCount: true,
                  projects: true,
                  name: true,
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
   * @description Get the projects that logged in user is collabed with
   * @param Request {Request}
   * @param Response {Response}
   */
  // This would have been redundant and much simpler if we save the project that user is collabed with in his database table, but whatever...
  getCollabProjects(Request: Request, Response: Response) {
    this.decodeToken(Request)
      .then(async (token: any) => {
        if (token) {
          // logged in user id
          const { id } = token as { id: number };
          prisma.project
            .findMany({
              where: {
                allowedUsers: {
                  hasEvery: [id], // get all projects that allowed user contains logged in user id
                },
              },
            })
            .then((result) => {
              sendResponse(Response, true, "Collab projects", {
                projects: result, // send them back in project object
              });
            })
            .catch((error) => {
              sendResponse(Response, false, "Something went wrong", error);
            });
        }
      })
      .catch((error) => {
        sendResponse(Response, false, "Unauthorized user", error);
      });
  }
}

module.exports = UserController;
