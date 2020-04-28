from app import app, socketio

import os
import spacy

spacy.cli.download('en_core_web_sm')

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print("Flask app running at http://0.0.0.0:" + str(port))
    socketio.run(app, host="0.0.0.0", port=port)
