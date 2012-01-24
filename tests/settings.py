ADMINS = (
    ('test@example.com', 'Mr. Test'),
)

INSTALLED_APPS = [
    'reversejs',
]

DATABASE_ENGINE = 'sqlite3'
DATABASE_NAME = 'reversejs.db'
TEST_DATABASE_NAME = 'reversejs-test.db'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.%s' % DATABASE_ENGINE,
        'NAME': DATABASE_NAME,
        'TEST_NAME': TEST_DATABASE_NAME,
    }
}

DEBUG = True
TEMPLATE_DEBUG = DEBUG
CACHE_BACKEND = 'locmem://'
ROOT_URLCONF = 'core.urls'
