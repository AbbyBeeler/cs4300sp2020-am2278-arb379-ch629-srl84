import re

import requests
from bs4 import BeautifulSoup

from . import *


# test topics
# 'healthcare', 'terrorism', 'national security', 'gun policy', 'taxes',
# 'education', 'economy', 'immigration', 'abortion', 'federal deficit',
# 'climate change', 'environment', 'war', 'corona virus', 'covid 19'


# save video links so we don't have to requery
# TODO: this should go in a database
videos = dict()


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
        if i not in added and topic in quote['text'].lower() and (quote['speaker'].lower() in candidates or len(candidates) == 0):
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


def search(topics, candidates, debate_filters):
    candidates = [candidate.lower() for candidate in candidates]

    topic_expansion = query_expansion(topics)
    topic_expansion.extend(topics)

    # TODO: add in candidate filtering
    # filter debates by title, tags, date, and description
    # right now filter by debate
    debates = dict()
    if debate_filters:
        for debate_filter in debate_filters:
            for debate in debates_table.find({'title': debate_filter}):
                debates[debate['url']] = debate
            for debate in debates_table.find({'tags': debate_filter}):
                debates[debate['url']] = debate
            for debate in debates_table.find({'date': debate_filter}):
                debates[debate['url']] = debate
            for debate in debates_table.find({'description': debate_filter}):
                debates[debate['url']] = debate

        debates = [v for v in debates.values() if 'debate' in v['tags']]
    else:
        debates = debates_table.find({'tags': 'debate'})

    results = []
    for debate in debates:
        relevant = []
        for topic in topics:
            for part in debate['parts']:
                for x, score in exact_search(part['text'], topic, candidates, topic_expansion):
                    relevant.append((part['video'], x, score))

        if relevant:
            relevant_transformed = []
            relevant.sort(key = lambda x: x[2], reverse=True)
            for video_link, quotes, _ in relevant:
                if video_link not in videos or videos[video_link] is None:
                    # videos[video_link] = video_link
                    videos[video_link] = get_video_link(video_link)

                relevant_transformed.append({
                    "video": videos[video_link],
                    "quotes": [{
                        "speaker": quote['speaker'],
                        "candidate": quote['speaker'] in debate['candidates'],
                        "question": quote['question'],
                        "time": quote['time'],
                        "text": quote['text']
                    } for quote in quotes]
                })

            results.append({
                "title": debate['title'],
                "date": debate['date'],
                "description": debate['description'],
                "results": relevant_transformed
            })
            
    return results


# as the link is only good for a day, this must be done on demand
def get_video_link(url):
    request_response = requests.get(url)
    if request_response.ok:
        pattern = re.compile('(?<="mediaUrl":").+?(?=")')

        soup = BeautifulSoup(request_response.text, 'html.parser')
        script = soup.find('script', text=pattern)
        if script:
            match = pattern.search(str(script))
            if match:
                return match.group(0)
    return None


# tags are:
# one of: "debate", "town hall", "speech", "interview",
# hierarchy (only one of which):
#                                                   [year] election
#                           [year] presidential election         etc
# [year] democratic presidential primary       [year] republican presidential primary   [year] presidential general election
