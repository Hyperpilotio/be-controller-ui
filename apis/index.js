const Router = require("koa-router")
const router = module.exports = new Router({ prefix: "/apis" })

router.get("/controller-log", require("./controller-log"))
