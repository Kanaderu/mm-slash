import { Request, Response } from "express";

export default abstract class BaseController {

  public static jsonResponse(res: Response, code: number, message: string) {
    return res.status(code).json({ message });
  }

  private TOKEN: string;

  constructor(TOKEN: string) {
    this.TOKEN = TOKEN;
  }

  public async execute(
    req: Request, res: Response,
  ): Promise<void> {

    try {
      await this.executeImpl(req, res);
    } catch (err) {
      console.error("[BaseController]: Uncaught controller error");
      console.error(err);
      this.fail(res, "An unexpected error occurred");
    }
  }

  public ok<T>(res: Response, dto?: T) {
    if (!!dto) {
      res.type("application/json");
      return res.status(200).json(dto);
    } else {
      return res.sendStatus(200);
    }
  }

  public created(res: Response) {
    return res.sendStatus(201);
  }

  public clientError(res: Response, message?: string) {
    return BaseController.jsonResponse(res, 400, message ? message : "Unauthorized");
  }

  public unauthorized(res: Response, message?: string) {
    return BaseController.jsonResponse(res, 401, message ? message : "Unauthorized");
  }

  public forbidden(res: Response, message?: string) {
    return BaseController.jsonResponse(res, 403, message ? message : "Forbidden");
  }

  public notFound(res: Response, message?: string) {
    return BaseController.jsonResponse(res, 404, message ? message : "Not found");
  }

  public conflict(res: Response, message?: string) {
    return BaseController.jsonResponse(res, 409, message ? message : "Conflict");
  }

  public tooMany(res: Response, message?: string) {
    return BaseController.jsonResponse(res, 429, message ? message : "Too many requests");
  }

  public todo(res: Response) {
    return BaseController.jsonResponse(res, 400, "TODO");
  }

  public fail(res: Response, error: Error | string) {
    console.error(error);
    return res.status(500).json({
      message: error.toString(),
    });
  }

  // overide
  protected abstract executeImpl(
    req: Request, res: Response,
  ): Promise<void | any>;

  protected verifyToken(req: Request) {
    if (!req.headers.authorization) {
      throw new Error("No API Token Provided");
    }
    const reqToken = req.headers.authorization.replace("Token ", "").trim();
    if (reqToken.localeCompare(this.TOKEN) !== 0) {
      throw new Error("Unable to Verify Provided API Token");
    }
  }
}
