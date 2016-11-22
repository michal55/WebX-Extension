# WebX-Extension

File structure
  - image folder contains images
  - image/icon.png - Chrome extension icon
  - js folder contains JavaScripts
  - popup.js - JS file.
  - manifest.json - Json file containing basic information like name, html file name, icon, permissions.
  - popup.html - Html file containing grafic and links to JS file.
  

Loading extension into chrome
  - Go to chrome://extensions/ adress
  - Enable Developer Mode
  - Load unpacked extension...
  - Navigate to file containing extension and press Open
  - Extension is running. If you need to reload extension just go to chrome://extensions/ and under the extension
    name is reload option.

Integration with Webx
  - In seeds.rb edit redirect_uri:
	'redirect_uri' => 'https://YourExtensionID.chromiumapp.org/'
  - run rake db:seed

TL;DR
  - popup.html contains the extension graphic
  - popup.js logic 

