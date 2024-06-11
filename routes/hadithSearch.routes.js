const router = require('express').Router();

const HadithSearchController = require('../controllers/hadithSearch.controller');

router
  .route('/site/hadith/search')
  .get(HadithSearchController.searchUsingSiteSunnah);

module.exports = router;
