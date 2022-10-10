
function getUsername(){
    return document.getElementById('username').value;
}

function getPassword(){
    return document.getElementById('password').value;
}

function soapRequestLogin(username,password){
    var str ='<?xml version="1.0" encoding="UTF-8"?>\n'+
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:spr="http://spring_boot_ws_srdc_hw2">\n' +
        '   <soapenv:Header/>\n' +
        '   <soapenv:Body>\n' +
        '      <spr:getLoginRequest>\n' +
        '         <spr:identifyingKey>'+ "Client" +'</spr:identifyingKey>\n' +
        '         <spr:username>'+ username + '</spr:username>\n' +
        '         <spr:password>'+ password +'</spr:password>\n' +
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
            if(xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","systemMessage")[0].childNodes[0].nodeValue === "Admin connected."){
                location.href = 'http://localhost:8080/admin.html';
                sessionStorage.setItem("username",username);
                sessionStorage.setItem("password",password);
            }
            else if(xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","systemMessage")[0].childNodes[0].nodeValue === "User connected."){
                location.href = 'http://localhost:8080/user.html';
                sessionStorage.setItem("username",username);
                sessionStorage.setItem("password",password);
            }
            else {
                document.getElementById("systemMessage").innerHTML = xhr.responseXML.getElementsByTagNameNS("http://spring_boot_ws_srdc_hw2","systemMessage")[0].childNodes[0].nodeValue;
            }
        }
    }
    xhr.setRequestHeader('Content-Type','text/xml');
    xhr.send(str);
}