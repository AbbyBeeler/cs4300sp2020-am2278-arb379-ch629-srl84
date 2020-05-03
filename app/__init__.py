# Gevent needed for sockets
from gevent import monkey
monkey.patch_all()

# Imports
import os
import json
from collections import defaultdict
from flask import Flask, render_template
from flask_socketio import SocketIO
from pymongo import MongoClient
from config import basedir

# paths
static_folder = basedir + '/build/static'
template_folder = basedir + '/build'

# Configure app
socketio = SocketIO()
app = Flask(__name__, static_folder=static_folder,
            template_folder=template_folder)
app.config.from_object(os.environ["APP_SETTINGS"])

# DB
client = MongoClient(app.config['MONGO_URI'])
db = client[app.config['MONGO_DBNAME']]

# Query Expansion
term_dictionary = json.load(open(basedir + '/app/data/dictionary.json'))

# Import + Register Blueprints
from app.irsystem import irsystem as irsystem
app.register_blueprint(irsystem)

# Initialize app with SocketIO
socketio.init_app(app)


@app.route('/')
def new_view():
    return render_template('index.html')


# HTTP error handling
@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404
