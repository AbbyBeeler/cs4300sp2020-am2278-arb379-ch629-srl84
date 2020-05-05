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

    results, topics = search(topics, candidates, debate_filters, False)
    return {'results': results, 'query': topics}

@irsystem.route('/exactsearch', methods=['POST'])
def esearch():
    data = request.get_json()
    # data format: {'topics': [], 'candidates': [], 'debates': []}
    topics = data['topics']
    candidates = data['candidates']
    debate_filters = data['debates']

    results, topics = search(topics, candidates, debate_filters, True)
    return {'results': results, 'query': topics}


@irsystem.route('/candidates', methods=['GET'])
def candidate_list():
    candidates = get_candidates()
    debates = get_debate_titles_tags()



    return {'candidates': candidates, 'debates': debates}


@irsystem.route('/debates', methods=['GET'])
def debate_list():
    return get_debate_titles_tags()

