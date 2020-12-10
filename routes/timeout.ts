import express, { Router } from 'express';

const router: Router = express.Router();

router.get('/timeout', (req, res) => {
    if(req.user){
        res.redirect('/');
    }
    res.send('Get Blocked').end();
});

export { router };
