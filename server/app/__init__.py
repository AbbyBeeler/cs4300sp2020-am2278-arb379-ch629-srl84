# Gevent needed for sockets
from gevent import monkey
monkey.patch_all()

# Imports
import os
from flask import Flask, render_template
from flask_socketio import SocketIO
from pymongo import MongoClient

# Configure app
socketio = SocketIO()
app = Flask(__name__, static_folder='../../client/build/static',
            template_folder="../../client/build")
app.config.from_object(os.environ["APP_SETTINGS"])

# DB
client = MongoClient(app.config['MONGO_URI'])
db = client[app.config['MONGO_DBNAME']]
debates_table = db[app.config['MONGO_DBCOLLECTION']]

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
    return render_template("404.html"), 404
