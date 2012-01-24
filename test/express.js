var express = require('express')
  , assert = require('assert')
  , reverser = require('..')

suite("test that reverser works with express", function() {
  test("test that reverse picks up routes from express", function() {
    var app = express.createServer()

    app.get('/some/path', function path(){})
    app.post('/some/:path', function other_path(){})

    var reverse = reverser.express(app)

    assert.equal(reverse('path'), '/some/path/')
    assert.equal(reverse('other_path', ['something']), '/some/something/')

  })
})
