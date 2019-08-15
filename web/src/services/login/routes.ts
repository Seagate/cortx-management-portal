
import { Request, Response } from "express";
import { getSessionKey } from "./LoginController";
import { checkUserParams } from "../../middleware/checks";

export default [
  {
    path: "/api/v1/sessionkey",
    method: "get",
    handler: [
      checkUserParams, // <-- this line
      async ({ query }: Request, res: Response) => {
        const result = await getSessionKey(query.user);
        res.status(200).send(result);
      }
    ]
  }
];