const path = require("path");
const express = require("express");
const app = express();
const router = express.Router();
const axios = require("axios");
const rssParser = require("rss-parser");
require("dotenv").config({ path: path.join(__dirname, "../", ".env") });


const parser = new rssParser();

router.get("/cnn", async (req, res) => {
  let articles = [];
  try {
    const response = await parser.parseURL(process.env.CNN_FEED_URL);
    articles.push(response.items);
    articles.flat().forEach((article) => {
      article.source = "cnn";
    });
    res.json({Feed: articles[0]});

  } catch (error) {
    res.send("Error getting CNN RSS feed");
  }
});

router.get("/fox", async (req, res) =>{
  //Initialize array to hold all articles
  let articles = [];
  //Get the RSS feed from FOX
  try {
    //Fetch from first Feed and add to array
    const response1 = await parser.parseURL(process.env.FOX_FEED_URL);
    articles.push(response1.items);

    //Fetch from second Feed
    const response2 = await parser.parseURL(process.env.FOX_TECH_URL);
    articles.push(response2.items);

    // Fetch from third Feed
    const response3 = await parser.parseURL(process.env.FOX_POLITICS);
    articles.push(response3.items);

    const response4 = await parser.parseURL(process.env.FOX_OPINION);
    articles.push(response4.items);

    const response5 = await parser.parseURL(process.env.FOX_HEALTH);
    articles.push(response5.items);

    const response6 = await parser.parseURL(process.env.FOX_SCIENCE);
    articles.push(response6.items);

    articles.flat().forEach((article) => {
      article.source = "fox";
    });
    res.json({Feed: articles.flat()});
  } catch (error) {
    res.send("Error getting FOX RSS feed");
  }
})

router.get("/nyt", async (req, res) =>{
  let articles = [];
  try {
    const response = await parser.parseURL(process.env.NYT_FEED_URL);
    articles.push(response.items);
    articles.flat().forEach((article) => {
      article.source = "nyt";
    });
    
    res.json({Feed: articles[0]});

  } catch (error) {
    res.send("Error getting NYT RSS feed");
  }
})

router.get("/reuters", async (req, res) =>{
  let articles = [];
  try {

    const response1 = await parser.parseURL(process.env.REUTERS_FEED_URL);
    articles.push(response1.items);

    const response2 = await parser.parseURL(process.env.REUTERS_ENVIRONMENT_URL);
    articles.push(response2.items);

    const response3 = await parser.parseURL(process.env.REUTERS_POLITICS_URL);
    articles.push(response3.items);

    const response4 = await parser.parseURL(process.env.REUTERS_BUSINESS_URL);
    articles.push(response4.items);

    const response5 = await parser.parseURL(process.env.REUTERS_HUMAN_INTEREST);
    articles.push(response5.items);

    const response6 = await parser.parseURL(process.env.REUTERS_ENTERTAINMENT);
    articles.push(response6.items);

    articles.flat().forEach((article) => {
      article.source = "reuters";
    });
    res.json({Feed: articles.flat()});

  } catch (error) {
    res.send("Error getting REUTERS RSS feed");
  }
})

module.exports = router;
