from django.test import TestCase
from django.template import Template, Context

_ = Context
T = Template

class ReverseJSTemplateTagTestCase(TestCase):
    def test_okay_to_load(self):
        try:
            tpl = T("{% load reversejs %}")
            tpl.render(_({}))
        except:
            self.fail()

    def test_okay_to_use_tag(self):
        try:
            tpl = T("{% load reversejs %}\n{% export_urls %}")
            tpl.render(_({}))
        except Exception, e:
            self.fail(e)

    def test_can_include_specific_urls(self):

        tpl = T("""
            {% load reversejs %}
            {% export_urls core.included %}
        """)

        render = tpl.render(_({}))
        
