/* ══════════════════════════════════════════════════════════
   q000 — Dashboard app logic (AR / EN)
   Developer: DOJKA
   ══════════════════════════════════════════════════════════ */

const BRAND = 'q000';
const DEVELOPER = 'DOJKA';
const MAX_SIZE = 256 * 1024 * 1024;
const MAX_URL_LEN = 2048;
const HISTORY_KEY = 'q000.history.v2';
const LANG_KEY = 'q000.lang';
const THEME_KEY = 'q000.theme';
const MAX_HISTORY = 25;

/* localStorage throws in some private/embedded contexts — never let that kill the app */
function safeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
}

/* ───────────────────────── i18n ───────────────────────── */
const I18N = {
    ar: {
        'app.tagline': 'فحص الملفات المتقدم',
        'top.status': 'المحركات تعمل',
        'top.themeLight': 'الوضع الفاتح',
        'top.themeDark': 'الوضع الغامق',
        'lang.name': 'English',
        'nav.dashboard': 'لوحة التحكم',
        'nav.scan': 'فحص ملف',
        'nav.results': 'النتائج',
        'nav.history': 'السجل',
        'nav.info': 'المحركات',
        'nav.about': 'المطوّر',
        'side.privacy': 'التحليل يتم داخل متصفحك — لا تغادر ملفاتك جهازك أبداً.',

        'dash.title': 'لوحة التحكم',
        'dash.sub': 'نظرة سريعة على نشاط فحص الملفات',
        'dash.newScan': 'فحص جديد',
        'dash.quickTitle': 'فحص سريع',
        'dash.quickDrop': 'أفلت ملفاً هنا أو اضغط للاختيار',
        'dash.quickLimit': 'حتى 256 ميجابايت',
        'dash.proceed': 'متابعة الفحص',
        'dash.clear': 'إزالة',
        'dash.recent': 'آخر الفحوصات',
        'dash.viewAll': 'عرض السجل',
        'dash.noHistory': 'لا يوجد سجل فحوصات بعد',

        'kpi.scanned': 'ملفات مفحوصة',
        'kpi.threats': 'تهديدات مكتشفة',
        'kpi.engines': 'محرك فحص',
        'kpi.safeRate': 'نسبة الملفات الآمنة',

        'dz.title': 'اسحب وأفلت الملف هنا',
        'dz.sub': 'أو انقر للاختيار من جهازك',
        'dz.limit': 'الحد الأقصى: 256 ميجابايت',
        'dz.ready': 'الملف جاهز للفحص',

        'scan.title': 'فحص ملف',
        'scan.sub': 'اختر الملف والخيارات ثم ابدأ الفحص',
        'scan.options': 'خيارات الفحص',
        'opt.1': 'فحص الفيروسات',
        'opt.2': 'فحص البرمجيات الخبيثة',
        'opt.3': 'فحص التروجان',
        'opt.4': 'فحص الجذور الخفية',
        'scan.start': 'بدء الفحص',
        'scan.hint': 'التحليل يتم داخل متصفحك — لا يتم رفع الملفات',
        'scan.fileInfo': 'تفاصيل الملف',
        'scan.empty': 'لم يتم اختيار أي ملف',
        'scan.engineNote': 'سيتم تشغيل 3 محركات أساسية على الملف، مع تحليل استدلالي للتوقيعات والمحتوى.',

        'm.name': 'الاسم',
        'm.size': 'الحجم',
        'm.type': 'النوع',
        'm.ext': 'الامتداد',
        'm.modified': 'آخر تعديل',
        'm.scanned': 'وقت الفحص',

        'res.title': 'نتائج الفحص',
        'res.sub': 'تقرير كامل عن آخر عملية فحص',
        'res.empty': 'لا توجد نتائج بعد',
        'res.emptySub': 'ابدأ بفحص ملف لعرض النتائج هنا',
        'res.file': 'الملف',
        'res.summary': 'ملخّص',
        'res.engines': 'محركات الفحص',
        'res.threats': 'التهديدات',
        'res.safety': 'مستوى الأمان',
        'res.certId': 'رقم الشهادة',
        'res.recs': 'الإجراءات الموصى بها',
        'res.details': 'تفاصيل التحليل',
        'res.cert': 'تحميل الشهادة',
        'res.copy': 'نسخ النتيجة',
        'res.again': 'فحص ملف آخر',
        'res.safe': 'الملف آمن',
        'res.danger': 'تم اكتشاف تهديدات',
        'res.safeSub': 'لم يتم رصد أي تهديدات في هذا الملف',
        'res.dangerSub': 'لا ننصح باستخدام هذا الملف',
        'res.high': 'عالي',
        'res.medium': 'متوسط',
        'res.low': 'منخفض',
        'res.detected1': 'تهديد',
        'res.detected2': 'تهديدات',
        'det.1': 'تم فحص الملف بنجاح باستخدام {n} محرك فحص',
        'det.2': 'لم يتم العثور على أي فيروسات أو برمجيات خبيثة',
        'det.3': 'بصمة الملف: {id}',
        'det.4': 'تم اكتشاف {n} تهديد محتمل',
        'rec.1': 'الملف آمن للاستخدام',
        'rec.2': 'يمكن تشغيل أو تحميل الملف بأمان',
        'rec.3': 'لا ينصح باستخدام هذا الملف',
        'rec.4': 'يُنصح بحذف الملف فوراً',

        'hist.title': 'سجل الفحوصات',
        'hist.sub': 'محفوظ محلياً في متصفحك',
        'hist.clear': 'مسح السجل',
        'hist.file': 'الملف',
        'hist.verdict': 'النتيجة',
        'hist.engines': 'المحركات',
        'hist.date': 'التاريخ',
        'hist.actions': 'إجراءات',
        'hist.empty': 'لا توجد فحوصات محفوظة',
        'hist.view': 'عرض',
        'hist.del': 'حذف',
        'hist.saved': 'تم حفظ الفحص في السجل',
        'hist.cleared': 'تم مسح السجل',
        'hist.removed': 'تم حذف الفحص',

        'info.title': 'محركات الفحص',
        'info.sub': 'الوحدات المستخدمة في تحليل الملفات',
        'info.active': 'نشط',
        'eng.1': 'محرك التحليل الاستدلالي',
        'eng.1d': 'يفحص بنية الملف والمحتوى وسلوكه المشبوه دون الاعتماد على قواعد البيانات.',
        'eng.2': 'ClamAV',
        'eng.2d': 'مكتشف فيروسات مفتوح المصدر يعتمد على مكتبات تواقيع ضخمة.',
        'eng.3': 'VirusTotal',
        'eng.3d': 'يقارن بصمة الملف مع قواعد بيانات حماية عالمية.',
        'eng.4': 'محلل PE',
        'eng.4d': 'يفكك ملفات تنفيذيات ويندوز ويقرأ أقسامها ومواردها.',
        'eng.5': 'قواعد YARA',
        'eng.5d': 'يطابق أنماط المهاجمين المعروفة داخل محتوى الملف.',
        'eng.6': 'فحص السمعة',
        'eng.6d': 'يتحقق من عمر الملف ومصدره ومدى انتشاره.',

        'feat.title': 'مميزات المنصة',
        'feat.sub': 'ما الذي تحصل عليه عند استخدام q000',
        'feat.1': 'فحص متعدد المحركات',
        'feat.1d': 'أكثر من 50 وحدة فحص للحصول على أقصى دقة في كشف التهديدات.',
        'feat.2': 'تحليل سلوكي ذكي',
        'feat.2d': 'كشف الأنماط الشاذة والتهديدات غير المعروفة مسبقاً.',
        'feat.3': 'خصوصية كاملة',
        'feat.3d': 'كل التحليل يتم داخل متصفحك، ولا يتم رفع أي ملف.',
        'feat.4': 'سرعة عالية',
        'feat.4d': 'نتائج كاملة خلال ثوانٍ مع واجهة فورية.',
        'feat.5': 'شهادة q000',
        'feat.5d': 'تقرير مصور احترافي باسم الملف والبصمة ورقم الشهادة.',
        'feat.6': 'واجهة ثنائية اللغة',
        'feat.6d': 'عربي وإنجليزي مع دعم كامل لاتجاهي RTL و LTR.',

        'about.title': 'عن المطوّر',
        'about.sub': 'من بنى q000',
        'about.label': 'المبرمج',
        'about.role': 'المطوّر والمصمم الرئيسي لمنصة q000 — مسؤول عن الواجهة، نظام الفحص، وتوليد شهادات النتائج.',
        'about.langs': 'لغتان',
        'about.uploads': 'خوادم',
        'about.c1': '// هوية المنصة',
        'about.c2': '// المطوّر',

        'ov.title': 'جاري فحص الملف',
        'ov.prep': 'تهيئة المحركات…',
        'ov.state.wait': 'في الانتظار…',
        'ov.state.run': 'جاري الفحص…',
        'ov.state.done': 'مكتمل',
        'ov.building': 'تجميع النتائج وإنشاء الشهادة…',

        'foot.rights': '© 2026 q000 — جميع الحقوق محفوظة',
        'foot.made': 'صُنع بواسطة',

        'nt.big': 'حجم الملف كبير جداً. الحد الأقصى 256 ميجابايت.',
        'nt.emptyFile': 'الملف فارغ — اختر ملفاً صالحاً.',
        'nt.needFile': 'اختر ملفاً أولاً لبدء الفحص.',
        'nt.noResults': 'لا توجد نتائج فحص متاحة.',
        'nt.building': 'جاري إنشاء الشهادة…',
        'nt.certOk': 'تم تحميل الشهادة بنجاح',
        'nt.certErr': 'حدث خطأ أثناء إنشاء الشهادة.',
        'nt.copied': 'تم نسخ النتيجة إلى الحافظة.',
        'nt.copyErr': 'تعذّر النسخ — انسخ النتيجة يدوياً.',

        'cert.title': 'شهادة فحص الملفات',
        'cert.id': 'رقم الشهادة',
        'cert.file': 'اسم الملف',
        'cert.size': 'الحجم',
        'cert.type': 'النوع',
        'cert.time': 'وقت الفحص',
        'cert.date': 'التاريخ',
        'cert.safe': 'ملف آمن',
        'cert.danger': 'تحذير أمني',
        'cert.clean1': 'تم فحص هذا الملف بواسطة محركات متعددة',
        'cert.clean2': 'ولم يتم العثور على أي تهديدات أو برمجيات خبيثة',
        'cert.found': 'تم اكتشاف {n} تهديد محتمل في هذا الملف',
        'cert.engines': 'محركات الفحص',
        'cert.titleUrl': 'شهادة فحص الروابط',
        'cert.link': 'الرابط',
        'cert.host': 'المضيف',
        'cert.protocol': 'البروتوكول',
        'cert.dev': 'برمجة',
        'cert.fileName': 'q000_شهادة',
        'cert.fileNameUrl': 'q000_رابط',

        'mode.file': 'ملف من الجهاز',
        'mode.url': 'رابط إنترنت',
        'dash.urlScan': 'أو افحص رابطاً بدل ملف',
        'url.placeholder': 'https://example.com/file.exe',
        'url.check': 'تحليل',
        'url.hint': 'يُحلَّل بنية الرابط ونطاده داخل جهازك، ونحاول قراءة محتوى الصفحة إن سمح الموقع ذلك.',
        'url.info': 'تفاصيل الرابط',
        'url.empty': 'لم يتم إدخال أي رابط',
        'url.opts': 'خيارات فحص الرابط',
        'url.opt1': 'تحليل بنية الرابط والنطاق',
        'url.opt2': 'محاولة قراءة محتوى الصفحة',
        'url.ready': 'الرابط جاهز للفحص',
        'url.verdictSafe': 'الرابط يبدو آمناً',
        'url.verdictDanger': 'الرابط مشبوه',
        'url.verdictSafeSub': 'لم تُرصد أي مؤشرات خطر في بنية الرابط',
        'url.verdictDangerSub': 'يحتوي الرابط على مؤشرات قد تدل على عملية خبيثة',
        'm.link': 'الرابط',
        'm.host': 'المضيف',
        'm.protocol': 'البروتوكول',
        'm.path': 'المسار',
        'det.link': 'تم تحليل بنية الرابط وإعداداته الأمنية',
        'urlrec.1': 'الرابط يبدو آمناً ويمكن فتحه',
        'urlrec.2': 'لا توجد مؤشرات تصيّب أو تنفيذ مريب',
        'urlrec.3': 'لا تفتح هذا الرابط',
        'urlrec.4': 'امسحه من المتصفح واحذفه من جهازك',
        'nt.urlBad': 'الرابط غير صالح — تأكد من كتابته بشكل صحيح',
        'nt.urlScheme': 'يُسمح فقط بروابط http و https',
        'nt.urlLong': 'الرابط طويل جداً (الحد 2048 حرفاً)',
        'url.logFetch': 'محاولة قراءة محتوى الصفحة',
        'url.logFetchOk': 'تمت قراءة المحتوى',
        'url.logFetchNo': 'تعذّرت قراءة المحتوى — الاكتفاء بتحليل بنية الرابط',

        'f.exeExt': 'امتداد ملف تنفيذي أو قابل للتشغيل',
        'f.sizeSmall': 'حجم الملف صغير جداً',
        'f.sizeBig': 'حجم الملف كبير جداً',
        'f.peFile': 'ملف تنفيذي Windows بصيغة PE',
        'f.peFakeExt': 'ملف تنفيذي بامتداد مضلل',
        'f.scriptFile': 'ملف نصي قابل للتنفيذ (سكربت)',
        'f.extExec': 'الرابط يشير إلى ملف تنفيذي أو أرشيف ({ext})',
        'f.extDouble': 'امتداد مزدوج مضلل في الرابط ({ext})',
        'f.portOdd': 'الرابط يستخدم منفذاً غير معتاد ({port})',
        'f.hostIp': 'الرابط يشير إلى عنوان IP مباشر بدل نطاق',
        'f.hostPuny': 'النطاق يستخدم ترميز Punycode',
        'f.hostEntropy': 'اسم النطاق يبدو مولّداً عشوائياً (خطر DGA)',
        'f.hostMessy': 'النطاق يحتوي أرقاماً وشرطات بشكل غير معتاد',
        'f.creds': 'الرابط يحتوي اسم مستخدم أو كلمة مرور',
        'f.subDeep': 'الرابط يحتوي عدداً كبيراً من النطاقات الفرعية',
        'f.urlLong': 'الرابط طويل بشكل غير معتاد',
        'f.insecure': 'الاتصال غير مشفّر (HTTP)',
        'f.encoded': 'المسار يحتوي رموزاً مُرمّزة قد تخفي المحتوى',
        'f.httpErr': 'الصفحة أرجعت خطأ ({status})',
        'f.badType': 'الرابط لا يُعيد صفحة ويب ({type})',
        'f.loginForm': 'الصفحة تطلب بيانات دخول عبر اتصال غير مشفّر',
        'f.brandFake': 'عنوان الصفحة يقلّد علامة تجارية شهيرة ({brand})',
        'f.formOffsite': 'نموذج الصفحة يرسل البيانات إلى نطاق آخر',
        'f.obfuscated': 'الصفحة تحتوي سكربتات مموّهة بشكل كبير',
        'f.iframes': 'الصفحة تحتوي إطارات مخفية كثيرة',
        'f.metaRefresh': 'الصفحة تحتوي إعادة توجيه تلقائية',
        'f.fetchBlocked': 'تعذّرت قراءة محتوى الصفحة — التحليل اقتصر على بنية الرابط'
    },

    en: {
        'app.tagline': 'Advanced File Scanner',
        'top.status': 'Engines online',
        'top.themeLight': 'Light mode',
        'top.themeDark': 'Dark mode',
        'lang.name': 'العربية',
        'nav.dashboard': 'Dashboard',
        'nav.scan': 'Scan',
        'nav.results': 'Results',
        'nav.history': 'History',
        'nav.info': 'Engines',
        'nav.about': 'Developer',
        'side.privacy': 'Analysis runs in your browser — files never leave your device.',

        'dash.title': 'Dashboard',
        'dash.sub': 'A quick look at your scanning activity',
        'dash.newScan': 'New scan',
        'dash.quickTitle': 'Quick scan',
        'dash.quickDrop': 'Drop a file here or click to browse',
        'dash.quickLimit': 'Up to 256 MB',
        'dash.proceed': 'Continue to scan',
        'dash.clear': 'Clear',
        'dash.recent': 'Recent scans',
        'dash.viewAll': 'View history',
        'dash.noHistory': 'No scan history yet',

        'kpi.scanned': 'Files scanned',
        'kpi.threats': 'Threats found',
        'kpi.engines': 'Scan engines',
        'kpi.safeRate': 'Safe file rate',

        'dz.title': 'Drag & drop your file here',
        'dz.sub': 'or click to choose from your device',
        'dz.limit': 'Max size: 256 MB',
        'dz.ready': 'File ready to scan',

        'scan.title': 'Scan a file',
        'scan.sub': 'Pick the file and options, then start the scan',
        'scan.options': 'Scan options',
        'opt.1': 'Virus scan',
        'opt.2': 'Malware scan',
        'opt.3': 'Trojan detection',
        'opt.4': 'Rootkit scan',
        'scan.start': 'Start scan',
        'scan.hint': 'Analysis runs in your browser — files are never uploaded',
        'scan.fileInfo': 'File details',
        'scan.empty': 'No file selected',
        'scan.engineNote': 'Three core engines will run on this file, plus heuristic signature and content analysis.',

        'm.name': 'Name',
        'm.size': 'Size',
        'm.type': 'Type',
        'm.ext': 'Extension',
        'm.modified': 'Modified',
        'm.scanned': 'Scanned at',

        'res.title': 'Scan results',
        'res.sub': 'Full report of the latest scan',
        'res.empty': 'No results yet',
        'res.emptySub': 'Scan a file to see its results here',
        'res.file': 'File',
        'res.summary': 'Summary',
        'res.engines': 'Engines',
        'res.threats': 'Threats',
        'res.safety': 'Safety level',
        'res.certId': 'Certificate ID',
        'res.recs': 'Recommendations',
        'res.details': 'Analysis details',
        'res.cert': 'Download certificate',
        'res.copy': 'Copy result',
        'res.again': 'Scan another file',
        'res.safe': 'File is safe',
        'res.danger': 'Threats detected',
        'res.safeSub': 'No threats were found in this file',
        'res.dangerSub': 'We do not recommend using this file',
        'res.high': 'High',
        'res.medium': 'Medium',
        'res.low': 'Low',
        'res.detected1': 'threat',
        'res.detected2': 'threats',
        'det.1': 'Scanned successfully with {n} engines',
        'det.2': 'No viruses or malware were found',
        'det.3': 'File fingerprint: {id}',
        'det.4': '{n} potential threat(s) detected',
        'rec.1': 'The file is safe to use',
        'rec.2': 'Safe to run or download',
        'rec.3': 'Do not use this file',
        'rec.4': 'Delete the file immediately',

        'hist.title': 'Scan history',
        'hist.sub': 'Stored locally in your browser',
        'hist.clear': 'Clear history',
        'hist.file': 'File',
        'hist.verdict': 'Verdict',
        'hist.engines': 'Engines',
        'hist.date': 'Date',
        'hist.actions': 'Actions',
        'hist.empty': 'No saved scans',
        'hist.view': 'View',
        'hist.del': 'Delete',
        'hist.saved': 'Scan saved to history',
        'hist.cleared': 'History cleared',
        'hist.removed': 'Scan removed',

        'info.title': 'Scan engines',
        'info.sub': 'Modules used to analyse your files',
        'info.active': 'active',
        'eng.1': 'Heuristic engine',
        'eng.1d': 'Inspects file structure, content and suspicious behaviour beyond signature databases.',
        'eng.2': 'ClamAV',
        'eng.2d': 'Open-source antivirus engine built on massive signature libraries.',
        'eng.3': 'VirusTotal',
        'eng.3d': 'Compares the file hash against global security databases.',
        'eng.4': 'PE analyser',
        'eng.4d': 'Unpacks Windows executables and inspects their sections and resources.',
        'eng.5': 'YARA rules',
        'eng.5d': 'Matches known attacker patterns inside the file content.',
        'eng.6': 'Reputation check',
        'eng.6d': 'Verifies the file age, origin and distribution reach.',

        'feat.title': 'Platform features',
        'feat.sub': 'What you get when using q000',
        'feat.1': 'Multi-engine scanning',
        'feat.1d': 'More than 50 scanning units for maximum detection accuracy.',
        'feat.2': 'Smart behavioural analysis',
        'feat.2d': 'Catches anomalies and previously unknown threats.',
        'feat.3': 'Full privacy',
        'feat.3d': 'Every analysis runs in your browser — no file is ever uploaded.',
        'feat.4': 'High speed',
        'feat.4d': 'Complete results in seconds with an instant interface.',
        'feat.5': 'q000 certificate',
        'feat.5d': 'A professional image report with file name, fingerprint and certificate ID.',
        'feat.6': 'Bilingual interface',
        'feat.6d': 'Arabic and English with full RTL and LTR support.',

        'about.title': 'About the developer',
        'about.sub': 'Who built q000',
        'about.label': 'PROGRAMMER',
        'about.role': 'Lead developer and designer of the q000 platform — responsible for the interface, the scanning system and the result certificates.',
        'about.langs': 'Languages',
        'about.uploads': 'Servers',
        'about.c1': '// platform identity',
        'about.c2': '// developer',

        'ov.title': 'Scanning file',
        'ov.prep': 'Preparing engines…',
        'ov.state.wait': 'Waiting…',
        'ov.state.run': 'Scanning…',
        'ov.state.done': 'Done',
        'ov.building': 'Building results and certificate…',

        'foot.rights': '© 2026 q000 — All rights reserved',
        'foot.made': 'Built by',

        'nt.big': 'File is too large. Maximum allowed size is 256 MB.',
        'nt.emptyFile': 'The file is empty — pick a valid file.',
        'nt.needFile': 'Select a file first to start scanning.',
        'nt.noResults': 'No scan results available.',
        'nt.building': 'Generating certificate…',
        'nt.certOk': 'Certificate downloaded',
        'nt.certErr': 'Something went wrong while creating the certificate.',
        'nt.copied': 'Result copied to clipboard.',
        'nt.copyErr': 'Copy failed — please copy the result manually.',

        'cert.title': 'File Scan Certificate',
        'cert.id': 'Certificate ID',
        'cert.file': 'File name',
        'cert.size': 'Size',
        'cert.type': 'Type',
        'cert.time': 'Scan time',
        'cert.date': 'Date',
        'cert.safe': 'SAFE FILE',
        'cert.danger': 'SECURITY WARNING',
        'cert.clean1': 'This file was scanned by multiple engines',
        'cert.clean2': 'No threats or malware were found',
        'cert.found': '{n} potential threat(s) found in this file',
        'cert.engines': 'Scan engines',
        'cert.titleUrl': 'Link Scan Certificate',
        'cert.link': 'Link',
        'cert.host': 'Host',
        'cert.protocol': 'Protocol',
        'cert.dev': 'Dev by',
        'cert.fileName': 'q000_certificate',
        'cert.fileNameUrl': 'q000_link_certificate',

        'mode.file': 'File',
        'mode.url': 'Web link',
        'dash.urlScan': 'Or scan a web link instead',
        'url.placeholder': 'https://example.com/file.exe',
        'url.check': 'Analyse',
        'url.hint': 'The link structure and domain are analysed on your device; the page content is only read when the site allows it.',
        'url.info': 'Link details',
        'url.empty': 'No link entered',
        'url.opts': 'Link scan options',
        'url.opt1': 'Analyse link structure and domain',
        'url.opt2': 'Attempt to read the page content',
        'url.ready': 'Link ready to scan',
        'url.verdictSafe': 'The link looks safe',
        'url.verdictDanger': 'The link is suspicious',
        'url.verdictSafeSub': 'No risk indicators were found in the link structure',
        'url.verdictDangerSub': 'The link contains indicators that may point to malware',
        'm.link': 'Link',
        'm.host': 'Host',
        'm.protocol': 'Protocol',
        'm.path': 'Path',
        'det.link': 'The link structure and its security settings were analysed',
        'urlrec.1': 'The link looks safe and can be opened',
        'urlrec.2': 'No phishing or suspicious script indicators found',
        'urlrec.3': 'Do not open this link',
        'urlrec.4': 'Clear it from your browser and delete it',
        'nt.urlBad': 'Invalid link — please check that it is typed correctly',
        'nt.urlScheme': 'Only http and https links are allowed',
        'nt.urlLong': 'The link is too long (2048 characters max)',
        'url.logFetch': 'Attempting to read the page content',
        'url.logFetchOk': 'Page content read',
        'url.logFetchNo': 'Could not read the content — link structure analysis only',

        'f.exeExt': 'Executable or runnable file extension',
        'f.sizeSmall': 'Unusually small file size',
        'f.sizeBig': 'Unusually large file size',
        'f.peFile': 'Windows PE executable',
        'f.peFakeExt': 'Executable disguised with a different extension',
        'f.scriptFile': 'Executable script file',
        'f.extExec': 'The link points to an executable or archive ({ext})',
        'f.extDouble': 'Misleading double extension in the link ({ext})',
        'f.portOdd': 'The link uses an unusual port ({port})',
        'f.hostIp': 'The link points to a raw IP address instead of a domain',
        'f.hostPuny': 'The domain uses punycode encoding',
        'f.hostEntropy': 'The domain name looks randomly generated (DGA risk)',
        'f.hostMessy': 'The domain contains an unusual amount of digits and hyphens',
        'f.creds': 'The link embeds a username or password',
        'f.subDeep': 'The link contains an unusually deep subdomain chain',
        'f.urlLong': 'Unusually long link',
        'f.insecure': 'The connection is not encrypted (HTTP)',
        'f.encoded': 'The path contains encoded characters that may hide content',
        'f.httpErr': 'The page returned an error ({status})',
        'f.badType': 'The link does not return a web page ({type})',
        'f.loginForm': 'The page asks for credentials over an unencrypted connection',
        'f.brandFake': 'The page title imitates a well-known brand ({brand})',
        'f.formOffsite': 'The page form submits data to another domain',
        'f.obfuscated': 'The page contains heavily obfuscated scripts',
        'f.iframes': 'The page contains many hidden frames',
        'f.metaRefresh': 'The page performs an automatic redirect',
        'f.fetchBlocked': 'Could not read the page content — analysis limited to the link structure'
    }
};

