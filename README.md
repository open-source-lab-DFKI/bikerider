# BikeRider App  <!-- omit in toc -->

The directory structure of this project is taken from the example project of [mmir-starter-kit](https://github.com/mmig/mmir-starter-kit). This Project is based on the cross-platform framework Ionic and MMIR.

- [Getting Started](#getting-started)
  - [Source Code & Project Structure](#source-code--project-structure)
  - [Install the Prerequisites](#install-the-prerequisites)
- [Recommended Configuration](#recommended-configuration)
  - [Disable Auto-Save](#disable-auto-save)
- [Transpiling & Running the App](#transpiling--running-the-app)
  - [Browser](#browser)
  - [Android Device](#android-device)
- [Troubleshooting](#troubleshooting)
  - [Hook for before_prepare cannot be started](#hook-for-beforeprepare-cannot-be-started)
  - [Gradle cannot be found](#gradle-cannot-be-found)
    - [A. Install Gradle](#a-install-gradle)
    - [B. Fix Cordova's Detection Mechanism](#b-fix-cordovas-detection-mechanism)
    - [C. Install Gradle Manually](#c-install-gradle-manually)
    - [D. Install Android Studio](#d-install-android-studio)
  - [Source path does not exist](#source-path-does-not-exist)


## Getting Started

This section describes the setup for the local development environment. 

### Source Code & Project Structure

Check out the source code from Gitlab and switch to the correct branch:
```
git clone ssh://git@gitlab-cos.b.dfki.de:10022/smart-mobility/opensourcelabmobilityapp.git

git checkout ionic-gui
``` 

Take a look on the page [*Project Structure*](https://ionicframework.com/docs/v3/intro/tutorial/project-structure/) of the Ionic docs to get an idea on how Ionic apps usually look like and the development conventions. Moreover, it explains the roles of the individual components.

> **Important**: Compared to Cordova projects, the source files are located in `/src` and not in `/www`. The `/www` directory contains generated files which will be overwritten when building the project.
  
So far, the only added view is Home (see sidebar in burger menu). It contains the Leaflet-based map and shows the user's current position. It contains forms to enter the start and destination, and makes a REST API call using GET to get the position of all users. The code of the REST API call is located in the file `/rest-api/rest-api.ts`. To add a new view to the project, you can use `ionic generate page`.

### Install the Prerequisites

The following list shows software prerequisites for development, and for running the app. Following, the software that needs to be installed manually before installing the remaining packages automatically:

- **Android SDK**
   - The easiest way is to use the Android Studio (GUI) which can be found on [Android Developer](https://developer.android.com/studio/index.html#downloads), and then to install the `Android SDK Build Tools version >= 26.x`
    - Alternatively, you can use the sdk-tools (see section [*Command line tools only*](https://developer.android.com/studio/index.html#downloads)) and install the build tools using the `sdkmanager`:
      - See the available versions of the build-tools: `sdkmanager --list | grep build`
      - Install a specific version: `sdkmanager "build-tools;29.0.2"`
      - See the [Android user guide](https://developer.android.com/studio/command-line/sdkmanager#install_packages) for more details
  
- **Gradle** – tested with v5.6.1
  - This is only needed if you did not install Android Studio, as Gradle is part of Android Studio 
  - Gradle is available on its official [*Releases*](https://gradle.org/releases/) page

- **Java JDK 8** – tested with v1.8.0_191
  - The latest Java version will not work, therefore it is important to stick to Java 8.
  - Java8 installer is available at [oracle.com](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
  - Make sure that `java -version` prints a version number starting with `1.8.x`.

- **Apache ANT** – tested with v1.10.5 
  - Windows: ANT just needs to be extracted and added to the path
    - Download the ZIP version from **ant.apache.org**
    - Set `ANT_HOME` to the Apache ANT directory, e.g., `set ANT_HOME=C:\tools\apache-ant-1.10.5`
  - MacOS: Use brew and run `brew install ant`

- **Node.js** – tested with v12.9.1
    - Install using the installers available at [nodejs.org](https://nodejs.org/en/)

- **Cordova CLI** – tested with v9.0.0
   - Install using `npm install -g cordova`

- **Ionic** framework – tested with v5.2.6
   - Install using: `npm install -g ionic`  

## Recommended Configuration

This section describes the recommended configuration.

### Disable Auto-Save

Starting from Cordova v7, auto-saving is enabled by default. However, it may cause problems due to the fact that Cordova's `plugin.xml` and npm's `package.json` interpret file paths differently, and auto-saving will write the same paths into both configuration files.

Autosave can be disabled by executing: `cordova config set autosave false`.            

## Transpiling & Running the App

This section explains the steps to run the application in a browser (e.g., for debugging) and to build an APK that can be installed on an Android device.

**NOTE:** The instructions following assume that you have installed **all prerequisites** described in the [*Install the Prerequisites*](#install-the-prerequisites) section.

### Browser

The app accesses foreign domains. To enable that, the CORS policy must be disabled, in order to allow the web app to make REST API calls to foreign hosts:

  - For Chrome, this can be accomplished by using the command-line option `--disable-web-security`.  There must be no other Chrome instance running (for the same user profile) for the command-line option to take effect—close all running instances of Chrome to ensure that. It is recommended that you use a dedicated user profile, to run this testing-instance of Chrome separately from your *normal* Chrome instance, for that, use the command-line option `--user-data-dir=<path-to-testing-user-profile>`.

  - For Firefox, the simplest way is to use an extension called [CORS Everywhere](https://addons.mozilla.org/de/firefox/addon/cors-everywhere/).

Run `ionic` in the project's root directory and accept using key `Y` the installation of the project's dependencies.

Next, run `ionic serve` and accept the message *Looks like this is an Ionic Angular project, would you like to install @ionic/cli-plugin-ionic-angular and continue? (Y/n)* by typing `Y`. At the end, a browser window with the web app should open automatically. The output on the console prints the actual address that is used: 

```
pc:work_bikerider-frontend patrick$ ionic serve
[INFO] Starting app-scripts server: --port 8100 --p 8100 --livereload-port 35729 --r 35729 --address 0.0.0.0 - Ctrl+C to cancel
[14:01:10]  watch started ...
[14:01:10]  build dev started ...
[14:01:10]  clean started ...
[14:01:10]  clean finished in 5 ms
[14:01:10]  copy started ...
...
[14:01:17]  watch ready in 7.47 s
[14:01:17]  dev server running: http://localhost:8100/

[INFO] Development server running
       Local: http://localhost:8100           << address to access the web app
```

You can stop the app server by pressing CTRL+C. As an alternative to `ionic serve` which opens the browser automatically, you can use `ionic serve -b` which does not open your default browser.

Changes in `src` will automatically be detected, compiled, and the served web page will be updated. In general, there is no need to stop and restart the application server during development.

### Android Device

To build the Android APK, the following steps are required to do **once**:

- Add the Android platform to Cordova: `cordova platform add android@5`. 
  - Notice that it is strongly recommended to employ `android@5` to avoid versions conflict with the *Crosswalk WebView* Cordova plugin.
  - To outline all pre-installed plugins in the project environment, type: `cordova platforms ls`.

Thereafter the app is ready to be build. To build an Android APK, run `ionic cordova build android` for building the Android APK, or `ionic cordova run android` for building the APK and installing it on the first available Android device.

A message like *The plugin @ionic/cli-plugin-cordova is not installed. Would you like to install it and continue? (Y/n)* should appear. Accept it by typing `Y`.

## Troubleshooting

Following the steps to troubleshoot common problems are given. 

### Hook for before_prepare cannot be started

It might be necessary on *nix systems to set the `executable` flag for the build script `hooks/before_prepare/build-mmir.js`. To do that, run `chmod -R u+x hooks`.

### Gradle cannot be found

Currently, there is a problem with integrating Android's build system `gradle` into `cordova` properly. If you get an error message that `gradle` could not be found, please try the following solutions. 

#### A. Install Gradle

As mentioned in the [Prerequisites](#prerequisites) section, if you just installed the `sdk-tools`, instead of the whole Android Studio, you need to manually install Gradle. If you manually installed Gradle, it might be necessary to add Gradle to the PATH such that it can be found when running `gradle` in a terminal.

#### B. Fix Cordova's Detection Mechanism

> Use this method, if you have `Android Studio` installed in a non-default location

Open the file `platforms/android/cordova/lib/check_reqs.js` and find implementation of function `module.exports.get_gradle_wrapper`.

Within the function, add the following code right before `if (module.exports.isDarwin()) {...`, resulting in:

```javascript
var program_dir;
if (process.env['ANDROID_STUDIO_HOME']){  // ADDED LINE
    androidStudioPath = path.join(process.env['ANDROID_STUDIO_HOME'], 'gradle');  // ADDED LINE
} else if (module.exports.isDarwin()) {  // MODIFIED LINE
    ...
}
```

Set the environment variable `ANDROID_STUDIO_HOME` to the path where you installed Android Studio. For example, on *nix systems run `export=/path/to/android`.

#### C. Install Gradle Manually

Install `gradle` into the default location, so that Cordova's build script will correctly detect its presence. For install instructions, see the [Prerequisites](#prerequisites).

#### D. Install Android Studio

Install Android Studio into the default location, so that Cordova's build script will correctly detect its presence.

### Source path does not exist

If you receive the error message *Error: Source path does not exist: resources\android\icon\drawable-hdpi-icon.png* it might be that the path is defined in Windows-style using backslashes (`\`) but the Unix-style using slashes (`/`) is expected, or vice versa [Source](https://stackoverflow.com/questions/39705491/error-source-path-does-not-exist-resources-android-icon-drawable-hdpi-icon-png).

In this case you can either 
- run `ionic cordova resources` that updates the resource configuration and corrects the paths, 
- or manually edit the file `config.xml`. The paths in the lines starting with `<icon ...` must be corrected according to the platform the application is running. 

