import { Request, Response, NextFunction } from "express";

function checkLogin(req: Request, res: Response, next: NextFunction) {
    if(req.isAuthenticated() || req.path.includes('/login')){
        next();
    }else{
        res.redirect('/login');
    }
}

export default checkLogin;
