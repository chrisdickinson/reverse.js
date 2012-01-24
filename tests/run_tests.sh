#!/bin/bash

PYTHONPATH=$PWD:$PWD/..${PYTHONPATH:+:$PYTHONPATH}
export PYTHONPATH

django-admin.py test reversejs --settings=settings

