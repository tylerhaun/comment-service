import _ from "lodash";
import bluebird from "bluebird";


import CommentController from "../controllers/comment";

const debug = require("debug")(__filename);

function applyConstraints(value, min, max) {
    debug("applyConstraints()", value, min, max)
    var ret = value;
    if (ret < min) ret = min;
    debug(ret);
    if (ret > max) ret = max;
    debug(ret);
    return ret;
}

function getPaginationParams(
            request, 
            constraints={
                page: [0, Infinity],
                pageSize: [0,50]
            },
            defaults={
                page: 0,
                pageSize: 50
            }
        ) {
    debug("getPaginationParams()", constraints, defaults);

    var page = request.query.page;
    var pageSize = request.query.pageSize;

    page = (page != null ? page = page : defaults.page);
    pageSize = (pageSize != null ? pageSize : defaults.pageSize)
    debug({page, pageSize});

    page = applyConstraints(page, constraints.page[0], constraints.page[1])
    pageSize = applyConstraints(pageSize, constraints.pageSize[0], constraints.pageSize[1])
    debug({page, pageSize});

    var limit = pageSize;
    var offset = page * pageSize;

    var paginationParams = {limit, offset};

    return paginationParams;
}


module.exports = function(app, route) {

    app.route(route)
        .get(function main(request, response, next) {
            
            return bluebird.resolve().then(async function() {
                const commentController = new CommentController();
                const readQuery = {};
                
                var paginationParams = getPaginationParams(request, 
                    {
                        page: [0, Infinity],
                        pageSize: [0, 10]
                    }
                );
                var query = _.omit(request.query, ["page", "pageSize"]);
                console.log("paginationParams", paginationParams);
                var comments = await commentController.read(query, paginationParams);
                console.log("comments", comments);
                var total = await commentController.count(query);
                console.log("total", total);
                return response.json({comments, total});
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
