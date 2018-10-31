# SLEMapp 

An application to access to the main functionality of the "State and Location of Equipment and Material" project. 

This has been build and designed for [Android](https://www.android.com).
It requires NFC to login to the application.
It requires a Camera to use the Barcode Scanner.
Thi application helps managing the Inbound and Outbound of equipment and material through the warehouses, to help managing orders and keeping trace of their location and status.

Mainly, this application innovation can be found through the preparation function for the batch to be shipped: 
1) writing the information gained through the order management's functionality of the backoffice, about the order ID and the batches IDs;
2) scanning the product barcode;
3) pairing the serial gained previously with the batch NFC.

Then the flows of inbound and outbound are the classical flows: identification of the product, updating of the database, inserting them in their right location/ inside the track for the shipping.

## Getting Started

This is an application developed through the [Apache Cordova](https://cordova.apache.org) framework, tested via [Adobe PhoneGapp](https://phonegap.com) for the net functionality in-browser.
The user interface is implemented through [JQuery mobile](https://jquerymobile.com).
The Api call to the [SLEM-Api](https://github.com/albvol/SLEM-Api) are implemented via Ajax.

### NFC

The nfc plugin used is the [PhoneGapp-NFC](https://github.com/chariotsolutions/phonegap-nfc)

### Barcode

The nfc plugin used is the [PhoneGapp-Plugin-BarcodeScanner](https://github.com/phonegap/phonegap-plugin-barcodescanner)

### Installation

1. Once Apache Cordova is installed, just download the entire project.

2. Download and install the [SLEM-Api](https://github.com/albvol/SLEM-Api), and configure it.

3. Change the URL in the API calls in www\js\index.js

4. Change the OAuth URL request.

5. Build and run on your Android Device.

## SLEM Ecosystem

* [SLEMapp](https://github.com/TimeParadox89/SLEMapp) - The SLEM application
* [SLEMapp Backoffice](https://github.com/TimeParadox89/SLEMApp_Backoffice) - The Backoffice Application
* [SLEM WriteToNFC](https://github.com/TimeParadox89/SLEMApp-WriteToNFC) - The first access application
* [SLEM-Api](https://github.com/albvol/SLEM-Api) -  The SLEM Api system

## Contributors

[Iannotta Erennio](https://github.com/TimeParadox89) , 
[Pappalardo Francesca](https://github.com/kikkatigre),
[Angelo Conte](https://github.com/superAnge),
[Michele Palumbo](https://github.com/michelepalumboAV).
