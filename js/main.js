import { CountUp } from './countup.js';
//import axios from './axios.min.js'
//const axios = require('./axios.min.js');

const cacheApi = './cache/data.json'
const sinaApi = 'http://interface.sina.cn/news/wap/fymap2020_data.d.json'


var locked = false

var currentPage = 0
var currentPageName = ""

const screenHeight = document.body.clientHeight
const screenWidth = document.body.clientWidth

var tw_count_1 = 0
var tw_count_2 = 0

var wallArr = []

var musicStatus = false
var currentMusic = 0
const bgm = document.getElementById("bgm")
const bgm_s = document.getElementById("bgm-s")
const music = document.getElementById("music")
const base = "./assets/sound/"
const sounds = ["vivian.wav", "itscoming.mp3", "ambulance.wav", "icu.wav"]

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
  },
  {
    id: 3,
    name: "twitter"
  },
  {
    id: 4,
    name: "msg"
  },
  {
    id: 5,
    name: "fake"
  },
  {
    id: 6,
    name: "question"
  },
  {
    id: 7,
    name: "video"
  },
  {
    id: 8,
    name: "flyer"
  },
  {
    id: 9,
    name: "ending"
  }
]


var datas = {
    d_infected: 66576,
    d_death: 1524
}

var datasKey = Object.keys(datas)



toPage(0, true)
//getData(sinaApi)

window.addEventListener('wheel', function(e) {

  var thisY = e.deltaY


  if(Math.abs(thisY) > 15) {

    if(!locked){
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

    }

  }
  
});

document.querySelector('#page-msg').addEventListener('click', ()=>{
  if(!locked){
    virusPopup()
  }
})

document.querySelector('.toNext').addEventListener('click', ()=>{
  if(locked){
    slowdown()
  } else {
    switchPage(1)
  }
  
})

document.querySelector('#qask-1').addEventListener('click', showAns)
document.querySelector('#qask-2').addEventListener('click', showAns)
document.querySelector('#music').addEventListener('click', ()=>{
  playmusic()
})
document.querySelector('#flyer-alert').addEventListener('click', ()=>{
  toPage(9)
})
document.getElementById('video-arrow').addEventListener('click', ()=>{
  toPage(8)
})


function selectSound (){

  var s
  if(currentPage < 2){
    s = 0
  }

  else if(currentPage >= 2 && currentPage < 5) {
    s = 1
  }

  else if(currentPage >= 5 && currentPage < 7){
    s = 2
  }

  else{
    s = 3
  }

  if(s != currentMusic){
    bgm_s.setAttribute("src", base+sounds[s])
    if(s == 1){
      bgm_s.setAttribute("type", "audio/mpeg")
    } else {
      bgm_s.setAttribute("type", "audio/wav")
    }

    currentMusic = s

  }

  
}


function playmusic(bol){

    if(bol == "stop"){
      bgm.pause()
      musicStatus = false
      music.style.animationName = ""
      return
    } 

    else if(bol == "force"){
      bgm.load()
      bgm.play()
      musicStatus = true
      music.style.animationName = "rotating"
      return
    }
    
    
    else {
      if(!musicStatus){
          bgm.load()
          bgm.play()
          musicStatus = true
          music.style.animationName = "rotating"
          return
      } else{
          bgm.pause()
          musicStatus = false
          music.style.animationName = ""
          return
      }
    }
}

