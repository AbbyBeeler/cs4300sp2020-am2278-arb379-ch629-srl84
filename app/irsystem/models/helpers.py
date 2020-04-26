from . import *


def get_candidates():
    return db.debates.distinct('candidates')


def get_debate_titles_tags():
    return db.debates.distinct('title') + db.debates.distinct('tags')
