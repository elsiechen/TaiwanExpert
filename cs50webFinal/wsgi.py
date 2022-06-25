"""
WSGI config for TaiwanExpert project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'TaiwanExpert.settings')

application = get_wsgi_application()

os.environ["SECRET_KEY"] = "django-insecure-4q@*vte&w_ae)e93rpwru5l4^9rgnf_hell)&y8c*#&x2kwqpg"