const express = require('express');
const app = express();
const ig = require('instagram-scraping');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 * 60 * 24});

const verifyCache = (req, res, next) => {
  try{
    const {username} = req.params;
    if(cache.has(username)){
      return res.status(200).json(cache.get(username))
    }
    return next();
  } catch (err) {
    throw new Error(err)
  }
}

app.get('/:username', verifyCache, async (req, res) => {
  try {
    const {username} = req.params
    ig.scrapeUserPage(username).then((result) => {
      cache.set(username, result);
      return res.status(200).send(result)
    });
  } catch ({response}){
    return res.sendStatus(500)
  }
});

app.listen(4000, () => {
    // console.log('My rest api running on port 3000')
})
