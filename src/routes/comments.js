import bluebird from "bluebird";
import CommentController from "../controllers/comment";

const debug = require("debug")(__filename);


module.exports = function(app, route) {

    app.route(route)
        .get(function main(request, response, next) {
            
            return bluebird.resolve().then(async function() {
                const commentController = new CommentController();
                var comments = await commentController.read(request.query);
                return response.json({comments});
            })
            .catch(next)

        })
        .post(function main(request, response, next) {

            return bluebird.resolve().then(async function() {
                const commentController = new CommentController();
                var comment = await commentController.create(request.body);
                return response.json({comment});
            })
            .catch(next)
            
        })

}
