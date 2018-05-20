# link-saver-app

> Hybrid Vue + Cordova mobile app version of [linksaver-client](https://github.com/duchunter/link-saver-client) to save all links offline

Info          |  Links
:-------------------------:|:-------------------------:
![](https://image.ibb.co/cmFVBT/32960572_1003926659782147_825428586134503424_n.png)  |  ![](https://image.ibb.co/fjVxrT/32967053_1003926669782146_4389532348325036032_n.png)


## Build Setup

``` bash
# install dependencies
npm install

# build for production with minification
npm run build

# check requirements for specific platform
cordova requirements

# run app on browser
npm run web

# run app on Android emulator
npm run android

# build .apk file for android
cordova build android
```

>You can also add ios platform by runnning ```cordova platforms add ios``` and fullfill ```cordova requirements```

> If you want to use your own Auth0 client, please edit ```env.js```

>If you want to use your own Linksaver server, edit ```BASE_URL``` in ```utils/api.js```
