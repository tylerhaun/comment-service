const sqlite = require("sqlite");
const Sequelize = require("sequelize");
const bson = require("bson");

const debug = require("debug")(__filename);

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
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: true
        }
    },
    author: {
        type: Sequelize.STRING,
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

    read(query, options) {
        debug("read ", query);
        const finishedQuery = Object.assign({}, {where: query}, options);
        console.log("finishedQuery", finishedQuery);
        return this.model.findAll(finishedQuery);
    }

    update() {
        throw new Error("Not Implemented");
    }

    delete() {
        throw new Error("Not Implemented");
    }

    count(query) {
        return this.model.count({where: query})
    }

}

export default class CommentController extends CrudController {

    constructor() {
        super()
        this.model = model;
    }

}
