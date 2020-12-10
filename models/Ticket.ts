import { sequelize } from '../config/config';
import { DataTypes, Model } from 'sequelize';
import { User } from './User';

interface TicketInstance extends Model {
    _id: number;
    title: string;
    posted: Date;
    priority: ['LOW', 'MEDIUM', 'HIGH'];
    status: ['OPEN', 'RESOLVED', 'CLOSED'];
    assigned_id: string;
    founder_id: string;
    description: string;
}

const Ticket = sequelize.define<TicketInstance>('tickets', {
    _id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    posted: {
        type: DataTypes.DATE,
        defaultValue: Date.now(),
        allowNull: false
    },
    priority: {
        type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'),
        defaultValue: 'LOW',
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('OPEN', 'RESOLVED', 'CLOSED'),
        defaultValue: 'OPEN',
        allowNull: false
    },
    assigned_id: {
        type: DataTypes.STRING,
        defaultValue: 'Unassigned',
        allowNull: false
    },
    founder_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { timestamps: false });

Ticket.belongsTo(User, { foreignKey: 'assigned_id' });
Ticket.belongsTo(User, { foreignKey: 'founder_id' });

export { Ticket, TicketInstance };
