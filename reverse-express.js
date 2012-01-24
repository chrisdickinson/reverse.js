var reverser = require('./index')

module.exports = function(app) {
  return reverser(Object.keys(app.routes.routes)
    .map(function(key) {
      return app.routes.routes[key]
    })
    .reduce(function(lhs, rhs) {
      return lhs.concat(rhs)
    }, [])
    .map(function(route) {
      return [route.regexp, route.callbacks[route.callbacks.length-1].name]
    }))
}
