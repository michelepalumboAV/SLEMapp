cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "phonegap-nfc.NFC",
    "file": "plugins/phonegap-nfc/www/phonegap-nfc.js",
    "pluginId": "phonegap-nfc",
    "runs": true
  },
  {
    "id": "phonegap-plugin-barcodescanner.BarcodeScanner",
    "file": "plugins/phonegap-plugin-barcodescanner/www/barcodescanner.js",
    "pluginId": "phonegap-plugin-barcodescanner",
    "clobbers": [
      "cordova.plugins.barcodeScanner"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "phonegap-nfc": "0.7.1",
  "phonegap-plugin-barcodescanner": "7.0.2"
};
// BOTTOM OF METADATA
});