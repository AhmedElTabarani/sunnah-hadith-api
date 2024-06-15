# Sunnah Hadith API

This is a simple API that scrapping data from the sunnah.com website. This API provide translation of the arabic hadith in English (Mainly English)

## Note

> This repository does not depend on any server and may have frequent major changes over time. Therefore, please fork and clone it instead of relying on pulls from this repository, So I hope that you use your own version.

> For Arabic README [from here](https://github.com/AhmedElTabarani/sunnah-hadith-api/blob/main/README_ARABIC.md)

- There is a cache for `5` seconds
- There is a rate limit: `100` requests per day for each `IP`

> You can configure this in [config.js](https://github.com/AhmedElTabarani/sunnah-hadith-api/blob/main/config/config.js)

## Installation

1. `fork` or `clone` this repository
2. install the dependencies

```bash
npm install
```

3. check out the [config.js](https://github.com/islamic-extensions/dorar-hadith-api/blob/main/config/config.js) file and configure it as you want
4. run the server

```bash
npm start
```

5. server will be running on `http://localhost:3000`
6. you can play with the API in localhost or deploy it to your cloud server

## API Endpoints

### /v1/site/hadith/search?value={text}

To search for hadiths by text (english or arabic)

JSON Response:

```json
{
  "status": "success",
  "metadata": {
    "numberOfHadith": "number of hadiths in this page",
    "totalOfHadith": "total number of hadiths",
    "page": "current page number",
    "numberOfPages": "total number of pages",
    "removeHTML": "boolean value to indicate whether HTML elements are removed or not",
    "isCached": "boolean value to indicate whether the response is cached or not"
  },
  "data": [
    {
      "collection": "collection name",
      "book": "book name",
      "english": {
        "hadithNarrated": "hadith narrated in english",
        "hadith": "Hadith text in english, without the narrator",
        "fullHadith": "Full hadith text in english, including the narrator",
        "grade": "grade of hadith in english"
      },
      "arabic": {
        "hadithNarrated": "hadith narrated in arabic",
        "hadith": "Hadith text in arabic, without the narrator",
        "fullHadith": "Full hadith text in arabic, including the narrator",
        "grade": "grade of hadith in arabic"
      },
      "reference": {
        "collectionId": "collection id",
        "bookId": "book id",
        "hadithNumberInBook": "hadith number in book",
        "hadithNumberInCollection": "hadith number in collection",
        "api": {
          "hadith": "api link for this hadith",
          "book": "api link for this book",
          "hadithInBook": "api link for this hadith in this book"
        },
        "sunnahWebsite": {
          "hadith": "sunnah website link for this hadith",
          "collection": "sunnah website link for this collection",
          "book": "sunnah website link for this book",
          "hadithInBook": "sunnah website link for this hadith in this book"
        }
      }
    }
  ]
}
```

### /v1/site/collections/:collectionId/books/:bookId

To get all hadiths in a specific book

JSON Response:

```json
{
  "status": "success",
  "metadata": {
    "collectionId": "collection id",
    "bookId": "book id",
    "note": "note about the book",
    "english": {
      "bookName": "book name in english",
      "bookIntro": "book introduction in english"
    },
    "arabic": {
      "bookName": "book name in arabic",
      "bookIntro": "book introduction in arabic"
    },
    "numberOfHadith": "number of hadiths in this book",
    "numberOfChapters": "number of chapters in this book",
    "isCached": "boolean value to indicate whether the response is cached or not"
  },
  "data": [
    {
      "chapter": {
        "english": {
          "name": "chapter name in english",
          "intro": "chapter introduction in english"
        },
        "arabic": {
          "name": "chapter name in arabic",
          "intro": "chapter introduction in arabic"
        }
      },
      "numberOfHadith": "number of hadiths in this chapter",
      "ahadith": [
        {
          "english": {
            "hadithNarrated": "hadith narrated in english",
            "hadith": "Hadith text in english, without the narrator",
            "fullHadith": "Full hadith text in english, including the narrator",
            "grade": "grade of hadith in english"
          },
          "arabic": {
            "hadithNarrated": "hadith narrated in arabic",
            "hadith": "Hadith text in arabic, without the narrator",
            "fullHadith": "Full hadith text in arabic, including the narrator",
            "grade": "grade of hadith in arabic"
          },
          "reference": {
            "collectionId": "collection id",
            "bookId": "book id",
            "hadithNumberInBook": "number of hadith in book",
            "hadithNumberInCollection": "number of hadith in collection",
            "api": {
              "hadith": "api link for this hadith",
              "book": "api link for this book",
              "hadithInBook": "api link for this hadith in this book"
            },
            "sunnahWebsite": {
              "hadith": "sunnah website link for this hadith",
              "collection": "sunnah website link for this collection",
              "book": "sunnah website link for this book",
              "hadithInBook": "sunnah website link for this hadith in this book"
            }
          }
        }
      ]
    }
  ]
}
```

### /v1/site/collections/:collectionId/books/:bookId/hadith/:hadithId

To get a specific hadith in a specific book

JSON Response:

```json
{
  "status": "success",
  "metadata": {
    "collectionId": "collection id",
    "bookId": "book id",
    "numberOfHadithInBook": "number of hadith in book number",
    "numberOfHadithInCollection": "number of hadith in collection",
    "english": {
      "bookName": "book name in english",
      "bookIntro": "book introduction in english",
      "chapterName": "chapter name in english"
    },
    "arabic": {
      "bookName": "book name in arabic",
      "bookIntro": "book introduction in arabic",
      "chapterName": "chapter name in arabic"
    },
    "numberOfHadith": "number of hadiths in this book",
    "numberOfChapters": "number of chapters in this book",
    "isCached": "boolean value to indicate whether the response is cached or not"
  },
  "data": {
    "english": {
      "hadithNarrated": "hadith narrated in english",
      "hadith": "Hadith text in english, without the narrator",
      "fullHadith": "Full hadith text in english, including the narrator",
      "grade": "grade of hadith in english"
    },
    "arabic": {
      "hadithNarrated": "hadith narrated in arabic",
      "hadith": "Hadith text in arabic, without the narrator",
      "fullHadith": "Full hadith text in arabic, including the narrator",
      "grade": "grade of hadith in arabic"
    },
    "reference": {
      "collectionId": "collection id",
      "bookId": "book id",
      "hadithNumberInBook": "number of hadith in book",
      "hadithNumberInCollection": "number of hadith in collection",
      "api": {
        "hadith": "api link for this hadith",
        "book": "api link for this book",
        "hadithInBook": "api link for this hadith in this book"
      },
      "sunnahWebsite": {
        "hadith": "sunnah website link for this hadith",
        "collection": "sunnah website link for this collection",
        "book": "sunnah website link for this book",
        "hadithInBook": "sunnah website link for this hadith in this book"
      }
    }
  }
}
```

### /v1/site/collections/:collectionId/hadith/:hadithId

To get a specific hadith in a specific collection

JSON Response:

```json
{
  "status": "success",
  "metadata": {
    "collectionId": "collection id",
    "bookId": "book id",
    "numberOfHadithInBook": "number of hadith in book number",
    "numberOfHadithInCollection": "number of hadith in collection",
    "english": {
      "bookName": "book name in english",
      "bookIntro": "book introduction in english",
      "chapterName": "chapter name in english"
    },
    "arabic": {
      "bookName": "book name in arabic",
      "bookIntro": "book introduction in arabic",
      "chapterName": "chapter name in arabic"
    },
    "numberOfHadith": "number of hadiths in this book",
    "numberOfChapters": "number of chapters in this book",
    "isCached": "boolean value to indicate whether the response is cached or not"
  },
  "data": {
    "english": {
      "hadithNarrated": "hadith narrated in english",
      "hadith": "Hadith text in english, without the narrator",
      "fullHadith": "Full hadith text in english, including the narrator",
      "grade": "grade of hadith in english"
    },
    "arabic": {
      "hadithNarrated": "hadith narrated in arabic",
      "hadith": "Hadith text in arabic, without the narrator",
      "fullHadith": "Full hadith text in arabic, including the narrator",
      "grade": "grade of hadith in arabic"
    },
    "reference": {
      "collectionId": "collection id",
      "bookId": "book id",
      "hadithNumberInBook": "number of hadith in book",
      "hadithNumberInCollection": "number of hadith in collection",
      "api": {
        "hadith": "api link for this hadith",
        "book": "api link for this book",
        "hadithInBook": "api link for this hadith in this book"
      },
      "sunnahWebsite": {
        "hadith": "sunnah website link for this hadith",
        "collection": "sunnah website link for this collection",
        "book": "sunnah website link for this book",
        "hadithInBook": "sunnah website link for this hadith in this book"
      }
    }
  }
}
```

## Query Parameters

| Key  |             Description             |
| :--------: | :---------------------------------: |
|   value    |   The text you want to search for   |
|    page    |   The page you want to search in    |
| removeHTML | Remove HTML elements in text or not |

### value

- The text you want to search for
- Example: `/v1/site/hadith/search?value=fasting`

### page

- The page you want to search in
- Example: `/v1/site/hadith/search?value=fasting&page=2`
- Default: `1`

### removeHTML

- Remove HTML elements in text or not like `<em>` and `<b>` elements
- Example: `/v1/site/hadith/search?value=fasting&removeHTML=false`
- Default: `true`
