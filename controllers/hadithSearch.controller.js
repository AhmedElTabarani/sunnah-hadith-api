const nodeFetch = require("node-fetch");
const { decode } = require("html-entities");
const { parseHTML } = require("linkedom");

const catchAsync = require("../utils/catchAsync");
const sendSuccess = require("../utils/sendSuccess");
const cache = require("../utils/cache");
const getReferenceValues = require("../utils/getReferenceValues");
const getOneActualHadithContainer = require("../utils/getOneHadith");
const getHadithInfoText = require("../utils/getHadithInfoText");
const getHadithInfoHTML = require("../utils/getHadithInfoHTML");
const getReferenceUrlInfo = require("../utils/getReferenceUrlInfo");
const AppError = require("../utils/AppError");

class HadithSearchController {
  searchUsingSiteSunnah = catchAsync(async (req, res, next) => {
    if (!req.query.value || req.query.value.trim() === "") {
      throw new AppError(
        '"value" query parameter is required, and it should not be empty',
        400,
      );
    }

    const query = req._parsedUrl.query?.replace("value=", "q=") || "";
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

    const allHadith = doc.querySelector(".AllHadith");

    if (!allHadith) {
      return sendSuccess(res, 200, [], {});
    }

    const totalOfHadith = +allHadith
      .querySelector("span")
      .textContent.split(" ")
      .at(-1);

    const result = Array.from(doc.querySelectorAll(".boh")).map(
      (info) => {
        const [collection, book] = info.querySelectorAll(".nounderline");

        const {
          englishHadithNarrated,
          englishHadith,
          englishFullHadith,
          englishGrade,
          arabicHadithNarrated,
          arabicHadith,
          arabicFullHadith,
          arabicGrade,
        } = req.isRemoveHTML
          ? getHadithInfoText(info)
          : getHadithInfoHTML(info);

        const english = {
          hadithNarrated: englishHadithNarrated,
          hadith: englishHadith,
          fullHadith: englishFullHadith,
          grade: englishGrade,
        };
        const arabic = {
          hadithNarrated: arabicHadithNarrated,
          hadith: arabicHadith,
          fullHadith: arabicFullHadith,
          grade: arabicGrade,
        };

        const reference = info.querySelector(".hadith_reference");
        const { hadithNumberInBook, hadithNumberInCollection } =
          getReferenceValues(reference);

        const collectionId = collection
          .getAttribute("href")
          .split("/")
          .at(-1);

        const bookId = book.getAttribute("href").split("/").at(-1);
        return {
          collection: collection.textContent.trim(),
          book: book.textContent.trim(),
          english,
          arabic,
          reference: {
            ...getReferenceUrlInfo(
              collectionId,
              bookId,
              hadithNumberInBook,
              hadithNumberInCollection,
            ),
          },
        };
      },
    );

    cache.set(url, result);

    const metadata = {
      numberOfHadith: result.length,
      totalOfHadith,
      page: req.query.page,
      numberOfPages: Math.ceil(totalOfHadith / 100),
      removeHTML: req.isRemoveHTML,
    };
    cache.set(`metadata:${url}`, metadata);

    sendSuccess(res, 200, result, {
      ...metadata,
      isCached: false,
    });
  });

