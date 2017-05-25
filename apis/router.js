const apis = require("./index").apis

const Router = require("koa-router")

let router = module.exports = new Router({ prefix: "/apis" })

for (let name of apis) {
  let handler = require(`./${name}`)
  let wrapper = async ctx => {
    try {
      await handler(ctx)
    } catch (e) {
      ctx.status = 500
      let { name, message, stack } = e
      console.error(e)
      // For debugging purpose
      ctx.body = { error: { name, message, stack } }
      // if (process.env.NODE_ENV !== "production")
      //   ctx.body = { error: { name, message, stack } }
      // else
      //   ctx.body = { error: "Internal Server Error" }
    }
  }
  router.get(`/${name}`, wrapper)
}
