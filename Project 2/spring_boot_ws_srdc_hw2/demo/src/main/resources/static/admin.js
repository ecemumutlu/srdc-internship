function soapRequestLogin(){
    var str ='<?xml version="1.0" encoding="UTF-8"?>\n'+
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spr="http://spring_boot_ws_srdc_hw2">\n' +
        '   <soapenv:Header/>\n' +
        '   <soapenv:Body>\n' +
        '      <spr:getLoginRequest>\n' +
        '         <spr:identifyingKey>'+ "User" +'</spr:identifyingKey>\n' +
        '         <spr:username>'+ sessionStorage.getItem("username") + '</spr:username>\n' +
        '         <spr:password>'+ sessionStorage.getItem("password") +'</spr:password>\n' +
        '      </spr:getLoginRequest>\n' +
        '   </soapenv:Body>\n' +
        '</soapenv:Envelope>';



    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://localhost:8080/ws");
    xhr.responseType = 'document';

    // Force the response to be parsed as XML
    xhr.overrideMimeType('text/xml');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseXML);
            if(xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","systemMessage")[0].childNodes[0].nodeValue === "User already logged in."){
                document.getElementById("hiddenVal").innerText =  "User already logged in.";
            }
            else if(xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","systemMessage")[0].childNodes[0].nodeValue === "User is logged out."){
                document.getElementById("hiddenVal").innerText =  "User is logged out.";
                soapRequestLogout();
            }
        }
    }
    xhr.setRequestHeader('Content-Type','text/xml');
    xhr.send(str);
}

function cancelUpdate(){
    document.getElementById("updateUserPage").style = 'display: none';
}

function cancelUpdateMsg(){
    document.getElementById("updateMessagePage").style = 'display: none';

}

function cancelCreateUser(){
    document.getElementById("createUserPage").style = 'display: none';

}
function cancelReadMsg(){
    document.getElementById("readMessagePage").style = 'display: none';

}

function cancelDeleteUser(){
    document.getElementById("deleteUserPage").style = 'display: none';

}

function cancelSendMsg(){
    document.getElementById("sendMessagePage").style = 'display: none';

}

function soapRequestSeeOwnInfo(){
    soapRequestLogin();
    if(sessionStorage.length === 0){
        document.getElementById("allInfo").innerHTML = "User not logged in or does not exist."
    }
    else{
        var username = sessionStorage.getItem("username");
        var password = sessionStorage.getItem("password");
        console.log(username);
        console.log(password);

        var str = '<?xml version="1.0" encoding="UTF-8"?>\n'+
            '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spr="http://spring_boot_ws_srdc_hw2">\n' +
            '<soapenv:Header/>\n' +
            '<soapenv:Body>\n' +
            '<spr:getUserInfoRequest>\n' +
            '<spr:username>' + username +'</spr:username>\n' +
            '</spr:getUserInfoRequest>\n' +
            '</soapenv:Body>\n' +
            '</soapenv:Envelope>'


        var xhr = new XMLHttpRequest();
        xhr.open("POST","http://localhost:8080/ws");

        xhr.responseType = 'document';
        xhr.overrideMimeType('text/xml');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.responseXML);
                document.getElementById("allInfo").innerHTML = "USER ID: " + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","userId")[0].childNodes[0].nodeValue + "<br>"
                    + "USERNAME: " + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","username")[0].childNodes[0].nodeValue + "<br>"
                    + "PASSWORD: " +xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","password")[0].childNodes[0].nodeValue + "<br>"
                    + "NAME: " +xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","name")[0].childNodes[0].nodeValue + "<br>"
                    + "SURNAME: " +xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","surname")[0].childNodes[0].nodeValue + "<br>"
                    + "BIRTHDATE: "+xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","birthdate")[0].childNodes[0].nodeValue + "<br>"
                    + "GENDER: " + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","gender")[0].childNodes[0].nodeValue + "<br>"
                    + "EMAIL: " + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","email")[0].childNodes[0].nodeValue + "<br>";
            }
        }

        xhr.setRequestHeader('Content-Type','text/xml');
        xhr.send(str);
    }


}

