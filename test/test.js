if(typeof module !== 'undefined') {
  reverser = require('..')
  assert = require('assert')
}

suite('Test of reverser', function() {
  test('reverser accepts simple args', function() {
    var reverse = reverser([
      ['^lol/$', 'lol']
    , ['^asdf/$', 'asdf']
    ])

    assert.equal(reverse('lol'), 'lol/')
    assert.equal(reverse('asdf'), 'asdf/')
  })

  test('reverser accepts single groups', function() {
    var reverse = reverser([
      [/([\w\d]+)\/hey\/$/, 'greeting']
    ])
  
    var name = 'hey'+~~(Math.random()*100)

    assert.equal(reverse('greeting', [name]), name+'/hey/')
  })

  test('reverser will return appropriate match for name with specific arg', function() {
    var reverse = reverser([
      [/([\w\d]+)\/hey\/$/, 'greeting']
    , [/(gary)\/hey\/$/,    'greeting']
    , [/lol\/hey\/$/,       'greeting']
    ])
  
    var name = 'hey'+~~(Math.random()*100)

    assert.equal(reverse('greeting', [name]), name+'/hey/')
    assert.equal(reverse('greeting', ['gary']), 'gary/hey/')
    assert.equal(reverse('greeting'), 'lol/hey/')
  })

  test('reverser may accept python-style named groups', function() {
    var reverse = reverser([
      ['(?P<name>[\\d\\w\\-]+)/yes/$', 'named']
    ])

    var name = 'hey'+~~(Math.random()*100)

    assert.equal(reverse('named', [], {name:name}), name+'/yes/')
    assert.strictEqual(reverse('named', [], {}), null)
  }) 

  test('reverser may accept a mix of python-style named groups and normal capture groups', function() {
    var reverse = reverser([
      ['(?P<name>[\\d\\w\\-]+)/yes/([\\w\\d\\-]+)/$', 'named']
    ])

    var name = 'hey'+~~(Math.random()*100)

    assert.equal(reverse('named', [name], {name:name}), name+'/yes/'+name+'/')
    assert.strictEqual(reverse('named', [], {name:name}), null)
    assert.strictEqual(reverse('named', [name], {}), null)
  })

  test('reverser may accept multiple normal capture groups', function() {
    var reverse = reverser([
      [/([\w\d\-]+)\/([\w\d\-]+)\/(?:[\w\d\-]+)/, 'multi']
    ])

    var names = ['name1', 'name-2', 'name-3-three']

    assert.equal(reverse('multi', names), names.join('/'))
    assert.equal(names.length, 3)
  })
})
