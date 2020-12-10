import express, { Router } from 'express';
import { options } from '../config/config';

const router: Router = express.Router();

router.get('/', (req, res) => {
    res.sendFile('index.html', options);
});

export { router };
