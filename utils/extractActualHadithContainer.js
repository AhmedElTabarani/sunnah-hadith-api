const getHadithInfoText = require("./getHadithInfoText");
const getReferenceUrlInfo = require("./getReferenceUrlInfo");
const getReferenceValues = require("./getReferenceValues");

module.exports = (elements, collectionId, bookId) => {
    const ahadith = [];

    for (const element of elements) {
        if (element.className.includes("actualHadithContainer")) {
            const {
                englishHadithNarrated,
                englishHadith,
                englishFullHadith,
                englishGrade,
                arabicHadithNarrated,
                arabicHadith,
                arabicFullHadith,
                arabicGrade,
            } = getHadithInfoText(element);

            const reference = element.querySelector(".hadith_reference");
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

    return ahadith;
};
