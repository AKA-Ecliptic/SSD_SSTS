import { Request, Response, NextFunction } from "express";
import { BlacklistIP } from "../models/BlacklistIP";

var counter: number = 0;
var timoutCounter: number = 0;
const attemptLimit: number = 5;
const blacklistThreshold: number = 3;

function failedLogin(req: Request, res: Response, next: NextFunction) {
    let userIP: string = req.connection.remoteAddress || (req.headers['x-forwarded-for'] || [''])[0];

    BlacklistIP.findOne({ where: { ipAddress: userIP }}).then(ip => {
        let found: boolean = (ip) ? true : false;

        if(counter >= attemptLimit || req.path == '/login_failed'){
            ++counter
            if(counter >= attemptLimit || found) {
                ++timoutCounter;
                if(timoutCounter >= blacklistThreshold){
                    BlacklistIP.create({
                        ipAddress: userIP
                    });
                }
                res.redirect('/timeout');
            }else{
                next();
            }
        }else{
            if(req.user){ 
                counter = 0;
                timoutCounter = 0;
            }
            next();
        }
    }).catch(err => {
        if(err) {
            console.log(err);
            next();
        }
    });
}

export default failedLogin;
