var TOKEN_ID = "";
var app = {
    pages: {

        HOME: "home",
        INBOUND: "inbound",
        INBOUND_ORDER: "inbound_order",
        INBOUND_BATCH: "inbound_batch",
        PREPARE2: "prepare2",
        OUTBOUND_BATCH: "outbound_batch",
        OUTBOUND_SEND: "outbound_send",
        OUTBOUND_PREPARE: "outbound_prepare",
    },
    color: {
        imput: "",
    },
    batchglobal: new Array(),
    locationlobal_id: "",
    userblobal_id: "",
    warehouseglobal_id: "",

    initialize: function() {
        app.bindEvents();
    },

    /*
    bind any events that are required on startup to listeners:
     */
    bindEvents: function() {
        document.addEventListener('deviceready', app.onDeviceReady, false);
    },

    /*
    app runs when the device is ready for user interaction:
     */
    onDeviceReady: function() {
        nfc.addNdefListener(
            app.onNfc, // tag successfully scanned
            function(status) { // listener successfully initialized
            },
            function(error) { // listener fails to initialize
                app.display("NFC reader failed to initialize " + JSON.stringify(error), "init_nfc_negative_result");
            }
        );
    },

    oNothingOnNfc: function(nfcEvent) {
        //do nothing function used when an nfc event is fired and no code has to be executed
    },

    /*
        Funzione che viene chiamata quando il dispositivo e vicino al tag nfc.
        E viene utilizzata per :
            1. leggere tag nfc relativo all'utenticazione del dipendente operaio per entrare in Slemapp
            2. leggere tag nfc relativo ad un ordine ;
            3. leggere tag nfc relativo ad una batch ;
            4. leggere tag nfc relativo ad una location ;
     */
    onNfc: function(nfcEvent) {
        var currentPage = $.mobile.activePage.attr('id');
        switch (currentPage) {
            case app.pages.HOME:
                var tag = nfcEvent.tag;
                var UserID = ndef.textHelper.decodePayload(tag.ndefMessage[0].payload);
                var MyWhID = ndef.textHelper.decodePayload(tag.ndefMessage[1].payload);
                var myTokenID = ndef.textHelper.decodePayload(tag.ndefMessage[2].payload);
                warehouseglobal_id = MyWhID;
                alert("NFC reading\n" +
                    "Result user_id: " + userblobal_id);
                app.setToken(myTokenID);
                app.getUser(UserID, MyWhID);
                break;
            case app.pages.INBOUND:
                app.remove();
                var tag = nfcEvent.tag;
                var orderID = ndef.textHelper.decodePayload(tag.ndefMessage[0].payload);
                var warehouseId = ndef.textHelper.decodePayload(tag.ndefMessage[1].payload);
                alert("NFC reading\n" +
                    "Result order_id: " + orderID);
                app.get_Inbound_oder(orderID, warehouseId);
                break;
            case app.pages.INBOUND_ORDER:
                var tag = nfcEvent.tag;
                var batchID = ndef.textHelper.decodePayload(tag.ndefMessage[0].payload);
                alert("NFC reading\n" +
                    "Result batch_id: " + batchID);
                app.scanBachtInbound(batchID);
                break;
            case app.pages.INBOUND_BATCH:
                var tag = nfcEvent.tag;
                var location_id = ndef.textHelper.decodePayload(tag.ndefMessage[0].payload);
                var warehouseId = ndef.textHelper.decodePayload(tag.ndefMessage[1].payload);
                alert("NFC reading\n" +
                    "Result location_id: " + location_id);
                locationlobal_id = location_id;
                app.getLocation(location_id, warehouseId);
                break;
            case app.pages.OUTBOUND_SEND:
                var tag = nfcEvent.tag;
                var batch_id = ndef.textHelper.decodePayload(tag.ndefMessage[0].payload);
                var warehouseId = ndef.textHelper.decodePayload(tag.ndefMessage[1].payload);
                var ordineId = ndef.textHelper.decodePayload(tag.ndefMessage[2].payload);
                app.writeUserToNFC(batch_id,ordineId,warehouseId);
                alert("NFC reading\n" +
                    "Result batch_id: " + batch_id);
                app.getBatch_outbound(batch_id, warehouseId, ordineId);
                break;
            case app.pages.OUTBOUND_PREPARE:
                var tag = nfcEvent.tag;
                var ordineId  = ndef.textHelper.decodePayload(tag.ndefMessage[0].payload);
                var warehouseId  = ndef.textHelper.decodePayload(tag.ndefMessage[1].payload)  
                alert("NFC reading\n" +
                    "Result order_id: " + ordineId);
                app.get_outbound_prepare(ordineId, warehouseId);
                break;
            default:
                //doNothing();
        }
    },

    /*
        Funzione che viene chiamata dopo la lettura del tag nfc relativo al dipendente,
        che permette di verificare se quel dipendente risiede nell sistema,
        effettuando una chiamata al web services utilizzando l'appropiata api. 
        Il response che ci restituisce ci permette di gestire l'accesso dei dipendenti,
        e il ruolo da loro ricoperto.
        
     */
    getUser: function(UserID, MyWhID) {
        $(".errorBox").hide();
        $.ajax({
            type: 'GET',
            url: 'http://petprojects.altervista.org/' + MyWhID + '/employee/' + UserID + '/',
            error: function(xhr) {
                if (xhr.status == 404) {
                    newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>' + xhr.responseJSON.error +
                     '</center></div>' + document.getElementById("homebox").innerHTML;
                    document.getElementById("homebox").innerHTML = newDiv;
                }
            },
            success: function(response) {
                var currentPage = $.mobile.activePage.attr('id');
                var span = new Array();
                var span = document.getElementsByClassName("helloMr");
                for (i = 0; i < span.length; i++) {
                    span[i].innerHTML = 'Hello, ' + response.name;
                }
                span.innerHTML = 'Hello, ' + response.name;
                switch (currentPage) {
                    case app.pages.HOME:
                        $.mobile.navigate('#menufunction');
                        switch (response.roleID) {
                            case '0':
                                $("#button_load").show();
                                $("#button_unload").hide();
                                break;
                            case '1':
                                $("#button_load").hide();
                                $("#button_unload").show();
                                break;
                            case '2':
                                $("#button_load").show();
                                $("#button_unload").show();
                                break;
                        }
                        break;
                }
            },
            contentType: "application/json",
            accept: "application/json",
            dataType: 'json',
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN_ID); }
        });
    },
    /*
        Funzione che viene chiamata nel momento in cui viene avvicinato il dispositivo al prodotto effettuata la lettura del suo barcode.   
     */v
    barcodeScan: function() {
        cordova.plugins.barcodeScanner.scan(
            function(result) {

                alert("We got a barcode\n" +
                    "Result: " + result.text + "\n" +
                    "Format: " + result.format + "\n" +
                    "Cancelled: " + result.cancelled);

                var currentPage = $.mobile.activePage.attr('id');
                switch (currentPage) {
                    case app.pages.OUTBOUND_BATCH:
                        app.Batch_outbound_dett(result.text);
                        break;
                }
            },
            function(error) {
                alert("Scanning failed: " + error);
            }, {
                preferFrontCamera: false, // iOS and Android
                showFlipCameraButton: true, // iOS and Android
                showTorchButton: true, // iOS and Android
                torchOn: true, // Android, launch with the torch switched on (if available)
                saveHistory: true, // Android, save scan history (default false)
                prompt: "Place a barcode inside the scan area", // Android
                resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                //formats : "QR_CODE ,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                formats: "EAN_8, EAN_13, QR_CODE, PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                orientation: "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                disableAnimations: true, // iOS
                disableSuccessBeep: false // iOS and Android
            }
        );

    },
    /*
        Funzione che viene chiamata nel momento in cui si deve creare un codice barCode di un prodotto,      
     */
    writebarCode: function() {
        cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com", function(success) {
            alert("encode success: " + success);

        }, function(fail) {
            alert("encoding failed: " + fail);
        });
    },

    /*
        Funzione che viene chiamata nella sezione inbound per ottenere dettagli dell'ordine dopo letto l'Nfc dell'ordine,
        effettuando una chiamata al web services utilizzando l'appropiata api.       
     */
    getOrdine: function(orderID, warehouseId) {
        $.mobile.navigate('#inbound_order');
        $(".errorBox").hide();
    
        $.ajax({
            type: 'GET',
            url: 'http://petprojects.altervista.org/' + warehouseId + '/inbound/' + orderID + '/batch/list/',
            error: function(xhr, data) {
                if (xhr.status == 404) {
                    newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>' + xhr.responseJSON.error + 
                    '</center></div>' + document.getElementById("cc").innerHTML;
                    document.getElementById("cc").innerHTML = newDiv;
                }
            },
            success: function(response) {
                var currentPage = $.mobile.activePage.attr('id');
                switch (currentPage) {
                    case app.pages.INBOUND_ORDER:
                        $("#Order_n").val(orderID);
                        var batch = new Array();
                        batch = response;
                        batchglobal = batch;

                        for (i = 0; i < batch.length; i++) {
                            newInput = '<input type="text" onclick="app.dettagliBatch(\'' + batch[i].batch.ID + '\',\'' + i +
                             '\');" name="batch"  class="inputBatchesPre" id="' + 
                            i + '" readonly value=' + batch[i].batch.ID + ' disabled>' + document.getElementById("cc").innerHTML;
                            document.getElementById("cc").innerHTML = newInput;
                        }
                        break;
                }
            },
            contentType: "application/json",
            accept: "application/json",
            dataType: 'json',
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN_ID); }
        });
    },
    /*
        Funzione che viene chiamata dopo la lettura del tag nfc relativo all'ordine,
        e permette di verificare sè quell'ordine risiede nell sistema,
        e ottenere le batches relative all'ordine letto effettuando una chiamata al web services utilizzando l'appropiata api. 
     */
    getOrdineOutbound: function() 
        var orderID = $("#order_ID").val()
        var warehouseId = warehouseglobal_id;
        $(".errorBox").hide();
        $.mobile.navigate('#outbound_order');
        $.ajax({
            type: 'GET',
            url: 'http://petprojects.altervista.org/' + warehouseId + '/outbound/' + orderID + '/batch/list/',
            error: function(xhr) {
               
                if (xhr.status == 404) {
                    newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>' + xhr.responseJSON.error +
                     '</center></div>' + document.getElementById("ccOutbound").innerHTML;
                    document.getElementById("ccOutbound").innerHTML = newDiv;
                }
            },
            success: function(response) {
                app.remove();
                $("#Order_ID_out").val(orderID);
                var batch = new Array();
                batch = response;
                for (i = 0; i < batch.length; i++) {
                    newInput = '<input type="text" class="inputBatchesPre" onclick="app.Batch_outbound(\'' + batch[i].batch.ID + '\',\'' + i + 
                        '\')" name="batch"  id="' + i + '" readonly value=' + batch[i].batch.ID + '>' + document.getElementById("ccOutbound").innerHTML;
                    document.getElementById("ccOutbound").innerHTML = newInput;
                }
            },
            contentType: "application/json",
            accept: "application/json",
            dataType: 'json',
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN_ID); }
        });
    },
    /*
        Funzione che viene chiamata dopo la lettura del tag nfc relativo alla batch,
        che permette di verificare se quella batch risiede nel dettaglio dell'ordine letto precedentemente,   
     */
    scanBachtInbound: function(batch_id) {
        $(".errorBox").hide();
        alert("avvio scansione");
        var tagInput = new Array();
        tagInput = document.getElementsByClassName("inputBatchesPre");
        var find = false;

        for (i = 0; i < tagInput.length; i++) {
            if (tagInput[i].value == batch_id) {
                $('#' + tagInput[i].id).attr('style', 'background-color:#DFF2BF !important; color: #4F8A10 !important');
                $('#' + tagInput[i].id).prop("disabled", false);
                find = true;
            }
        }
        if (!find) {
            $("#boxscanBatch").prop("hidden", false);
            newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>Batch not found</center></div>' + 
            document.getElementById("boxscanBatch").innerHTML;
            document.getElementById("boxscanBatch").innerHTML = newDiv;
        }
    },

    /*
        Funzione utilizzata per rimuovere elementi nei div.    
     */
    remove: function() {
        document.getElementById("cc").innerHTML = "";
        document.getElementById("ccOutbound").innerHTML = "";
        $(".errorBox").hide();
    },

    /*
        Funzione utilizzata nella sezione Inbound per inserire i dettagli della batch nelle caselle di input  
        e disabilitazione del bottone conferma. 
     */
    dettagliBatch: function(batch_id, i) {
        $("#scanLocation").show();
        $("#location").hide();
        $.mobile.navigate('#inbound_batch');
        $("#Batch_ID").val(batch_id);
        $(".successBox").hide();
        $("#confirm").prop("disabled", true);
        app.color.imput = i;
    },
    /*
        Funzione utilizzata nella sezione Outbound per per inserire i dettagli della batch nelle caselle di input
        e disabilitazione del bottone conferma.   
     */
    Batch_outbound: function(batch_id, i) {
        $("#scanLocation").show();
        $("#location").hide();
        $("#end_batch").prop("disabled", true);
        $.mobile.navigate('#outbound_batch');
        $("#Batch_ID_out").val(batch_id);
        $(".successBox").hide();
        $("#confirm").prop("disabled", true);
        $("#Batch_ID_out_det").val(batch_id);
        app.color.imput = i;
    },
    /*
        Funzione utilizzata nella sezione Outbound per inserire l'id dell'ordine, letto dal Nfc nalla casella di input,ricavato 
        effettuando una chiamata al web services utilizzando l'appropiata api, 
        e la navigazione nella pagina dove inserire i dati .   
     */
    get_outbound_prepare: function(order_id, warehouseId) {
       $(".errorBox").hide();
        $.ajax({
            type: 'GET',
            url: 'http://petprojects.altervista.org/' + warehouseId + '/outbound/' + order_id + '/',
            error: function(xhr) {
                if (xhr.status == 404) {
                    $("#boxorder").prop("hidden", false);
                    newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>' + xhr.responseJSON.error + 
                    '</center></div>' + document.getElementById("boxorder").innerHTML;
                    document.getElementById("boxorder").innerHTML = newDiv;
                }
            },
            success: function(response) {
                $.mobile.navigate('#prepare2');
                $("#order_ID").val(order_id);
            },
            contentType: "application/json",
            accept: "application/json",
            dataType: 'json',
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN_ID); }
        });
    },
    /*
        Funzione utilizzata nella sezione Inbound per verificare se l'ordine letto dal Nfc esiste, 
        effettuando una chiamata al web services utilizzando l'appropiata api, e la chiamata della funzione 
        app.getOrdine(order_id, warehouseId) nel caso la richiesta va a buon fine.
     */
    get_Inbound_oder: function(order_id, warehouseId) {
        $(".errorBox").hide();
        $.ajax({
            type: 'GET',
            url: 'http://petprojects.altervista.org/' + warehouseId + '/inbound/' + order_id + '/',
            error: function(xhr) {
                if (xhr.status == 404) {
                    $("#boxorderInbound").prop("hidden", false);
                    newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>' + xhr.responseJSON.error + 
                    '</center></div>' + document.getElementById("boxorderInbound").innerHTML;
                    document.getElementById("boxorderInbound").innerHTML = newDiv;
                }
            },
            success: function(response) {
                app.getOrdine(order_id, warehouseId)
            },
            contentType: "application/json",
            accept: "application/json",
            dataType: 'json',
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN_ID); }
        });

    },
    /*
        Funzione utilizzara per rendere di nuovo i div nascosti
     */
    resetVisibility: function() {
        $("#boxorder").prop("hidden", true);
        $("#box_send_2").prop("hidden", true);
        $("#boxorderInbound").prop("hidden", true);
        $("#boxscanBatch").prop("hidden", true);
    },
    /*
        Funzione che viene chiamata nella sezione outBound dopo la lettura del barCode del prodotto,
        e permette di ricavare i dettagli relativi al prodotto scansionato dal sistema ,
        effettuando una chiamata al web services utilizzando l'appropiata api.   
     */
    Batch_outbound_dett: function(code) {
        $.mobile.navigate('#outbound_batch_dett');
        $(".successBox").hide();
        $(".errorBox").hide();
        var serial = code;
        var warehouseId = warehouseglobal_id;

        $.ajax({
            type: 'GET',
            url: 'http://petprojects.altervista.org/' + warehouseId + '/equipment_material/' + serial + '/',
            error: function(xhr) {
                $(".errorBox").hide();
                if (xhr.status == 404) {
                    newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>' + xhr.responseJSON.error +
                     '</center></div>' + document.getElementById("box_out_det").innerHTML;
                    document.getElementById("box_out_det").innerHTML = newDiv;
                }
            },
            success: function(response) {
                $(".errorBox").hide();
                if (response.status != 'Ordered') { //then status=='available'
                    $(".errorBox").hide();
                    $("#Serial").val(serial);
                    $("#Product_ID_out_det").val(response.product.ID);
                    $("#Location_ID_out_det").val(response.location.ID);
                    $("#added").prop("disabled", false);
                } else {
                    $("#Serial").val(serial);
                    $("#Product_ID_out_det").val(response.product.ID);
                    $("#Location_ID_out_det").val(response.location.ID);
                    newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>The product is ' + response.status +
                     '</center></div>' + document.getElementById("box_out_det").innerHTML;
                    document.getElementById("box_out_det").innerHTML = newDiv;
                }
            },
            contentType: "application/json",
            accept: "application/json",
            dataType: 'json',
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN_ID); }
        });
    },
     /*
        Funzione che viene chiamata nella sezione outBound Send dopo la lettura del Nfc della batch,
        e permette di verificare sè la batch scansionato è nel sistema  per poi essere spedita,
        effettuando una chiamata al web services utilizzando l'appropiata api.   
     */
    getBatch_outbound: function(batch_id, warehouseId, ordineId) {
    
        
        $("#Batch_ID_out_send").val(batch_id);
        $(".successBox").hide();
        $(".errorBox").hide();

        $.ajax({
            type: 'GET',
            url: 'http://petprojects.altervista.org/' + warehouseId + '/outbound/' + ordineId + '/batch/' + batch_id + '/',
            error: function(xhr) {
                $(".errorBox").hide();
                $(".successBox").hide();
                if (xhr.status == 404) {
                    newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>' + xhr.error + 
                    '</center></div>' + document.getElementById("box_send_2").innerHTML;
                    document.getElementById("box_send_2").innerHTML = newDiv;
                }
            },
            success: function(response) {
                $("#confirm_send_2").prop("disabled", false);
                $.mobile.navigate('#outbound_send_2');

            },
            contentType: "application/json",
            accept: "application/json",
            dataType: 'json',
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN_ID); }
        });
    },
    /*
        Funzione che viene chiamata nella sezione inbound dopo la lettura del Nfc della location, 
        utilizzata per segnalare al sistema dove inserire la batch arrivata,
        effettuando una chiamata al web services utilizzando l'appropiata api.   
     */
    getLocation: function(location_id, warehouseId) {

        $(".errorBox").hide();
        $(".successBox").hide();
        $.ajax({
            type: 'GET',
            url: 'http://petprojects.altervista.org/' + warehouseId + '/location/' + location_id + '/',
            error: function(xhr) {
                if (xhr.status == 404) {
                    newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>' + xhr.responseJSON.error +
                     '</center></div>' + document.getElementById("boxLocation").innerHTML;
                    document.getElementById("boxLocation").innerHTML = newDiv;
                }
            },
            success: function(response) {
                $("#scanLocation").hide();
                $("#Location_ID").val(response.name);
                $("#location").show();
                $("#confirm").prop("disabled", false);

            },
            contentType: "application/json",
            accept: "application/json",
            dataType: 'json',
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN_ID); }
        });
    },
    /*
        Funzione che viene chiamata nella sezione Inbound,
        e permette di segnalare al sistema  che la batch arrivata è stata depositata,
        effettuando una chiamata al web services utilizzando l'appropiata api.   
     */
    confermaBatch: function() {

        var warehouseId = warehouseglobal_id;
        var order_id=$("#Order_n").val;
        var batch_id=$("#Batch_ID").val;
        $(".errorBox").hide();
        $(".successBox").hide();
        $.ajax({

            type: 'PUT',
            url: 'http://petprojects.altervista.org/' + warehouseId + '/inbound/' + order_id + '/batch/' + batch_id + '/arrived/',
            data: JSON.stringify({
                inboundEmployeeID: userblobal_id,
                locationID: locationlobal_id,
            }),
            error: function(xhr) {
                newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>' + xhr.responseJSON.error + 
                '</center></div>' + document.getElementById("btn_confirma").innerHTML;
                document.getElementById("btn_confirma").innerHTML = newDiv;
            },
            success: function(response) {
                newDiv = '<div class="successBox"><center><i class="fa fa-times-circle"></i> The batch has been confirmed </center></div>' +
                 document.getElementById("btn_confirma").innerHTML;
                document.getElementById("btn_confirma").innerHTML = newDiv;

            },
            contentType: "application/json",
            accept: "application/json",
            dataType: 'json',
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN_ID); }
        });
    },
    /*
        Funzione che viene chiamata nella sezione outBound Send per confermare al sistema  che la batch è stata spedita effettuando un Updata
        tramite una chiamata al web services utilizzando l'appropiata api.   
     */
    confermaBatch_out_send_2: function() {

        var warehouseId = warehouseglobal_id;
        var order_id=$("#Order_n").val;
        var batch_id=$("#Batch_ID_out_send").val;
        $(".errorBox").hide();
        $(".successBox").hide();

        $.ajax({

            type: 'PUT',
            url: 'http://petprojects.altervista.org/' + warehouseId + '/outbound/' + order_id + '/batch/' + batch_id + '/departure/',

            data: JSON.stringify({
                outboundEmployeeID: userblobal_id,
            }),
            error: function(xhr) {
                newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>' + xhr.responseJSON.error + 
                '</center></div>' + document.getElementById("box_send_2").innerHTML;
                document.getElementById("box_send_2").innerHTML = newDiv;
            },
            success: function(response) {
                newDiv = '<div class="successBox"><center><i class="fa fa-times-circle"></i> The batch has been confirmed </center></div>' +
                document.getElementById("box_send_2").innerHTML;
                document.getElementById("box_send_2").innerHTML = newDiv;
            },
            AcontentType: "application/json",
            accept: "application/json",
            dataType: 'json',
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN_ID); }
        });
    },
    /*
        Funzione che viene chiamata nella sezione outBound Prepare, per confermare al sistema  che 
        il prodotto è stato inserito nella batch da spedire effettuando un Updata
        tramite una chiamata al web services utilizzando l'appropiata api. 
     */
    addProductOutbound: function() {
        $(".successBox").hide();
        var warehouseId = warehouseglobal_id;
        var order_id=$("#Order_n").val;
        var batch_id=$("#Batch_ID_out_send").val;
        $(".errorBox").hide();
        $(".successBox").hide();

        $.ajax({

            type: 'POST',
            url: 'http://petprojects.altervista.org/' + warehouseId + '/outbound/' + order_id + '/batch/' + batch_id + '/details/',
            data: JSON.stringify({
                serialID: $("#Serial").val(),
            }),
            error: function(xhr) {
                newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>' + xhr.responseJSON.error + 
                '</center></div>' + document.getElementById("box_out_det").innerHTML;
                document.getElementById("box_out_det").innerHTML = newDiv;
            },
            success: function(response) {
                newDiv = '<div class="successBox"><center><i class="fa fa-times-circle"></i> The batch has been confirmed </center></div>' +
                document.getElementById("box_out_det").innerHTML;
                document.getElementById("box_out_det").innerHTML = newDiv;
                $("#end_batch").prop("disabled", false);
            },
            contentType: "application/json",
            accept: "application/json",
            dataType: 'json',
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN_ID); }
        });
    },
     /*
        Funzione che viene chiamata nella sezione outBound Prepare, dopo che la batch è stata riempita,
        e conferma al sistema la preparazione della batch tramite una chiamata al web services utilizzando l'appropiata api. 
     */
    endBatch: function() {
        $(".successBox").hide();
        tagInput = document.getElementsByClassName("inputBatchesPre");
        newDiv = '<div class="successBox"><center><i class="fa fa-times-circle"></i> The batch has been terminated </center></div>' +
         document.getElementById("boxinf").innerHTML;
        document.getElementById("boxinf").innerHTML = newDiv;

        var order_id = $("#Order_ID_out").val();
        var Batch_ID_out = $("#Batch_ID_out").val();

        for (i = 0; i < tagInput.length; i++) {
            if (tagInput[i].value == Batch_ID_out) {
                $('#' + tagInput[i].id).prop("disabled", true);
            }
        }

        app.writeToNFC(order_id, Batch_ID_out, warehouseglobal_id);

    },
     /*
        Funzione che viene chiamata dopo che la batch è stata riempita, e scrive il tag Nfc relativo alla batch 
     */
    writeToNFC: function(value1, value2, value3) {
        alert("Nfc is write");
        var message = [ndef.textRecord(value1), ndef.textRecord(value2), ndef.textRecord(value3)];
        // write the record to the tag:
        nfc.write(
            message, // write the record itself to the tag
            function() { // when complete, run app callback function:
                alert("Device scritto correttamente");
            },
            // app function runs if the write command fails:
            function(reason) {
                alert("There is a problem: " + reason);
            }
        );
    },
     /*
        Funzione che setta il Token relativo al dipendente che accedede al sistema, per avere il consenso di effettuare le operzioni di Inbound e Outbound
     */
    setToken: function(value) {
        TOKEN_ID = value;
    }

};