import { sequelize } from '../config/config';
import { DataTypes, Model } from 'sequelize';
import { Ticket } from './Ticket';
import { User } from './User';

interface CommentInstance extends Model {
    _id: number;
    user_id: string;
    ticket_id: string;
    posted: Date;
    text: string;
}

const Comment = sequelize.define<CommentInstance>('comments', {
    _id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ticket_id: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    posted: {
        type: DataTypes.DATE,
        defaultValue: Date.now(),
        allowNull: false
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { timestamps: false });

Comment.belongsTo(User, { foreignKey: 'user_id' });
Comment.belongsTo(Ticket, { foreignKey: 'ticket_id' });

Ticket.hasMany(Comment, { foreignKey: 'ticket_id' });

export { Comment, CommentInstance };