function soapRequestLogout(){
    if(sessionStorage.getItem("username") === null){
        document.getElementById("allInfo").innerHTML = "User does not exist or logged out."
        location.href = 'http://localhost:8080/Client.html';
        sessionStorage.clear();
    }
    else{
        var username = sessionStorage.getItem("username");
        var password = sessionStorage.getItem("password");
        console.log(username);
        console.log(password);

        var str = '<?xml version="1.0" encoding="UTF-8"?>\n'+ '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spr="http://spring_boot_ws_srdc_hw2">\n' +
            '   <soapenv:Header/>\n' +
            '   <soapenv:Body>\n' +
            '      <spr:getLogoutRequest>\n' +
            '         <spr:username>'+ sessionStorage.getItem("username")+'</spr:username>\n' +
            '      </spr:getLogoutRequest>\n' +
            '   </soapenv:Body>\n' +
            '</soapenv:Envelope>';



        var xhr = new XMLHttpRequest();
        xhr.open("POST","http://localhost:8080/ws");

        xhr.responseType = 'document';
        xhr.overrideMimeType('text/xml');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.responseXML);
                document.getElementById("allInfo").innerHTML = "USER ID: " + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","userId")[0].childNodes[0].nodeValue + "<br>"
                    + "USERNAME: " + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","username")[0].childNodes[0].nodeValue + "<br>"
                    + "PASSWORD: " +xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","password")[0].childNodes[0].nodeValue + "<br>"
                    + "NAME: " +xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","name")[0].childNodes[0].nodeValue + "<br>"
                    + "SURNAME: " +xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","surname")[0].childNodes[0].nodeValue + "<br>"
                    + "BIRTHDATE: "+xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","birthdate")[0].childNodes[0].nodeValue + "<br>"
                    + "GENDER: " + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","gender")[0].childNodes[0].nodeValue + "<br>"
                    + "EMAIL: " + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","email")[0].childNodes[0].nodeValue + "<br>";
            }
        }

        xhr.setRequestHeader('Content-Type','text/xml');
        xhr.send(str);
    }


    if(sessionStorage.getItem("username") === null){
        document.getElementById("allInfo").innerHTML = "User does not exist or logged out."
        location.href = 'http://localhost:8080/Client.html';
        sessionStorage.clear();
    }else{
        location.href = 'http://localhost:8080/Client.html';
        sessionStorage.clear();
    }

}

function CreateUserButton(){
    document.getElementById("createUserPage").style = 'display: inline';
}

function soapRequestCreateUser(){
    soapRequestLogin();

    var str = '<?xml version="1.0" encoding="UTF-8"?>\n'+
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spr="http://spring_boot_ws_srdc_hw2">\n' +
        '<soapenv:Header/>\n' +
        '<soapenv:Body>\n' +
        '<spr:getCreateUserRequest>\n' +
        '<spr:userType>' + document.getElementById('userType').value +'</spr:userType>\n' +
        '<spr:username>' + getUsername() +'</spr:username>\n' +
        '<spr:password>' + getPassword() +'</spr:password>\n' +
        '<spr:name>' + getName() +'</spr:name>\n' +
        '<spr:surname>' + getSurname() +'</spr:surname>\n' +
        '<spr:birthdate>' + getBirthdate() +'</spr:birthdate>\n' +
        '<spr:gender>' + document.getElementById('gender').value +'</spr:gender>\n' +
        '<spr:email>' + getEmail() +'</spr:email>\n' +
        '</spr:getCreateUserRequest>\n' +
        '</soapenv:Body>\n' +
        '</soapenv:Envelope>'

    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://localhost:8080/ws");
    xhr.responseType = 'document';

    // Force the response to be parsed as XML
    xhr.overrideMimeType('text/xml');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseXML);
            var resp;
            resp = xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","systemMessage")[0].childNodes[0].nodeValue;
            document.getElementById("allInfo").innerText = resp;

        }
    }

    xhr.setRequestHeader('Content-Type','text/xml');
    xhr.send(str);
    document.getElementById("createUserPage").style = 'display: none';

}

function deleteUserButton(){
    document.getElementById("deleteUserPage").style = 'display: inline';

}

