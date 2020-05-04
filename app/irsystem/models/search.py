from datetime import timedelta

import pymongo
import spacy
from nltk.stem.snowball import SnowballStemmer

from app.irsystem import TYPE_TAGS
from app.irsystem.models.videos import get_video
from . import *

# test topics
# 'healthcare', 'terrorism', 'national security', 'gun policy', 'taxes',
# 'education', 'economy', 'immigration', 'abortion', 'federal deficit',
# 'climate change', 'environment', 'war', 'corona virus', 'covid 19'


nlp = spacy.load('en_core_web_sm')
stemmer = SnowballStemmer('english')


# if i is in result, return the exchange
# otherwise, create a new one
def get_exchange(i, transcript, added, result, topic, topic_expansion):
    if i in result:
        return result[i]
    elif i in added:
        # must be a response
        return get_exchange(transcript[i]['response'], transcript, added, result, topic, topic_expansion)
    else:
        added.add(i)
        score = transcript[i]['text'].count(topic) + sum(transcript[i]['text'].count(t)/2 for t in topic_expansion)
        result[i] = ([transcript[i]], score)
        return result[i]


def exact_search(transcript, topic, candidates, topic_expansion):
    topic = topic.lower()
    added = set()
    result = dict()
    for i, quote in enumerate(transcript):
        if i not in added and topic in quote['text'].lower() and (quote['speaker'] in candidates or len(candidates) == 0):
            # if in questions, then add question and all responsesa
            if quote['question'] and quote['response']:
                exchange = [quote]
                added.add(i)
                score = quote['text'].count(topic)
                score += sum(quote['text'].count(t)/2 for t in topic_expansion)
                for q in quote['response']:
                    exchange.append(transcript[q])
                    score += sum(transcript[q]['text'].count(t)/2 for t in topic_expansion)
                    score += transcript[q]['text'].count(topic)
                    added.add(q)
                result[i] = (exchange, score)
            # otherwise only add question (if not already) and response
            elif not quote['question'] and type(quote['response']) == int:
                added.add(i)
                first_i = quote['response']
                z, score = get_exchange(first_i, transcript, added, result, topic, topic_expansion)
                exchange = z
                exchange.append(quote)
                score = score + quote['text'].count(topic) + sum(quote['text'].count(t)/2 for t in topic_expansion)
                result[first_i] =  (exchange, score)
    return result.values()


def query_expansion(topics): 
    expansion = []
    for topic in topics:
        tokens = topic.split()
        for token in tokens: 
            if token in term_dictionary:
                expansion.extend([term_dictionary[token][i] for i in range(3)])
    return expansion


# tokenize, lemmatize, lowercase, and filter out stop words and punctuation
def tokenize(text):
    tokens = {stemmer.stem(token.text.lower()) for token in nlp(text) if not (token.is_punct or token.is_space or token.is_stop)}
    return tokens


def get_candidate_info(candidate_name, election, date):
    # get polling data
    polls = db.polls.find_one({'candidate_race': candidate_name + '_' + election})
    if polls is not None:
        polls = sorted(polls['polls'], key=lambda x: x['date'], reverse=True)

        shifted_date = date + timedelta(days=1)  # day of polling won't be affected
        pre_date = date - timedelta(weeks=4)
        after_date = date + timedelta(weeks=4)

        # limit after_date to before next debate
        other_debates = db.debates.find_one({'candidates': candidate_name,
                                             'tags': 'debate',
                                             'date': {'$gt': date, '$lt': after_date}},
                                            sort=[('date', pymongo.ASCENDING)])
        if other_debates is not None:
            after_date = other_debates['date']

        # get the closest poll to before the debate and after roughly 4 weeks
        before = next((x for x in polls if pre_date <= x['date'] < shifted_date), False)
        after = next((x for x in polls if shifted_date <= x['date'] <= after_date), False)

        if before and after and before['pct'] != 0:
            pct_change = round((after['pct'] - before['pct']) / before['pct'] * 100, 2)
            return {'name': candidate_name, 'pct_change': pct_change}

    # can't calculate change if no polls in the range
    return {'name': candidate_name, 'pct_change': None}


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
            election = next(x for x in debate['tags'] if x not in TYPE_TAGS)
            result['candidates'] = [get_candidate_info(x, election, debate['date']) for x in debate['candidates']]
            results.append(result)

    # order debates by date
    results = sorted(results, key=lambda x: x['date'], reverse=True)

    # make date pretty
    for debate in results:
        debate['date'] = f"{debate['date']:%B} {debate['date'].day}, {debate['date'].year}"

    return results


def search_debate(debate, topics, candidates):

    topic_expansion = query_expansion(topics)
    topic_expansion.extend(topics)
    
    relevant = []
    for topic in topics:
        for part in debate['parts']:
            for x, score in exact_search(part['text'], topic, candidates, topic_expansion):
                relevant.append((part['video'], x, score))

    if relevant:
        relevant_transformed = []
        relevant.sort(key = lambda x: x[2], reverse=True)
        for video_link, quotes, _ in relevant:
            relevant_transformed.append({
                'video': get_video(video_link),
                'quotes': [{
                    'speaker': quote['speaker'],
                    'candidate': quote['speaker'] in debate['candidates'],
                    'question': quote['question'],
                    'time': quote['time'],
                    'text': quote['text']
                } for quote in quotes]
            })

        return {
            'title': debate['title'],
            'date': debate['date'],
            'description': debate['description'],
            'tags': debate['tags'],
            'results': relevant_transformed
        }
    return None
