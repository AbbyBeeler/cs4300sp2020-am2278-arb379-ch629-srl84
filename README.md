# Running Locally

`npm install`

1. Build
```bash
source venv/bin/activate
source .env

npm run build
python app.py
```
And go to local http://localhost:5000/

2. Don't Build
In one tab `npm start`. In another `python app.py`.
And go to local http://localhost:3000/


# Pushing to Heroku

Make sure everything is committed. And run the following (remove the brackets). It will take 5ever.
```bash
git push [remote name - usually heroku] master
heroku ps:scale web=1 --app [app name]
```

For debugging purposes
```bash
heroku logs --tail --app [app name]
```


# Adding a new Heroku version

Make sure everything is committed. And run the following (remove the brackets).
```bash
heroku create [app name] --remote [app name]
heroku buildpacks:set heroku/python --app [app name]
heroku buildpacks:add --index 1 heroku/nodejs --app [app name]
```
And then push as above


# Updating the database

DO NOT RUN scraping.py!!!! If you do want to run it, then change the output to another file. The files require some manual editing and re-scraping would overwrite that. 
Once whatever polling/ debate files have been updated. Run the corresponding function in manage_db.py which should take care of removing old versions if files are being updated.


For intial build instructions, visit https://github.com/CornellNLP/CS4300_Flask_template