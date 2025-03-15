module.exports = (elements) => {
  const chapterInfo = {
    english: {},
    arabic: {},
  };

  for (const element of elements) {
    if (
      element.className.includes("surah") ||
      element.className.includes("chapter")
    ) {
      const englishName = element.querySelector(".englishchapter")?.textContent
        .trim();
      const arabicName = element.querySelector(".arabicchapter")?.textContent
        .trim();

      chapterInfo.english.name = englishName;
      chapterInfo.arabic.name = arabicName;
    } else if (element.className.includes("achapintro")) {
      chapterInfo.arabic.intro = element.textContent;
    } else if (element.className.includes("echapintro")) {
      chapterInfo.english.intro = element.textContent;
    }
  }

  return chapterInfo;
};
