from django import template
from django.conf import settings
from django.core.urlresolvers import RegexURLResolver
from django.utils.importlib import import_module
from django.utils.safestring import mark_safe

register = template.Library()

def get_structure_from_urls(patterns):

    def get_name(rex):
        if rex.name:
            return rex.name

        if not callable(rex.callback):
            return rex.callback

        if hasattr(rex.callback, 'func_name'):
            return rex.callback.func_name

        # wrong!
        return type(rex.callback).__name__

    def recurse_into_patterns(insert, prefix, patterns, namespaces):
        for rex in patterns:
            src = rex.regex.pattern
            if hasattr(rex, 'url_patterns'):
                recurse_into_patterns(
                    insert,
                    prefix+src,
                    rex.url_patterns,
                    namespaces + (hasattr(rex, 'namespace') and [rex.namespace] or [])
                )
            else:
                name = src
                if name[0] == '^':
                    name = name[1:]
                name = prefix+src
                insert([name, ':'.join(namespaces + [get_name(rex)])])

    result = []
    recurse_into_patterns(result.append, '',  patterns.url_patterns, [])
    return result


class ExportNode(template.Node):
    def __init__(self, url_module_name, as_name, *args, **kwargs):
        self.url_module_name = url_module_name
        self.as_name = as_name
        return super(ExportNode, self).__init__(*args, **kwargs)

    def render(self, context):
        try:
            module = import_module(self.url_module_name)
            urls = getattr(module, 'urlpatterns') 

            structure = get_structure_from_urls(RegexURLResolver('^', urls))

            template = '<script type="text/javascript">window.{name} = reverser({urls})</script>'

            return mark_safe(template.format(name=self.as_name, urls=structure))
        except AttributeError, e:
            return u''
        except ImportError, e:
            return u''

def quelch(fn, *args, **kwargs):
    try:
        return fn(*args, **kwargs)
    except:
        return None

def export_urls(parser, token):
    """
        {% export_urls ['path.to.urls'] [as <name>] %}
    """
    bits = token.contents.split()
    as_offs = quelch(bits.index, 'as')
    _as = 'reverse'
    _base = settings.ROOT_URLCONF 

    if as_offs is not None:
        _as = quelch(bits.__getitem__, as_offs+1) or 'reverse'

    if as_offs > 1 or (as_offs is None and len(bits) > 1):
        _base = bits[1]

    return ExportNode(_base, _as)

register.tag('export_urls', export_urls) 
