# Sunnah Hadith API

هذ `API` بسيطة يقوم بسحب البيانات من موقع sunnah.com\
ميزته أنه يوفر البحث ن الاحاديث سواء بنص عربي أو انجليزي والنتائج تكون مترجمة
باللغة العربية والإنجليزية

## تنبيه

> المشروع ليس مرفوعًا على أي سيرفر وقد يشهد تغييرات كبيرة وجزرية بشكل متكررة.
> لذلك، يُنصح بعمل `fork` أو `clone` له بدلاً من الاعتماد على سحب التحديثات منه
> بشكل مباشر، لذا أرجو أن تستخدم النسخة الخاصة بك

> ملف README باللغة الإنجليزية
> [من هنا](https://github.com/AhmedElTabarani/sunnah-hadith-api/blob/main/README.md)

- يتم عمل `cache` لكل عملية بحث لمدة `5` ثواني
- هناك حد للاستخدام: `100` عملية بحث في اليوم لكل `IP`

> يمكنك تعديل هذه الإعدادات من
> [config.js](https://github.com/AhmedElTabarani/sunnah-hadith-api/blob/main/config/config.js)

## تشغيل الـ API

1. عمل `fork` أو `clone` لهذا المشروع
2. تثبيت الـ `dependencies`

```bash
npm install
```

3. تفقد ملف
   [config.js](https://github.com/islamic-extensions/dorar-hadith-api/blob/main/config/config.js)
   وقم بتعديله حسب رغبتك
4. تشغيل الـ `API`

```bash
npm start
```

5. سيتم تشغيل الـ `API` على `http://localhost:3000`
6. استخدمه على `localhost` كما تريد أو ارفعه على استضافة أو سيرفر خاص بك

## API Endpoints

### /v1/site/hadith/search?value={text}

للبحث عن الأحاديث بواسطة النص

شكل الرد كـ `JSON`:

```json
{
  "status": "success",
  "metadata": {
    "numberOfHadith": "عدد الأحاديث في هذه الصفحة",
    "totalOfHadith": "إجمالي عدد الأحاديث",
    "page": "رقم الصفحة الحالية",
    "numberOfPages": "إجمالي عدد الصفحات",
    "removeHTML": "هل عناصر الـ HTML ممسوحة أم لا",
    "isCached": "هل هذه النتائج من الـ cache أم لا"
  },
  "data": [
    {
      "collection": "اسم المجموعة",
      "book": "اسم الكتاب",
      "english": {
        "hadithNarrated": "سند الحديث بالإنجليزية",
        "hadith": "نص الحديث بالإنجليزية، بدون الراوي",
        "fullHadith": "النص الكامل للحديث بالإنجليزية، بما في ذلك الراوي",
        "grade": "درجة الحديث بالإنجليزية"
      },
      "arabic": {
        "hadithNarrated": "سند الحديث بالعربية",
        "hadith": "نص الحديث بالعربية، بدون الراوي",
        "fullHadith": "النص الكامل للحديث بالعربية، بما في ذلك الراوي",
        "grade": "درجة الحديث بالعربية"
      },
      "reference": {
        "collectionId": "رقم المجموعة",
        "bookId": "رقم الكتاب",
        "hadithNumberInBook": "رقم الحديث في الكتاب",
        "hadithNumberInCollection": "رقم الحديث في المجموعة",
        "api": {
          "hadith": "رابط API لهذا الحديث",
          "book": "رابط API لهذا الكتاب",
          "hadithInBook": "رابط API لهذا الحديث في هذا الكتاب"
        },
        "sunnahWebsite": {
          "hadith": "رابط الحديث على موقع السنة",
          "collection": "رابط المجموعة على موقع السنة",
          "book": "رابط الكتاب على موقع السنة",
          "hadithInBook": "رابط الحديث في هذا الكتاب على موقع السنة"
        }
      }
    }
  ]
}
```

### /v1/site/collections/:collectionId/books/:bookId

للحصول على جميع الأحاديث في كتاب معين

شكل الرد كـ `JSON`:

```json
{
  "status": "success",
  "metadata": {
    "collectionId": "رقم المجموعة",
    "bookId": "رقم الكتاب",
    "note": "ملاحظة حول الكتاب",
    "hasChapters": "هل هذا الكتاب يحتوي على فصول أم لا",
    "english": {
      "bookName": "اسم الكتاب بالإنجليزية",
      "bookIntro": "مقدمة الكتاب بالإنجليزية"
    },
    "arabic": {
      "bookName": "اسم الكتاب بالعربية",
      "bookIntro": "مقدمة الكتاب بالعربية"
    },
    "numberOfHadith": "عدد الأحاديث في هذا الكتاب",
    "numberOfChapters": "عدد الفصول في هذا الكتاب",
    "isCached": "هل هذه النتائج من الـ cache أم لا"
  },
  "data": [
    {
      "chapter": {
        "english": {
          "name": "اسم الفصل بالإنجليزية",
          "intro": "مقدمة الفصل بالإنجليزية"
        },
        "arabic": {
          "name": "اسم الفصل بالعربية",
          "intro": "مقدمة الفصل بالعربية"
        }
      },
      "numberOfHadith": "عدد الأحاديث في هذا الفصل",
      "ahadith": [
        {
          "english": {
            "hadithNarrated": "الحديث مترجم إلى الإنجليزية",
            "hadith": "نص الحديث بالإنجليزية، بدون الراوي",
            "fullHadith": "النص الكامل للحديث بالإنجليزية، بما في ذلك الراوي",
            "grade": "درجة الحديث بالإنجليزية"
          },
          "arabic": {
            "hadithNarrated": "سند الحديث بالعربية",
            "hadith": "نص الحديث بالعربية، بدون الراوي",
            "fullHadith": "النص الكامل للحديث بالعربية، بما في ذلك الراوي",
            "grade": "درجة الحديث بالعربية"
          },
          "reference": {
            "collectionId": "رقم المجموعة",
            "bookId": "رقم الكتاب",
            "hadithNumberInBook": "رقم الحديث في الكتاب",
            "hadithNumberInCollection": "رقم الحديث في المجموعة",
            "api": {
              "hadith": "رابط API لهذا الحديث",
              "book": "رابط API لهذا الكتاب",
              "hadithInBook": "رابط API لهذا الحديث في هذا الكتاب"
            },
            "sunnahWebsite": {
              "hadith": "رابط الحديث على موقع السنة",
              "collection": "رابط المجموعة على موقع السنة",
              "book": "رابط الكتاب على موقع السنة",
              "hadithInBook": "رابط الحديث في هذا الكتاب على موقع السنة"
            }
          }
        }
      ]
    }
  ]
}
```

### /v1/site/collections/:collectionId/books/:bookId/hadith/:hadithId

للحصول على حديث معين في كتاب معين

شكل الرد كـ `JSON`:

```json
{
  "status": "success",
  "metadata": {
    "collectionId": "رقم المجموعة",
    "bookId": "رقم الكتاب",
    "numberOfHadithInBook": "رقم الحديث في الكتاب",
    "numberOfHadithInCollection": "رقم الحديث في المجموعة",
    "english": {
      "bookName": "اسم الكتاب بالإنجليزية",
      "bookIntro": "مقدمة الكتاب بالإنجليزية",
      "chapterName": "اسم الفصل بالإنجليزية"
    },
    "arabic": {
      "bookName": "اسم الكتاب بالعربية",
      "bookIntro": "مقدمة الكتاب بالعربية",
      "chapterName": "اسم الفصل بالعربية"
    },
    "numberOfHadith": "عدد الأحاديث في هذا الكتاب",
    "numberOfChapters": "عدد الفصول في هذا الكتاب",
    "isCached": "هل هذه النتائج من الـ cache أم لا"
  },
  "data": {
    "english": {
      "hadithNarrated": "الحديث مترجم إلى الإنجليزية",
      "hadith": "نص الحديث بالإنجليزية، بدون الراوي",
      "fullHadith": "النص الكامل للحديث بالإنجليزية، بما في ذلك الراوي",
      "grade": "درجة الحديث بالإنجليزية"
    },
    "arabic": {
      "hadithNarrated": "سند الحديث بالعربية",
      "hadith": "نص الحديث بالعربية، بدون الراوي",
      "fullHadith": "النص الكامل للحديث بالعربية، بما في ذلك الراوي",
      "grade": "درجة الحديث بالعربية"
    },
    "reference": {
      "collectionId": "رقم المجموعة",
      "bookId": "رقم الكتاب",
      "hadithNumberInBook": "رقم الحديث في الكتاب",
      "hadithNumberInCollection": "رقم الحديث في المجموعة",
      "api": {
        "hadith": "رابط API لهذا الحديث",
        "book": "رابط API لهذا الكتاب",
        "hadithInBook": "رابط API لهذا الحديث في هذا الكتاب"
      },
      "sunnahWebsite": {
        "hadith": "رابط الحديث على موقع السنة",
        "collection": "رابط المجموعة على موقع السنة",
        "book": "رابط الكتاب على موقع السنة",
        "hadithInBook": "رابط الحديث في هذا الكتاب على موقع السنة"
      }
    }
  }
}
```

### /v1/site/collections/:collectionId/hadith/:hadithId

للحصول على حديث معين في مجموعة معينة

شكل الرد كـ `JSON`:

```json
{
  "status": "success",
  "metadata": {
    "collectionId": "رقم المجموعة",
    "bookId": "رقم الكتاب",
    "numberOfHadithInBook": "رقم الحديث في الكتاب",
    "numberOfHadithInCollection": "رقم الحديث في المجموعة",
    "english": {
      "bookName": "اسم الكتاب بالإنجليزية",
      "bookIntro": "مقدمة الكتاب بالإنجليزية",
      "chapterName": "اسم الفصل بالإنجليزية"
    },
    "arabic": {
      "bookName": "اسم الكتاب بالعربية",
      "bookIntro": "مقدمة الكتاب بالعربية",
      "chapterName": "اسم الفصل بالعربية"
    },
    "numberOfHadith": "عدد الأحاديث في هذا الكتاب",
    "numberOfChapters": "عدد الفصول في هذا الكتاب",
    "isCached": "هل هذه النتائج من الـ cache أم لا"
  },
  "data": {
    "english": {
      "hadithNarrated": "الحديث مترجم إلى الإنجليزية",
      "hadith": "نص الحديث بالإنجليزية، بدون الراوي",
      "fullHadith": "النص الكامل للحديث بالإنجليزية، بما في ذلك الراوي",
      "grade": "درجة الحديث بالإنجليزية"
    },
    "arabic": {
      "hadithNarrated": "سند الحديث بالعربية",
      "hadith": "نص الحديث بالعربية، بدون الراوي",
      "fullHadith": "النص الكامل للحديث بالعربية، بما في ذلك الراوي",
      "grade": "درجة الحديث بالعربية"
    },
    "reference": {
      "collectionId": "رقم المجموعة",
      "bookId": "رقم الكتاب",
      "hadithNumberInBook": "رقم الحديث في الكتاب",
      "hadithNumberInCollection": "رقم الحديث في المجموعة",
      "api": {
        "hadith": "رابط API لهذا الحديث",
        "book": "رابط API لهذا الكتاب",
        "hadithInBook": "رابط API لهذا الحديث في هذا الكتاب"
      },
      "sunnahWebsite": {
        "hadith": "رابط الحديث على موقع السنة",
        "collection": "رابط المجموعة على موقع السنة",
        "book": "رابط الكتاب على موقع السنة",
        "hadithInBook": "رابط الحديث في هذا الكتاب على موقع السنة"
      }
    }
  }
}
```

## Query Parameters

|    Key     |             الوصف              |
| :--------: | :----------------------------: |
|   value    |    النص الذي تريد البحث عنه    |
|    page    |  الصفحة التي تريد البحث فيها   |
| removeHTML | إزالة عناصر HTML من النص أم لا |

### value

- النص الذي تريد البحث عنه
- مثال: `/v1/site/hadith/search?value=fasting`

### page

- الصفحة التي تريد البحث فيها
- مثال: `/v1/site/hadith/search?value=fasting&page=2`
- القيمة الافتراضية: `1`

### removeHTML

- إزالة عناصر `HTML` من النص أم لا مثل عناصر `<em>` و `<b>`
- مثال: `/v1/site/hadith/search?value=fasting&removeHTML=false`
- القيمة الافتراضية: `true`