  getOneBookInCollectionUsingSiteSunnah = catchAsync(
    async (req, res, next) => {
      const { collectionId, bookId } = req.params;
      const url = `https://sunnah.com/${collectionId}/${bookId}`;

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

      const note = doc
        .querySelector(
          'div[style="width: 85%; margin: auto; text-align: justify;"]',
        )
        ?.textContent.trim();

      const AllHadith = doc.querySelector(".AllHadith");

      if (!AllHadith) {
        return sendSuccess(res, 200, [], {});
      }

      const isSingleHadith = AllHadith.className.includes("single_hadith");

      if (isSingleHadith) {
        const { result, metadata } = getOneActualHadithContainer(
          doc,
          collectionId,
          bookId,
          undefined,
        );

        cache.set(url, result);
        cache.set(`metadata:${url}`, metadata);

        sendSuccess(res, 200, result, {
          ...metadata,
          isCached: false,
        });
        return;
      }

      const elements = AllHadith.querySelectorAll(
        "a[name], .chapter, .echapintro, .achapintro, .actualHadithContainer",
      );

      const isHasChapters = elements.some((element) =>
        element.className.includes("chapter")
      );

      const groupedSections = new Map();
      let currentSection = null;

      if (!isHasChapters) {
        currentSection = "C0.0";
        groupedSections.set(currentSection, []);
      }

      elements.forEach((element) => {
        if (
          element.tagName.toLowerCase() === "a" &&
          element.hasAttribute("name")
        ) {
          const name = element.getAttribute("name");
          if (/^C\d+\.\d+$/.test(name)) {
            groupedSections.set(name, []);
            currentSection = name;
          }
        } else if (element.tagName.toLowerCase() !== "a") {
          groupedSections.get(currentSection).push(element);
        }
      });

      let numberOfHadith = 0;
      const result = Array.from(groupedSections.values()).map(
        (groupedSection) => {
          let chapter = {};
          let ahadith = [];
          for (const section of groupedSection) {
            if (section.className.includes("chapter")) {
              const englishChapterName = section
                .querySelector(".englishchapter")
                ?.textContent.trim();
              const arabicChapterName = section
                .querySelector(".arabicchapter")
                ?.textContent.trim();
              chapter = {
                english: {
                  name: englishChapterName,
                },
                arabic: {
                  name: arabicChapterName,
                },
              };
            } else if (section.className.includes("achapintro")) {
              chapter.arabic.intro = section.textContent;
            } else if (section.className.includes("echapintro")) {
              chapter.english.intro = section.textContent;
            } else if (
              section.className.includes("actualHadithContainer")
            ) {
              const {
                englishHadithNarrated,
                englishHadith,
                englishFullHadith,
                englishGrade,
                arabicHadithNarrated,
                arabicHadith,
                arabicFullHadith,
                arabicGrade,
              } = getHadithInfoText(section);

              const reference = section.querySelector(
                ".hadith_reference",
              );
              const { hadithNumberInBook, hadithNumberInCollection } =
                getReferenceValues(reference);

              ahadith.push({
                english: {
                  hadithNarrated: englishHadithNarrated,
                  hadith: englishHadith,
                  fullHadith: englishFullHadith,
                  grade: englishGrade,
                },
                arabic: {
                  hadithNarrated: arabicHadithNarrated,
                  hadith: arabicHadith,
                  fullHadith: arabicFullHadith,
                  grade: arabicGrade,
                },
                reference: {
                  ...getReferenceUrlInfo(
                    collectionId,
                    bookId,
                    hadithNumberInBook,
                    hadithNumberInCollection,
                  ),
                },
              });
            }
          }
          numberOfHadith += ahadith.length;
          return {
            chapter,
            numberOfHadith: ahadith.length,
            ahadith,
          };
        },
      );

      cache.set(url, result);

      const arabicBookName = doc
        .querySelector(".book_page_arabic_name")
        ?.textContent.trim();

      const englishBookName = doc
        .querySelector(".book_page_english_name")
        ?.textContent.trim();

      const englishBookIntro = doc
        .querySelector(".ebookintro")
        ?.textContent.trim();

      const arabicBookIntro = doc
        .querySelector(".abookintro")
        ?.textContent.trim();

      const metadata = {
        collectionId,
        bookId,
        note,
        hasChapters: isHasChapters,
        english: {
          bookName: englishBookName,
          bookIntro: englishBookIntro,
        },
        arabic: {
          bookName: arabicBookName,
          bookIntro: arabicBookIntro,
        },
        numberOfHadith,
        numberOfChapters: result.length,
        page: req.query.page,
      };
      cache.set(`metadata:${url}`, metadata);

      sendSuccess(res, 200, result, {
        ...metadata,
        isCached: false,
      });
    },
  );

  getOneHadithInBook = catchAsync(async (req, res, next) => {
    const { collectionId, bookId, hadithId } = req.params;
    const url = `https://sunnah.com/${collectionId}/${bookId}/${hadithId}`;

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

    const { result, metadata } = getOneActualHadithContainer(
      doc,
      collectionId,
      bookId,
      hadithId,
    );

    cache.set(url, result);
    cache.set(`metadata:${url}`, metadata);

    sendSuccess(res, 200, result, {
      ...metadata,
      isCached: false,
    });
  });

  getOneHadithInCollection = catchAsync(async (req, res, next) => {
    const { collectionId, hadithId } = req.params;
    const url = `https://sunnah.com/${collectionId}:${hadithId}`;

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

    const { result, metadata } = getOneActualHadithContainer(
      doc,
      collectionId,
      undefined,
      hadithId,
    );

    cache.set(url, result);
    cache.set(`metadata:${url}`, metadata);

    sendSuccess(res, 200, result, {
      ...metadata,
      isCached: false,
    });
  });
}

module.exports = new HadithSearchController();
