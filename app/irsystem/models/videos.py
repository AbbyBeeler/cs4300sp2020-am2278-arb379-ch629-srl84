import re
from datetime import datetime, timedelta, timezone
import requests
from bs4 import BeautifulSoup

from . import *


# fetch video url from database, else request it and put it in the database
def get_video(path_url):
    date = get_expiration_date()
    video = db.videos.find_one({'path': path_url, 'expires': date})
    if video is None or video['url'] is None:
        video_url = get_video_url(path_url)
        db.videos.delete_many({'path': path_url})
        db.videos.insert_one({
            'path': path_url,
            'url': video_url,
            'expires': date
        })
        return video_url
    else:
        return video['url']


def get_expiration_date():
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    tomorrow = today + timedelta(days=1)
    return int(tomorrow.timestamp())


# as the url is only good for a day, this must be done on demand
def get_video_url(path_url):
    response = requests.get(path_url)
    if response.ok:
        pattern = re.compile('(?<="mediaUrl":").+?(?=")')

        soup = BeautifulSoup(response.text, 'html.parser')
        script = soup.find('script', text=pattern)
        if script:
            match = pattern.search(str(script))
            if match:
                return match.group(0)
    return None
