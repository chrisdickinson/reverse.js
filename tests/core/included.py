from django.conf.urls.defaults import patterns, url, include

blorp = lambda *A : None

urlpatterns = patterns('',
    url(r'^included/$',                 blorp, name='included-no-groups'),
    url(r'^included/([\w\d]+)/$',       blorp, name='included-one-group'),
)
