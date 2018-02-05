var app = {
    pages: {
        MAIN: "main_page",
        READ: "wh_page",
        WRITE: "ms_page",
        HOME: "home",
        EMPVER: "configure_bracelet_page",
        INBOUND: "inbound",
        INBOUND_ORDER: "inbound_order",
        INBOUND_BATCH:"inbound_batch",
        PREPARE2: "prepare2",
        OUTBOUND_BATCH:"outbound_batch",
        OUTBOUND_SEND: "outbound_send",
    },
    color:{
        imput:"",
    },
     batchglobal:new Array(),
     locationlobal_id:"",
     userblobal_id:"",
  

    initialize: function () {
        app.bindEvents();
    },

    /*
    bind any events that are required on startup to listeners:
     */
    bindEvents: function () {
        document.addEventListener('deviceready', app.onDeviceReady, false);
    },

    /*
    app runs when the device is ready for user interaction:
     */
    onDeviceReady: function () {
        nfc.addNdefListener(
            app.onNfc, // tag successfully scanned
            function (status) { // listener successfully initialized
            },
            function (error) { // listener fails to initialize
                app.display("NFC reader failed to initialize " + JSON.stringify(error), "init_nfc_negative_result");
            }
        );
    },

    oNothingOnNfc: function (nfcEvent) {
        //do nothing function used when an nfc event is fired and no code has to be executed
    },

    /*
    called when a device is close to a nfc tag
     */
    onNfc: function (nfcEvent) {
        var currentPage = $.mobile.activePage.attr('id');
       // app.onNfc = app.doNothingOnNfc;

        switch (currentPage) {
            case app.pages.HOME:
                var UserID= "pieroangela";
                userblobal_id=UserID;
                alert("NFC reading\n" +
                      "Result user_id: " + userblobal_id);
                var MyWhID="31814799-B4B5-4D67-B5F4-989245BD8DDD";
                //var tag = nfcEvent.tag;
                //var managerID = ndef.textHelper.decodePayload(tag.ndefMessage[0].payload);
                //var myWarehouseID = ndef.textHelper.decodePayload(tag.ndefMessage[1].payload);
                app.getUser(UserID, MyWhID);
                break;
            case app.pages.INBOUND:
                app.remove();
                var orderID="1463E3D5-5644-4AD6-99E7-37DDCABF6312";
                var warehouseId="03EC181C-C204-496E-B1E7-0F2B1E14040F";
                alert("NFC reading\n" +
                      "Result order_id: " + orderID);
                //var tag = nfcEvent.tag;
                //var managerID = ndef.textHelper.decodePayload(tag.ndefMessage[0].payload);
                //var myWarehouseID = ndef.textHelper.decodePayload(tag.ndefMessage[1].payload);
                app.getOrdine(orderID, warehouseId);
                break;
            case app.pages.INBOUND_ORDER:
                var batchID='AF72C51C-4327-45E5-9D9F-408AFA6C21E4';
                alert("NFC reading\n" +
                      "Result batch_id: " + batchID);
                //var tag = nfcEvent.tag;
                //var managerID = ndef.textHelper.decodePayload(tag.ndefMessage[0].payload);
                //var myWarehouseID = ndef.textHelper.decodePayload(tag.ndefMessage[1].payload);
                app.scanBachtInbound(batchID);
                break;
            case app.pages.INBOUND_BATCH:
                var location_id="B5C628EA-405D-48DE-90F6-4E78B0863E39";
                locationlobal_id=location_id;
                var warehouseId="31814799-B4B5-4D67-B5F4-989245BD8DDD";
                alert("NFC reading\n" +
                      "Result location_id: " + locationlobal_id);
                //var tag = nfcEvent.tag;
                //var managerID = ndef.textHelper.decodePayload(tag.ndefMessage[0].payload);
                //var myWarehouseID = ndef.textHelper.decodePayload(tag.ndefMessage[1].payload);
                app.getLocation(location_id, warehouseId);
                break;
            case app.pages.OUTBOUND_SEND:
                var batch_id="AF72C51C-4327-45E5-9D9F-408AFA6C21E4";
                var warehouseId="03EC181C-C204-496E-B1E7-0F2B1E14040F";
                alert("NFC reading\n" +
                      "Result batch_id: " + batch_id);
                //var tag = nfcEvent.tag;
                //var managerID = ndef.textHelper.decodePayload(tag.ndefMessage[0].payload);
                //var myWarehouseID = ndef.textHelper.decodePayload(tag.ndefMessage[1].payload);
                app.getBatch_outbound(batch_id, warehouseId);
                break;
        default:
            //doNothing();
        } 
        if (currentPage === app.pages.READ) {
            var tag = nfcEvent.tag;
            var stringPayload = ndef.textHelper.decodePayload(tag.ndefMessage[0].payload);
            app.display("You have read: " + stringPayload, "read_result");
            app.display("NFC read", "status_div");
        }
        else if (currentPage === app.pages.WRITE) {
            var message = ["erennio", "cretino"];

            var inputValue = $("#write_text_input").val();
            record = ndef.textRecord(inputValue);

            // put the record in the message array:
            message.push(record);
            app.display("NFC write", "status_div");

            // write the record to the tag:
            nfc.write(
                message, // write the record itself to the tag
                function () { // when complete, run app callback function:
                    app.display("Wrote '" + inputValue + "' to tag.", "write_result"); // write to the message div
                },
                // app function runs if the write command fails:
                function (reason) {
                    app.display("There was a problem " + reason, "write_result");
                }
            );
        }
    },

    display: function (message, messageDivId) {
        var messageDiv = document.getElementById(messageDivId);
        messageDiv.innerHTML = message;
    },

    displayClass: function (message, messageDivClass) {
        var messageDiv = document.getElementsByClassName(messageDivClass);
        messageDiv[0].innerHTML = message;
    },

    /*
    clears the message div:
     */
    clearAll: function () {
        var messageReadDiv = document.getElementById("read_result");
        var messageWriteDiv = document.getElementById("write_result");
        messageReadDiv.innerHTML = "";
        messageWriteDiv.innerHTML = "";
    },

    addUser: function () {

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
            success: function (response) {
                app.display(response.status, "responde_add_div");
            },
            contentType: "application/json",
            dataType: 'json'
        });
    },

    getUser: function (UserID, MyWhID) {
        //var UserID= "pieroangela"
        //var MyWhID="31814799-B4B5-4D67-B5F4-989245BD8DDD"
        $.ajax({
            type: 'GET',
            url: 'http://petprojects.altervista.org/' + MyWhID + '/employee/' + UserID + '/',
            error: function (xhr, data){
                $(".errorBox").hide();
                if(xhr.status==404) {
                    newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i> The user is not in the database </center></div>' + document.getElementById("homeLoginContent").innerHTML;
                    document.getElementById("homeLoginContent").innerHTML = newDiv;
                }
            },
            success: function (response) {
                var currentPage = $.mobile.activePage.attr('id');
                var span= new Array();
                var span = document.getElementsByClassName("helloMr");
               
                for(i=0;i<span.length;i++){
                    span[i].innerHTML='Hello, '+response.name;
                }
                span.innerHTML='Hello, '+response.name;
                switch (currentPage) {
                    case app.pages.HOME:
                       
                         $.mobile.navigate('#menufunction');
                        switch('2'){
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
            accept: "application/json",
            dataType: 'json'
        });
    },
    
   barcodeScan: function() {

        cordova.plugins.barcodeScanner.scan(
            function (result) {
    
                alert("We got a barcode\n" +
                      "Result: " + result.text + "\n" +
                      "Format: " + result.format + "\n" +
                      "Cancelled: " + result.cancelled);

                var currentPage = $.mobile.activePage.attr('id');
                switch (currentPage) {
                    case app.pages.OUTBOUND_BATCH:
                        app.Batch_outbound_dett();
                        break;
                }   
            },
            function (error) {
                alert("Scanning failed: " + error);
            },
            {
                preferFrontCamera : false, // iOS and Android
                showFlipCameraButton : true, // iOS and Android
                showTorchButton : true, // iOS and Android
                torchOn: true, // Android, launch with the torch switched on (if available)
                saveHistory: true, // Android, save scan history (default false)
                prompt : "Place a barcode inside the scan area", // Android
                resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                //formats : "QR_CODE ,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                formats : "EAN_8, EAN_13, QR_CODE, PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                 
                orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
                disableAnimations : true, // iOS
                disableSuccessBeep: false // iOS and Android
            }
         );

    },
  
    prova2:function() {
        cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com", function(success) {
                    alert("encode success: " + success);
                    
                }, function(fail) {
                    alert("encoding failed: " + fail);
                }
                );
     }, 


    getOrdine: function (orderID, warehouseId) { 
         //alert("sono in ordine");
        $.mobile.navigate('#inbound_order'); 
        var orderID="1463E3D5-5644-4AD6-99E7-37DDCABF6312";
        var warehouseId="03EC181C-C204-496E-B1E7-0F2B1E14040F";
        
        $.ajax({
            type: 'GET',
            url: 'http://petprojects.altervista.org/' + warehouseId + '/inbound/' + orderID+ '/batch/list/',
            error: function (xhr, data){
                // alert("sono in error")
            $(".errorBox").hide();
            if(xhr.status==404) {
                newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i>The batch is not in the database </center></div>' + document.getElementById("cc").innerHTML;
                document.getElementById("cc").innerHTML = newDiv;
            }
        },
            success: function (response) {
                var currentPage = $.mobile.activePage.attr('id');
                switch (currentPage) {
                    case app.pages.INBOUND_ORDER:
                        //alert("sono nel caso 1");
                        $("#Order_n").val(orderID);
                        var batch = new Array();
                        batch=response;
                        batchglobal=batch;
        
                        for(i=0;i<batch.length;i++){
                            newInput='<input type="text" onclick="app.dettagliBatch(\''+batch[i].batch.ID+'\',\''+i+'\');" name="batch"  class="inputBatchesPre" id="'+i+'" readonly value='+batch[i].batch.ID+' disabled>' + document.getElementById("cc").innerHTML;
                            document.getElementById("cc").innerHTML= newInput; 
                        } 
                        break;
                    case app.pages.PREPARE2:
                        app.remove();
                        $("#Order_ID_out").val(orderID);
                        var batch = new Array();
                        batch=response;
                        $.mobile.navigate('#outbound_order'); 

                        for(i=0;i<batch.length;i++){
                            newInput='<input type="text" onclick="app.Batch_outbound(\''+batch[i].batch.ID+'\',\''+i+'\');" name="batch"  class="inputBatchesPre" id="'+i+'" readonly value='+batch[i].batch.ID+'" >' + document.getElementById("ccOutbound").innerHTML;
                            document.getElementById("ccOutbound").innerHTML= newInput; 
                        } 
                        break;
                }
            },
            accept: "application/json",
            dataType: 'json'
    });
},

    getOrdineOutbound: function () { 
        var orderID="1463E3D5-5644-4AD6-99E7-37DDCABF6312";
        var warehouseId="31814799-B4B5-4D67-B5F4-989245BD8DDD";
        $.mobile.navigate('#outbound_order');
        
        $.ajax({
            type: 'GET',
            url: 'http://petprojects.altervista.org/' + warehouseId + '/outbound/' + orderID+ '/batch/list/',
            error: function (xhr){
            // alert("sono in error")
                $(".errorBox").hide();
                if(xhr.status==404) {
                    newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i> The batch is not in the database </center></div>' + document.getElementById("ccOutbound").innerHTML;
                    document.getElementById("ccOutbound").innerHTML = newDiv;
                }
            },
            success: function (response) {
            
                app.remove();
                $("#Order_ID_out").val(orderID);
                var batch = new Array();
                batch=response;
                for(i=0;i<batch.length;i++){
                    newInput='<input type="text" class="inputBatchesPre" onclick="app.Batch_outbound(\''+batch[i].batch.ID+'\',\''+i+'\')" name="batch"  id="'+i+'" readonly value='+batch[i].batch.ID+'>'+ document.getElementById("ccOutbound").innerHTML;
                    document.getElementById("ccOutbound").innerHTML= newInput; 
                } 
            },
            accept: "application/json",
            dataType: 'json'
        });
    },

    scanBachtInbound: function(batch_id){
        alert("avvio scansione");
        var tagInput = new Array();
        //var batch_id='AF72C51C-4327-45E5-9D9F-408AFA6C21E4';
        tagInput=document.getElementsByClassName("inputBatchesPre");

        for(i=0;i<tagInput.length;i++){
            if( tagInput[i].value==batch_id){
               $('#'+tagInput[i].id).attr('style', 'background-color:#DFF2BF !important; color: #4F8A10 !important');
               $('#'+tagInput[i].id).prop("disabled",false);
           }  
        }
    },

    remove:function(){
        document.getElementById("cc").innerHTML="";
        document.getElementById("ccOutbound").innerHTML="";
    },

    dettagliBatch:function(batch_id,i){
        $("#scanLocation").show();
        $("#location").hide();
        $.mobile.navigate('#inbound_batch');  
        $("#Batch_ID").val(batch_id);
        $(".successBox").hide();
        $("#confirm").prop("disabled",true);
        app.color.imput=i;  
    },

    Batch_outbound:function(batch_id,i){
        $("#scanLocation").show();
        $("#location").hide();
        $.mobile.navigate('#outbound_batch');  
        $("#Batch_ID_out").val(batch_id);
        $(".successBox").hide();
        $("#confirm").prop("disabled",true);
        $("#Batch_ID_out_det").val(batch_id);
        app.color.imput=i;  
    },

    Batch_outbound_dett:function(){
        $.mobile.navigate('#outbound_batch_dett');  
        $(".successBox").hide();
        $(".errorBox").hide();
    
        var serial="sadbasmbvndbsad";
        var warehouseId="03EC181C-C204-496E-B1E7-0F2B1E14040F";
        
        $.ajax({
            type: 'GET',
            url: 'http://petprojects.altervista.org/'+warehouseId+'/equipment_material/'+ serial+'/',
            error: function (xhr){
                $(".errorBox").hide();
                if(xhr.status==404) {
                    newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i> The serial is not in the database </center></div>' + document.getElementById("box_out_det").innerHTML;
                    document.getElementById("box_out_det").innerHTML = newDiv;
                }
            },
            success: function (response) {
                $(".errorBox").hide();
                if(response.status!='Ordered'){ //then status=='available'
                    $(".errorBox").hide();
                    $("#Serial").val(serial);
                    $("#Product_ID_out_det").val(response.product.ID);
                    $("#Location_ID_out_det").val(response.location.ID);
                    $("#added").prop("disabled",false);
                }
                else{
                    $("#Serial").val(serial);
                    $("#Product_ID_out_det").val(response.product.ID);
                    $("#Location_ID_out_det").val(response.location.ID);
                    newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i> The product is not available but has already been ordered  </center></div>' + document.getElementById("box_out_det").innerHTML;
                    document.getElementById("box_out_det").innerHTML = newDiv;   
                }           
            },
            accept: "application/json",
            dataType: 'json'
        });
    },

    getBatch_outbound:function(batch_id, warehouseId){
        //var batch="AF72C51C-4327-45E5-9D9F-408AFA6C21E4";
        //var warehouseId="03EC181C-C204-496E-B1E7-0F2B1E14040F";
        $.mobile.navigate('#outbound_send_2');  
        $("#Batch_ID_out_send").val(batch_id);  
    
        $.ajax({
            type: 'GET',
            url: 'http://petprojects.altervista.org/' + warehouseId + '/equipment_material/' + batch_id+ '/',
            error: function (xhr){
                $(".errorBox").hide();
                $(".successBox").hide();
                if(xhr.status==404) {
                    newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i> The batch is not in the database </center></div>' + document.getElementById("box_send_2").innerHTML;
                    document.getElementById("box_send_2").innerHTML = newDiv;
                }
            },
            success: function (response) {
                $(".successBox").hide();
                $(".errorBox").hide();
                $("#confirm_send_2").prop("disabled",false);
                      
            },
            accept: "application/json",
            
            dataType: 'json'
        });
    },

    getLocation:function( location_id, warehouseId){
        //var location_id="B5C628EA-405D-48DE-90F6-4E78B0863E39";
        //var warehouseId="31814799-B4B5-4D67-B5F4-989245BD8DDD";
        $.ajax({
            type: 'GET',
            url: 'http://petprojects.altervista.org/' + warehouseId + '/location/' + location_id+ '/',
            error: function (xhr){
                $(".errorBox").hide();
                $(".successBox").hide();
                if(xhr.status==404) {
                    alert("error")
                    newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i> Location is not in the database </center></div>' + document.getElementById("box_send_2").innerHTML;
                    document.getElementById("box_send_2").innerHTML = newDiv;
                }
            },
            success: function (response) {
                $("#scanLocation").hide();
                $(".successBox").hide();
                $(".errorBox").hide();
                $("#Location_ID").val(response.name);
                $("#location").show();
                $("#confirm").prop("disabled",false);
                      
            },
            accept: "application/json",
            dataType: 'json'
        });
    },

    confermaBatch:function(){
        var warehouseId="11BF7528-53F4-4031-896B-EA0E33C4D22B";
        var order_id="DCCC3756-AB85-4326-80AD-3B80A2A76975";
        //var order_id=$("#Order_n").val;
        var batch_id="496070A5-D3EB-4BAD-92CD-2B18BF3DF1AD";
        //var batch_id=$("#Batch_ID").val;


        $.ajax({
           
            type: 'PUT',
            url: 'http://petprojects.altervista.org/'+ warehouseId +'/inbound/'+ order_id+'/batch/'+ batch_id+'/arrived/',
           
            data: JSON.stringify({
                inboundEmployeeID:"abracadabra",
                //inboundEmployeeID: userblobal_id,
                locationID: locationlobal_id,
            }),
            error: function (xhr){
               alert("error");
               $(".errorBox").hide();
               $(".successBox").hide();  
               newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i> The user_id or location_id are not valid </center></div>' + document.getElementById("btn_confirma").innerHTML;
               document.getElementById("btn_confirma").innerHTML = newDiv;      
            },
            success: function (response) {
                alert("sono in succes")
                $(".successBox").hide();
                newDiv = '<div class="successBox"><center><i class="fa fa-times-circle"></i> The batch has been confirmed </center></div>' + document.getElementById("btn_confirma").innerHTML;
                document.getElementById("btn_confirma").innerHTML = newDiv;         
            },
           Accept: "application/json",
           contentType: "application/json",
           dataType: 'json'
        });
    },
    confermaBatch_out_send_2:function(i){
    
        var warehouseId="31814799-B4B5-4D67-B5F4-989245BD8DDD";
        var order_id="DCCC3756-AB85-4326-80AD-3B80A2A76975";
        //var order_id=$("#Order_n").val;
        var batch_id="496070A5-D3EB-4BAD-92CD-2B18BF3DF1AD";
        //var batch_id=$("#Batch_ID_out_send").val;
        $.ajax({
           
            type: 'PUT',
            url: 'http://petprojects.altervista.org/'+ warehouseId +'/outbound/'+ order_id+'/batch/'+ batch_id+'/departure/',
            data: JSON.stringify({
                outboundEmployeeID: "albertoangela", 
                //inboundEmployeeID: userblobal_id,
            }),
            error: function (xhr){
               alert("error");
               $(".errorBox").hide();
               $(".successBox").hide();  
               newDiv = '<div class="errorBox"><center><i class="fa fa-times-circle"></i> The batch is not in the database </center></div>' + document.getElementById("box_send_2").innerHTML;
               document.getElementById("box_send_2").innerHTML = newDiv;      
            },
            success: function (response) {
                alert("sono in succes")
                $(".successBox").hide();
                newDiv = '<div class="successBox"><center><i class="fa fa-times-circle"></i> The batch has been confirmed </center></div>' + document.getElementById("box_send_2").innerHTML;
                document.getElementById("box_send_2").innerHTML = newDiv;      
            },
           Accept: "application/json",
           contentType: "application/json",
           dataType: 'json'
        });
    },


    addProductOutbound:function(){
        $(".successBox").hide();
        newDiv = '<div class="successBox"><center><i class="fa fa-times-circle"></i> The product has been added </center></div>' + document.getElementById("box_out_det").innerHTML;
        document.getElementById("box_out_det").innerHTML = newDiv;
    }

        /*Inbound
        {warehouseID}/inbound/{orderID}/batch/{batchID}/arrived/
        http://petprojects.altervista.org/11BF7528-53F4-4031-896B-EA0E33C4D22B/inbound/DCCC3756-AB85-4326-80AD-3B80A2A76975/batch/496070A5-D3EB-4BAD-92CD-2B18BF3DF1AD/arrived/

        nell'header devi mettere Accept application/json e Content-Type application/json

        la richiesta è di tipo PUT

        esempio di body:
        {
        "inboundEmployeeID": "abracadabra",
        "locationID": "8c31715f-7655-479a-957d-92e0fdcf530f" 
        }

        OUTBOUND:
        {warehouseID}/outbound/{orderID}/batch/{batchID}/departure/

        es: http://petprojects.altervista.org/31814799-B4B5-4D67-B5F4-989245BD8DDD/outbound/DCCC3756-AB85-4326-80AD-3B80A2A76975/batch/496070A5-D3EB-4BAD-92CD-2B18BF3DF1AD/departure/

        tag nell'head come quelli di ogni richiesta

        tipo di richiesta: PUT

        es di body:
        {
        "outboundEmployeeID": "albertoangela" 
        }*/



};