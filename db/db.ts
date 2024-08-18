import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize("mariadb://root@localhost:3306/purrweb");

const User = sequelize.define(
    'users',
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        timestamps: false
    }
);

const Column = sequelize.define(
    'columns',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        columnTitle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: false
    }
);

const Card = sequelize.define(
    'cards',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        cardTitle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cardText: {
            type: DataTypes.STRING,
            allowNull: false
        },
        columnId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: false
    }
);

const Comment = sequelize.define(
    'comments',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        authorId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cardId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: false
    }
);

User.sync().then(() => {
    console.log("User model synced");
});

Column.sync().then(() => {
    console.log("Column model synced");
});

Card.sync().then(() => {
    console.log("Card model synced");
});

Comment.sync().then(() => {
    console.log("Comment model synced");
});

User.hasMany(Column, { foreignKey: 'ownerId' });
Column.hasMany(Card, { foreignKey: 'columnId' });
Card.hasMany(Comment, { foreignKey: 'cardId' });

export { sequelize, User, Column, Card, Comment };