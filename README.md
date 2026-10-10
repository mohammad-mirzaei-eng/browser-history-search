# Browser History Search

A powerful browser extension for advanced history search with comprehensive features.

## Demo

<img width="781" height="599" alt="image" src="https://github-production-user-asset-6210df.s3.amazonaws.com/7163310/670302880-c77945af-350f-431a-9672-d99fd9f556f9.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20261010%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20261010T074253Z&X-Amz-Expires=300&X-Amz-Signature=9a8ce387ac388ac5a0f73f7eedb106d6ae727c7b5d1bc21cd2caad09ab530064&X-Amz-SignedHeaders=host&response-content-type=image%2Fpng" />


The new user interface is designed to be modern, user-friendly, and fully responsive. It adapts gracefully to any screen size, from a small mobile phone to a large desktop monitor, ensuring a seamless experience on any device. The design features a clean aesthetic, an improved dark mode, and enhanced accessibility.

## Features

### Search & Filtering
- 🔍 Advanced keyword search with multiple filters
- 🔎 Exact or partial match options
- 🌐 Domain-specific filtering
- 📅 Date range filtering
- 🔢 Minimum visit count filter
- 🔢 Maximum results per search (user configurable)

### Results Management
- 📊 Real-time statistics and charts
- 📈 Visual representation of results and visits
- 🗑️ Delete selected items
- 🗑️ Delete all items at once
- 📥 Export to CSV format
- 📥 Export to JSON format

### User Interface
- 🌙 Dark/Light mode support
- 🌐 Multi-language support (English/Persian)
- 🔄 Auto-save search filters
- 📱 Responsive design
- 🎨 Modern and clean interface
- 🌀 Progress overlay during heavy operations (search, delete, export)

### Advanced Features
- 🔍 Bulk selection with Shift+Click
- 📋 Copy URLs to clipboard
- 🔄 Automatic search refresh
- 📊 Detailed visit statistics
- 🔍 Quick search history

## How to Use

1. Click on the extension icon
2. Enter your search keyword
3. Set your desired filters:
   - Search type (contains/exact)
   - Specific domain
   - Date range
   - Minimum visit count
4. Click the search button
5. From the results you can:
   - Click on titles to visit pages
   - Use Shift+Click to select multiple items
   - Delete selected items
   - Export results

## Settings

- Language switch: English/Persian
- Dark/Light mode toggle
- Auto-save search filters
- Chart display options
- Results per page

## Installation

