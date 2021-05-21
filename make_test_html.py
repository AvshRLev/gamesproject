# TEMPLATES = [                           # Setup Django templates backend 
#     {
#         'BACKEND': 'django.template.backends.django.DjangoTemplates',
#         'DIRS': ['games/templates'],
#     }
# ]
# ROOT_URLCONF = 'project.urls'

# from django.conf import settings
# settings.configure(TEMPLATES=TEMPLATES, ROOT_URLCONF=ROOT_URLCONF)

# import django
# django.setup()

# from django.template import Template, Context, loader
# template = open("games/templates/games/space_invaders.html" ).read()
# t = Template(template)
# c = Context({'name': 'world'})
# f = open("test.html", "w")
# x = t.render(c)
# f.write(x)
# f.close()
import os, sys

proj_path = "./"
# This is so Django knows where to find stuff.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")
sys.path.append(proj_path)

# This is so my local_settings.py gets loaded.
os.chdir(proj_path)

# This is so models get loaded.
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

from django.template import Template, Context, loader
template = open("games/templates/games/space_invaders.html" ).read()
t = Template(template)
c = Context({'name': 'world'})
f = open("test.html", "w")
x = t.render(c)
f.write(x)
f.close()