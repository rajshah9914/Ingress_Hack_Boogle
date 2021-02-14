console.log("Whatsapp Encryption Begins.");

if (document.getElementById('eye') === null) {
let iconsClass = document.querySelectorAll('._3qpzV.rN1v9')[0];
let sp1 = document.createElement("div");
sp1.setAttribute('class', 'bDS3i');
sp1.innerHTML = '<div class="_2wfYK"><div aria-disabled="false" role="button" tabindex="0" title="Attach" aria-label="Attach"><span id="eye" data-testid="clip" data-icon="clip" class=""><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z"/></svg></span></div><span></span></div>';
iconsClass.insertAdjacentElement("beforeEnd", sp1)
}

document.getElementById('eye').addEventListener('click', () => {
    let msg = document.querySelectorAll('._1awRl.copyable-text.selectable-text')[1].innerHTML
    let key = keyy;
    if (key.length > 16) {
        key = key.substr(0, 16);
    }
    else if (key.length < 16) {
        var n = key.length;
        for (var i = 0; i < 16 - n; i++) {
            key += 'a';
        }
    }
    let Http = new XMLHttpRequest();
    const url = 'http://localhost:9000/encrypt?key='+ key + '&msg=' + msg;
    console.log(url)
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = (e) => {
        if (Http.readyState == 4 && Http.status == 200) {
            let encryptedMsg = Http.responseText;
            let enccm=btoa(encryptedMsg)
            document.querySelectorAll('._1awRl.copyable-text.selectable-text')[1].innerHTML = enccm;
        }
    }
});

// decryption
document.querySelectorAll('._1VzZY.selectable-text.copyable-text').forEach(node => {
    let msg = node.innerText;
    try {
        console.log(msg)
        let a = atob(msg)
        console.log(msg)
        console.log(keyy)
        let key=keyy;
        if(key.length>16){
            key=key.substr(0,16);
        }
        else if(key.length<16){
            var n=key.length;
            for(var i=0;i<16-n;i++){
                key+='a';
           }
        }
        let Http = new XMLHttpRequest();
        const url = 'http://localhost:9000/decrypt?key=' + key + '&msg=' + msg;
        Http.open("GET", url);
        Http.send();
        Http.onreadystatechange = (e) => {
            if (Http.readyState == 4 && Http.status == 200) {
                let encryptedMsg = Http.responseText;
                node.innerText = encryptedMsg;
            }
        }
    } catch (e) {
    }
});