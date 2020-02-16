import { CountUp } from './countup.js';
//import axios from './axios.min.js'
//const axios = require('./axios.min.js');

const cacheApi = './cache/data.json'
const sinaApi = 'http://interface.sina.cn/news/wap/fymap2020_data.d.json'

var lastY = 0
var locked = false

var currentPage = 0
var currentPageName = "page-head"

const pages = [
  {
    id: 0,
    name: "head"
  },
  {
    id: 1,
    name: "data"
  },
  {
    id: 2,
    name: "lwl"
  }
]


var datas = {
    d_infected: 66576,
    d_death: 1524
}

var datasKey = Object.keys(datas)



toPage(0)
//getData(sinaApi)

window.addEventListener('wheel', function(e) {
  //console.log(e.deltaY)
  var thisY = e.deltaY
  //var dis = thisY - lastY
  /*var c = document.getElementById(currentPageName)
  c.style.opacity = 1 - Math.abs(thisY)
  console.log(1 - (Math.abs(thisY) / 10))*/
  if(Math.abs(thisY) > 20 && locked == false) {

    if(thisY > 0){
      console.log("next")
      thisY = 0
      locked = true
      switchPage(1)
    }

    else if(thisY < 0){
      console.log("last")
      thisY = 0
      locked = true
      switchPage(-1)
    }

  } else {
    //c.style.opacity = 1
    //lastY = e.deltaY
  }
  
});

function switchPage(to){

  setTimeout(()=>{
    locked = false
  }, 1200)

  if(currentPage == 0 && to == -1){
    console.log("no last")
    return
  }

  if(currentPage == pages.length - 1 && to == 1){
    console.log("no next")
    return
  }

  toPage(currentPage + to)
  
}


function toPage(id){

  if(id == 1){
    getData(cacheApi)
  }

  if(id == 2){
    stamp()
  }
  
  for(let i=0;i<pages.length;i++){
    if(pages[i].id == id){
      document.getElementById('page-' + pages[i].name).style.animationName = "fade-in"
      currentPage = i
      currentPageName = 'page-' + pages[i].name
      
    } else {
      document.getElementById('page-' + pages[i].name).style.animationName = "fade-out"
    }
  }

  

}

function getData (api) {

  axios.get(api)
  .then(function (response) {
    
    // handle success
    const res = response.data.data
    datas.d_infected = res.gntotal
    datas.d_death = res.deathtotal

    for(let i=0;i<datasKey.length;i++){
      var countUp = new CountUp(datasKey[i], datas[datasKey[i]]);
      countUp.start();
    }
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
}

function stamp(){
  document.getElementById('lwl-fingure').style.animationName = 'stamp'
}






