var TOKEN_ID = "";
var app = {
    pages: {
        MAIN: "main_page",
        READ: "wh_page",
        WRITE: "ms_page",
        HOME: "home",
        EMPVER: "configure_bracelet_page",
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
    called when a device is close to a nfc tag
     */
    onNfc: function(nfcEvent) {
        var currentPage = $.mobile.activePage.attr('id');
        // app.onNfc = app.doNothingOnNfc;
        switch (currentPage) {
            case app.pages.HOME:
                //fra
                //var UserID = "ASD7238ASD";
                //Angvar UserID = "WTYETYWT";
                var UserID = "ALB23JSHA";
                userblobal_id = UserID;
                alert("NFC reading\n" +
                    "Result user_id: " + userblobal_id);
                var MyWhID = "AC532822-825E-400A-B747-1BB9355BDA67";
                //fra
                //var MyWhID = "324E1C25-9454-4A98-A860-8196893CC326";
                warehouseglobal_id = MyWhID;
                //var tag = nfcEvent.tag;
                //var UserID = ndef.textHelper.decodePayload(tag.ndefMessage[0].payload);
                //var MyWhID = ndef.textHelper.decodePayload(tag.ndefMessage[1].payload);
                //var myTokenID = ndef.textHelper.decodePayload(tag.ndefMessage[2].payload);
                var myTokenID = "1e4e72810b8f8a4995da82ae70da5a70d81968b7";
                app.setToken(myTokenID);
                app.getUser(UserID, MyWhID);
                break;
            case app.pages.INBOUND:
                app.remove();
                var orderID = "6E8A303F-D9ED-4BEE-9139-403C8AFDF2C8";
                var warehouseId = "324E1C25-9454-4A98-A860-8196893CC326";
                alert("NFC reading\n" +
                    "Result order_id: " + orderID);
                //var tag = nfcEvent.tag;
                //var orderID = ndef.textHelper.decodePayload(tag.ndefMessage[0].payload);
                //var warehouseId = ndef.textHelper.decodePayload(tag.ndefMessage[1].payload);
                app.getOrdine(orderID, warehouseId);
                break;
            case app.pages.INBOUND_ORDER:
                var batchID = '9554BEC8-D252-42FC-ACCE-EF941555964B';
                alert("NFC reading\n" +
                    "Result batch_id: " + batchID);
                //var tag = nfcEvent.tag;
                //var batchID = ndef.textHelper.decodePayload(tag.ndefMessage[0].payload);
                app.scanBachtInbound(batchID);
                break;
            case app.pages.INBOUND_BATCH:
                var location_id = "9929EF55-85F5-41D8-B498-094057081EFC";
                locationlobal_id = location_id;
                var warehouseId = "324E1C25-9454-4A98-A860-8196893CC326";
                alert("NFC reading\n" +
                    "Result location_id: " + location_id);
                //var tag = nfcEvent.tag;
                //var location_id = ndef.textHelper.decodePayload(tag.ndefMessage[0].payload);
                //var warehouseId = ndef.textHelper.decodePayload(tag.ndefMessage[1].payload);
                app.getLocation(location_id, warehouseId);
                break;
            case app.pages.OUTBOUND_SEND:

                var batch_id = "9554BEC8-D252-42FC-ACCE-EF941555964B";
                var warehouseId = "AC532822-825E-400A-B747-1BB9355BDA67";
                var ordineId = "6E8A303F-D9ED-4BEE-9139-403C8AFDF2C8";
                alert("NFC reading\n" +
                    "Result batch_id: " + batch_id);
                //var tag = nfcEvent.tag;
                //var batch_id = ndef.textHelper.decodePayload(tag.ndefMessage[0].payload);
                //var warehouseId = ndef.textHelper.decodePayload(tag.ndefMessage[1].payload);
                //var ordineId = ndef.textHelper.decodePayload(tag.ndefMessage[2].payload);
                //app.writeUserToNFC(batch_id,ordineId,warehouseId);
                app.getBatch_outbound(batch_id, warehouseId, ordineId);
                break;
            case app.pages.OUTBOUND_PREPARE:
                var ordineId = "FAEF5AC0-8397-464C-A43E-42E2FC24B7B3";
                alert("NFC reading\n" +
                    "Result batch_id: " + ordineId);
                //var tag = nfcEvent.tag;
                //var ordineId  = ndef.textHelper.decodePayload(tag.ndefMessage[0].payload);  
                app.get_outbound_prepare(ordineId);
                break;
            default:
                //doNothing();
        }
    },

    display: function(message, messageDivId) {
        var messageDiv = document.getElementById(messageDivId);
        messageDiv.innerHTML = message;
    },

    displayClass: function(message, messageDivClass) {
        var messageDiv = document.getElementsByClassName(messageDivClass);
        messageDiv[0].innerHTML = message;
    },

    /*
    clears the message div:
     */
    clearAll: function() {
        var messageReadDiv = document.getElementById("read_result");
        var messageWriteDiv = document.getElementById("write_result");
        messageReadDiv.innerHTML = "";
        messageWriteDiv.innerHTML = "";
    },

    addUser: function() {
        $.ajax({
            type: 'POST',
            url: 'http://petprojects.altervista.org/SLEM/api/employee/new/',
            data: JSON.stringify({
                ID: $('#fiscalcode').val(),
                name: $('#firstname').val(),
                surname: $('#lastname').val(),
                birthDate: $('#birthdate').val(),
                roleID: $('#roleid').val(),
                warehouseID: "e70d8391-1317-4c8b-b9d0-16bde0f872d1"
            }),
            success: function(response) {
                app.display(response.status, "responde_add_div");
            },
            contentType: "application/json",
            dataType: 'json'
        });
    },

    getUser: function(UserID, MyWhID) {

        $.ajax({
            type: 'GET',
            url: 'http://petprojects.altervista.org/' + MyWhID + '/employee/' + UserID + '/',
            error: function(xhr) {
                $(".errorBox").hide();
                if (xhr.status == 404) {
                    newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>' + xhr.responseJSON.error + '</center></div>' + document.getElementById("homebox").innerHTML;
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

    prova2: function() {
        cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com", function(success) {
            alert("encode success: " + success);

        }, function(fail) {
            alert("encoding failed: " + fail);
        });
    },


    getOrdine: function(orderID, warehouseId) {
        $.mobile.navigate('#inbound_order');
        //var orderID="1463E3D5-5644-4AD6-99E7-37DDCABF6312";
        //var warehouseId="03EC181C-C204-496E-B1E7-0F2B1E14040F";

        $.ajax({
            type: 'GET',
            url: 'http://petprojects.altervista.org/' + warehouseId + '/inbound/' + orderID + '/batch/list/',
            error: function(xhr, data) {
                $(".errorBox").hide();
                if (xhr.status == 404) {
                    newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>' + xhr.responseJSON.error + '</center></div>' + document.getElementById("cc").innerHTML;
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
                            newInput = '<input type="text" onclick="app.dettagliBatch(\'' + batch[i].batch.ID + '\',\'' + i + '\');" name="batch"  class="inputBatchesPre" id="' + i + '" readonly value=' + batch[i].batch.ID + ' disabled>' + document.getElementById("cc").innerHTML;
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

    getOrdineOutbound: function() {
        //var orderID = "6E8A303F-D9ED-4BEE-9139-403C8AFDF2C8";
        var orderID = $("#order_ID").val()
            //var warehouseId = "AC532822-825E-400A-B747-1BB9355BDA67";
        var warehouseId = warehouseglobal_id;
        $.mobile.navigate('#outbound_order');

        $.ajax({
            type: 'GET',
            url: 'http://petprojects.altervista.org/' + warehouseId + '/outbound/' + orderID + '/batch/list/',
            error: function(xhr) {
                $(".errorBox").hide();
                if (xhr.status == 404) {
                    newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>' + xhr.responseJSON.error + '</center></div>' + document.getElementById("ccOutbound").innerHTML;
                    document.getElementById("ccOutbound").innerHTML = newDiv;
                }
            },
            success: function(response) {
                app.remove();
                $("#Order_ID_out").val(orderID);
                var batch = new Array();
                batch = response;
                for (i = 0; i < batch.length; i++) {
                    newInput = '<input type="text" class="inputBatchesPre" onclick="app.Batch_outbound(\'' + batch[i].batch.ID + '\',\'' + i + '\')" name="batch"  id="' + i + '" readonly value=' + batch[i].batch.ID + '>' + document.getElementById("ccOutbound").innerHTML;
                    document.getElementById("ccOutbound").innerHTML = newInput;
                }
            },
            contentType: "application/json",
            accept: "application/json",
            dataType: 'json',
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN_ID); }
        });
    },

    scanBachtInbound: function(batch_id) {
        alert("avvio scansione");
        var tagInput = new Array();
        tagInput = document.getElementsByClassName("inputBatchesPre");

        for (i = 0; i < tagInput.length; i++) {
            if (tagInput[i].value == batch_id) {
                $('#' + tagInput[i].id).attr('style', 'background-color:#DFF2BF !important; color: #4F8A10 !important');
                $('#' + tagInput[i].id).prop("disabled", false);
            }
        }
    },

    remove: function() {
        document.getElementById("cc").innerHTML = "";
        document.getElementById("ccOutbound").innerHTML = "";
    },

    dettagliBatch: function(batch_id, i) {
        $("#scanLocation").show();
        $("#location").hide();
        $.mobile.navigate('#inbound_batch');
        $("#Batch_ID").val(batch_id);
        $(".successBox").hide();
        $("#confirm").prop("disabled", true);
        app.color.imput = i;
    },

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

    get_outbound_prepare: function(order_id) {
        $.mobile.navigate('#prepare2');
        $("#order_ID").val(order_id);

    },

    Batch_outbound_dett: function(code) {
        $.mobile.navigate('#outbound_batch_dett');
        $(".successBox").hide();
        $(".errorBox").hide();

        //var serial = code;
        var serial = "G1";
        //var warehouseId = "AC532822-825E-400A-B747-1BB9355BDA67";
        var warehouseId = warehouseglobal_id;

        $.ajax({
            type: 'GET',
            url: 'http://petprojects.altervista.org/' + warehouseId + '/equipment_material/' + serial + '/',
            error: function(xhr) {
                $(".errorBox").hide();
                if (xhr.status == 404) {
                    newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>' + xhr.responseJSON.error + '</center></div>' + document.getElementById("box_out_det").innerHTML;
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
                    newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>The product is ' + response.status + '</center></div>' + document.getElementById("box_out_det").innerHTML;
                    document.getElementById("box_out_det").innerHTML = newDiv;
                }
            },
            contentType: "application/json",
            accept: "application/json",
            dataType: 'json',
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN_ID); }
        });
    },

    getBatch_outbound: function(batch_id, warehouseId, ordineId) {
        //var batch="C9ECDD8A-A410-4A67-906B-6CB02609317B";
        //var warehouseId="31814799-B4B5-4D67-B5F4-989245BD8DDD";
        //var ordineId="1463E3D5-5644-4AD6-99E7-37DDCABF6312";

        $.mobile.navigate('#outbound_send_2');
        $("#Batch_ID_out_send").val(batch_id);

        $.ajax({
            type: 'GET',
            url: 'http://petprojects.altervista.org/' + warehouseId + '/outbound/' + ordineId + '/batch/' + batch_id + '/',
            error: function(xhr) {
                $(".errorBox").hide();
                $(".successBox").hide();
                if (xhr.status == 404) {
                    newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>' + xhr.error + '</center></div>' + document.getElementById("box_send_2").innerHTML;
                    document.getElementById("box_send_2").innerHTML = newDiv;
                }
            },
            success: function(response) {
                $(".successBox").hide();
                $(".errorBox").hide();
                $("#confirm_send_2").prop("disabled", false);

            },
            contentType: "application/json",
            accept: "application/json",
            dataType: 'json',
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN_ID); }
        });
    },

    getLocation: function(location_id, warehouseId) {

        $(".errorBox").hide();
        $.ajax({
            type: 'GET',
            url: 'http://petprojects.altervista.org/' + warehouseId + '/location/' + location_id + '/',
            error: function(xhr) {
                if (xhr.status == 404) {
                    newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>' + xhr.responseJSON.error + '</center></div>' + document.getElementById("boxLocation").innerHTML;
                    document.getElementById("boxLocation").innerHTML = newDiv;
                }
            },
            success: function(response) {
                $("#scanLocation").hide();
                $(".successBox").hide();
                $(".errorBox").hide();
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

    confermaBatch: function() {

        var warehouseId = warehouseglobal_id;
        var order_id = "FAEF5AC0-8397-464C-A43E-42E2FC24B7B3";
        //var order_id=$("#Order_n").val;
        var batch_id = "429598AA-F615-4A6A-AA37-ECEECBC2736A";
        //var batch_id=$("#Batch_ID").val;
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
                newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>' + xhr.responseJSON.error + '</center></div>' + document.getElementById("btn_confirma").innerHTML;
                document.getElementById("btn_confirma").innerHTML = newDiv;
            },
            success: function(response) {
                newDiv = '<div class="successBox"><center><i class="fa fa-times-circle"></i> The batch has been confirmed </center></div>' + document.getElementById("btn_confirma").innerHTML;
                document.getElementById("btn_confirma").innerHTML = newDiv;

            },
            contentType: "application/json",
            accept: "application/json",
            dataType: 'json',
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN_ID); }
        });
    },
    confermaBatch_out_send_2: function(i) {

        //var warehouseId = "AC532822-825E-400A-B747-1BB9355BDA67";
        var warehouseId = warehouseglobal_id;
        var order_id = "FAEF5AC0-8397-464C-A43E-42E2FC24B7B3";
        //var order_id=$("#Order_n").val;
        var batch_id = "429598AA-F615-4A6A-AA37-ECEECBC2736A";
        //var batch_id=$("#Batch_ID_out_send").val;

        $.ajax({

            type: 'PUT',
            url: 'http://petprojects.altervista.org/' + warehouseId + '/outbound/' + order_id + '/batch/' + batch_id + '/departure/',

            data: JSON.stringify({
                //outboundEmployeeID: "ALB23JSHA",
                outboundEmployeeID: userblobal_id,
            }),
            error: function(xhr) {
                $(".errorBox").hide();
                $(".successBox").hide();
                newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>' + xhr.responseJSON.error + '</center></div>' + document.getElementById("box_send_2").innerHTML;
                document.getElementById("box_send_2").innerHTML = newDiv;
            },
            success: function(response) {
                $(".successBox").hide();
                newDiv = '<div class="successBox"><center><i class="fa fa-times-circle"></i> The batch has been confirmed </center></div>' + document.getElementById("box_send_2").innerHTML;
                document.getElementById("box_send_2").innerHTML = newDiv;
            },
            AcontentType: "application/json",
            accept: "application/json",
            dataType: 'json',
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN_ID); }
        });
    },

    addProductOutbound: function() {
        $(".successBox").hide();
        //var warehouseId = "AC532822-825E-400A-B747-1BB9355BDA67";
        var warehouseId = warehouseglobal_id;
        var order_id = "FAEF5AC0-8397-464C-A43E-42E2FC24B7B3";
        //var order_id=$("#Order_n").val;
        var batch_id = "429598AA-F615-4A6A-AA37-ECEECBC2736A";
        //var batch_id=$("#Batch_ID_out_send").val;

        $.ajax({

            type: 'POST',
            url: 'http://petprojects.altervista.org/' + warehouseId + '/outbound/' + order_id + '/batch/' + batch_id + '/details/',
            data: JSON.stringify({
                serialID: $("#Serial").val(),
                //inboundEmployeeID: userblobal_id,
            }),
            error: function(xhr) {
                $(".errorBox").hide();
                $(".successBox").hide();
                newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>' + xhr.responseJSON.error + '</center></div>' + document.getElementById("box_out_det").innerHTML;
                document.getElementById("box_out_det").innerHTML = newDiv;
            },
            success: function(response) {
                $(".successBox").hide();
                newDiv = '<div class="successBox"><center><i class="fa fa-times-circle"></i> The batch has been confirmed </center></div>' + document.getElementById("box_out_det").innerHTML;
                document.getElementById("box_out_det").innerHTML = newDiv;
                $("#end_batch").prop("disabled", false);
            },
            contentType: "application/json",
            accept: "application/json",
            dataType: 'json',
            beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + TOKEN_ID); }
        });
    },
    endBatch: function() {
        $(".successBox").hide();
        tagInput = document.getElementsByClassName("inputBatchesPre");
        newDiv = '<div class="successBox"><center><i class="fa fa-times-circle"></i> The batch has been terminated </center></div>' + document.getElementById("boxinf").innerHTML;
        document.getElementById("boxinf").innerHTML = newDiv;

        var order_id = $("#Order_ID_out").val();
        var Batch_ID_out = $("#Batch_ID_out").val();

        for (i = 0; i < tagInput.length; i++) {
            if (tagInput[i].value == Batch_ID_out) {
                $('#' + tagInput[i].id).prop("disabled", true);
            }
        }

        app.writeToNFC(order_id, Batch_ID_out);

    },
    writeToNFC: function(value1, value2) {
        alert("Nfc is write");
        var message = [ndef.textRecord(value1), ndef.textRecord(value2)];
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

    setToken: function(value) {
        TOKEN_ID = value;
    }

};