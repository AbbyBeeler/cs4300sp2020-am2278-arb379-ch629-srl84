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

# paths
static_folder = '../build/static'
template_folder = '../build'

# Configure app
socketio = SocketIO()
app = Flask(__name__, static_folder=static_folder,
            template_folder=template_folder)
app.config.from_object(os.environ["APP_SETTINGS"])

# DB
client = MongoClient(app.config['MONGO_URI'])
db = client[app.config['MONGO_DBNAME']]

# Query Expansion
term_dictionary = json.load(open('app/data/dictionary.json'))

# Polling Data
polling_dictionary = defaultdict(list, json.load(open('app/data/polling.json')))

# Import + Register Blueprints
from app.irsystem import irsystem as irsystem
app.register_blueprint(irsystem)

# Initialize app w/SocketIO
socketio.init_app(app)


@app.route('/')
def new_view():
    return render_template('index.html')


# HTTP error handling
@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404
