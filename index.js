;(function() {

var json = typeof JSON !== 'undefined' ?
  JSON.parse :
  function(x) { return Function('return '+x) }


function Route(route, idx) {
  this.regex = route[0].source || route[0]
  this.name = route[1]
  this.idx = idx

  if(this.regex)
    this.parsed = this.parse(this.regex)
}

Route.parse = function(x) {
  var src     = x.replace(/[\^\$]/g, '')
    , tokens  = []
    , re      = /\((.*?)\)/
    , match
    , groups  = 0
    , text    = function(str) {
        return function() {
          return str.replace(/(\.|\*|\+|\\w|\\)/g, '')
        }
      }
    , rex     = function(exp) {
        ++groups
        var name
          , idx

        // support for named match groups
        if(exp.indexOf('?P<') !== -1) {
          idx = exp.indexOf('>')
          name = exp.slice('?P<'.length+1, idx)
          exp = '('+exp.slice(idx+1)

          return function(values, kwargs) {
            if(kwargs[name] === undefined)
              return null

            return new RegExp('^'+exp+'$').test(kwargs[name]) ? kwargs[name] : null
          }
        }

        return function(values, kwargs) {
          var value = values.shift()
          if(value === undefined)
            return null

          return new RegExp('^'+exp+'$').test(value) ? value : null
        }
      }

  while(src.length) {
    match = re.exec(src)
    if(!match) {
      tokens.push(text(src))
      src = ''
      continue
    }

    tokens.push(text(src.slice(0, match.index)))
    tokens.push(rex(src.slice(match.index, match.index+match[0].length)))
    src = src.slice(match.index + match[0].length)
  }

  return function(args, kwargs) {
    var values = args.slice()
      , results = []
      , result

    for(var i = 0, len = tokens.length; i < len; ++i) {
      result = tokens[i](values, kwargs)
      if(result === null) return null

      results.push(result)
    }

    return results.join('')
  }
}

Route.prototype.parse = Function('x', 'return this.constructor.parse(x)')

Route.prototype.match = function(args, kwargs) {
  return this.parsed(args, kwargs)
}

function items_reverser(items) {
  // expected: [[REGEX, NAME], ...]
  var routes = []
    , len

  for(var i = 0, len = items.length; i < len; ++i) {
    routes.push(new Route(items[i], i))
  }

  return function(name, args, kwargs) {
    var matched

    args = args || []
    kwargs = kwargs || {}

    for(var i = 0; i < len; ++i) {
      if(routes[i].name === name && (matched = routes[i].match(args, kwargs))) {
        return matched
      }
    }

    return null
  }
}

function ajax_reverser(endpoint) {
  var xhr = new XMLHttpRequest
    , data

  xhr.open('GET', endpoint, false)
  xhr.send(null)

  if(xhr.status !== 200)
    throw new Error('Could not divine url structure via endpoint `'+endpoint+'`.')

  data = json(xhr.responseText)  

  if(typeof data !== 'object' || !data || !data.routes || !data.routes.length)
    throw new Error('XHR routes must be in the form: {routes:[[REGEX, NAME], ...]}.')

  return items_reverser(data.routes)
}

function reverser(map) {
  var items = map.slice()

  if(typeof items === 'string')
    return ajax_reverser(items)

  return items_reverser(items)
}

if(typeof module !== 'undefined') {
  module.exports = reverser
  module.exports.express = require('./reverse-express')
} else
  window.reverser = reverser

})()
