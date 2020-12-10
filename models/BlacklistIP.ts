import { sequelize } from '../config/config';
import { DataTypes, Model } from 'sequelize';

interface BlacklistIPInstance extends Model {
    _id: number;
    ipAddress: string;
    blockedDate: string;
}

const BlacklistIP = sequelize.define<BlacklistIPInstance>('blacklisted_ips', {
    _id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    blockedDate: {
        type: DataTypes.DATE,
        defaultValue: Date.now(),
        allowNull: false
    }
}, { timestamps: false });

export { BlacklistIP, BlacklistIPInstance };