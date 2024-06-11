const nodeFetch = require('node-fetch');
const { decode } = require('html-entities');
const { parseHTML } = require('linkedom');

const catchAsync = require('../utils/catchAsync');
const sendSuccess = require('../utils/sendSuccess');
const cache = require('../utils/cache');
const getReferenceValues = require('../utils/getReferenceValues');

class HadithSearchController {
  searchUsingSiteSunnah = catchAsync(async (req, res, next) => {
    if (!req.query.value || req.query.value.trim() === '')
      throw new Error(
        '"value" query parameter is required, and it should not be empty',
      );

    const query = req._parsedUrl.query?.replace('value=', 'q=') || '';
    const url = `https://sunnah.com/search?${query}`;

    if (cache.has(url)) {
      const result = cache.get(url);
      return sendSuccess(res, 200, result, {
        ...cache.get(`metadata:${url}`),
        isCached: true,
      });
    }

    const data = await nodeFetch(url);
    const html = decode(await data.text());
    const doc = parseHTML(html).document;

    const allHadith = doc.querySelector('.AllHadith');

    const numberOfHadith = +allHadith
      .querySelector('span')
      .textContent.split(' ')
      .at(-1);

    const result = Array.from(doc.querySelectorAll('.boh')).map(
      (info) => {
        const [collection, book] =
          info.querySelectorAll('.nounderline');

        let englishHadith;
        let arabicHadith;
        let arabicGrade;
        let englishGrade;
        if (req.isRemoveHTML) {
          englishHadith = info
            .querySelector('.text_details')
            .textContent.trim();

          englishGrade = info
            .querySelector('.english_grade')
            ?.nextElementSibling.textContent.trim();

          arabicHadith = info
            .querySelector('.arabic_text_details')
            .textContent.trim();

          arabicGrade = info
            .querySelector('.arabic_grade')
            ?.textContent.trim();
        } else {
          englishHadith = info
            .querySelector('.text_details')
            .innerHTML.trim();

          englishGrade = info
            .querySelector('.english_grade')
            ?.nextElementSibling.innerHTML.trim();

          arabicHadith = info
            .querySelector('.arabic_text_details')
            .innerHTML.trim();

          arabicGrade = info
            .querySelector('.arabic_grade')
            ?.innerHTML.trim();
        }

        const englishHadithNarrated = info.querySelector(
          '.hadith_narrated',
        );

        const arabicHadithNarrated =
          info.querySelector('.arabic_sanad');

        const reference = info.querySelector('.hadith_reference');
        const { hadithNumberInBook, hadithNumberInCollection } =
          getReferenceValues(reference);

        let collectionId = collection
          .getAttribute('href')
          .split('/')
          .at(-1);

        collectionId =
          collectionId === '-1' ? 'introduction' : collectionId;

        const bookId = book.getAttribute('href').split('/').at(-1);

        return {
          english: {
            hadithNarrated: englishHadithNarrated?.textContent.trim(),
            hadith: englishHadith,
            grade: englishGrade,
          },
          arabic: {
            hadithNarrated: arabicHadithNarrated?.textContent.trim(),
            hadith: arabicHadith,
            grade: arabicGrade,
          },
          reference: {
            collection: collection.textContent.trim(),
            collectionId,
            book: book.textContent.trim(),
            bookId,
            sunnahWebsite: {
              hadith: hadithNumberInCollection
                ? `https://sunnah.com/${collectionId}:${hadithNumberInCollection}`
                : undefined,
              collection: `https://sunnah.com/${collectionId}`,
              book: `https://sunnah.com/${collectionId}/${bookId}`,
              hadithInBook: `https://sunnah.com/${collectionId}/${bookId}/${hadithNumberInBook}`,
            },
          },
        };
      },
    );

    cache.set(url, result);

    const metadata = {
      length: result.length,
      numberOfHadith,
      removeHTML: req.isRemoveHTML,
      numberOfPages: Math.ceil(numberOfHadith / 100),
    };
    cache.set(`metadata:${url}`, metadata);

    sendSuccess(res, 200, result, {
      ...metadata,
      isCached: false,
    });
  });
}

module.exports = new HadithSearchController();
