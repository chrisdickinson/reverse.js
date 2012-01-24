# Reverse.js

Tired of hard-coding endpoints in your client-side JS? Exhausted
from rewriting all of your redirects whenever you change your express
routes? Reverse match your routes with `reverse.js`:

````javascript

    var reverse = reverser([
        ['^path/to/([\\w\\d]+)/$', 'resource']
    ])

    var path = reverse('resource', ['garybusey'])
    // === 'path/to/garybusey/'

````

Works in browser and in Node (and with Django!) 

## With Express

````javascript

var express = require('express')
  , reverser = require('reverse')

app.get('/some/:path', function myController(req, resp, next) { })

app.reverse = reverser.express(app)

app.reverse('myController', ['thing']) // === '/some/thing'

````

## With Django

**Pending a setup.py.**

Add reversejs to your `INSTALLED_APPS`. In your template:

````django

{% load reversejs %}

{# expose all patterns available under 'testapp.urls' through the function `myreverse` #}
{% export_urls 'testapp.urls' as myreverse %}

```` 

Your client-side javascript now has the ability to reverse any endpoints
exposed by `'testapp.urls'`. If you're using named regexen in your routes,
you may use the optional `kwargs` argument to reverse those.

````javascript

var endpoint = myreverse('blog_detail', [], {'slug':'myslug'})

````

## License

MIT

