module.exports = (req, res, next) => {
  res.json({
    status: 'success',
    github: 'https://github.com/islamic-extensions/dorar-hadith-api',
    endpoints: [
      {
        endpoint: '/v1/site/hadith/search?value={text}&page={page}',
        example:
          '/v1/site/hadith/search?value=انما الاعمال بالنيات&page=2',
        abstractResponse: {
          status: 'success',
          metadata: {
            length: 'number of hadiths in this page',
            numberOfHadith: 'total number of hadiths',
            page: 'current page number',
            numberOfPages: 'total number of pages',
            removeHTML:
              'boolean value for remove HTML elements in text or not',
          },
          data: [
            {
              english: {
                hadithNarrated: 'hadith narrated in english',
                hadith: 'hadith text in english',
                grade: 'grade of hadith in english',
              },
              arabic: {
                hadithNarrated: 'hadith narrated in arabic',
                hadith: 'hadith text in arabic',
                grade: 'grade of hadith in arabic',
              },
              reference: {
                collection: 'collection name',
                collectionId: 'collection id',
                book: 'book name',
                bookId: 'book id',
                hadithNumberInBook: 'hadith number in book',
                hadithNumberInCollection:
                  'hadith number in collection',
                sunnahWebsite: {
                  hadith: 'sunnah website link for this hadith',
                  collection:
                    'sunnah website link for this collection',
                  book: 'sunnah website link for this book',
                  hadithInBook:
                    'sunnah website link for this hadith in this book',
                },
              },
            },
          ],
        },
      },
    ],
    query: {
      value: 'search value in hadith text',
      page: 'page number of the result',
      removehtml:
        'to delete elements from hadith text or not including `<em>` and `<b>` elements',
    },
  });
};
