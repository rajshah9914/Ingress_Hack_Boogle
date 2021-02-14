{

console.log('joker')


var x=  {
  "padding": "15px",
  "margin-bottom": "20px",
  "border": "1px solid red",
  "backgroundColor":"#dff0d8",
  "border-radius": "4px"
}

// .alert - success {
//     background - color: #dff0d8;
//     border - color: #d6e9c6;
//     color: #3c763d;
// }

let Http = new XMLHttpRequest();
const urll = 'http://localhost:3000/getRating'
// console.log(urll)
Http.open("GET", urll);
Http.send();
var obj;
Http.onreadystatechange = function () {
  if (Http.readyState == 4 && Http.status == 200) {
    // sp1.innerHTML = '<b>' + Http.responseText + '&nbsp / &nbsp 5</b>'
    // node.insertAdjacentElement("beforeBegin", sp1)
    obj=JSON.parse(Http.responseText);
    console.log(JSON.parse(Http.responseText));
  }
}


function funn(){
var ff = document.querySelectorAll('.yuRUbf')
// foreach (x in ff){
//     console.log(ff[x].getAttribute('original_target'))
// }
ff.forEach(node=>{
    // console.log(node.firstElementChild.getAttribute('href'))
    let sp1 = document.createElement("div")
    sp1.setAttribute("id", "pp")
    sp1.setAttribute("align", "right")
    sp1.setAttribute("role", "alert")
    var link = node.firstElementChild.getAttribute('href')
    var cnt=0;
    var sum=0.0;
    console.log(link)
    for (x in obj){
      console.log(obj[x])
      if(obj[x].url===link){
        sum+=parseInt(obj[x].star);
        cnt+=parseInt(1);
      }
    }
    console.log("end")
  var staravg;
    if(cnt===0){
      staravg="UnRated Yet..Be the first"
    }
    else{
      staravg = (sum / cnt).toFixed(2).toString();
    }
    // let Http = new XMLHttpRequest();
    // const urll = 'http://localhost:3000/getRating?urll=' + node.firstElementChild.getAttribute('href')
    // console.log(urll)
    // Http.open("GET", urll);
    // Http.send();
    // Http.onreadystatechange = function () {
    // console.log(Http)
    // if (Http.readyState == 4 && Http.status == 200) {
      sp1.innerHTML = '<b>'+staravg+'&nbsp / &nbsp 5</b>'
      node.insertAdjacentElement("beforeBegin", sp1)
    //   console.log(Http.responseText);
    // }
  // }
    // document.getElementById("pp").style.backgroundColor = "green"
})
}


setTimeout(() => { funn() }, 3000);
}