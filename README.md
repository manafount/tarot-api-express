# Tarot API

A simple Tarot API using Express and LoopBack to provide Tarot Card lookups and on-demand readings (spreads).

Tarot Card reading and image data is scraped from [Tarot Biddy](tarotbiddy.com). 

MongoDB is used to store Card and User model instances. The database is hosted on [mLab](mlab.com).

Images are stored in and supplied by [Cloudinary](cloudinary.com). Card transformations and overlays (for the api/cards/spread endpoint) are accomplished via the Cloudinary API and the Cloudinary NPM module.

Included in `handler/index.js` is a sample handler function for working with API.AI