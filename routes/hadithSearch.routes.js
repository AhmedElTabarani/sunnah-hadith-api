const router = require('express').Router();

const HadithSearchController = require('../controllers/hadithSearch.controller');

router
  .route('/site/hadith/search')
  .get(HadithSearchController.searchUsingSiteSunnah);

router
  .route('/site/collections/:collectionId/books/:bookId')
  .get(HadithSearchController.getOneBookInCollectionUsingSiteSunnah);

router
  .route(
    '/site/collections/:collectionId/books/:bookId/hadith/:hadithId',
  )
  .get(HadithSearchController.getOneHadithInBook);

router
  .route(
    '/site/collections/:collectionId/hadith/:hadithId',
  )
  .get(HadithSearchController.getOneHadithInCollection);

module.exports = router;
