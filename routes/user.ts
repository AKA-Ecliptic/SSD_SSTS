import express, { Router } from 'express';
import { User, UserInstance } from '../models/User';

const router: Router = express.Router();

router.get('/', (req, res) => {
    if(req.user){
        let user: UserInstance = <UserInstance>req.user;
        res.send(user._id).end(200);
    }
});

router.get('/all', (req, res) => {
    if(req.user){
        User.findAll({
            attributes: [
                '_id'
            ]
        }).then(results => {
            let users: Object[] = [];
            if(results){
                results.forEach(user => users.push(user.get('_id')));
                res.send(users).end();
            }
        }).catch(err => { if(err) console.log(err) });
    }
});

export { router };
