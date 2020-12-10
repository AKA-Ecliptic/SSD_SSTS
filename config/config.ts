import { join } from 'path';
import dotenv, { DotenvConfigOutput } from 'dotenv'; 
import expressSession, { Store } from 'express-session';
import sessionFileStore, { FileStore } from 'session-file-store';
import { Sequelize } from 'sequelize';
import logDB from '../helpers/logDatabase';

const result: DotenvConfigOutput = dotenv.config({ path: join(__dirname, 'store/.env')});
if(result.error) { console.log(result.error) }

const SESSION_MAX_AGE: number = 5 * 60 * 1000;
const SESSION_SECRET: string = (process.env.SESSION_SECRET) ? process.env.SESSION_SECRET : 'YEET';

const fileStore: FileStore = sessionFileStore(expressSession);
const storeLocation: string = join(__dirname, 'store/sessions');
const fileStoreOptions: Object = {
    path: storeLocation,
    logFn: () => {}
}

const store: Store = new fileStore(fileStoreOptions);

const options: Object = {
    root: join(__dirname, '../public', 'pages')
};

const PORT: string = process.env.PORT || '7000';

const sequelize: Sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: join(__dirname, '../database.db'),
    logging: logDB,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 15000
    }
});

const session = expressSession({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: SESSION_MAX_AGE, httpOnly: true }
});

export { options, PORT, sequelize, session };
