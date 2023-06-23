import { Request, Response, NextFunction } from "express";

export const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    next(error); // errorLogger -> errorHandler
};

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(400);
    res.json({ errorMessage: error.message });
};