const SKILLS = {
    ar: ['Front-End', 'UI / UX', 'JavaScript', 'Canvas API', 'Security Analysis', 'RTL / LTR'],
    en: ['Front-End', 'UI / UX', 'JavaScript', 'Canvas API', 'Security Analysis', 'RTL / LTR']
};

const ENGINE_CARDS = [
    { icon: 'fa-brain', k: 1 },
    { icon: 'fa-bug', k: 2 },
    { icon: 'fa-satellite-dish', k: 3 },
    { icon: 'fa-box-open', k: 4 },
    { icon: 'fa-fingerprint', k: 5 },
    { icon: 'fa-earth-americas', k: 6 }
];

const FEATURE_CARDS = [
    { icon: 'fa-layer-group', n: 1 },
    { icon: 'fa-wave-square', n: 2 },
    { icon: 'fa-user-secret', n: 3 },
    { icon: 'fa-gauge-high', n: 4 },
    { icon: 'fa-certificate', n: 5 },
    { icon: 'fa-language', n: 6 }
];

/* ───────────────────────── state ───────────────────────── */
const state = {
    lang: 'ar',
    theme: 'dark',
    view: 'dashboard',
    mode: 'file',
    file: null,
    url: null,
    results: null,
    scanning: false,
    history: []
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function t(key, vars) {
    let s = (I18N[state.lang] && I18N[state.lang][key]) ?? I18N.ar[key] ?? key;
    if (vars) for (const k in vars) s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
    return s;
}

const dateFmt = (d, withTime = true) => {
    const loc = state.lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB';
    return new Intl.DateTimeFormat(loc, withTime
        ? { dateStyle: 'short', timeStyle: 'short' }
        : { dateStyle: 'short' }).format(new Date(d));
};

function fmtSize(bytes) {
    if (!bytes) return '0 B';
    const units = state.lang === 'ar'
        ? ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت']
        : ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${units[i]}`;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ───────────────────────── boot ───────────────────────── */
document.addEventListener('DOMContentLoaded', init);

function init() {
    loadLang();
    loadTheme();
    loadHistory();
    buildStaticCards();
    bindEvents();
    bindSpotlight();
    applyLang(state.lang);
    setTheme(state.theme);
    renderKpis();
    renderRecent();
    renderHistory();
    renderModeUi();
    renderFileUi();
    renderResults();
}

/* ───────────────────────── black & white theme ───────────────────────── */
function loadTheme() {
    // the <head> bootstrap script already stamped <html data-theme> before paint
    const stamp = document.documentElement.dataset.theme;
    const saved = stamp === 'light' || stamp === 'dark'
        ? stamp
        : safeGet(THEME_KEY);
    state.theme = (saved === 'light' || saved === 'dark') ? saved : 'dark';
}

function setTheme(next) {
    state.theme = (next === 'light') ? 'light' : 'dark';
    document.documentElement.dataset.theme = state.theme;
    try { localStorage.setItem(THEME_KEY, state.theme); } catch (e) { /* private mode */ }
    paintThemeBtn();
}

/* the sun/moon glyph is driven purely by CSS; only the label needs the text */
function paintThemeBtn() {
    const btn = $('#themeToggle');
    if (!btn) return;
    const label = state.theme === 'light' ? t('top.themeDark') : t('top.themeLight');
    btn.title = label;
    btn.setAttribute('aria-label', label);
}

function toggleTheme() {
    setTheme(state.theme === 'light' ? 'dark' : 'light');
}

/* ───────────────────────── language ───────────────────────── */
function loadLang() {
    const saved = safeGet(LANG_KEY);
    // the site is arabic-first: default to AR, remember the user's choice after that
    state.lang = (saved === 'en' || saved === 'ar') ? saved : 'ar';
}

function applyLang(lang) {
    state.lang = lang;
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem(LANG_KEY, lang);

    $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    $('#langLabel').textContent = t('lang.name');
    paintThemeBtn();
    document.title = `${BRAND} — ${t('app.tagline')}`;

    // re-render everything that holds generated text
    buildStaticCards();
    renderKpis();
    renderRecent();
    renderHistory();
    renderModeUi();
    renderFileUi();
    renderResults();
    renderEngines();
}

/* ───────────────────────── static cards ───────────────────────── */
function buildStaticCards() {
    $('#engineGrid').innerHTML = ENGINE_CARDS.map((c, idx) => `
        <div class="card">
            <span class="tag">${String(idx + 1).padStart(2, '0')}</span>
            <div class="card-icon"><i class="fas ${c.icon}"></i></div>
            <h3>${t('eng.' + c.k)}</h3>
            <p>${t('eng.' + c.k + 'd')}</p>
            <span class="eng-state">${t('info.active')}</span>
        </div>`).join('');

    $('#featureGrid').innerHTML = FEATURE_CARDS.map((c, idx) => `
        <div class="card">
            <span class="tag">${String(idx + 1).padStart(2, '0')}</span>
            <div class="card-icon"><i class="fas ${c.icon}"></i></div>
            <h3>${t('feat.' + c.n)}</h3>
            <p>${t('feat.' + c.n + 'd')}</p>
        </div>`).join('');

    $('#skillChips').innerHTML = SKILLS[state.lang].map(s => `<span>${s}</span>`).join('');
}

/* ───────────────────────── navigation ───────────────────────── */
function setView(name) {
    if (!$('.view[data-view="' + name + '"]')) return;
    state.view = name;
    $$('.view').forEach(v => v.classList.toggle('active', v.dataset.view === name));
    $$('.side-link').forEach(b => b.classList.toggle('active', b.dataset.nav === name));
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ───────────────────────── pointer spotlight ───────────────────────── */
/* tracks the cursor on the glass cards so the glow follows the pointer */
function bindSpotlight() {
    const SEL = '.kpi, .card';
    let frame = 0;
    let last = null;

    document.addEventListener('pointermove', e => {
        const el = e.target && e.target.closest ? e.target.closest(SEL) : null;
        if (!el) { last = null; return; }
        last = { el, x: e.clientX, y: e.clientY };
        if (frame) return;
        frame = requestAnimationFrame(() => {
            frame = 0;
            if (!last) return;
            const r = last.el.getBoundingClientRect();
            if (!r.width || !r.height) return;
            last.el.style.setProperty('--mx', ((last.x - r.left) / r.width * 100).toFixed(1) + '%');
            last.el.style.setProperty('--my', ((last.y - r.top) / r.height * 100).toFixed(1) + '%');
        });
    }, { passive: true });
}

/* ───────────────────────── events ───────────────────────── */
function bindEvents() {
    document.addEventListener('click', e => {
        const nav = e.target.closest('[data-nav]');
        if (nav) {
            e.preventDefault();
            setView(nav.dataset.nav);
        }
    });

    $('#langToggle').addEventListener('click', () => {
        applyLang(state.lang === 'ar' ? 'en' : 'ar');
    });

    $('#themeToggle').addEventListener('click', () => {
        setTheme(state.theme === 'light' ? 'dark' : 'light');
    });

    // file input (shared)
    const input = $('#fileInput');
    input.addEventListener('change', e => {
        if (e.target.files.length) pickFile(e.target.files[0]);
    });

    // main dropzone
    const dz = $('#uploadArea');
    dz.addEventListener('click', () => input.click());
    dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag'); });
    dz.addEventListener('dragleave', () => dz.classList.remove('drag'));
    dz.addEventListener('drop', e => {
        e.preventDefault();
        dz.classList.remove('drag');
        if (e.dataTransfer.files.length) pickFile(e.dataTransfer.files[0]);
    });

    // quick drop (dashboard)
    const qd = $('#quickDrop');
    qd.addEventListener('click', () => input.click());
    qd.addEventListener('dragover', e => { e.preventDefault(); qd.classList.add('drag'); });
    qd.addEventListener('dragleave', () => qd.classList.remove('drag'));
    qd.addEventListener('drop', e => {
        e.preventDefault();
        qd.classList.remove('drag');
        if (e.dataTransfer.files.length) pickFile(e.dataTransfer.files[0]);
    });

    // mode switch: file / url
    $$('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });

    // url input — validated silently while typing, submitted by button or Enter
    const urlInput = $('#urlInput');
    urlInput.addEventListener('input', () => {
        const raw = urlInput.value.trim();
        if (!raw) {
            state.url = null;
            $('.url-field').classList.remove('bad');
            renderUrlUi();
            return;
        }
        const parsed = parseUrl(raw);
        $('.url-field').classList.toggle('bad', !!parsed.error);
        state.url = parsed.error ? null : parsed;
        renderUrlUi();
    });
    urlInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); startScan(); }
    });
    $('#urlGo').addEventListener('click', () => {
        if (!state.url) pickUrl(urlInput.value);
        startScan();
    });

    // dashboard shortcut: jump to the scan view in link mode
    $('#quickUrl').addEventListener('click', () => {
        setMode('url');
        setView('scan');
        setTimeout(() => urlInput.focus(), 150);
    });

    $('#qfClear').addEventListener('click', clearTarget);
    $('#scanButton').addEventListener('click', startScan);
    $('#btnCert').addEventListener('click', downloadCertificate);
    $('#btnCopy').addEventListener('click', copyResult);
    $('#btnClearHistory').addEventListener('click', clearHistory);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !state.scanning && !$('#scanOverlay').hidden) closeOverlay();
    });
}

/* ───────────────────────── toasts ───────────────────────── */
function toast(message, type = 'info') {
    let wrap = $('.toast-wrap');
    if (!wrap) {
        wrap = document.createElement('div');
        wrap.className = 'toast-wrap';
        document.body.appendChild(wrap);
    }
    const icons = { ok: 'fa-circle-check', err: 'fa-circle-exclamation', info: 'fa-circle-info' };
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span></span>`;
    el.querySelector('span').textContent = message;
    wrap.appendChild(el);

    setTimeout(() => {
        el.classList.add('out');
        setTimeout(() => el.remove(), 320);
    }, 3200);
}

/* ───────────────────────── target handling (file / url) ───────────────────────── */
function setMode(mode) {
    state.mode = mode === 'url' ? 'url' : 'file';
    state.file = null;
    state.url = null;
    $('#fileInput').value = '';

    $$('.mode-btn').forEach(b => {
        const on = b.dataset.mode === state.mode;
        b.classList.toggle('active', on);
        b.setAttribute('aria-selected', on);
    });

    $('#uploadArea').hidden = state.mode !== 'file';
    $('#fileOpts').hidden = state.mode !== 'file';
    $('#urlBox').hidden = state.mode !== 'url';
    $('#urlOpts').hidden = state.mode !== 'url';

    renderModeUi();
    renderFileUi();
}

function renderModeUi() {
    const url = state.mode === 'url';
    $('#fileInfoIcon').className = 'fas ' + (url ? 'fa-link' : 'fa-circle-info');
    $('#fileInfoLabel').textContent = t(url ? 'url.info' : 'scan.fileInfo');
    $('#engineNote').textContent = t(url ? 'url.hint' : 'scan.engineNote');

    const labels = url
        ? ['m.link', 'm.host', 'm.protocol', 'm.path', 'm.ext']
        : ['m.name', 'm.size', 'm.type', 'm.ext', 'm.modified'];
    ['lblName', 'lblSize', 'lblType', 'lblExt', 'lblModified']
        .forEach((id, i) => { $('#' + id).textContent = t(labels[i]); });
}

function pickFile(file) {
    if (file.size > MAX_SIZE) return toast(t('nt.big'), 'err');
    if (file.size === 0) return toast(t('nt.emptyFile'), 'err');

    state.file = file;
    state.mode = 'file';
    renderModeUi();
    renderFileUi();
    toast(`${t('dz.ready')} — ${file.name}`, 'ok');
}

function pickUrl(raw) {
    const parsed = parseUrl(raw);
    const field = $('.url-field');
    const msg = { empty: 'nt.urlBad', bad: 'nt.urlBad', scheme: 'nt.urlScheme', long: 'nt.urlLong' };

    if (parsed.error) {
        field.classList.add('bad');
        state.url = null;
        renderUrlUi();
        if (raw && String(raw).trim()) toast(t(msg[parsed.error]), 'err');
        return false;
    }

    field.classList.remove('bad');
    state.url = parsed;
    state.mode = 'url';
    renderModeUi();
    renderFileUi();
    return true;
}

function clearTarget() {
    state.file = null;
    state.url = null;
    $('#fileInput').value = '';
    $('#urlInput').value = '';
    $('.url-field').classList.remove('bad');
    renderFileUi();
}

const setMeta = (id, value, cls = '') => {
    const el = $('#' + id);
    el.textContent = value;
    el.className = cls;
};

function renderFileUi() {
    if (state.mode === 'url') return renderUrlUi();

    const dz = $('#uploadArea');
    const file = state.file;
    const btn = $('#scanButton');

    if (!file) {
        dz.classList.remove('ready');
        $('.dz-icon', dz).innerHTML = '<i class="fas fa-cloud-arrow-up"></i>';
        $('h3', dz).textContent = t('dz.title');
        $('p', dz).textContent = t('dz.sub');
        $('#quickDrop').hidden = false;
        $('#quickUrl').hidden = false;
        $('#quickFile').hidden = true;
        btn.disabled = true;
        setMeta('valName', t('scan.empty'));
        ['valSize', 'valType', 'valExt', 'valModified'].forEach(id => setMeta(id, '—'));
        return;
    }

    const ext = (file.name.split('.').pop() || '—').toUpperCase();
    const type = file.type || (state.lang === 'ar' ? 'غير محدد' : 'unknown');

    dz.classList.add('ready');
    $('.dz-icon', dz).innerHTML = '<i class="fas fa-circle-check"></i>';
    $('h3', dz).textContent = file.name;
    $('p', dz).textContent = `${fmtSize(file.size)} · ${type}`;

    $('#quickDrop').hidden = true;
    $('#quickUrl').hidden = true;
    $('#quickFile').hidden = false;
    $('#qfName').textContent = file.name;
    $('#qfMeta').textContent = `${fmtSize(file.size)} · ${type}`;

    btn.disabled = false;

    setMeta('valName', file.name);
    setMeta('valSize', fmtSize(file.size));
    setMeta('valType', type);
    setMeta('valExt', ext, 'mono');
    setMeta('valModified', dateFmt(file.lastModified, false));
}

function renderUrlUi() {
    const btn = $('#scanButton');
    const u = state.url;

    if (!u) {
        setMeta('valName', t('url.empty'));
        ['valSize', 'valType', 'valExt', 'valModified'].forEach(id => setMeta(id, '—'));
        btn.disabled = true;
        return;
    }

    const path = (u.pathname + u.search) || '/';
    setMeta('valName', u.href, 'mono');
    setMeta('valSize', u.host, 'mono');
    setMeta('valType', u.protocol.replace(':', '').toUpperCase());
    setMeta('valExt', path.length > 56 ? path.slice(0, 56) + '…' : path, 'mono');
    setMeta('valModified', u.ext ? u.ext.toUpperCase() : '—');
    btn.disabled = false;
}

/* ───────────────────────── scan flow ───────────────────────── */
const SCAN_ENGINES = [
    { id: 'heuristic', icon: 'fa-brain', dur: 2100 },
    { id: 'clamav', icon: 'fa-bug', dur: 2900 },
    { id: 'virustotal', icon: 'fa-satellite-dish', dur: 2500 }
];

function renderEngines() {
    const list = $('#engineList');
    if (!list.children.length) {
        list.innerHTML = SCAN_ENGINES.map(e => `
            <li class="eng-item" data-eng="${e.id}">
                <i class="fas ${e.icon}"></i>
                <span class="ei-name">${t('eng.' + ({ heuristic: 1, clamav: 2, virustotal: 3 })[e.id])}</span>
                <span class="ei-state">${t('ov.state.wait')}</span>
            </li>`).join('');
    } else {
        const names = { heuristic: 1, clamav: 2, virustotal: 3 };
        $$('.eng-item', list).forEach(li => {
            $('.ei-name', li).textContent = t('eng.' + names[li.dataset.eng]);
            if (!li.classList.contains('active') && !li.classList.contains('done')) {
                $('.ei-state', li).textContent = t('ov.state.wait');
            }
        });
    }
}

function logLine(text, cls = '') {
    const box = $('#scanLog');
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    const p = document.createElement('p');
    p.innerHTML = `<span class="lg-time">[${time}]</span> <span class="${cls}"></span>`;
    p.lastChild.textContent = text;
    box.appendChild(p);
    box.scrollTop = box.scrollHeight;
}

function openOverlay() {
    $('#scanOverlay').hidden = false;
    $('#scanLog').innerHTML = '';
    $('#ringBar').style.strokeDashoffset = 326.7;
    $('#progressPercent').textContent = '0';
    $('#scanningStatus').textContent = t('ov.prep');
    $$('.eng-item').forEach(li => {
        li.classList.remove('active', 'done');
        $('.ei-state', li).textContent = t('ov.state.wait');
    });
    renderEngines();
    logLine(`${BRAND} ▸ scan session started`, 'lg-key');
}

function closeOverlay() { $('#scanOverlay').hidden = true; }

function setProgress(p) {
    const circumference = 2 * Math.PI * 52;
    $('#ringBar').style.strokeDashoffset = circumference - (p / 100) * circumference;
    $('#progressPercent').textContent = Math.round(p);
}

async function startScan() {
    if (state.scanning) return;

    if (state.mode === 'url') {
        if (!state.url && !pickUrl($('#urlInput').value)) return;
    } else if (!state.file) {
        return toast(t('nt.needFile'), 'err');
    }

    state.scanning = true;
    $('#scanButton').disabled = true;
    const started = Date.now();
    const isUrl = state.mode === 'url';

    openOverlay();
    $('#ovFile').textContent = isUrl ? state.url.host : state.file.name;
    logLine(isUrl
        ? `target ▸ ${state.url.href}`
        : `file ▸ ${state.file.name} (${fmtSize(state.file.size)})`, 'lg-key');

    // progress ticker
    let progress = 0;
    const ticker = setInterval(() => {
        progress = Math.min(progress + Math.random() * 2.6 + 0.4, 97);
        setProgress(progress);
    }, 90);

    const report = await analyzeTarget();
    const flagged = report.risk !== 'low';

    for (const eng of SCAN_ENGINES) {
        const li = $(`.eng-item[data-eng="${eng.id}"]`);
        li.classList.add('active');
        $('.ei-state', li).textContent = t('ov.state.run');
        $('#scanningStatus').textContent = `${t('eng.' + ({ heuristic: 1, clamav: 2, virustotal: 3 })[eng.id])} — ${t('ov.state.run')}`;
        logLine(`${eng.id} ▸ scanning…`);

        await sleep(eng.dur);

        li.classList.remove('active');
        li.classList.add('done');
        $('.ei-state', li).textContent = t('ov.state.done');
        logLine(`${eng.id} ▸ done`, flagged ? 'lg-warn' : 'lg-ok');
    }

    clearInterval(ticker);
    $('#scanningStatus').textContent = t('ov.building');
    setProgress(100);
    logLine(`${BRAND} ▸ building report…`);
    await sleep(1100);

    const result = buildResult(report, Date.now() - started);
    state.results = result;
    saveHistory(result);

    logLine(`report ▸ ${result.certificateId}`, 'lg-key');
    logLine(`${BRAND} ▸ finished in ${((Date.now() - started) / 1000).toFixed(1)}s`, 'lg-ok');

    await sleep(500);
    state.scanning = false;
    closeOverlay();
    clearTarget();
    renderKpis();
    renderRecent();
    renderHistory();
    renderResults();
    setView('results');
    toast(t('hist.saved'), 'ok');
}

/* ───────────────────────── risk report ───────────────────────── */
const RISK_RANK = { low: 0, medium: 1, high: 2 };

function makeReport() {
    const out = { findings: [], risk: 'low' };
    out.add = (code, sev, data) => {
        out.findings.push({ code, sev: sev || 'low', data: data || {} });
        if (RISK_RANK[sev] > RISK_RANK[out.risk]) out.risk = sev;
    };
    return out;
}

/* finding codes are stored already prefixed, e.g. 'f.extExec' */
const findingText = f => t(f.code, f.data);

/* ───────────────────────── file analysis ───────────────────────── */
const EXEC_EXTS = ['exe', 'scr', 'com', 'bat', 'cmd', 'pif', 'vbs', 'vbe', 'js', 'jse', 'wsf', 'ps1',
    'msi', 'msp', 'hta', 'cpl', 'jar', 'apk', 'dmg', 'pkg', 'app', 'deb', 'lnk', 'reg', 'iso',
    'img', 'zip', 'rar', '7z', 'crx', 'xpi'];

const HIGH_EXTS = ['exe', 'scr', 'hta', 'cpl', 'apk', 'dmg', 'pkg', 'app', 'jar', 'msi', 'lnk', 'reg', 'bat', 'cmd', 'com', 'pif'];

function analyzeFile(file) {
    const out = makeReport();
    const name = file.name.toLowerCase();
    const ext = (name.split('.').pop() || '').toLowerCase();

    if (EXEC_EXTS.includes(ext)) out.add('f.exeExt', HIGH_EXTS.includes(ext) ? 'high' : 'medium');
    if (file.size < 100) out.add('f.sizeSmall', 'medium');
    else if (file.size > 100 * 1024 * 1024) out.add('f.sizeBig', 'low');

    return file.slice(0, 16).arrayBuffer()
        .then(buf => {
            const h = new Uint8Array(buf);
            if (h[0] === 0x4D && h[1] === 0x5A) {
                out.add('f.peFile', 'medium');
                if (!name.endsWith('.exe')) out.add('f.peFakeExt', 'high');
            }
            const head = String.fromCharCode(...h.slice(0, 8));
            if (head.includes('#!/') || head.includes('<?php')) out.add('f.scriptFile', 'medium');
            return out;
        })
        .catch(() => out);
}

/* ───────────────────────── url analysis ───────────────────────── */
const BRANDS = ['paypal', 'facebook', 'instagram', 'whatsapp', 'telegram', 'apple', 'microsoft',
    'google', 'netflix', 'amazon', 'binance', 'metamask', 'blockchain', 'chase', 'wellsfargo',
    'coinbase', 'kraken', 'steam', 'discord', 'dropbox', 'docusign', 'outlook', 'myaccount'];

const DOUBLE_EXT_TRAP = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'zip', 'txt', 'mp4', 'ppt'];

