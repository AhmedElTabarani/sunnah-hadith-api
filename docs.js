module.exports = (req, res, next) => {
  res.json({
    status: "success",
    github: "https://github.com/islamic-extensions/dorar-hadith-api",
    endpoints: [
      {
        endpoint: "/v1/site/hadith/search?value={text}&page={page}",
        example: "/v1/site/hadith/search?value=انما الاعمال بالنيات&page=2",
        abstractResponse: {
          status: "success",
          metadata: {
            numberOfHadith: "number of hadiths in this page",
            totalOfHadith: "total number of hadiths",
            page: "current page number",
            numberOfPages: "total number of pages",
            removeHTML:
              "boolean value to indicate whether HTML elements are removed or not",
            isCached:
              "boolean value to indicate whether the response is cached or not",
          },
          data: [
            {
              collection: "collection name",
              book: "book name",
              english: {
                hadithNarrated: "hadith narrated in english",
                hadith: "Hadith text in english, without the narrator",
                fullHadith:
                  "Full hadith text in english, including the narrator",
                grade: "grade of hadith in english",
              },
              arabic: {
                hadithNarrated: "hadith narrated in arabic",
                hadith: "Hadith text in arabic, without the narrator",
                fullHadith:
                  "Full hadith text in arabic, including the narrator",
                grade: "grade of hadith in arabic",
              },
              reference: {
                collectionId: "collection id",
                bookId: "book id",
                hadithNumberInBook: "hadith number in book",
                hadithNumberInCollection: "hadith number in collection",
                api: {
                  hadith: "api link for this hadith",
                  book: "api link for this book",
                  hadithInBook: "api link for this hadith in this book",
                },
                sunnahWebsite: {
                  hadith: "sunnah website link for this hadith",
                  collection: "sunnah website link for this collection",
                  book: "sunnah website link for this book",
                  hadithInBook:
                    "sunnah website link for this hadith in this book",
                },
              },
            },
          ],
        },
      },
      {
        endpoint: "/v1/site/collections/:collectionId/books/:bookId",
        example: "/v1/site/collections/bukhari/books/1",
        abstractResponse: {
          status: "success",
          metadata: {
            collectionId: "collection id",
            bookId: "book id",
            note: "note about the book",
            hasChapters: "boolean value to indicate whether the book has chapters or not",
            english: {
              bookName: "book name in english",
              bookIntro: "book introduction in english",
            },
            arabic: {
              bookName: "book name in arabic",
              bookIntro: "book introduction in arabic",
            },
            numberOfHadith: "number of hadiths in this book",
            numberOfChapters: "number of chapters in this book",
            isCached:
              "boolean value to indicate whether the response is cached or not",
          },
          data: [
            {
              chapter: {
                english: {
                  name: "chapter name in english",
                  intro: "chapter introduction in english",
                },
                arabic: {
                  name: "chapter name in arabic",
                  intro: "chapter introduction in arabic",
                },
              },
              numberOfHadith: "number of hadiths in this chapter",
              ahadith: [
                {
                  english: {
                    hadithNarrated: "hadith narrated in english",
                    hadith: "Hadith text in english, without the narrator",
                    fullHadith:
                      "Full hadith text in english, including the narrator",
                    grade: "grade of hadith in english",
                  },
                  arabic: {
                    hadithNarrated: "hadith narrated in arabic",
                    hadith: "Hadith text in arabic, without the narrator",
                    fullHadith:
                      "Full hadith text in arabic, including the narrator",
                    grade: "grade of hadith in arabic",
                  },
                  reference: {
                    collectionId: "collection id",
                    bookId: "book id",
                    hadithNumberInBook: "number of hadith in book",
                    hadithNumberInCollection: "number of hadith in collection",
                    api: {
                      hadith: "api link for this hadith",
                      book: "api link for this book",
                      hadithInBook: "api link for this hadith in this book",
                    },
                    sunnahWebsite: {
                      hadith: "sunnah website link for this hadith",
                      collection: "sunnah website link for this collection",
                      book: "sunnah website link for this book",
                      hadithInBook:
                        "sunnah website link for this hadith in this book",
                    },
                  },
                },
              ],
            },
          ],
        },
      },
      {
        endpoint:
          "/v1/site/collections/:collectionId/books/:bookId/hadith/:hadithId",
        example: "/v1/site/collections/bukhari/books/1/hadith/1",
        abstractResponse: {
          status: "success",
          metadata: {
            collectionId: "collection id",
            bookId: "book id",
            numberOfHadithInBook: "number of hadith in book number",
            numberOfHadithInCollection: "number of hadith in collection",
            english: {
              bookName: "book name in english",
              bookIntro: "book introduction in english",
              chapterName: "chapter name in english",
            },
            arabic: {
              bookName: "book name in arabic",
              bookIntro: "book introduction in arabic",
              chapterName: "chapter name in arabic",
            },
            numberOfHadith: "number of hadiths in this book",
            numberOfChapters: "number of chapters in this book",
            isCached:
              "boolean value to indicate whether the response is cached or not",
          },
          data: {
            english: {
              hadithNarrated: "hadith narrated in english",
              hadith: "Hadith text in english, without the narrator",
              fullHadith: "Full hadith text in english, including the narrator",
              grade: "grade of hadith in english",
            },
            arabic: {
              hadithNarrated: "hadith narrated in arabic",
              hadith: "Hadith text in arabic, without the narrator",
              fullHadith: "Full hadith text in arabic, including the narrator",
              grade: "grade of hadith in arabic",
            },
            reference: {
              collectionId: "collection id",
              bookId: "book id",
              hadithNumberInBook: "number of hadith in book",
              hadithNumberInCollection: "number of hadith in collection",
              api: {
                hadith: "api link for this hadith",
                book: "api link for this book",
                hadithInBook: "api link for this hadith in this book",
              },
              sunnahWebsite: {
                hadith: "sunnah website link for this hadith",
                collection: "sunnah website link for this collection",
                book: "sunnah website link for this book",
                hadithInBook:
                  "sunnah website link for this hadith in this book",
              },
            },
          },
        },
      },
      {
        endpoint: "/v1/site/collections/:collectionId/hadith/:hadithId",
        example: "/v1/site/collections/bukhari/hadith/1",
        abstractResponse: {
          status: "success",
          metadata: {
            collectionId: "collection id",
            bookId: "book id",
            numberOfHadithInBook: "number of hadith in book number",
            numberOfHadithInCollection: "number of hadith in collection",
            english: {
              bookName: "book name in english",
              bookIntro: "book introduction in english",
              chapterName: "chapter name in english",
            },
            arabic: {
              bookName: "book name in arabic",
              bookIntro: "book introduction in arabic",
              chapterName: "chapter name in arabic",
            },
            numberOfHadith: "number of hadiths in this book",
            numberOfChapters: "number of chapters in this book",
            isCached:
              "boolean value to indicate whether the response is cached or not",
          },
          data: {
            english: {
              hadithNarrated: "hadith narrated in english",
              hadith: "Hadith text in english, without the narrator",
              fullHadith: "Full hadith text in english, including the narrator",
              grade: "grade of hadith in english",
            },
            arabic: {
              hadithNarrated: "hadith narrated in arabic",
              hadith: "Hadith text in arabic, without the narrator",
              fullHadith: "Full hadith text in arabic, including the narrator",
              grade: "grade of hadith in arabic",
            },
            reference: {
              collectionId: "collection id",
              bookId: "book id",
              hadithNumberInBook: "number of hadith in book",
              hadithNumberInCollection: "number of hadith in collection",
              api: {
                hadith: "api link for this hadith",
                book: "api link for this book",
                hadithInBook: "api link for this hadith in this book",
              },
              sunnahWebsite: {
                hadith: "sunnah website link for this hadith",
                collection: "sunnah website link for this collection",
                book: "sunnah website link for this book",
                hadithInBook:
                  "sunnah website link for this hadith in this book",
              },
            },
          },
        },
      },
    ],
    query: {
      value: "search value in hadith text",
      page: "page number of the result",
      removehtml:
        "to delete elements from hadith text or not including `<em>` and `<b>` elements",
    },
  });
};
