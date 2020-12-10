import express, { Router } from 'express';
import { UserInstance } from '../models/User';
import sanitiseInput from '../helpers/checkInput';
import { Ticket, TicketInstance } from '../models/Ticket';
import { Comment, CommentInstance } from '../models/Comment';
import { Op } from 'sequelize';

const router: Router = express.Router();

router.get('/', (req, res) => {
    if(req.user){
        let user: UserInstance = <UserInstance>req.user;
        Ticket.findAll({ 
            attributes: [
                '_id',
                'title',
                'posted',
                'priority',
                'status'
            ],
            where: {
                [Op.or]: [
                    { assigned_id: user._id },
                    { founder_id: user._id }
                ]
            }
        }).then(results => {
            let tickets: Object[] = [];
            if(results){
                results.forEach(ticket => tickets.push(ticket.get()));
            }
            res.send(tickets).end();
        }).catch(err => { if(err) console.log(err) });
    }
});

router.get('/get/:id', (req, res) => {
    if(req.user){
        if(req.params.id){
            let ticket_id: number = Number.parseInt(req.params.id);
            Ticket.findOne({
                where: {
                    _id: ticket_id
                },
                include: [Comment]
            }).then(result => {
                let ticketComments: any;
                let comments: any[] = [];
                if(result){
                    (<any[]>result.get('comments')).forEach(comment => {
                        comments.push(comment.get());
                    });
                    ticketComments = result.get({ clone: true });
                    ticketComments.comments = comments;
                    res.send(ticketComments).end();
                }
            }).catch(err => { if(err) console.log(err) });
        }
    }
});

router.get('/all', (req, res) => {
    if(req.user){
        Ticket.findAll({
            attributes: [
                '_id',
                'title',
                'posted',
                'priority',
                'status'
            ]
        }).then(results => {
            let tickets: Object[] = [];
            if(results){
                results.forEach(ticket => tickets.push(ticket.get()));
                res.send(tickets).end();
            }
        }).catch(err => { if(err) console.log(err) });
    }
});

router.post('/comment', (req, res) => {
    if(req.user){
        let user: string = (<UserInstance>req.user)._id;
        let ticket: number = <number>(req.body.ticket);
        let text: string = <string>(req.body.text);
        Comment.create({
            user_id: user,
            ticket_id: ticket,
            text: sanitiseInput(text)
        }).then(inserted => {
            let comment: CommentInstance = inserted.get();
            comment.posted = new Date(inserted.get('posted'));
            res.send(comment).end(200);
        }).catch(err => {
            if(err) console.log(err);
        });
    }
});

router.post('/new', (req, res) => {
    if(req.user){
        let user: string = (<UserInstance>req.user)._id;
        let toAdd: any = req.body;

        Ticket.create({
            title: sanitiseInput(toAdd.title),
            priority: toAdd.priority,
            assigned_id: toAdd.assigned,
            founder_id: user,
            description: sanitiseInput(toAdd.description)
        }).then(inserted => {
            let ticket: TicketInstance = inserted.get();
            ticket.posted = new Date(inserted.get('posted'));
            res.redirect('/');
        }).catch(err => {
            if(err) console.log(err);
        });
    }
});

router.post('/update/:id', (req, res) => {
    if(req.user){
        if(req.params.id){
            let user_id: string = (<UserInstance>req.user)._id;
            let ticket_id: number = Number.parseInt(req.params.id);
            let toUpdate: any = req.body;
            
            Ticket.update({
                priority: toUpdate.priority,
                status: toUpdate.status
            },{
                where: { 
                    _id: ticket_id, 
                    [Op.or]: [
                        { assigned_id: user_id },
                        { founder_id: user_id }
                    ] 
                }
            }).then(updated => {
                res.redirect('/');
            }).catch(err => {
                if(err) console.log(err);
            });
        }
    }
});

router.post('/delete/:id', (req, res) => {
    if(req.user){
        if(req.params.id){
            let user_id: string = (<UserInstance>req.user)._id;
            let ticket_id: number = Number.parseInt(req.params.id);
            
            Ticket.destroy({
                where: { 
                    _id: ticket_id, 
                    [Op.or]: [
                        { assigned_id: user_id },
                        { founder_id: user_id }
                    ] 
                }
            }).then(deleted => {
                if(deleted)
                    res.status(200).end();
            }).catch(err => {
                if(err) console.log(err);
            });
        }
    }
});

export { router };
