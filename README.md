# Tarot API

A simple Tarot API using Express and LoopBack to provide Tarot Card lookups and on-demand readings (spreads).

Used for [this Tarot Reader Slack Bot](https://slack.com/oauth/authorize?&client_id=12872081299.247514140934&scope=bot)

Coming soon to Alexa and Google Home. Try it out on [API.AI](https://bot.api.ai/1ca54192-8e60-4aa0-aae6-08651b08fc03)!

Tarot Card reading and image data is scraped from [Tarot Biddy](https://tarotbiddy.com). 

MongoDB is used to store Card and User model instances. The database is hosted on [mLab](https://mlab.com).

Images are stored in and supplied by [Cloudinary](https://cloudinary.com). Card transformations and overlays (for the api/cards/spread endpoint) are accomplished via the Cloudinary API and the Cloudinary NPM module.

Included in `handler/index.js` is a sample handler function for working with API.AI