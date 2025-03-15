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
const extractChapterInfo = require("../utils/extractChapterInfo");
const extractActualHadithContainer = require("../utils/extractActualHadithContainer");

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
        "a[name], .surah, .chapter, .echapintro, .achapintro, .actualHadithContainer"
      );
      
      const chaptersMap = new Map();
      let currentChapterId = null;
      
      // Determine main chapter ID from any chapter ID (converts C1.01 → C1.00)
      function getMainChapterId(chapterId) {
        const parts = chapterId.split('.');
        return `${parts[0]}.00`;
      }
      
      // Check if an ID is a main chapter (ends with .00)
      function isMainChapter(chapterId) {
        return chapterId.endsWith('.00');
      }
      
      if (!elements.some(el => el.className.includes("chapter"))) {
        currentChapterId = "C0.00";
        chaptersMap.set(currentChapterId, {
          isMainChapter: true,
          elements: [],
          mainChapterId: currentChapterId
        });
      }
      
      elements.forEach((element) => {
        if (element.tagName.toLowerCase() === "a" && element.hasAttribute("name")) {
          const chapterId = element.getAttribute("name");
          
          if (/^C\d+\.\d+$/.test(chapterId)) {
            const isMain = isMainChapter(chapterId);
            const mainChapterId = isMain ? chapterId : getMainChapterId(chapterId);
            
            // Create the main chapter if it doesn't exist
            if (!chaptersMap.has(mainChapterId)) {
              chaptersMap.set(mainChapterId, {
                isMainChapter: true,
                elements: [],
                mainChapterId: mainChapterId
              });
            }
            
            // Create the subchapter if it's not a main chapter
            if (!isMain) {
              chaptersMap.set(chapterId, {
                isMainChapter: false,
                elements: [],
                mainChapterId: mainChapterId
              });
            }
            
            currentChapterId = chapterId;
          }
        } else if (element.tagName.toLowerCase() !== "a" && currentChapterId) {
          // Add element to the current chapter/subchapter
          chaptersMap.get(currentChapterId).elements.push(element);
        }
      });
      
      let numberOfHadith = 0;
      const result = [];
      const processedMainChapters = new Set();
      
      // Process each chapter/subchapter
      for (const [chapterId, chapterData] of chaptersMap) {
        const mainChapterId = chapterData.mainChapterId;
        
        // Skip if we've already processed this main chapter
        if (processedMainChapters.has(mainChapterId)) continue;
        
        // Process the main chapter
        const mainChapter = chaptersMap.get(mainChapterId);
        const mainChapterInfo = extractChapterInfo(mainChapter.elements);
        const mainChapterAhadith = extractActualHadithContainer(mainChapter.elements, collectionId, bookId);

        mainChapterInfo.id = mainChapterId;
        
        // Find all subchapters belonging to this main chapter
        const subchapters = [];
        for (const [id, data] of chaptersMap) {
          if (!data.isMainChapter && data.mainChapterId === mainChapterId) {
            const subChapterInfo = extractChapterInfo(data.elements);
            const subChapterAhadith = extractActualHadithContainer(data.elements, collectionId, bookId);

            numberOfHadith += subChapterAhadith.length;

            subChapterInfo.id = id;
            
            subchapters.push({
              chapter: subChapterInfo,
              numberOfHadith: subChapterAhadith.length,
              ahadith: subChapterAhadith
            });
          }
        }

        numberOfHadith += mainChapterAhadith.length;
      
        result.push({
          chapter: mainChapterInfo,
          numberOfHadith: mainChapterAhadith.length,
          ahadith: mainChapterAhadith,
          hasSubchapters: subchapters.length > 0,
          numberOfHadithInAllSubchapters: subchapters.reduce((acc, subchapter) => acc + subchapter.numberOfHadith, 0),
          subchapters: subchapters,
        });
        
        // Mark this main chapter as processed
        processedMainChapters.add(mainChapterId);
      }

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
