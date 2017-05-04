const _ = require("lodash")
const fetch = require("isomorphic-fetch")

const apis = [ "controller-log", "get-nodes", "get-settings" ]

const defineRoutes = () => {
  const Router = require("koa-router")
  const router = new Router({ prefix: "/apis" })

  apis.forEach(name => router.get(`/${name}`, require(`./${name}`)))
  return router
}

const defineApiFunctions = () => {
  let funcs = {}

  if (typeof window === "undefined") {

    apis.forEach(name => {
      funcs[_.camelCase(name)] = async query => {
        debugger;
        let context = {
          request: { query },
          body: null
        }
        let apiFunc = require(`./${name}`)
        await apiFunc(context)
        return context.body
      }
    })

  } else {

    apis.forEach(name => {
      funcs[_.camelCase(name)] = async query => {
        let res = await fetch(`/apis/${name}`)
        return await res.json()
      }
    })

  }

  return funcs
}


if (typeof window === "undefined") {
  module.exports.router = defineRoutes()
}
module.exports.apis = defineApiFunctions()
