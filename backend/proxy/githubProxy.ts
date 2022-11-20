// Imported packages
import axios from "axios";
import { Request, Response } from "express";
import { Octokit } from "octokit";
const fg = require("fast-glob");
const { Base64 } = require("js-base64");
const fs = require("fs");
const sendResponse = require("../utils/sendResponse");

const CLIEND_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

class GithubProxy {
  // When deployed this will be the path to the project folder on the server
  private readonly projectDir =
    "C:\\Users\\Jad Yahya\\Documents\\SE Factory\\Web Development\\Projects\\FINAL PROJECT\\code-with-me\\backend\\public\\projects\\";

  public async getAccessToken(req: Request, res: Response) {
    const { code } = req.query;
    console.log(code, "hi");
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
        res.send(response.data);
      })
      .catch((error: any) => console.log(error));
  }

  private async createRepo(octo: Octokit, name: any) {
    await octo.rest.repos.createForAuthenticatedUser({
      name,
      auto_init: true,
    });
  }

  public async pushCode(req: Request, res: Response) {
    const {
      access_token,
      repository_name,
      commit_message,
      project_title,
      owner_username,
      owner_email,
    } = req.body;

    console.log(access_token, "access token");
    console.log(repository_name, "repo name");
    console.log(commit_message, "commit message");
    console.log(project_title, "project title");
    console.log(owner_username, "owner username");
    console.log(owner_email, "owner email");

    const octokit = new Octokit({ auth: access_token });
    const repos = await octokit.rest.repos.listForAuthenticatedUser();
    // Check if repo already exists if no create one
    if (!repos.data.map((repo: any) => repo.name).includes(repository_name)) {
      await this.createRepo(octokit, repository_name);
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
          // replace the owner and email with your own details
          owner: owner_username,
          repo: repository_name,
          path: file,
          message: commit_message,
          content: contentEncoded,
          committer: {
            name: `Octokit Bot`,
            email: owner_email,
          },
          author: {
            name: "Octokit Bot",
            email: owner_email,
          },
        });
        console.log(data);
      });
    } catch (err) {
      console.error(err);
    } finally {
      sendResponse(res, true, "Code pushed successfully");
    }
  }
}

module.exports = GithubProxy;