function soapRequestDeleteUser(){
    soapRequestLogin();

    var str = '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spr="http://spring_boot_ws_srdc_hw2">\n' +
        '   <soapenv:Header/>\n' +
        '   <soapenv:Body>\n' +
        '      <spr:getDeleteUserRequest>\n' +
        '         <spr:userId>'+ document.getElementById('userId').value +'</spr:userId>\n' +
        '      </spr:getDeleteUserRequest>\n' +
        '   </soapenv:Body>\n' +
        '</soapenv:Envelope>'

    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://localhost:8080/ws");
    xhr.responseType = 'document';

    // Force the response to be parsed as XML
    xhr.overrideMimeType('text/xml');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseXML);
            var resp;
            resp = xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","systemMessage")[0].childNodes[0].nodeValue;
            document.getElementById("allInfo").innerText = resp;

        }
    }

    xhr.setRequestHeader('Content-Type','text/xml');
    xhr.send(str);
    document.getElementById("deleteUserPage").style = 'display: none';

}

function updateUserButton(){
    soapRequestLogin();

    document.getElementById("updateUserPage").style = 'display: inline';

}

function soapRequestUpdateUser(){
    var str = '<?xml version="1.0" encoding="UTF-8"?>\n'+ '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spr="http://spring_boot_ws_srdc_hw2">\n' +
        '   <soapenv:Header/>\n' +
        '   <soapenv:Body>\n' +
        '      <spr:getUpdateUserRequest>\n' +
        '         <spr:username>'+ document.getElementById('usernameUpdate').value +'</spr:username>\n' +
        '         <spr:what>'+ document.getElementById('featureUpdate').value +'</spr:what>\n' +
        '         <spr:new_info>'+ document.getElementById('new_info').value +'</spr:new_info>\n' +
        '      </spr:getUpdateUserRequest>\n' +
        '   </soapenv:Body>\n' +
        '</soapenv:Envelope>';

    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://localhost:8080/ws");
    xhr.responseType = 'document';

    // Force the response to be parsed as XML
    xhr.overrideMimeType('text/xml');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseXML);
            var resp;
            resp = xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","systemMessage")[0].childNodes[0].nodeValue;
            document.getElementById("allInfo").innerText = resp;

        }
    }

    xhr.setRequestHeader('Content-Type','text/xml');
    xhr.send(str);
    document.getElementById("updateUserPage").style = 'display: none';
}

function sendMessageButton(){
    soapRequestLogin();

    document.getElementById("sendMessagePage").style = 'display: inline';
}
function soapRequestSendMessage(){
    var str = '<?xml version="1.0" encoding="UTF-8"?>\n'+
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spr="http://spring_boot_ws_srdc_hw2">\n' +
        '   <soapenv:Header/>\n' +
        '   <soapenv:Body>\n' +
        '      <spr:getSendMessageRequest>\n' +
        '         <spr:sender>'+ sessionStorage.getItem("username") +'</spr:sender>\n' +
        '         <spr:receiver>'+ document.getElementById('receiverSendMsg').value +'</spr:receiver>\n' +
        '         <spr:subject>'+ document.getElementById('subjectSendMsg').value +'</spr:subject>\n' +
        '         <spr:message>'+ document.getElementById('messageSendMsg').value +'</spr:message>\n' +
        '      </spr:getSendMessageRequest>\n' +
        '   </soapenv:Body>\n' +
        '</soapenv:Envelope>';


    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://localhost:8080/ws");
    xhr.responseType = 'document';

    // Force the response to be parsed as XML
    xhr.overrideMimeType('text/xml');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseXML);
            var resp;
            resp = xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","systemMessage")[0].childNodes[0].nodeValue;
            document.getElementById("allInfo").innerText = resp;
        }
    }

    xhr.setRequestHeader('Content-Type','text/xml');
    xhr.send(str);
    document.getElementById("sendMessagePage").style = 'display: none';
}

function readMessageButton(){
    soapRequestLogin();

    document.getElementById("readMessagePage").style = 'display: inline';
}