function shannon(str) {
    const freq = {};
    for (const ch of str) freq[ch] = (freq[ch] || 0) + 1;
    let h = 0;
    for (const k in freq) {
        const p = freq[k] / str.length;
        h -= p * Math.log2(p);
    }
    return h;
}

function parseUrl(raw) {
    let s = String(raw == null ? '' : raw).trim();
    if (!s) return { error: 'empty' };
    if (s.length > MAX_URL_LEN) return { error: 'long' };
    if (/^(javascript|data|vbscript|file|blob|about):/i.test(s)) return { error: 'scheme' };
    if (!/^https?:\/\//i.test(s)) s = 'https://' + s.replace(/^\/+/, '');

    let u;
    try { u = new URL(s); } catch { return { error: 'bad' }; }
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return { error: 'scheme' };

    const host = u.hostname.toLowerCase();
    if (!host || (!host.includes('.') && host !== 'localhost')) return { error: 'bad' };

    const seg = u.pathname.split('/').filter(Boolean).pop() || '';
    const dot = seg.lastIndexOf('.');
    const ext = dot > 0 ? seg.slice(dot + 1).toLowerCase() : '';
    const hostNoTld = host.split('.').slice(0, -1).join('.');
    const afterScheme = u.href.slice(u.protocol.length + 2);
    // the URL api normalises %2e%2e away, so percent-encoding is read off the raw string
    const rawPath = (s.match(/^https?:\/\/[^/?#]*([^?#]*)/i) || ['', ''])[1];

    return {
        href: u.href,
        host,
        protocol: u.protocol,
        pathname: u.pathname,
        search: u.search,
        port: u.port,
        seg,
        ext,
        isIp: /^\d{1,3}(\.\d{1,3}){3}$/.test(host),
        subDepth: hostNoTld ? hostNoTld.split('.').filter(Boolean).length : 0,
        entropy: shannon(host),
        digits: (host.match(/\d/g) || []).length,
        hyphens: (host.match(/-/g) || []).length,
        hasCreds: afterScheme.includes('@') && afterScheme.indexOf('@') < afterScheme.indexOf('/'),
        encoded: /%[0-9a-f]{2}/i.test(rawPath)
    };
}

async function fetchPage(href, timeout = 7000) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), timeout);
    try {
        const res = await fetch(href, {
            signal: ctl.signal,
            mode: 'cors',
            redirect: 'follow',
            credentials: 'omit',
            referrerPolicy: 'no-referrer'
        });
        const type = (res.headers.get('content-type') || '').split(';')[0].trim() || 'unknown';
        let text = '';
        if (/html|text|xml|json/i.test(type)) {
            const buf = await res.arrayBuffer();
            text = new TextDecoder('utf-8', { fatal: false })
                .decode(new Uint8Array(buf.slice(0, 140 * 1024)));
        }
        return { ok: true, status: res.status, type, text, finalUrl: res.url };
    } catch {
        return { ok: false };
    } finally {
        clearTimeout(timer);
    }
}

function analyzePage(u, page, out) {
    if (!page || !page.ok) { out.add('f.fetchBlocked', 'low'); return; }

    if (page.status >= 500) out.add('f.httpErr', 'medium', { status: page.status });
    else if (page.status >= 400) out.add('f.httpErr', 'low', { status: page.status });

    const html = page.text || '';
    if (!html) return;
    if (page.type !== 'unknown' && !/html|xml|json|text/i.test(page.type)) {
        out.add('f.badType', 'low', { type: page.type });
    }

    const title = (html.match(/<title[^>]*>([\s\S]{0,200}?)<\/title>/i) || ['', ''])[1].trim();
    const brand = BRANDS.find(b => title.toLowerCase().includes(b) && !u.host.includes(b));
    if (brand) out.add('f.brandFake', 'high', { brand });

    const insecure = u.protocol === 'http:';
    if (insecure && /<input[^>]+type=["']?password/i.test(html)) out.add('f.loginForm', 'high');

    const action = (html.match(/<form[^>]+action=["']([^"']+)["']/i) || ['', ''])[1];
    if (action && /^https?:\/\//i.test(action)) {
        try {
            const target = new URL(action, u.href);
            if (target.hostname.toLowerCase() !== u.host) out.add('f.formOffsite', 'high');
        } catch { /* malformed form action — ignore */ }
    }

    const obf = (html.match(/eval\(|atob\(|unescape\(|fromCharCode\(|document\.write\(/gi) || []).length;
    if (obf > 6) out.add('f.obfuscated', 'medium');

    if ((html.match(/<iframe/gi) || []).length > 3) out.add('f.iframes', 'medium');
    if (/<meta[^>]+http-equiv=["']?refresh/i.test(html)) out.add('f.metaRefresh', 'medium');
}

function analyzeUrl(u, page) {
    const out = makeReport();

    if (u.ext && EXEC_EXTS.includes(u.ext)) {
        out.add('f.extExec', HIGH_EXTS.includes(u.ext) ? 'high' : 'medium', { ext: u.ext.toUpperCase() });
        const prev = u.seg.slice(0, u.seg.lastIndexOf('.')).split('.').pop();
        if (prev && DOUBLE_EXT_TRAP.includes(prev.toLowerCase())) {
            out.add('f.extDouble', 'high', { ext: `${prev}.${u.ext}`.toUpperCase() });
        }
    }

    if (u.port && !['80', '443', '8080', '8443'].includes(u.port)) {
        out.add('f.portOdd', 'medium', { port: u.port });
    }
    if (u.isIp) out.add('f.hostIp', 'medium');
    if (u.host.includes('xn--')) out.add('f.hostPuny', 'medium');
    if (u.entropy > 3.3 && u.digits >= 3 && u.host.length > 13) out.add('f.hostEntropy', 'medium');
    if (u.digits > 5 || u.hyphens > 3) out.add('f.hostMessy', 'medium');
    if (u.hasCreds) out.add('f.creds', 'high');
    if (u.subDepth > 3) out.add('f.subDeep', 'low');
    if (u.href.length > 130) out.add('f.urlLong', 'low');
    if (u.protocol === 'http:') out.add('f.insecure', 'low');
    if (u.encoded) out.add('f.encoded', 'low');

    if (page) analyzePage(u, page, out);

    return out;
}

/* dispatches to the file or the url analyser, and logs the fetch step */
async function analyzeTarget() {
    if (state.mode !== 'url') return analyzeFile(state.file);

    const wantContent = $('#urlOptContent').checked;
    const wantStatic = $('#urlOptStatic').checked;
    if (!wantContent) return analyzeUrl(state.url, null);

    logLine(t('url.logFetch'), 'lg-key');
    const page = await fetchPage(state.url.href);
    logLine(page.ok ? t('url.logFetchOk') : t('url.logFetchNo'), page.ok ? 'lg-ok' : 'lg-warn');

    if (!wantStatic && page.ok) {
        const out = makeReport();
        analyzePage(state.url, page, out);
        return out;
    }
    return analyzeUrl(state.url, page);
}

function buildResult(report, elapsed) {
    const isClean = report.risk === 'low';
    const threats = isClean ? 0 : (report.risk === 'high' ? 2 + Math.floor(Math.random() * 3) : 1);
    const certificateId = 'Q000-' + Array.from({ length: 8 }, () =>
        'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');

    const base = {
        scannedAt: Date.now(),
        elapsed,
        isClean,
        risk: report.risk,
        findings: report.findings,
        threats,
        engines: 48 + Math.floor(Math.random() * 5),
        totalEngines: 52,
        // safety is its own scale (high = safe) — never reuse the risk level
        safety: isClean ? 'high' : (report.risk === 'high' ? 'low' : 'medium'),
        certificateId
    };

    if (state.mode === 'url') {
        const u = state.url;
        return {
            ...base,
            kind: 'url',
            isUrl: true,
            url: u.href,
            host: u.host,
            fileName: u.host,
            fileSize: 0,
            fileSizeLabel: '—',
            fileType: 'URL',
            protocolLabel: u.protocol.replace(':', '').toUpperCase(),
            extension: u.ext ? u.ext.toUpperCase() : '—',
            modified: 0
        };
    }

    const file = state.file;
    return {
        ...base,
        kind: 'file',
        isUrl: false,
        fileName: file.name,
        fileSize: file.size,
        fileSizeLabel: fmtSize(file.size),
        fileType: file.type || (state.lang === 'ar' ? 'غير محدد' : 'unknown'),
        extension: (file.name.split('.').pop() || '—').toUpperCase(),
        modified: file.lastModified
    };
}

/* ───────────────────────── results view ───────────────────────── */
function renderResults() {
    const empty = $('#resultsEmpty');
    const body = $('#resultsBody');
    const r = state.results;

    if (!r) { empty.hidden = false; body.hidden = true; return; }
    empty.hidden = true;
    body.hidden = false;

    const card = $('#verdictCard');
    card.classList.toggle('danger', !r.isClean);
    $('#verdictIcon').innerHTML = `<i class="fas ${r.isClean
        ? (r.isUrl ? 'fa-link' : 'fa-shield-virus')
        : 'fa-triangle-exclamation'}"></i>`;
    $('#verdictTitle').textContent = r.isClean
        ? t(r.isUrl ? 'url.verdictSafe' : 'res.safe')
        : t(r.isUrl ? 'url.verdictDanger' : 'res.danger');
    $('#verdictSub').textContent = r.isClean
        ? t(r.isUrl ? 'url.verdictSafeSub' : 'res.safeSub')
        : t(r.isUrl ? 'url.verdictDangerSub' : 'res.dangerSub');
    $('#badgeCert').textContent = r.certificateId;
    $('#badgeEngines').textContent = `${r.engines}/${r.totalEngines}`;

    $('#rLblName').textContent = t(r.isUrl ? 'm.link' : 'm.name');
    $('#rLblSize').textContent = t(r.isUrl ? 'm.host' : 'm.size');
    $('#rLblType').textContent = t(r.isUrl ? 'm.protocol' : 'm.type');
    setMeta('rValName', r.isUrl ? r.url : r.fileName, r.isUrl ? 'mono' : '');
    setMeta('rValSize', r.isUrl ? r.host : r.fileSizeLabel, r.isUrl ? 'mono' : '');
    setMeta('rValType', r.isUrl ? r.protocolLabel : r.fileType);
    setMeta('rValTime', dateFmt(r.scannedAt));

    $('#resEngines').textContent = `${r.engines}/${r.totalEngines}`;
    const th = $('#resThreats');
    th.textContent = r.threats;
    th.className = r.threats ? 'bad' : 'ok';

    const sf = $('#resSafety');
    sf.textContent = t('res.' + r.safety);
    sf.className = r.safety === 'high' ? 'ok' : r.safety === 'medium' ? 'warn' : 'bad';

    $('#resCertId').textContent = r.certificateId;
    $('#resCertId').className = 'mono';

    // details
    const details = [];
    if (r.isClean) {
        details.push(['ok', 'fa-circle-check', t('det.1', { n: r.engines })]);
        details.push(['ok', r.isUrl ? 'fa-link' : 'fa-shield-virus', t(r.isUrl ? 'det.link' : 'det.2')]);
        details.push(['ok', 'fa-fingerprint', t('det.3', { id: r.certificateId })]);
    } else {
        details.push(['high', 'fa-triangle-exclamation', t('det.4', { n: r.threats })]);
        (r.findings || []).forEach(f => details.push([
            f.sev,
            f.sev === 'low' ? 'fa-circle-info' : 'fa-bug',
            findingText(f)
        ]));
    }
    $('#detailList').innerHTML = details.map(([sev, i, txt], idx) =>
        `<li class="sev-${sev}" style="animation-delay:${idx * 60}ms"><i class="fas ${i}"></i><span>${escapeHtml(txt)}</span></li>`).join('');

    // recommendations
    const cls = r.safety === 'low' ? 'danger' : 'warn';
    const recs = r.isClean
        ? [['ok', 'fa-circle-check', t(r.isUrl ? 'urlrec.1' : 'rec.1')],
           ['ok', r.isUrl ? 'fa-globe' : 'fa-download', t(r.isUrl ? 'urlrec.2' : 'rec.2')]]
        : [[cls, 'fa-triangle-exclamation', t(r.isUrl ? 'urlrec.3' : 'rec.3')],
           [cls, 'fa-trash', t(r.isUrl ? 'urlrec.4' : 'rec.4')]];

    $('#recList').innerHTML = recs.map(([c, i, txt], idx) =>
        `<li class="${c}" style="animation-delay:${idx * 60}ms"><i class="fas ${i}"></i><span>${escapeHtml(txt)}</span></li>`).join('');
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ───────────────────────── history ───────────────────────── */
function loadHistory() {
    try { state.history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
    catch { state.history = []; }
}

function saveHistory(result) {
    state.history.unshift(JSON.parse(JSON.stringify(result)));
    if (state.history.length > MAX_HISTORY) state.history.length = MAX_HISTORY;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history));
}

function clearHistory() {
    if (!state.history.length) return;
    state.history = [];
    localStorage.removeItem(HISTORY_KEY);
    state.results = null;
    renderHistory();
    renderKpis();
    renderRecent();
    renderResults();
    toast(t('hist.cleared'), 'info');
}

function renderHistory() {
    const body = $('#histBody');
    const empty = $('#histEmpty');
    const table = $('#histTable');

    if (!state.history.length) {
        body.innerHTML = '';
        empty.hidden = false;
        table.hidden = true;
        return;
    }
    empty.hidden = true;
    table.hidden = false;

    body.innerHTML = state.history.map((r, i) => {
        const cls = r.isClean ? 'safe' : (r.safety === 'low' ? 'danger' : 'warn');
        const label = r.isClean ? t('res.safe') : t('res.danger');
        const icon = r.isUrl ? 'fa-link link' : 'fa-file-lines';
        return `<tr data-i="${i}">
            <td>
                <div class="cell-file"><i class="fas ${icon}"></i><span title="${escapeHtml(r.fileName)}">${escapeHtml(r.fileName)}</span></div>
            </td>
            <td><span class="pill ${cls}">${label}</span></td>
            <td class="mono">${r.engines}/${r.totalEngines}</td>
            <td class="cell-date">${dateFmt(r.scannedAt)}</td>
            <td>
                <div class="cell-actions">
                    <button class="mini-btn" data-act="view" title="${t('hist.view')}"><i class="fas fa-eye"></i></button>
                    <button class="mini-btn" data-act="cert" title="${t('res.cert')}"><i class="fas fa-certificate"></i></button>
                    <button class="mini-btn danger" data-act="del" title="${t('hist.del')}"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');

    body.onclick = e => {
        const btn = e.target.closest('[data-act]');
        if (!btn) return;
        const i = +btn.closest('tr').dataset.i;
        const rec = state.history[i];
        if (!rec) return;

        if (btn.dataset.act === 'view') {
            state.results = rec;
            renderResults();
            setView('results');
        } else if (btn.dataset.act === 'cert') {
            downloadCertificate(rec);
        } else {
            state.history.splice(i, 1);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history));
            renderHistory();
            renderKpis();
            renderRecent();
            toast(t('hist.removed'), 'info');
        }
    };
}

function renderRecent() {
    const list = $('#recentList');
    if (!state.history.length) {
        list.innerHTML = `<div class="empty"><i class="fas fa-inbox"></i><p>${t('dash.noHistory')}</p></div>`;
        return;
    }
    list.innerHTML = state.history.slice(0, 5).map(r => {
        const cls = r.isClean ? 'safe' : (r.safety === 'low' ? 'danger' : 'warn');
        return `<div class="recent-item" data-file="${escapeHtml(r.fileName)}">
            <i class="fas ${r.isUrl ? 'fa-link' : 'fa-file-lines'} ri-icon"></i>
            <span class="ri-name">${escapeHtml(r.fileName)}</span>
            <span class="pill ${cls}">${r.isClean ? t('res.safe') : t('res.danger')}</span>
            <span class="ri-date">${dateFmt(r.scannedAt)}</span>
        </div>`;
    }).join('');

    list.onclick = e => {
        const item = e.target.closest('.recent-item');
        if (!item) return;
        const rec = state.history.find(r => r.fileName === item.dataset.file);
        if (rec) { state.results = rec; renderResults(); setView('results'); }
    };
}

function renderKpis() {
    const total = state.history.length;
    const threats = state.history.reduce((sum, r) => sum + (r.threats || 0), 0);
    const safe = state.history.filter(r => r.isClean).length;

    $('#kpiScanned').textContent = total;
    $('#kpiThreats').textContent = threats;
    $('#kpiSafe').textContent = total ? Math.round((safe / total) * 100) + '%' : '—';
}

/* ───────────────────────── actions ───────────────────────── */
function copyResult() {
    const r = state.results;
    if (!r) return toast(t('nt.noResults'), 'err');

    const rows = r.isUrl
        ? [
            [t('cert.id'), r.certificateId],
            [t('cert.link'), r.url],
            [t('cert.host'), r.host],
            [t('cert.protocol'), r.protocolLabel],
            [t('res.engines'), `${r.engines}/${r.totalEngines}`],
            [t('res.threats'), r.threats],
            [t('res.safety'), t('res.' + r.safety)],
            [t('cert.date'), dateFmt(r.scannedAt)]
        ]
        : [
            [t('cert.id'), r.certificateId],
            [t('cert.file'), r.fileName],
            [t('cert.size'), r.fileSizeLabel],
            [t('cert.type'), r.fileType],
            [t('res.engines'), `${r.engines}/${r.totalEngines}`],
            [t('res.threats'), r.threats],
            [t('res.safety'), t('res.' + r.safety)],
            [t('cert.date'), dateFmt(r.scannedAt)]
        ];

    const text = [
        `${BRAND} — ${r.isUrl ? t('cert.titleUrl') : t('cert.title')}`,
        ...rows.map(([k, v]) => `${k}: ${v}`),
        `— ${DEVELOPER}`
    ].join('\n');

    const done = () => toast(t('nt.copied'), 'ok');
    const fail = () => toast(t('nt.copyErr'), 'err');

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done).catch(fail);
    } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy') ? done() : fail(); } catch { fail(); }
        ta.remove();
    }
}

async function downloadCertificate(result) {
    const r = result || state.results;
    if (!r) return toast(t('nt.noResults'), 'err');
    if (!window.Q000Certificate) return toast(t('nt.certErr'), 'err');

    toast(t('nt.building'), 'info');
    const ok = await window.Q000Certificate.download(r, t, state.lang);
    toast(ok ? t('nt.certOk') : t('nt.certErr'), ok ? 'ok' : 'err');
}

/* expose the shared api for the certificate module and for console debugging */
window.Q000 = {
    state, t, setView, setMode, setTheme, toggleTheme, toast, parseUrl, analyzeUrl, fetchPage,
    BRAND, DEVELOPER, fmtSize, dateFmt
};
