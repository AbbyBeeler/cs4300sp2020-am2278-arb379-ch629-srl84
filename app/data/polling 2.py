import json

import pandas as pd
from bson import json_util

from app.irsystem.models.helpers import get_candidates
from config import basedir


def smooth(temp):
    # remove outliers
    temp['avg_pct'] = temp.pct.rolling(20, min_periods=1, center=True).mean()
    temp['stand_dev'] = temp.pct.rolling(20, min_periods=1, center=True).std()
    temp = temp[(temp.pct > temp.avg_pct - 2*temp.stand_dev) & (temp.pct < temp.avg_pct + 2*temp.stand_dev)]

    # smoothing
    temp.avg_pct = temp.pct.rolling(20, min_periods=1, center=True).mean()
    temp.avg_pct = temp.avg_pct.rolling(20, min_periods=1, center=True).mean()
    temp.avg_pct = temp.avg_pct.round(2)

    return temp


def format_and_save(file_name, name):
    df = pd.read_csv(file_name, low_memory=False)

    # filter only relevant candidates and get the right name
    candidates_map = {candidate.split(' ', 1)[1]: candidate for candidate in candidates}
    df_filtered = df[df.answer.isin(candidates_map.keys())].replace(candidates_map)

    # remove regional and bad polls
    df_filtered = df_filtered[df_filtered.state.isnull()]
    df_filtered = df_filtered[~(df_filtered.fte_grade.str.contains('C') | df_filtered.fte_grade.str.contains('D'))]

    # remove other columns
    df_filtered = df_filtered[['created_at', 'answer', 'pct']]

    # fix date and sort by it
    df_filtered.created_at = pd.to_datetime(df_filtered.created_at)
    df_filtered = df_filtered.sort_values(by=['created_at'])
    df_filtered.reset_index(inplace=True)

    # smooth the data
    df_filtered2 = df_filtered.groupby(by='answer').apply(smooth).reset_index(drop=True)

    # save to json by candidate
    nice_results = []
    for c in candidates:
        df_c = df_filtered2[df_filtered2.answer == c]
        df_c = df_c[['created_at', 'avg_pct']].rename(columns={'created_at': 'date', 'avg_pct': 'pct'})
        polls = df_c.to_dict('records')
        if polls:
            nice_results.append({
                'candidate_race': c + '_' + name,
                'polls': polls
            })

    # save to file
    with open(basedir + '/app/data/polling/' + name + '.json', 'w') as f:
        json.dump(nice_results, f, default=json_util.default)


candidates = get_candidates()
format_and_save(basedir + '/app/data/polling/president_primary_polls.csv', '2020 democratic presidential primary')
format_and_save(basedir + '/app/data/polling/president_polls.csv', '2020 presidential general election')
