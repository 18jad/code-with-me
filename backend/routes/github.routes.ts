// Imported packages
const { Router } = require("express");
import { Request, Response } from "express";

// Variables
const router = Router();
const GithubProxy = require("../proxy/githubProxy");
const githubProxy = new GithubProxy();

router.get("/get_access_token", (req: Request, res: Response) => {
  githubProxy.getAccessToken(req, res);
});

router.post("/push", (req: Request, res: Response) => {
  githubProxy.pushCode(req, res);
});

module.exports = router;
