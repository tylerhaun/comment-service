const sqlite = require("sqlite");
const Sequelize = require("sequelize");
const bson = require("bson");

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite"
});


var model = sequelize.define("comment", {
    id: {
        type: Sequelize.STRING,
        defaultValue: () => {var ret = String(new bson.ObjectId());console.log("EWEQEQWEQWEEFDEEV V FEVEEFR", ret);return ret;},
        primaryKey: true,
    },
    name: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: true
        }
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: true
        }
    },
    postId: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: true
        }
    }
}, {
    timestamps: true
});

sequelize.sync();

class CrudController {

    create(data) {
        if (!Array.isArray(data)) {
            data = [data];
        }
        return this.model.bulkCreate(data);
    }

    read(query) {
        return this.model.findAll(query);
    }

    update() {
        throw new Error("Not Implemented");
    }

    delete() {
        throw new Error("Not Implemented");
    }

}

export default class CommentController extends CrudController {

    constructor() {
        super()
        this.model = model;
    }

}