### Firefox
1. Visit [Firefox Add-ons](https://addons.mozilla.org/)
2. Search for "Browser History Search"
3. Click "Add to Firefox"

### Development Installation
1. Download the project files
2. For Firefox:
   - Go to `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select the manifest.json file
3. For Chrome:
   - Go to `chrome://extensions`
   - Enable Developer mode
   - Click "Load unpacked"
   - Select the project folder

## Permissions

- `history`: Access to browser history
- `storage`: Save settings and filters

## Development

This extension is built with HTML, CSS, and JavaScript.

### Browser-specific packages

Run `node scripts/build-packages.js` to generate three self-contained extension folders:

- `desktop/chrome`: Chrome desktop popup, sized to 780 x 600 CSS pixels.
- `desktop/firefox`: Firefox desktop popup, sized to 780 x 600 CSS pixels.
- `mobile/firefox`: Firefox for Android layout, sized to the available screen and arranged in one column.

Load the desired folder as an unpacked extension in the corresponding browser. Re-run the build script after changing the shared source files. The script updates package files without deleting other files in those folders.

## Support

For issues or feature requests, please use the Issues section on GitHub.

## License

This project is licensed under the MIT License.

---

# جستجوی تاریخچه مرورگر

یک افزونه قدرتمند مرورگر برای جستجوی پیشرفته در تاریخچه با امکانات جامع.

## دمو


<img width="781" height="599" alt="image" src="https://github-production-user-asset-6210df.s3.amazonaws.com/7163310/670302880-c77945af-350f-431a-9672-d99fd9f556f9.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20261010%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20261010T074253Z&X-Amz-Expires=300&X-Amz-Signature=9a8ce387ac388ac5a0f73f7eedb106d6ae727c7b5d1bc21cd2caad09ab530064&X-Amz-SignedHeaders=host&response-content-type=image%2Fpng" />

رابط کاربری جدید به گونه‌ای طراحی شده است که مدرن، کاربرپسند و کاملاً واکنش‌گرا باشد. این طرح به زیبایی با هر اندازه صفحه‌نمایش، از یک تلفن همراه کوچک تا یک مانیتور دسکتاپ بزرگ، سازگار می‌شود و تجربه‌ای یکپارچه را در هر دستگاهی تضمین می‌کند. این طراحی دارای زیبایی‌شناسی تمیز، حالت تاریک بهبود یافته و دسترسی‌پذیری پیشرفته است.

## ویژگی‌ها

### جستجو و فیلتر کردن
- 🔍 جستجوی پیشرفته با فیلترهای مختلف
- 🔎 گزینه‌های جستجوی دقیق یا نسبی
- 🌐 فیلتر کردن بر اساس دامنه
- 📅 فیلتر کردن بر اساس محدوده زمانی
- 🔢 فیلتر بر اساس حداقل تعداد بازدید
- 🔢 تعیین حداکثر نتایج جستجو توسط کاربر

### مدیریت نتایج
- 📊 آمار و نمودارهای زنده
- 📈 نمایش بصری نتایج و بازدیدها
- 🗑️ حذف موارد انتخاب شده
- 🗑️ حذف همه موارد یکجا
- 📥 خروجی به فرمت CSV
- 📥 خروجی به فرمت JSON

### رابط کاربری
- 🌙 پشتیبانی از حالت تاریک/روشن
- 🌐 پشتیبانی از چند زبان (انگلیسی/فارسی)
- 🔄 ذخیره خودکار فیلترهای جستجو
- 📱 طراحی واکنش‌گرا
- 🎨 رابط کاربری مدرن و تمیز
- 🌀 نمایش پرده و پروگرس بار هنگام عملیات سنگین (جستجو، حذف، خروجی)

### امکانات پیشرفته
- 🔍 انتخاب گروهی با Shift+Click
- 📋 کپی آدرس‌ها به حافظه
- 🔄 به‌روزرسانی خودکار جستجو
- 📊 آمار دقیق بازدیدها
- 🔍 تاریخچه جستجوهای سریع

## نحوه استفاده

1. روی آیکن افزونه کلیک کنید
2. کلیدواژه مورد نظر را وارد کنید
3. فیلترهای دلخواه را تنظیم کنید:
   - نوع جستجو (شامل/دقیق)
   - دامنه خاص
   - محدوده زمانی
   - حداقل تعداد بازدید
4. دکمه جستجو را بزنید
5. از نتایج می‌توانید:
   - با کلیک روی عنوان به صفحه بروید
   - با Shift+Click چند مورد را انتخاب کنید
   - موارد انتخاب شده را حذف کنید
   - نتایج را ذخیره کنید

## تنظیمات

- تغییر زبان: انگلیسی/فارسی
- تغییر حالت تاریک/روشن
- ذخیره خودکار فیلترها
- تنظیمات نمایش نمودار
- تعداد نتایج در هر صفحه

## نصب

### فایرفاکس
1. به [افزونه‌های فایرفاکس](https://addons.mozilla.org/) مراجعه کنید
2. "جستجوی تاریخچه مرورگر" را جستجو کنید
3. روی "افزودن به فایرفاکس" کلیک کنید

### نصب برای توسعه
1. فایل‌های پروژه را دانلود کنید
2. برای فایرفاکس:
   - به `about:debugging` بروید
   - روی "This Firefox" کلیک کنید
   - روی "Load Temporary Add-on" کلیک کنید
   - فایل manifest.json را انتخاب کنید
3. برای کروم:
   - به `chrome://extensions` بروید
   - حالت توسعه‌دهنده را فعال کنید
   - روی "Load unpacked" کلیک کنید
   - پوشه پروژه را انتخاب کنید

## مجوزها

- `history`: دسترسی به تاریخچه مرورگر
- `storage`: ذخیره تنظیمات و فیلترها

## توسعه

این افزونه با HTML، CSS و JavaScript ساخته شده است.

## پشتیبانی

برای گزارش مشکلات یا پیشنهاد بهبود، لطفاً از بخش Issues در گیت‌هاب استفاده کنید.

## مجوز

این پروژه تحت مجوز MIT منتشر شده است.
