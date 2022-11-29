// Imported packages
import axios from "axios";
import { Request, Response } from "express";
import { Octokit } from "octokit";
import { NGithub } from "./git";
const sendResponse = require("../utils/sendResponse");
const { Base64 } = require("js-base64");
const path = require("path");
const fs = require("fs");

// Variables
const CLIEND_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

class GithubProxy implements NGithub.IGithubProxy {
  // When deployed this will be the path to the project folder on the server
  private readonly projectDir = path.join(__dirname, `../public/projects/`);

  /**
   * @description Get access token from github, to be able to have action on your account remotely
   * @param request {Request}
   * @param response {Response}
   */
  public async getAccessToken(request: Request, response: Response) {
    const { code } = request.query;
    axios
      .get(
        `https://github.com/login/oauth/access_token?client_id=${CLIEND_ID}&client_secret=${CLIENT_SECRET}&code=${code}`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      )
      .then((response: any) => {
        response.send(response.data);
      })
      .catch((error: any) => console.log(error));
  }

  /**
   * @description Create a repository on github
   * @param octo {Octokit}
   * @param name {string}
   */
  private async createRepository(octo: Octokit, name: string) {
    await octo.rest.repos.createForAuthenticatedUser({
      name,
      auto_init: true,
    });
  }

  /**
   * @description Push code to github
   * @param request {Request}
   * @param response {Response}
   */
  public async pushCode(request: Request, response: Response) {
    const {
      access_token,
      repository_name,
      commit_message,
      project_title,
      owner_username,
      owner_email,
    } = request.body as NGithub.IRepositories;

    const octokit = new Octokit({ auth: access_token });
    const repos = await octokit.rest.repos.listForAuthenticatedUser();
    // Check if repo already exists if no create one
    if (!repos.data.map((repo: any) => repo.name).includes(repository_name)) {
      await this.createRepository(octokit, repository_name);
    }
    try {
      const dirFiles = fs.readdirSync(
        `${this.projectDir}${project_title}`,
        "utf-8",
      );
      dirFiles.forEach(async (file: any) => {
        const content = fs.readFileSync(
          this.projectDir + project_title + "\\" + file,
          "utf-8",
        );
        const contentEncoded = Base64.encode(content);
        const { data } = await octokit.rest.repos.createOrUpdateFileContents({
          owner: owner_username,
          repo: repository_name,
          path: file,
          message: commit_message,
          content: contentEncoded,
          committer: {
            name: owner_username,
            email: owner_email,
          },
          author: {
            name: owner_username,
            email: owner_email,
          },
        });
      });
    } catch (err) {
      console.error(err);
    } finally {
      sendResponse(response, true, "Code pushed successfully");
    }
  }
}

module.exports = GithubProxy;
