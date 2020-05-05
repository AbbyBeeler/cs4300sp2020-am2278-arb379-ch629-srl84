from flask import Blueprint
from app import static_folder, template_folder

# Define a Blueprint for this module (mchat)
irsystem = Blueprint('irsystem', __name__, url_prefix='/',
                     static_folder=static_folder,
                     template_folder=template_folder)

TYPE_TAGS = {'debate', 'town hall', 'speech', 'interview'}

# Import all controllers
from .controllers.search_controller import *
