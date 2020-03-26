# Introduction
This is a simple static web application to visualize a list of local stores. It is packaged as a Node application just for testing purposes. You can directly take the contents of the "public" directory to embed in any kind of web application. My purpose was to rapidly share updated local business information during the COVID-19 epidemic, but with a bit of tinkering you can make it work for any kind of application that wants to plot data on a map that comes from a Google sheet.

# How to Use It
This application consumes data from a Google sheet. You'll need to change it to your own sheet [here](https://github.com/jarthorn/local-store-locator/blob/master/public/js/store.js#L142). You will also need to replace the Google maps API key with your own [here](https://github.com/jarthorn/local-store-locator/blob/master/public/map.html#L8) (the one here only works on a single domain, not yours).

# Credits
Credit to [Anton McConville](https://github.com/antonmc) who developed the [original version](https://github.com/antonmc/sheetmap) of this concept many years ago.