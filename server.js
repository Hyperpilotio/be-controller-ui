const Koa = require("koa")
const next = require("next")
const Router = require("koa-router")
const logger = require("koa-logger")
const json = require("koa-json")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()


app.prepare()
.then(() => {
  const server = new Koa()
  const router = new Router()
  const apisRouter = require("./apis/router")

  server.use(logger());

  router.get("/node/:id", async ctx => {
    let query = Object.assign({}, ctx.params, ctx.query)
    await app.render(ctx.req, ctx.res, "/node", query)
    ctx.respond = false
  })

  router.get('*', async ctx => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })

  server.use(json())
  server.use(apisRouter.routes())

  server.use(router.routes())
  server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
