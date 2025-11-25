# 📱 دليل بناء APK لتطبيق Net Customers

**[العربية](#عربي) | [English](#english)**

---

## عربي

# 🚀 خطوات بناء تطبيق Net Customers

## 1️⃣ المتطلبات الأساسية

قبل بدء البناء، تأكد من توفر:

```
✓ حساب Expo (إنشاء مجاني على https://expo.dev)
✓ Expo Token (من https://expo.dev/settings/auth-tokens)
✓ Node.js مثبت على جهازك
✓ مشروع مستنسخ من GitHub
```

### إنشاء Expo Token:
1. اذهب إلى https://expo.dev/settings/auth-tokens
2. اضغط "Create Token"
3. اختر اسم للتوكن (مثلاً: "NetCustomers Build")
4. انسخ التوكن واحفظه في مكان آمن

---

## 2️⃣ إعداد المشروع على جهازك

### أ) استنساخ المشروع من GitHub:
```bash
git clone https://github.com/SAMZalaf/NetCustomers.git
cd NetCustomers
```

### ب) تثبيت المكتبات:
```bash
npm install
```

### ج) تثبيت Expo CLI (إذا لم تكن مثبتة):
```bash
npm install -g eas-cli
```

---

## 3️⃣ التحقق من ملف الإعدادات (app.json)

**تأكد من أن ملف app.json يحتوي على:**

```json
{
  "expo": {
    "name": "Net Customers",
    "slug": "internet-customers",
    "version": "1.0.0",
    "extra": {
      "eas": {
        "projectId": "6bfb9b75-8296-4820-90d1-b3b435ff966b"
      }
    },
    "owner": "mohamadzalaf"
  }
}
```

**النقاط الحرجة:**
- ✅ `slug` يجب أن يكون: `internet-customers`
- ✅ `projectId` يجب أن يكون: `6bfb9b75-8296-4820-90d1-b3b435ff966b`
- ✅ `owner` يجب أن يكون: `mohamadzalaf`

---

## 4️⃣ بناء APK عبر Expo Build Service

هناك طريقتان:

### الطريقة الأولى: عبر سطر الأوامر (الأسهل والأسرع)

```bash
# 1️⃣ أدخل إلى مجلد المشروع
cd NetCustomers

# 2️⃣ قم بتعيين توكن Expo
export EXPO_TOKEN="YOUR_EXPO_TOKEN_HERE"

# ⚠️ استبدل YOUR_EXPO_TOKEN_HERE بتوكنك الفعلي الذي حصلت عليه أعلاه

# 3️⃣ ابدأ عملية البناء
eas build --platform android --wait
```

**شرح الأوامر:**
- `eas build` = أمر بدء البناء
- `--platform android` = بناء لنظام Android (APK)
- `--wait` = انتظر حتى ينتهي البناء (قد يستغرق 10-20 دقيقة)

### الطريقة الثانية: عبر واجهة الويب

1. اذهب إلى https://expo.dev/dashboard
2. ادخل إلى مشروع "internet-customers"
3. اضغط "Create build"
4. اختر "Android"
5. اختر "Internal build" أو "Production build"
6. ابدأ البناء

---

## 5️⃣ ماذا يحدث أثناء البناء؟

عندما تشغل الأمر `eas build`:

```
✓ سيتم رفع المشروع إلى Expo servers
✓ سيتم تجميع الكود
✓ سيتم بناء ملف APK الفعلي
✓ سيتم حفظ APK على خوادم Expo
⏱️ الوقت المتوقع: 10-20 دقيقة
```

### مراقبة التقدم:
```bash
# إذا لم تستخدم --wait، يمكنك التحقق من الحالة:
export EXPO_TOKEN="YOUR_EXPO_TOKEN_HERE"
eas build:list --platform android

# سيظهر شيء مثل:
# ID                          Status        Platform
# 3051fd8a-cf0d-4d74-834a...  in progress   Android
# ca13b41c-6dd9-4881-afb2...  finished      Android
```

---

## 6️⃣ تحميل APK

### بعد انتهاء البناء:

1. **عبر الطرفية (CLI):**
```bash
eas build:list --platform android --limit 1
# ستجد رابط التحميل تحت: "Application Archive URL"
```

2. **عبر موقع Expo:**
   - اذهب إلى https://expo.dev/dashboard
   - اضغط على المشروع "internet-customers"
   - ابحث عن أحدث بناء
   - اضغط تحميل (Download)

3. **الرابط المباشر:**
```
https://expo.dev/accounts/mohamadzalaf/projects/internet-customers/builds
```

---

## 7️⃣ تثبيت APK على جهازك

### أ) على هاتف Android (عبر USB):
```bash
# تأكد من توصيل الهاتف عبر USB
adb install -r path/to/app.apk
```

### ب) على محاكي Android:
```bash
emulator -avd your_emulator_name &
adb install -r path/to/app.apk
```

### ج) يدويًا على الهاتف:
1. حمّل ملف APK على الهاتف
2. افتح المجلد حيث حفظت APK
3. اضغط على الملف واختر "تثبيت"

---

## 8️⃣ حل المشاكل الشائعة

### ❌ خطأ: "Slug does not match"
```
الحل: تأكد من أن app.json يحتوي على:
{
  "expo": {
    "slug": "internet-customers",
    "extra": {
      "eas": {
        "projectId": "6bfb9b75-8296-4820-90d1-b3b435ff966b"
      }
    }
  }
}
```

### ❌ خطأ: "Not logged in"
```bash
# الحل: قم بتعيين توكن Expo:
export EXPO_TOKEN="YOUR_EXPO_TOKEN_HERE"

# أو استخدم:
eas login
```

### ❌ خطأ: ".git/index.lock"
```bash
# الحل: احذف الملف المقفول:
rm -f .git/index.lock
```

### ❌ البناء بطيء جداً؟
```bash
# الحل: تخطَّ خطوة fingerprint:
export EXPO_TOKEN="YOUR_EXPO_TOKEN_HERE"
export EAS_SKIP_AUTO_FINGERPRINT=1
eas build --platform android --wait
```

---

## 9️⃣ معلومات المشروع

| الخاصية | القيمة |
|-------|--------|
| **اسم التطبيق** | Net Customers |
| **Slug** | internet-customers |
| **Project ID** | 6bfb9b75-8296-4820-90d1-b3b435ff966b |
| **Owner** | mohamadzalaf |
| **Package** | com.internetcustomers.app |
| **Version** | 1.0.0 |
| **SDK** | 54.0.0 |

---

## 🔟 ملخص سريع للخطوات

```bash
# 1. استنساخ المشروع
git clone https://github.com/SAMZalaf/NetCustomers.git
cd NetCustomers

# 2. تثبيت المكتبات
npm install

# 3. تعيين توكن Expo
export EXPO_TOKEN="YOUR_EXPO_TOKEN_HERE"

# 4. بدء البناء
eas build --platform android --wait

# 5. انتظر وابحث عن رابط التحميل!
```

---

---

## English

# 🚀 Building Net Customers APK

## 1️⃣ Prerequisites

Before starting the build, ensure you have:

```
✓ Expo Account (Free signup at https://expo.dev)
✓ Expo Token (from https://expo.dev/settings/auth-tokens)
✓ Node.js installed
✓ Project cloned from GitHub
```

### Create Expo Token:
1. Go to https://expo.dev/settings/auth-tokens
2. Click "Create Token"
3. Choose a name (e.g., "NetCustomers Build")
4. Copy and save the token securely

---

## 2️⃣ Setup Project on Your Machine

### A) Clone from GitHub:
```bash
git clone https://github.com/SAMZalaf/NetCustomers.git
cd NetCustomers
```

### B) Install Dependencies:
```bash
npm install
```

### C) Install EAS CLI (if not installed):
```bash
npm install -g eas-cli
```

---

## 3️⃣ Verify app.json Configuration

**Make sure app.json contains:**

```json
{
  "expo": {
    "name": "Net Customers",
    "slug": "internet-customers",
    "version": "1.0.0",
    "extra": {
      "eas": {
        "projectId": "6bfb9b75-8296-4820-90d1-b3b435ff966b"
      }
    },
    "owner": "mohamadzalaf"
  }
}
```

**Critical Points:**
- ✅ `slug` must be: `internet-customers`
- ✅ `projectId` must be: `6bfb9b75-8296-4820-90d1-b3b435ff966b`
- ✅ `owner` must be: `mohamadzalaf`

---

## 4️⃣ Build APK via Expo Build Service

Two methods available:

### Method 1: Command Line (Easiest)

```bash
# 1️⃣ Navigate to project folder
cd NetCustomers

# 2️⃣ Set Expo Token
export EXPO_TOKEN="YOUR_EXPO_TOKEN_HERE"

# ⚠️ Replace YOUR_EXPO_TOKEN_HERE with your actual token

# 3️⃣ Start build process
eas build --platform android --wait
```

**Command Explanation:**
- `eas build` = Start build process
- `--platform android` = Build for Android (APK)
- `--wait` = Wait until build completes (10-20 minutes)

### Method 2: Web Interface

1. Go to https://expo.dev/dashboard
2. Open "internet-customers" project
3. Click "Create build"
4. Select "Android"
5. Choose "Internal build" or "Production build"
6. Start build

---

## 5️⃣ What Happens During Build?

When you run `eas build`:

```
✓ Project uploaded to Expo servers
✓ Code compilation
✓ APK build generation
✓ APK stored on Expo servers
⏱️ Expected time: 10-20 minutes
```

### Monitor Progress:
```bash
# If you didn't use --wait, check status:
export EXPO_TOKEN="YOUR_EXPO_TOKEN_HERE"
eas build:list --platform android

# Output example:
# ID                          Status        Platform
# 3051fd8a-cf0d-4d74-834a...  in progress   Android
# ca13b41c-6dd9-4881-afb2...  finished      Android
```

---

## 6️⃣ Download APK

### After Build Completes:

1. **Via Terminal:**
```bash
eas build:list --platform android --limit 1
# Find download link under: "Application Archive URL"
```

2. **Via Expo Website:**
   - Go to https://expo.dev/dashboard
   - Click "internet-customers" project
   - Find latest build
   - Click Download

3. **Direct Link:**
```
https://expo.dev/accounts/mohamadzalaf/projects/internet-customers/builds
```

---

## 7️⃣ Install APK on Device

### A) On Android Phone (via USB):
```bash
# Ensure phone is connected via USB
adb install -r path/to/app.apk
```

### B) On Android Emulator:
```bash
emulator -avd your_emulator_name &
adb install -r path/to/app.apk
```

### C) Manual Installation on Phone:
1. Download APK to phone
2. Open file manager where APK is saved
3. Tap APK file and select "Install"

---

## 8️⃣ Troubleshooting

### ❌ Error: "Slug does not match"
```
Solution: Verify app.json has:
{
  "expo": {
    "slug": "internet-customers",
    "extra": {
      "eas": {
        "projectId": "6bfb9b75-8296-4820-90d1-b3b435ff966b"
      }
    }
  }
}
```

### ❌ Error: "Not logged in"
```bash
# Solution: Set Expo Token:
export EXPO_TOKEN="YOUR_EXPO_TOKEN_HERE"

# Or use:
eas login
```

### ❌ Error: ".git/index.lock"
```bash
# Solution: Remove lock file:
rm -f .git/index.lock
```

### ❌ Build too slow?
```bash
# Solution: Skip fingerprint step:
export EXPO_TOKEN="YOUR_EXPO_TOKEN_HERE"
export EAS_SKIP_AUTO_FINGERPRINT=1
eas build --platform android --wait
```

---

## 9️⃣ Project Information

| Property | Value |
|----------|-------|
| **App Name** | Net Customers |
| **Slug** | internet-customers |
| **Project ID** | 6bfb9b75-8296-4820-90d1-b3b435ff966b |
| **Owner** | mohamadzalaf |
| **Package** | com.internetcustomers.app |
| **Version** | 1.0.0 |
| **SDK** | 54.0.0 |

---

## 🔟 Quick Summary

```bash
# 1. Clone project
git clone https://github.com/SAMZalaf/NetCustomers.git
cd NetCustomers

# 2. Install dependencies
npm install

# 3. Set Expo Token
export EXPO_TOKEN="YOUR_EXPO_TOKEN_HERE"

# 4. Start build
eas build --platform android --wait

# 5. Wait and download APK!
```

---

## 📚 Useful Resources

- **Expo Documentation:** https://docs.expo.dev
- **EAS Build Docs:** https://docs.expo.dev/build/introduction
- **React Native Docs:** https://reactnative.dev
- **Android SDK Setup:** https://developer.android.com/studio

---

**Last Updated:** November 25, 2025
**Status:** Ready for Production Build
