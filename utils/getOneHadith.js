const getHadithInfoText = require('./getHadithInfoText');
const getReferenceUrlInfo = require('./getReferenceUrlInfo');

module.exports = (doc, collectionId, bookId, hadithId) => {
  const hadithNumberInCollection =
    bookId == 'introduction'
      ? '1'
      : doc
          .querySelector('.crumbs')
          ?.textContent.split('» Hadith')
          .at(-1)
          .replaceAll(' ', '');

  const arabicBookName = doc
    .querySelector('.book_page_arabic_name')
    ?.textContent.trim();

  const englishBookName = doc
    .querySelector('.book_page_english_name')
    ?.textContent.trim();

  const englishBookIntro = doc
    .querySelector('.ebookintro')
    ?.textContent.trim();

  const arabicBookIntro = doc
    .querySelector('.abookintro')
    ?.textContent.trim();

  const AllHadith = doc.querySelector('.AllHadith');

  if (!AllHadith) {
    throw new Error('No result');
  }

  const chapter = AllHadith.querySelector('.chapter');

  const englishChapterName = chapter
    ?.querySelector('.englishchapter')
    ?.textContent.trim();
  const arabicChapterName = chapter
    ?.querySelector('.arabicchapter')
    ?.textContent.trim();

  const hadith = AllHadith.querySelector('.actualHadithContainer');

  const {
    englishHadith,
    englishHadithNarrated,
    englishFullHadith,
    englishGrade,
    arabicHadithNarrated,
    arabicHadith,
    arabicFullHadith,
    arabicGrade,
  } = getHadithInfoText(hadith);

  return {
    result: {
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
          hadithId,
          hadithNumberInCollection,
        ),
      },
    },
    metadata: {
      collectionId,
      bookId,
      hadithNumberInBook: hadithId,
      hadithNumberInCollection,
      english: {
        bookName: englishBookName,
        bookIntro: englishBookIntro,
        chapterName: englishChapterName,
      },
      arabic: {
        bookName: arabicBookName,
        bookIntro: arabicBookIntro,
        chapterName: arabicChapterName,
      },
    },
  };
};
