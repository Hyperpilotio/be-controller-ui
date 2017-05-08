const fs = require("fs")

let path = "node_modules/dygraphs/package.json"

let dygraphsPackage = JSON.parse(fs.readFileSync(path))

dygraphsPackage.module = "index.es5"

fs.writeFileSync(path, JSON.stringify(dygraphsPackage))
