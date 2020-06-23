

const addendum = process.env.STAGE === 'production' ? "" : "-"+process.env.STAGE
const version = "1.0.8";
const buildNumber = 33;
const appName = '<project-name>';
const bundleIdentifier = "com.gunnertech.<project-name>"

export default ({ config }) => ({
  "expo": {
    "name": appName+addendum,
    "scheme": appName.toLowerCase()+addendum,
    "notification": {
      "iosDisplayInForeground": true
    },
    "userInterfaceStyle": "automatic",
    "description": "This project is really great.",
    "slug": appName.toLowerCase()+addendum,
    "privacy": "public",
    "platforms": [
      "ios",
      "android",
      "web"
    ],
    "version": version,
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "cover",
      "backgroundColor": "#000000"
    },
    "hooks": {
      "postPublish": [
        {
          "file": "sentry-expo/upload-sourcemaps",
          "config": {
            "organization": "gunner-technology",
            "project": appName.toLowerCase(),
            "authToken": ""
          }
        }
      ]
    },
    "updates": {
      "fallbackToCacheTimeout": 300000
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "android": {
      "package": bundleIdentifier+addendum.replace(/\-/g, "_"),
      "playStoreUrl": "https://play.google.com/store/apps/details?id="+bundleIdentifier+addendum.replace(/\-/g, "_"),
      "versionCode": buildNumber,
      "splash": {
        "resizeMode": "cover",
        "backgroundColor": "#000000",
        "mdpi": "./assets/mdpi.png",
        "hdpi": "./assets/hdpi.png",
        "xhdpi": "./assets/xhdpi.png",
        "xxhdpi": "./assets/xxhdpi.png",
        "xxxhdpi": "./assets/xxxhdpi.png"
      },
      "permissions": [
        "CAMERA",
        "NOTIFICATIONS",
        "CAMERA_ROLL",
        "READ_INTERNAL_STORAGE",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ],
      "config": {
        "branch": {
          "apiKey": ""
        }
      }
    },
    "ios": {
      "associatedDomains": [
        "applinks:"+appName.toLowerCase()+addendum+".app.link",
        "applinks:"+appName.toLowerCase()+addendum+"-alternate.app.link"
      ],
      "infoPlist": {
        
      },
      "bundleIdentifier": bundleIdentifier+addendum,
      "supportsTablet": true,
      "buildNumber": buildNumber.toString(),
      "config": {
        "usesNonExemptEncryption": false,
        "branch": {
          "apiKey": ""
        }
      }
    },
    "extra": {
      "ENV": process.env.STAGE
    }
  }
})