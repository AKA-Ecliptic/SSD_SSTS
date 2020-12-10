import express, { Express } from 'express';
import { json, urlencoded } from 'body-parser';
import { join } from 'path';
import { router as home } from './routes/home';
import { router as users } from './routes/user';
import { router as login } from './routes/login';
import { router as tickets } from './routes/ticket';
import { router as timeout } from './routes/timeout';
import checkLogin from './middlewares/checkLogin';
import { session } from './config/config';
import passport from './config/passport';

let app: Express = express();

app.use(express.static(join(__dirname, 'public')));
app.use('/scripts', express.static(join(__dirname, 'public/scripts/dist')));
app.use('/jquery', express.static(join(__dirname, 'node_modules/jquery/dist')));
app.use('/bootstrap', express.static(join(__dirname, 'node_modules/bootstrap/dist')));

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(session);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', timeout);
app.use(checkLogin)
app.use('/', login);
app.use('/', home);
app.use('/users', users);
app.use('/tickets', tickets);

export { app };
