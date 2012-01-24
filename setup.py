#!/usr/bin/env python
# -*- coding: utf-8 -*-
try:
    from setuptools import setup
except ImportError:
    from ez_setup import use_setuptools
    use_setuptools()
    from setuptools import setup

setup(
    name='django-reversejs',
    version='0.0.1',
    description='Provide Django URL reversing to your JavaScript code.',
    author='Chris Dickinson',
    author_email='chris@neversaw.us',
    url='http://github.com/chrisdickinson/reverse.js/',
    long_description=open('README.md', 'r').read(),
    packages=[
        'reversejs',
        'reversejs.templatetags',
    ],
    classifiers=[
        'Development Status :: 4 - Beta',
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Utilities'
    ],
)
