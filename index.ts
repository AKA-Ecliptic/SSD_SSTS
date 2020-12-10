import { app } from './app';
import bcrypt from 'bcrypt';
import { PORT, sequelize } from './config/config';
import { Comment } from './models/Comment';
import { Ticket } from './models/Ticket';
import { User } from './models/User';

sequelize.authenticate().then(() => {
    sequelize.sync();
    console.log('Connection has been established successfully.');
    // Uncomment to load test data
    sequelize.afterBulkSync(insertDummyData);
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

function insertDummyData(): void {
    User.findOne({ }).then(res => {
        if(!res) insertDummyUsers();
    });
}

function insertDummyUsers(): void {
    let testerPass: string = bcrypt.hashSync('tester', 10);
    let devOnePass: string = bcrypt.hashSync('devOne', 10);
    let devTwoPass: string = bcrypt.hashSync('devTwo', 10);
    let clientPass: string = bcrypt.hashSync('client', 10);

    User.bulkCreate([
        {
            _id: "tester",
            contact: "tester@mail.com",
            password: testerPass
        },
        {
            _id: "devOne",
            contact: "devOne@mail.com",
            password: devOnePass
        },
        {
            _id: "devTwo",
            contact: "devTwo@mail.com",
            password: devTwoPass
        },
        {
            _id: "client",
            contact: "client@mail.com",
            password: clientPass
        }

    ])
    .then(insertDummyTickets)
    .catch(err => console.log(err));  
}

function insertDummyTickets(): void {
    Ticket.bulkCreate([
        {
            title: 'UI bug on app',
            priority: 'LOW',
            status: 'OPEN',
            assigned_id: 'devOne',
            founder_id: 'tester',
            description: 'When selecting options in menu, menu can become dark if to many are selected.'
        },
        {
            title: 'UI lag',
            priority: 'MEDIUM',
            status: 'CLOSED',
            assigned_id: 'devOne',
            founder_id: 'tester',
            description: 'When too many images are loaded it causes UI lag.'
        },
        {
            title: 'App crashing on image submit',
            priority: 'HIGH',
            status: 'RESOLVED',
            assigned_id: 'devTwo',
            founder_id: 'client',
            description: 'When sugmitting too large an image the app will be stuck in a crash loop.'
        },

    ])
    .then(insertDummyComments)
    .catch(err => console.log(err)); 
}

function insertDummyComments(): void {
    Comment.bulkCreate([
        {
            user_id: 'client',
            ticket_id: '2',
            text: 'Perhaps the implementation of a low res feature would help?'
        },
        {
            user_id: 'tester',
            ticket_id: '2',
            text: 'I agree with @client, this feature may be useful.'
        },
        {
            user_id: 'devTwo',
            ticket_id: '3',
            text: 'Done! thanks for the ticket.'
        },
        {
            user_id: 'client',
            ticket_id: '3',
            text: 'Thanks for the quick fix, you are a life saver!'
        }

    ])
    .catch((res) => console.log("Data Loaded"))
    .catch(err => console.log(err)); 
}

const server = app.listen(PORT, () => { console.log(`Listening on port: ${PORT}`) });
