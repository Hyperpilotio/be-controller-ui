const apis = require("./index").apis

const Router = require("koa-router")

let router = module.exports = new Router({ prefix: "/apis" })

for (let name of apis)
  router.get(`/${name}`, require(`./${name}`))
