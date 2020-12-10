import { sequelize } from '../config/config';
import { DataTypes, Model } from 'sequelize';

interface UserInstance extends Model {
    _id: string;
    contact: string;
    password: string;
}

const User = sequelize.define<UserInstance>('users', {
    _id: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false
    },
    contact: {
        unique: true,
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { timestamps: false });

export { User, UserInstance };
