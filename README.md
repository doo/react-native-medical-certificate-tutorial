


# How to integrate Scanbot Medical Certificate Scanner in your React Native app

  

## Introduction

  

This tutorial demonstrates how to setup Scanbot SDK in a [React Native](https://reactnative.dev/) App, and how to integrate and customize the Medical Certificate Scanner.
  
## Getting Started

We'll start by creating a React Native project from scratch, by using npx and react-native command line:

```bash
npx react-native init MedicalCertificateDemo
```
This will create an empty basic react native project.

## Installing Scanbot SDK

The Scanbot SDK module is available as an  [npm package](https://www.npmjs.com/package/react-native-scanbot-sdk).

We can simply add it to our project with npm install:

```bash
npm install --save react-native-scanbot-sdk
```
  
Perfect! Now, before we can use Scanbot SDK, we need to tweak Android and iOS configurations.

## Android Setup
**Scanbot SDK Maven Repositories**

This React Native module depends on the native Scanbot SDK for Android. The Scanbot SDK for Android is distributed through our private Maven repositories. Please add these repositories in your  `android/build.gradle`  file in the section  `allprojects > repositories`:

```properties
allprojects {
    repositories {
        mavenLocal()
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url "$rootDir/../node_modules/react-native/android"
        }

        google()
        jcenter()

        // Scanbot SDK Maven repositories:
        maven { url 'https://nexus.scanbot.io/nexus/content/repositories/releases/' }
        maven { url 'https://nexus.scanbot.io/nexus/content/repositories/snapshots/' }
    }
}
```

**Add SDK Project Reference**

Scanbot SDK reference also needs to be included in your  `settings.gradle`, as such:

```properties
include ':react-native-scanbot-sdk'
project(':react-native-scanbot-sdk').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-scanbot-sdk/android/app')
```

**Enable Multidex**

Make sure you have enabled  [multidex](https://developer.android.com/studio/build/multidex)  by setting  `multiDexEnabled`  to  `true`  in your app module-level  `build.gradle`  file:

```properties
android {
  ...
  defaultConfig {
    ...
    multiDexEnabled true
  }
}
```

Also add the following config in your  `build.gradle`  to avoid conflicts with the lib filename  `libc++_shared.so`, which is used by React Native as well as by many other 3rd-party modules:

```properties
android {
  ...
  packagingOptions {
      pickFirst '**/libc++_shared.so'
  }
}
```

**Tuning the Android Manifest**

Since your application will work with high-resolution images, it is strongly recommended to add the property  `android:largeHeap="true"`  in the  `<application>`  element of your  `android/app/src/main/AndroidManifest.xml`  file, especially for Android <= 7.x. Processing hi-res images is a memory intensive task and this property will ensure your app has enough heap allocated to avoid  `OutOfMemoryError`  exceptions.

```xml
<application ... android:largeHeap="true">
  ...
</application>
```

**OCR Support**

The Medical Scanner requires OCR functionalities in order to work. As explained in our official documentation, you have to manually add the OCR data to your project, under ```android/app/src/main/assets/ocr_blobs```

You can download the OCR files from tesseract official sources or directly from our example project:
https://github.com/doo/scanbot-sdk-example-react-native/tree/master/android/app/src/main

**Additional Steps**

Before trying to run the app on Android, open it at least once on Android Studio, to let gradle do its magic.

If you get build errors it may be due to your JDK & Gradle versions; try adding this line to your `gradle.properties` file:

```properties
org.gradle.jvmargs=-Xmx1536M --add-exports=java.base/sun.nio.ch=ALL-UNNAMED --add-opens=java.base/java.lang=ALL-UNNAMED --add-opens=java.base/java.lang.reflect=ALL-UNNAMED --add-opens=java.base/java.io=ALL-UNNAMED --add-exports=jdk.unsupported/sun.misc=ALL-UNNAMED
```
## iOS Setup

As of `v0.62` of `react-native` and `v4.1.0`, the iOS configuration has become much easier because of autolinking support.

However, you have to do an extra step if you want to include special SDK modules, like:

-   `OCR`: for the default OCR data bundle  `ScanbotSDKOCRData.bundle`  containing default language files for DE and EN
-   `MRZ`: for the MRZ Scanner data bundle  `ScanbotSDKMRZData.bundle`
-   `MLDETECT`: For ML-based Document detection
-   `ALL`: for all available bundles (default, currently OCR + MRZ)

**1. Disable auto-linking**
Add a file called `react-native.config.js` in your project folder, with the following content:

```javascript
module.exports  = {
    dependencies: {
        'react-native-scanbot-sdk': {
            platforms: {ios: null},
         },
    },
};
```
**2. Manually add the RNScanbotSDK pod**

```ruby
use_react_native!(
	:path => config[:reactNativePath],
	# to enable hermes on iOS, change `false` to `true` and then install pods
	:hermes_enabled => false
)

# ADD THIS LINE: 
pod 'RNScanbotSDK/ALL', :path => '../node_modules/react-native-scanbot-sdk'
```
This will tell cocoapods to install all the Scanbot SDK packages, including ML detection and OCR, needed for the Medical Scanner.

**Install the pods**

Finally, we can install the pods:

```bash
$ cd ios/
$ pod install --repo-update
```

Now we can open `ios/MedicalCertificateDemo.xcworkspace` on Xcode, and setup our Signing Options under Signing & Configurations.

## Permissions

In order to operate correctly an application that utilizes ScanbotSDK module must have all required permissions to your App. Here is a listing of those permissions:

**Android**  (must be added in your  `android/app/src/main/AndroidManifest.xml`  file)

-   `<uses-permission android:name="android.permission.CAMERA" />`  - This permission is used for the camera views.
-   `<uses-feature android:name="android.hardware.camera" />`  - Camera hardware features.

**iOS**  (must be added in your  `Info.plist`  file)

-   `NSCameraUsageDescription`  -  _"Privacy - Camera Usage Description"_. Describe why your app wants to access the device's camera.

### Running the project

You can run the project by connecting a device via USB and using these commands:

```bash
react-native run-android
react-native run-ios --device
```

You can also open ```ios/MedicalCertificateDemo.xcworkspace``` and build/run the project from Xcode.

## IMPORTANT: Compatibility with latest Xcode and React releases

Many React Native users have reported problems with the new Xcode build system and the most recent React / React Native versions for what concerns the bundling of Pods dependencies in the iOS project.

If you find yourself unable to build the iOS app, you might have to apply the following changes.


**Use patch-package to apply a workaround**

You can do so by:
```bash
npm i patch-package
```

Add this to your package.json:

```json
"scripts": {
    "postinstall": "patch-package"
},
```

Finally, create a folder named `patches` in your project directory, where you will add a file called `react-native-scanbot-sdk+4.11.3.patch` (if you didn't install version react-native-scanbot-sdk@4.11.3, replace the file name to match your installed version). 

You can download the file here: https://drive.google.com/file/d/1j6XpjSvdKviALOgzkaa-p-NewIdunm4I/view?usp=sharing

## Getting Started with Scanbot SDK!

For this example we migrated the starter project to typescript, by simply changing the extensions of our files from ```.jsx``` to ```.tsx``` ; also, we installed typescript for autocompletion and realtime code correction:

```bash
npm install --save-dev typescript
```

Furthermore, we used the following packages, to help us build a simple UI:

```json
"@react-navigation/native": "^6.0.8",
"@react-navigation/stack": "^6.1.1",
"react-native-safe-area-context": "1.0.0",
"react-native-gesture-handler": "1.10.3",
```

We added them to `package.json` , ran `npm install`, and then `cd ios; pod install --repo-update` to let autolinking do its magic.

Let's take a look at our `App.tsx` file.

**App.tsx**

First of all, we imported ScanbotSDK and InitializationOptions:

```typescript
import ScanbotSDK, {InitializationOptions} from 'react-native-scanbot-sdk';
```

And we initialized the SDK in the constructor, like this:

```typescript
  constructor(props) {
    super(props);
    this.initScanbotSdk();
  }

  async initScanbotSdk() {
    const options: InitializationOptions = {
      licenseKey: '', // An empty license will start a 60 seconds trial; you can request an actual trial license on our website
      loggingEnabled: true, // Consider switching logging OFF in production builds for security and performance reasons!
    };
    try {
      const result = await ScanbotSDK.initializeSDK(options);
      console.log(result);
    } catch (e) {
      console.error('Error initializing Scanbot SDK:', e.message);
    }
  }
```

Using Typescript is pretty handy, since you'll be able to see which properties you can set while initializing the SDK, with extensive code documentation. You can also read more on our official documentation.

This file also contains a basic UI navigation structure, which we won't explain in detail since it's out of the scope of this tutorial. 

The important part is that we immediately redirect the user to the HomeScreen, where the Medical Certificate Scanner is integrated.

**HomeScreen.tsx**

In the HomeScreen you will find this method:

```typescript
    async startMedicalCertificateScanner() {

        let config: MedicalCertificateScannerConfiguration = {
          topBarBackgroundColor: '#c8193c',
          footerTitle: 'Scan your Medical Certificate',
          footerSubtitle: 'ScanbotSDK Demo',
          // aspectRatios: [
          //   MedicalCertificateStandardSize.A5_PORTRAIT,
          //   MedicalCertificateStandardSize.A6_LANDSCAPE,
          // ],
        };

        const result: MedicalCertificateScannerResult = await ScanbotSDK.UI.startMedicalCertificateScanner(config);
    
        if (result.status !== 'OK') {
          return;
        }

        console.log(JSON.stringify(result, undefined, 4));

        MedicalCertificateResultsScreen.result = result.data;
        this.props.navigation.push(MedicalCertificateResultsScreen.PAGE_NAME);
    }
```

Let's break it down:


**HomeScreen.tsx - Configuration**
```typescript
let config: MedicalCertificateScannerConfiguration = {
  topBarBackgroundColor: Colors.SCANBOT_RED,
  footerTitle: 'Scan your Medical Certificate',
  footerSubtitle: 'ScanbotSDK Demo',
  // aspectRatios: [
  //   MedicalCertificateStandardSize.A5_PORTRAIT,
  //   MedicalCertificateStandardSize.A6_LANDSCAPE,
  // ],
};
```

Through ```MedicalCertificateScannerConfiguration```,  you have access to many parameters that you can use to customize the style, texts and behavior of the Medical Scanner. 

In this example we have tweaked some UI parameters for demo purposes, and left a comment to show how it is possible to tweak the required aspect ratios in order to
match your target medical certificates (in case the default values are not appropriate for your specific use-case).

Please, read more on how you can configure the medical certificate scanner on our [documentation](https://docs.scanbot.io/document-scanner-sdk/react-native/features/#medical-certificate-scanner)

**HomeScreen.tsx - Opening the Medical Certificate Scanner**

To open the Medical Certificate Scanner, we only need one line of code:

```typescript
var result = await ScanbotSDK.UI.startMedicalCertificateScanner(config);
```


We await the result, since the operation will be asynchronous and will only terminate once the user has scanned the medical certificate or canceled the operation.


Again, the advantage of using TypeScript is being able to access all these parameters, with the relative code documentation, without having to consult the online guide.

The result will contain a status (OK or CANCELED), so we can check if the scan was successful or not:

```typescript
if (result.status !== 'OK') {
  return;
}
```

Then we can show the results on a dedicated UI:

```typescript
MedicalCertificateResultsScreen.result = result.data;
this.props.navigation.push(MedicalCertificateResultsScreen.PAGE_NAME);
```

Let's take a look at the result structure:

**Result Structure**

```typescript
export interface MedicalCertificateScannerResultData {
  /**
   * The Medical Certificate Form Type
   */
  formType: MedicalCertificateFormType;
  /**
   * The captured page
   */
  capturedPage?: Page;
  /**
   * The extracted patient data
   */
  patientData: {
    /** 
     * The health insurance provider. 
     */
    insuranceProvider?: string;
    /** 
     * The patients first name. 
     */
    firstName?: string;
    /** 
     * The patients last name. 
     */
    lastName?: string;
    /** 
     * The patients address 1. 
     */
    address1?: string;
    /** 
     * The patients address 2. 
     */
    address2?: string;
    /** 
     * The patients diagnose. 
     */
    diagnose?: string;
    /** 
     * The patients health insurance number. 
     */
    healthInsuranceNumber?: string;
    /** 
     * The patients person number. 
     */
    insuredPersonNumber?: string;
    /** 
     * The patients status. 
     */
    status?: string;
    /** 
     * The place of operation number. 
     */
    placeOfOperationNumber?: string;
    /** 
     * The doctors number. 
     */
    doctorNumber?: string;
    /** 
     * An undefined field, that was recognized still. 
     */
    unknown?: string;
  };
  /**
   * The extracted dates data
   */
  dates: {
    /** 
     * The date since when the employee is incapable of work. 
     */
    incapableOfWorkSince?: MedicalCertificateDateField;    
    /** 
     * The date until when the employee is incapable of work. 
     */
    incapableOfWorkUntil?: MedicalCertificateDateField;    
    /** 
     * The date of the day of diagnosis. 
     */
    diagnosedOn?: MedicalCertificateDateField;    
    /** 
     * The date since when the child needs care. 
     */
    childNeedsCareFrom?: MedicalCertificateDateField;    
    /** 
     * The date until the childs needs care. 
     */
    childNeedsCareUntil?: MedicalCertificateDateField;    
    /** 
     * Patient birth date. 
     */
    birthDate?: MedicalCertificateDateField;    
    /** 
     * Document date. 
    */
    documentDate?: MedicalCertificateDateField;    
    /** 
     * An unclassified date, which was recognized still 
     */
    unknown?: MedicalCertificateDateField;    
  };
  /**
   * The extracted checkboxes data.
   * It contains information about the medical form checkboxes type
   * and whether they are checked or not.
   */
  checkboxes: {
    /** 
     * The checkbox states if the certificate is an initial certificate. 
     */
    initialCertificate?: MedicalCertificateCheckboxField;
    /** 
     * The checkbox states if the certificate is a renewed certificate. 
     */
    renewedCertificate?: MedicalCertificateCheckboxField;
    /** 
     * The checkbox states if the certificate is about a work accident. 
     */
    workAccident?: MedicalCertificateCheckboxField;
    /** 
     * The checkbox states if the certificate is assigned to an accident insurance doctor. 
     */
    assignedToAccidentInsuranceDoctor?: MedicalCertificateCheckboxField;
    /** 
     * The checkbox states if the certificate is about an accident. 
     */
    accident?: MedicalCertificateCheckboxField;
    /** 
     * The checkbox states if ill child requires care. 
     */
    requiresCare?: MedicalCertificateCheckboxField;
    /** 
     * The checkbox states if the insurance company has to pay for treatment. 
     */
    insuredPayCase?: MedicalCertificateCheckboxField;
    /** 
     * The checkbox states if the certificate is final. 
     */
    finalCertificate?: MedicalCertificateCheckboxField;
    /** 
     * The checkbox could not be classified, but it was recognized still
     */
    unknown?: MedicalCertificateCheckboxField;
  };
};
```

**Results Page**
Again, analyzing the React UI for showing the results is out of the scope of this tutorial, just know that we're simply accessing those result parameters and showing them in a list divided by sections. 

```
sections={[
  {title: 'Patient Data', data: getPatientData(certificate)},
  {title: 'Dates', data: getDatesData(certificate)},
  {title: 'Checkboxes', data: getCheckboxesData(certificate)},
]}
```
We're also using our ```PreviewImage``` utility class to show the snapped picture on top of the list.