function soapRequestReadMessage(){
    var str = '<?xml version="1.0" encoding="UTF-8"?>\n'+
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spr="http://spring_boot_ws_srdc_hw2">\n' +
        '   <soapenv:Header/>\n' +
        '   <soapenv:Body>\n' +
        '      <spr:getReadMessageRequest>\n' +
        '         <spr:messageId>'+ document.getElementById('messageIDReadMsg').value +'</spr:messageId>\n' +
        '         <spr:username>'+ sessionStorage.getItem("username") +'</spr:username>\n' +
        '      </spr:getReadMessageRequest>\n' +
        '   </soapenv:Body>\n' +
        '</soapenv:Envelope>'



    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://localhost:8080/ws");
    xhr.responseType = 'document';

    // Force the response to be parsed as XML
    xhr.overrideMimeType('text/xml');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseXML);
            var resp;
            resp = "MESSAGE ID: " + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","messageId")[0].childNodes[0].nodeValue + "<br>"
                + "SENDER: " +xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","sender")[0].childNodes[0].nodeValue + "<br>"
                + "RECEIVER: " +xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","receiver")[0].childNodes[0].nodeValue + "<br>"
                + "SUBJECT: " +xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","subject")[0].childNodes[0].nodeValue + "<br>"
                + "DATE: " +xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","date")[0].childNodes[0].nodeValue + "<br>"
                + "MESSAGE: " +xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","messageContent")[0].childNodes[0].nodeValue + "<br>";
            document.getElementById("allInfo").innerHTML = resp;

        }
    }

    xhr.setRequestHeader('Content-Type','text/xml');
    xhr.send(str);
    document.getElementById("readMessagePage").style = 'display: none';
}

function updateMessageButton(){
    soapRequestLogin();

    document.getElementById("updateMessagePage").style = 'display: inline';

}
function soapRequestUpdateMessage(){
    var str = '<?xml version="1.0" encoding="UTF-8"?>\n'+
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spr="http://spring_boot_ws_srdc_hw2">\n' +
        '   <soapenv:Header/>\n' +
        '   <soapenv:Body>\n' +
        '      <spr:getUpdateMessageRequest>\n' +
        '         <spr:messageId>'+ document.getElementById('msgIdUpdateMsg').value +'</spr:messageId>\n' +
        '         <spr:messageContent>'+ document.getElementById('msgContentUpdateMsg').value +'</spr:messageContent>\n' +
        '      </spr:getUpdateMessageRequest>\n' +
        '   </soapenv:Body>\n' +
        '</soapenv:Envelope>';


    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://localhost:8080/ws");
    xhr.responseType = 'document';

    // Force the response to be parsed as XML
    xhr.overrideMimeType('text/xml');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseXML);
            var resp;
            resp = xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","systemMessage")[0].childNodes[0].nodeValue;
            document.getElementById("allInfo").innerText = resp;
        }
    }

    xhr.setRequestHeader('Content-Type','text/xml');
    xhr.send(str);
    document.getElementById("updateMessagePage").style = 'display: none';
}


function soapRequestSeeAllUsers(){
    soapRequestLogin();

    var str = '<?xml version="1.0" encoding="UTF-8"?>\n'+
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spr="http://spring_boot_ws_srdc_hw2">\n' +
        '   <soapenv:Header/>\n' +
        '   <soapenv:Body>\n' +
        '      <spr:getSeeAllUsersRequest/>\n' +
        '   </soapenv:Body>\n' +
        '</soapenv:Envelope>';

    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://localhost:8080/ws");
    xhr.responseType = 'document';

    // Force the response to be parsed as XML
    xhr.overrideMimeType('text/xml');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseXML);
            var resp = "";
            var size = xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","userList").length;
            for(var i=0;i<size;i++){
                resp = resp + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","userId")[i].childNodes[0].nodeValue + "     "
                    + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","userType")[i].childNodes[0].nodeValue + "     "
                    + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","username")[i].childNodes[0].nodeValue + "     "
                    + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","password")[i].childNodes[0].nodeValue + "     "
                    + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","name")[i].childNodes[0].nodeValue + "     "
                    + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","surname")[i].childNodes[0].nodeValue + "     "
                    + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","birthdate")[i].childNodes[0].nodeValue + "     "
                    + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","gender")[i].childNodes[0].nodeValue + "     "
                    + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","email")[i].childNodes[0].nodeValue + "<br>"
            }
            document.getElementById("allInfo").innerHTML = resp;
        }
    }

    xhr.setRequestHeader('Content-Type','text/xml');
    xhr.send(str);
}

