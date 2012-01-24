from django.conf.urls.defaults import patterns, url, include

blorp = lambda *A : None

urlpatterns = patterns('',
    url(r'^no/groups/$',            blorp, name='no-groups'),
    url(r'^(one)/group/$',          blorp, name='one-group'),
    url(r'^(two)/([\w\d]+)/$',      blorp, name='two-groups'),
    url(r'^include/',               include('core.included', namespace='include-no-group')),
    url(r'^include/([\w\d+])/',     include('core.included', namespace='include-one-group')),
    url(r'^(?P<named>[\w\d]+)/$',   blorp, name='one-named-group')
)
