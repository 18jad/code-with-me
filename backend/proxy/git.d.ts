import { Request, Response } from "express";

export namespace NGithub {
  export interface IGithubProxy {
    getAccessToken(request: Request, response: Response): Promise<void>;
    pushCode(request: Request, response: Response): Promise<void>;
  }

  export interface IRepositories {
    access_token: string;
    repository_name: string;
    commit_message: string;
    project_title: string;
    owner_username: string;
    owner_email: string;
  }
}
