from . import *  
from app.irsystem.models.helpers import *
from app.irsystem.models.helpers import NumpyEncoder as NumpyEncoder
from app.irsystem.models.search import search


@irsystem.route('/search', methods=['POST'])
def on_input_change():
    data = request.get_json()
    # data format: {'topics': [], 'candidates': [], 'debates': []}
    topics = data['topics']
    candidates = data['candidates']
    debate_filters = data['debates']

    results = search(topics, candidates, debate_filters)
    return {'results': results}

