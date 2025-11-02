# website/celery.py
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'website.settings')

app = Celery('website')

# THIS LINE IS CRITICAL - it loads CELERY_* settings from Django
app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()