function soapRequestSeeAllInbox(){
    soapRequestLogin();

    var str = '<?xml version="1.0" encoding="UTF-8"?>\n'+
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spr="http://spring_boot_ws_srdc_hw2">\n' +
        '   <soapenv:Header/>\n' +
        '   <soapenv:Body>\n' +
        '      <spr:getSeeAllInboxRequest/>\n' +
        '   </soapenv:Body>\n' +
        '</soapenv:Envelope>';


    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://localhost:8080/ws");
    xhr.responseType = 'document';

    // Force the response to be parsed as XML
    xhr.overrideMimeType('text/xml');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseXML);
            var resp = xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","inboxSize")[0].childNodes[0].nodeValue + "<br>";
            var size = xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","messageList").length;
            for(var i=0;i<size;i++){
                resp = resp + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","messageId")[i].childNodes[0].nodeValue + "     "
                    + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","sender")[i].childNodes[0].nodeValue + "     "
                    + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","receiver")[i].childNodes[0].nodeValue + "     "
                    + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","subject")[i].childNodes[0].nodeValue + "     "
                    + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","date")[i].childNodes[0].nodeValue + "<br>";
            }
            document.getElementById("allInfo").innerHTML = resp;
        }
    }

    xhr.setRequestHeader('Content-Type','text/xml');
    xhr.send(str);
}


function soapRequestInbox(){
    soapRequestLogin();

    var str = '<?xml version="1.0" encoding="UTF-8"?>\n'+
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spr="http://spring_boot_ws_srdc_hw2">\n' +
        '   <soapenv:Header/>\n' +
        '   <soapenv:Body>\n' +
        '      <spr:getInboxRequest>\n' +
        '         <spr:username>' + sessionStorage.getItem("username") +'</spr:username>\n' +
        '      </spr:getInboxRequest>\n' +
        '   </soapenv:Body>\n' +
        '</soapenv:Envelope>';


    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://localhost:8080/ws");
    xhr.responseType = 'document';

    // Force the response to be parsed as XML
    xhr.overrideMimeType('text/xml');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseXML);
            var resp = xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","inboxSize")[0].childNodes[0].nodeValue + "<br>";
            var size = xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","messageList").length;
            for(var i=0;i<size;i++){
                resp = resp + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","messageId")[i].childNodes[0].nodeValue + "     "
                    + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","sender")[i].childNodes[0].nodeValue + "     "
                    + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","receiver")[i].childNodes[0].nodeValue + "     "
                    + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","subject")[i].childNodes[0].nodeValue + "     "
                    + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","date")[i].childNodes[0].nodeValue + "<br>";
            }
            document.getElementById("allInfo").innerHTML = resp;
        }
    }

    xhr.setRequestHeader('Content-Type','text/xml');
    xhr.send(str);
}

function soapRequestOutbox(){
    soapRequestLogin();

    var str = '<?xml version="1.0" encoding="UTF-8"?>\n'+
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spr="http://spring_boot_ws_srdc_hw2">\n' +
        '   <soapenv:Header/>\n' +
        '   <soapenv:Body>\n' +
        '      <spr:getOutboxRequest>\n' +
        '         <spr:username>' + sessionStorage.getItem("username") +'</spr:username>\n' +
        '      </spr:getOutboxRequest>\n' +
        '   </soapenv:Body>\n' +
        '</soapenv:Envelope>';


    var xhr = new XMLHttpRequest();
    xhr.open("POST","http://localhost:8080/ws");
    xhr.responseType = 'document';

    // Force the response to be parsed as XML
    xhr.overrideMimeType('text/xml');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseXML);
            var resp = xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","outboxSize")[0].childNodes[0].nodeValue + "<br>";
            var size = xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","messageList").length;
            for(var i=0;i<size;i++){
                resp = resp + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","messageId")[i].childNodes[0].nodeValue + "     "
                    + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","sender")[i].childNodes[0].nodeValue + "     "
                    + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","receiver")[i].childNodes[0].nodeValue + "     "
                    + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","subject")[i].childNodes[0].nodeValue + "     "
                    + xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","date")[i].childNodes[0].nodeValue + "<br>";
            }
            document.getElementById("allInfo").innerHTML = resp;
        }
    }

    xhr.setRequestHeader('Content-Type','text/xml');
    xhr.send(str);
}



function getUserType(){
    return document.getElementById('userType').value;
}
function getUsername(){
    return document.getElementById('username').value;
}
function getPassword(){
    return document.getElementById('password').value;
}
function getName(){
    return document.getElementById('name').value;
}
function getSurname(){
    return document.getElementById('surname').value;
}
function getBirthdate(){
    return document.getElementById('birthdate').value;
}
function getGender(){
    return document.getElementById('gender').value;
}
function getEmail(){
    return document.getElementById('email').value;
}