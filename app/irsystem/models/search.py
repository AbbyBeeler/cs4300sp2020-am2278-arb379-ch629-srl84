import spacy
from nltk.stem.snowball import SnowballStemmer

from app.irsystem.models.videos import get_video
from . import *

# test topics
# 'healthcare', 'terrorism', 'national security', 'gun policy', 'taxes',
# 'education', 'economy', 'immigration', 'abortion', 'federal deficit',
# 'climate change', 'environment', 'war', 'corona virus', 'covid 19'


nlp = spacy.load("en_core_web_sm")
stemmer = SnowballStemmer("english")

# if i is in result, return the exchange
# otherwise, create a new one
def get_exchange(i, transcript, added, result):
    if i in result:
        return result[i]
    elif i in added:
        # must be a response
        return get_exchange(transcript[i]['response'], transcript, added, result)
    else:
        added.add(i)
        result[i] = [transcript[i]]
        return result[i]


def exact_search(transcript, topic, candidates):
    topic = topic.lower()
    added = set()
    result = dict()
    for i, quote in enumerate(transcript):
        if i not in added and topic in quote['text'].lower() and (quote['speaker'] in candidates or len(candidates) == 0):
            # if in questions, then add question and all responses
            if quote['question'] and quote['response']:
                exchange = [quote]
                added.add(i)
                for q in quote['response']:
                    exchange.append(transcript[q])
                    added.add(q)
                result[i] = exchange
            # otherwise only add question (if not already) and response
            elif not quote['question'] and type(quote['response']) == int:
                added.add(i)
                first_i = quote['response']
                z = get_exchange(first_i, transcript, added, result)
                exchange = z
                exchange.append(quote)
    return result.values()


# tokenize, lemmatize, lowercase, and filter out stop words and punctuation
def tokenize(text):
    tokens = {stemmer.stem(token.text.lower()) for token in nlp(text) if not (token.is_punct or token.is_space or token.is_stop)}
    return tokens


def search(topics, candidates, debate_filters):
    # query: (OR candidates) AND (OR filters in title, tags, and description)

    # OR all of the candidates
    # TODO: remove debate filter
    debate_query = {'tags': 'debate'}
    if len(candidates) == 1:
        debate_query['candidates'] = candidates[0]
    elif len(candidates) > 1:
        debate_query['$or'] = [{'candidates': candidate} for candidate in candidates]

    # AND all words in a debate filter, OR the filters
    debates = []
    for debate in db.debates.find(debate_query):
        # TODO: tags?
        # filter debates by title, tags, and description
        debate_text = tokenize(debate['title']).union(
            tokenize(debate['description'])).union(
            tokenize(' '.join(debate['tags'])))

        if not debate_filters:
            debates.append(debate)
        for debate_filter in debate_filters:
            words = tokenize(debate_filter)
            if words.issubset(debate_text):
                debates.append(debate)
                break

    results = []
    for debate in debates:
        result = search_debate(debate, topics, candidates)
        if result is not None:
            results.append(result)

    # TODO: order debates by date and social component

    return results


def search_debate(debate, topics, candidates):
    relevant = []
    for topic in topics:
        for part in debate['parts']:
            for x in exact_search(part['text'], topic, candidates):
                relevant.append((part['video'], x))

    if relevant:
        relevant_transformed = []
        for video_link, quotes in relevant:
            relevant_transformed.append({
                "video": get_video(video_link),
                "quotes": [{
                    "speaker": quote['speaker'],
                    "candidate": quote['speaker'] in debate['candidates'],
                    "question": quote['question'],
                    "time": quote['time'],
                    "text": quote['text']
                } for quote in quotes]
            })

        return {
            "title": debate['title'],
            "date": debate['date'],
            "description": debate['description'],
            "results": relevant_transformed
        }
    return None