function switchPage(to){

  setTimeout(()=>{
    locked = false
  }, 2000)

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




function toPage(id, hardSwitch){

  hardSwitch = hardSwitch ? hardSwitch : false

  if(id == 1){
    getData(cacheApi)
    getData(sinaApi)
  }

  if(id == 2){
    stamp()
  }

  if(id == 3){
    wallArr[0] = setInterval(()=>{
      tw_count_1++
      tPop(document.getElementById('twitter-wall-1'), tw_count_1, 1)
    },2000)

    wallArr[1] =setInterval(()=>{
      tw_count_2++
      tPop(document.getElementById('twitter-wall-2'), tw_count_2, 2)
    },3000)
  } 
  
  if(id != 3) {
    tw_count_1 = 0
    tw_count_2 = 0
    clearAllInterval()
  }

  if(id == 5){

  }

  if(id == 7){
    playmusic("stop")
    setTimeout(()=>{
      goDark()
    }, 1000)
  }

  if(id == 8) {

    showAlert()
  }

  if(id == 9){
    //setPageEnd()
  }
  
  for(let i=0;i<pages.length;i++){
    if(pages[i].id == id){
      if(!hardSwitch){
        document.getElementById('page-' + pages[i].name).style.display = "block"
        document.getElementById('page-' + pages[i].name).style.animationName = "fade-in"
      } else {
        document.getElementById('page-' + pages[i].name).style.display = "block"
        document.getElementById('page-' + pages[i].name).style.opacity = 1
      }
      
      currentPage = i
      currentPageName = 'page-' + pages[i].name
    } else {

      if(!hardSwitch){
        document.getElementById('page-' + pages[i].name).style.animationName = "fade-out"
        setTimeout(()=>{
          document.getElementById('page-' + pages[i].name).style.display = "none"
        }, 1500)
      } else {
        document.getElementById('page-' + pages[i].name).style.display = "none"
      }
      
    }
  }

  selectSound()

}


function getData (api) {

  axios.get(api)
  .then(function (response) {
    
    // handle success
    const res = response.data.data
    datas.d_infected = res.gntotal
    datas.d_death = res.deathtotal

    document.getElementById("data-update-date").innerHTML = "Update: " + res.mtime

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

const lwlWord = [
  { a: "Zhong NanShan", v: "Dr.Li is a hero" },
  { a: "Trisha", v: "Li leaves a 6-month pregnant wife and a 5yo child. Both have coronavirus." },
  { a: "Lulu", v: "can’t fail to understand" },
  { a: "Li WenLiang", v: "A healthy society should not only have one voice" },
  { a: "xhm", v: "His discovery during his lifetime was identified as a rumor-maker." },
  { a: "Gian", v: "You are a hero. #LiWenLiang" },
  { a: "Mikky", v: "A truth whistle-blower" }
]

function tPop(container, count, id){
  var n =  document.createElement("div")
  n.classList.add("twitter-single")
  //n.classList.add("twitter-single-n")

  var author = lwlWord[count%lwlWord.length].a
  var value = lwlWord[count%lwlWord.length].v
  console.log(count)

  n.innerHTML='<div class="twitter-content"><div class="twitter-head">@' + author + '</div><div>' + value + '</div></div>'

  var created = container.appendChild(n)

  if(count == 3){
    cleanTweet(container, id)
    //count = 0
  }

  tUp(container,created)
}

function tUp (container) {
  const dis = 80
  //created.style.transform = "translateY(" + -80 + "px)"

  var allSingle = container.getElementsByClassName("twitter-single")
  var currentY = getTY(allSingle[0].style.transform)
  //console.log(allSingle)
  for(let i=0;i<allSingle.length;i++){

    //allSingle[i].style.animationName = "twitterUp"
    //console.log(allSingle[i].style.transform)

    
    if(currentY){
      allSingle[i].style.transform = "translateY(" + -(currentY+dis) + "px)"
    } else {
      allSingle[i].style.transform = "translateY(" + -dis + "px)"
    }
    
  }
}

function cleanTweet(container, id){
  const child = container.childNodes
  var as = container.getElementsByClassName("twitter-single")

  for(let i=0;i<child.length;i++){
    if(i < 3){
      container.removeChild(child[i])
      
      for(let c=0;c<as.length;c++){
        as[c].style.transform = "translateY(" + -80 + "px)"
        //console.log(-(yc - yc3))
      }

      if(id == 1){
        tw_count_1 = 0
      } else {
        tw_count_2 = 0
      }
    }
  }
}

function getTY (str) {
  return parseInt(str.replace(/[^0-9]/ig,""))
}


function clearAllInterval () {
  wallArr.forEach(el => {
    clearInterval(el)
  })
}


const allMsgs = [
  "Go away!", 
  "You are virus!", 
  "Get lost!", 
  "You are not welcome!", 
  "We will dead thanks to these slit eyes", 
  "Cinese infetto, tornatene al tuo paese", 
  "Sick man of Asia", 
  "Be carful of that yellow monkey",
  "It’s all Wuhan’s fault",
  "How can you prove you are not the spreader?",
  "China To kill 20000 Coronavirus Patients"
]
const allMsgsColor = ["0022F4", "FF003D", "37EE1A", "00D1FF", "FF9900"]
const totalLoop = 80
var loopCount = 0

function virusPopup () {

  locked = true

  const container = document.getElementById('msg-msgs')


  setTimeout(()=>{
    var n = document.createElement("div")
    n.classList.add("msg-msgs-s")
    n.style.background = "#" + allMsgsColor[loopCount % allMsgsColor.length]
    n.innerHTML = allMsgs[ loopCount % allMsgs.length]
    n.style.top = ramdomInRange(0, screenHeight) + "px"
    n.style.left = ramdomInRange(0, screenWidth) + "px"
    n.style.animationName = "popupTweet"
    container.appendChild(n)

    if(loopCount < totalLoop){
      virusPopup()
    } else {
      // Clear all after 10 seconds
      setTimeout(()=>{
        locked = false
        toPage(5)
        container.innerHTML = ""
      }, 3200)
    }

  }, 40)

  loopCount++
}

function goDark () {
  document.getElementById("page-video").style.background = "#000000";
}


function ramdomInRange(n,m){
  var c = m-n+1;  
  return Math.floor(Math.random() * c + n);
}

function showAns () {
  document.getElementById("question-ans").style.display = "block"
  document.getElementById("question-and-inner").style.animationName = "fade-in"
}

function showAlert(){

  setTimeout(()=>{
    document.getElementById('flyer-alert').style.animationName = "stamp2"
  }, 3500)

  setTimeout(()=>{
    document.getElementById('flyer-alert-text').style.animationName = "flashing2"
    setTimeout(()=>{
      document.getElementById('flyer-alert-text').innerHTML = "Infection Control Unit(ICU)"
    }, 1000)
    
  }, 4500)
  
}

function slowdown(){
  document.getElementById('slowdown').style.display = "block"
  document.getElementById('slowdown').style.animationName = "slowdown"
}







