# Firestore Backup Strategy (TRUST Platform)

لحماية بياناتك الثمينة (الإثباتات، التقييمات، معلومات الدفع) من الحذف غير المقصود أو الأخطاء البشرية، يجب إعداد نظام نسخ احتياطي آلي (Automated Backup). لا يمكن الاعتماد على Firebase فقط بدون تصدير البيانات لتخزين خارجي.

هذه هي الاستراتيجية الاحترافية والآمنة (لا تتطلب برمجة إضافية في الموقع، بل تعتمد على بنية Google Cloud).

## الخطوة 1: تجهيز مستودع التخزين (Cloud Storage)
1. ادخل إلى [Google Cloud Console](https://console.cloud.google.com).
2. تأكد من اختيار مشروع فايربيس الخاص بك (trust-platform).
3. ابحث عن **Cloud Storage** وقم بإنشاء مستودع جديد (Bucket) مخصص للنسخ الاحتياطية.
   - سمّه مثلاً: `trust-platform-backups`
   - اختر المنطقة (Region) مطابقة لمنطقة الـ Firestore لتجنب تكاليف النقل.

## الخطوة 2: إنشاء وظيفة السيرفر (Cloud Function) للتصدير
سنقوم بإنشاء أمر أوتوماتيكي يقوم بنسخ الـ Firestore ووضعه في الـ Bucket.

1. افتح **Cloud Functions** في Google Cloud.
2. أنشئ دالة جديدة (Create Function).
3. اجعل الـ Trigger نوعه **Cloud Pub/Sub**.
4. أنشئ Topic جديد سمه `daily-backup`.
5. في كود الدالة (Node.js 20)، استخدم هذا الكود:

```javascript
const firestore = require('@google-cloud/firestore');
const client = new firestore.v1.FirestoreAdminClient();

exports.backupFirestore = async (event, context) => {
  const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
  const databaseName = client.databasePath(projectId, '(default)');
  // اسم الـ bucket الذي قمنا بإنشائه في الخطوة 1
  const bucket = 'gs://trust-platform-backups';

  try {
    const [operation] = await client.exportDocuments({
      name: databaseName,
      outputUriPrefix: bucket,
      // يمكنك تحديد الكولكشنز التي تريد نسخها فقط أو تركها فارغة لنسخ كل شيء
      collectionIds: ['reviews', 'proofs', 'payments']
    });

    console.log(`Backup started successfully. Operation Name: ${operation.name}`);
  } catch (err) {
    console.error('Error starting backup:', err);
    throw err;
  }
};
```

## الخطوة 3: الجدولة اليومية (Cloud Scheduler)
لكي يعمل الكود يومياً بشكل آلي، سنحتاج لجدولته:

1. اذهب إلى **Cloud Scheduler** في Google Cloud.
2. أنشئ وظيفة جديدة (Create Job).
3. التردد (Frequency): `0 2 * * *` (هذا يعني الساعة 2 صباحاً كل يوم).
4. الـ Target: `Pub/Sub`.
5. اختر الـ Topic الذي أنشأناه `daily-backup`.
6. الحشوة (Payload): اكتب `backup`.

## استرجاع البيانات (Restoration)
في حال وقوع كارثة أو حذف بالخطأ، يمكنك استرجاع أي نسخة احتياطية بسهولة عبر أداة `gcloud`:

```bash
gcloud firestore import gs://trust-platform-backups/2026-05-10T02:00:00_5682/
```

هذه الاستراتيجية (Enterprise-grade) ومستقرة تماماً ولا تستهلك موارد السيرفر الخاص بـ Next.js نهائياً.
