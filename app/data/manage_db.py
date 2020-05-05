import json
import os

from bson import json_util

from app import db
from config import basedir


def insert_many_debates(replace, folders=None):
    if replace:
        # delete everything in the database
        db.debates.delete_many({})

    if folders is None:
        folders = [basedir + '/app/data/debates/', basedir + '/app/data/others/']
    # read all the json files in
    for folder in folders:
        for file_name in os.listdir(folder):
            if file_name.endswith('.json'):
                with open(folder + file_name) as f:
                    debate = json.load(f, object_hook=json_util.object_hook)

                    # delete any debates with same url (redundant if replace)
                    delete_one_debate(debate['url'])
                    # and insert them
                    db.debates.insert_one(debate)


def insert_one_debate(file_name):
    # read the debate in as a dictionary
    with open(file_name) as f:
        debate = json.load(f, object_hook=json_util.object_hook)

    # delete any debates with same url
    delete_one_debate(debate['url'])
    # insert new one
    db.debates.insert_one(debate)


def delete_one_debate(url):
    # delete any debates with same url
    db.debates.delete_many({'url': url})


def insert_many_polls():
    # delete everything in the database
    db.polls.delete_many({})

    # read all the json files in
    folder = basedir + '/app/data/polling/'
    for file_name in os.listdir(folder):
        if file_name.endswith('.json'):
            with open(folder + file_name) as f:
                polls = json.load(f, object_hook=json_util.object_hook)
                # and insert them
                db.polls.insert_many(polls)


def delete_one_poll(candidate_race):
    # delete any polls with same candidate and race
    db.polls.delete_many({'candidate_race': candidate_race})
