from app.irsystem.models.helpers import get_candidates, get_debate_titles_tags
from app.irsystem.models.search import search
from . import *


@irsystem.route('/search', methods=['POST'])
def debates():
    data = request.get_json()
    # data format: {'topics': [], 'candidates': [], 'debates': []}
    topics = data['topics']
    candidates = data['candidates']
    debate_filters = data['debates']

    results = search(topics, candidates, debate_filters)
    return {'results': results}


@irsystem.route('/candidates', methods=['GET'])
def candidate_list():
    return get_candidates()


@irsystem.route('/debates', methods=['GET'])
def debate_list():
    return get_debate_titles_tags()

