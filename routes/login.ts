import express, { Router } from 'express';
import passport from '../config/passport';
import { options } from '../config/config';
import failedLogin from '../middlewares/failedLogin';

const router: Router = express.Router();

router.get('/login', failedLogin, (req, res) => {
    if(req.user){
        res.redirect('/');
    }else{
        res.sendFile('login.html', options);
    }
});

router.get('/logout', (req, res) => {
    if(req.user){
        req.session.destroy((err) => {  
            res.status(200).end();
        });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', { 
        successRedirect: '/login_success',
        failureRedirect: '/login_failed' 
    })(req, res, next);
});

router.get('/login_failed', failedLogin, (req, res) => {
    res.redirect('/login');
});

router.get('/login_success', failedLogin, (req, res) => {
    res.redirect('/');
});

export { router };
