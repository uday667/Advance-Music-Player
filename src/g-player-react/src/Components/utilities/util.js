import { GP_SORTING_KEY_MAPPING, SORT_NONE, SORT_PLAY_COUNT, WIKI_SUMMARY_URL } from "../redux/GPActionTypes";

export const getMins = (seconds) =>{
    
    if(seconds==='' || seconds===undefined || seconds===null || seconds===0){
        return '';
    }
    const mins = Math.floor(seconds/60);
    let secs = Math.floor(seconds - (mins*60));
    secs = secs < 10 ? "0"+secs : secs;
    return mins+":"+secs;

    //function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}
}

export const getMins0 = (seconds) =>{
    
    if(seconds==='' || seconds===undefined || seconds===null || seconds===0){
        return '';
    }
    let  mins = Math.floor(seconds/60);
    mins = mins < 10 ? "0"+mins : mins;
    let secs = Math.floor(seconds - (mins*60));
    secs = secs < 10 ? "0"+secs : secs;
    return mins+":"+secs;
}

export function handleAPIError(error){
    console.log(error);
    if(error.response!==undefined){
        if(error.response.data.status==="TOKEN_EXPIRED"){
            document.cookie="jToken=;";
            window.location.reload();
        }
    }
}

export function scrolltoId(id){
    try {
        const access = document.getElementById(id);
        access.scrollIntoView(true);
        //access.scrollIntoView({behavior: 'smooth'}, true);
        //var rect = access.getBoundingClientRect();
        //console.log(rect.top, rect.right, rect.bottom, rect.left);
        //ccess.scrollTo(0, rect.bottom);
    } catch (error) {
        
    }
}

export const scrollToPlaying = (isPlaying)=>{
    if(isPlaying){
        const trackPlaying = document.getElementsByClassName("text-highlighted-y");
        if(trackPlaying.length>0){
         scrolltoId(trackPlaying[0].id);   
        }
    }
}

export const debounce = (fn) => {
    let timer;
    return function (...args) {
      const context=this;    
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        fn.apply(context, args);
      },1000);
    };
  };

export const getCookieDetails = () => {
    const cookies = document.cookie;
    const cookieArr = cookies.split(";");
    const cookieDetails = {};
    let cookieArr1;
    cookieArr.forEach((cookie => {
        if(cookie!==""){
            cookieArr1 = cookie.split("=");
            cookieDetails[cookieArr1[0].trim()] = cookieArr1[1].trim();
        }
    }))
    return cookieDetails;
}

export const setCookies = (name, value) => {
    const date = new Date();
    const expires = new Date(date);
    expires.setDate(expires.getDate()+5);
    document.cookie=name+"="+value+"; expires="+expires+"; path=/";
}

export const getCookieValue = (name) => {
    const cookies = document.cookie;
    const cookieArr = cookies.split(";");
    let cookieArr1;
    let cookieValue;
    cookieArr.forEach((cookie => {
        if(cookie!==""){
            cookieArr1 = cookie.split("=");
            if(cookieArr1[0].trim() ===name){
                cookieValue = cookieArr1[1].trim();
            }
        }
    }))
    return cookieValue;
}

export const sortGroupByField = (entArr, field, histArr) => {
    if(!field || field === SORT_NONE){
        let tempEntObj = {};
        entArr.forEach((ent,i)=>{
            tempEntObj[i]=[ent];
        });
        return tempEntObj;
    }
    let entListObj = {};
    let tempArr = [];
    let ind;
    let indArr;
    let count;
    let maxCount = 0;
    let countArr = [0,1];

    if(field === SORT_PLAY_COUNT){
        maxCount = histArr.map(ent=>ent[1]).reduce((a,c)=>a>c?a:c,0);
        countArr = getCountArr(maxCount, countArr);
    }

    entArr.forEach((ent) => {
        indArr = []
        //if (ent[field] !== null && ent[field] !== undefined && ent[field] !== "") {
        if (ent[field] || field === SORT_PLAY_COUNT) {
            if(field==='title' || field==='albumName' || field==='artistName'){
                ind = ent[field].substring(0, 1).toUpperCase();
                if (!isNaN(ind)) {
                    ind = '#';
                }
            }else if(field === 'lyricsAvl'){
                ind = ent.lyricsAvl ? 'Tracks with lyrics' : 'No Lyrics'
            }else if(field === SORT_PLAY_COUNT){
                count = histArr.filter(his=>his[0]===ent.songId)[0];
                ind = count?getCountIndex(countArr,count[1]):0;
            }else{
                ind = ent[field];
            }

            if(field === "language" || field === "genre"){
                if(ind.includes(",")){
                    indArr = ind.split(",");
                }else if(ind.includes("/")){
                    indArr = ind.split("/");
                }
            }

            if(indArr && indArr.length > 0){
                indArr.forEach(ind1 =>{
                    if (entListObj[ind1] !== undefined) {
                        tempArr = entListObj[ind1];
                        tempArr.push(ent);
                        entListObj[ind1] = tempArr;
                    } else {
                        entListObj[ind1] = [ent];
                    }
                });
            }else{
                if (entListObj[ind] !== undefined) {
                    tempArr = entListObj[ind];
                    tempArr.push(ent);
                    entListObj[ind] = tempArr;
                } else {
                    entListObj[ind] = [ent];
                }
            }
        }
    });
    //console.log("entListObj: ",entListObj)
return entListObj;
}

export const sortByKey = (key,arr,obj) => {
    let sarr = [...arr];
    if(obj && Object.keys(obj).length>0){
        sarr =  arr.sort((a,b)=>obj[a]>obj[b]?GP_SORTING_KEY_MAPPING[key]:GP_SORTING_KEY_MAPPING[key]*-1);
    }else{
        sarr =  arr.sort((a,b)=>a>b?GP_SORTING_KEY_MAPPING[key]:GP_SORTING_KEY_MAPPING[key]*-1);
    }
    return sarr;
}

export const getCountArr = (maxCount, countArr) => {
    for(let i=5;i<maxCount;i+=5){
        countArr.push(i);
    }
    return countArr.reverse();
}

export const getCountIndex = (countArr, count) => {
    for(let i=0;i<countArr.length;i++){
        if(count >= countArr[i]){
            return countArr[i];
        }
    }
}

export const showHideSideBar = () => {
    if(!isMobile()){
        return;
    }
    const sideBar = document.getElementById('sidebar');
    if(sideBar.offsetWidth > 0){
        sideBar.classList.remove('show-mobile-sidebar');
        document.getElementById('MenuSideBarFold').style.display = 'none';
    }else{
        sideBar.classList.add('show-mobile-sidebar');
        document.getElementById('MenuSideBarFold').style.display = 'block';
    }
}

export const isMobile = () => {
    return ( ( window.innerWidth <= 760 ) 
    //&& ( window.innerHeight <= 600 ) 
    );
  }

export const checkIfActionAllowed = (emeIds, event) => {
    const itrCount = 12;
    let elem = event.target;
    let tempIsclickedOnCM = false;
    if(elem !== undefined && elem !== null){
        for(let i = 0; i< itrCount;i++){
            if(elem && ((elem.id && emeIds.includes(elem.id)) || (elem.data_id && emeIds.includes(elem.data_id)))){
                tempIsclickedOnCM = true;
                break;
            }else if(elem){
                elem = elem.parentElement;
            }
        }
    }
    return tempIsclickedOnCM;
}

export const callGetAPI = async(URL) => {
    const response = await fetch(URL);
    const data = await response.json();
    return data;
}

export const fetchArtistDetailsfromWiki = async(artist) => {
        let searchedSingerActor = false;
        let data = await callGetAPI(`${WIKI_SUMMARY_URL}${artist}`);
        if(data.title.includes("Not Found") || data.title.includes("doesn't exist") || data.extract.includes("may refer to")){
            data = await callGetAPI(`${WIKI_SUMMARY_URL}${artist}_(singer)`);
            if(data.title.includes("Not Found") || data.title.includes("doesn't exist")){
                data = await callGetAPI(`${WIKI_SUMMARY_URL}${artist}_(actor)`);
                searchedSingerActor = true;
            }
        }
        if(!(data.extract.includes("singer") || data.extract.includes("director")
                        || data.extract.includes("actress") || data.extract.includes("actor")
                        || data.extract.includes("composer") || data.extract.includes("musician")
                        )){
            if(!searchedSingerActor){
                data = await callGetAPI(`${WIKI_SUMMARY_URL}${artist}_(singer)`);
                if(data.title.includes("Not Found") || data.title.includes("doesn't exist")){
                    data = await callGetAPI(`${WIKI_SUMMARY_URL}${artist}_(actor)`);
                }
            }else{
                data = null;
            }
        }
        return data;
    }

    export const convertDataFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file)
          fileReader.onload = () => {
            resolve(fileReader.result);
          }
          fileReader.onerror = (error) => {
            reject(error);
          }
        })
      }


      export const camelize = (str) => {
        if(!str)return str;
        const tempStrArr = str.split(" ");
        const strArr = [];
        tempStrArr.forEach(trmpStr =>{
            strArr.push(trmpStr.substring(0, 1).toUpperCase() + trmpStr.substring(1))
        })
        return strArr.join(" ");
      }

      export const replace_AndCamelize = (str) => {
        if(!str)return str;
        str = str.replaceAll("_"," ").toLowerCase();
        return camelize(str);
      }

      export const selectFocusedText = (e) => {
        let target;
        if(e.target){
            target = e.target;
        }
        target.select();
      }

      export const trimInputText = (e) => {
        let target;
        if(e.target){
            target = e.target;
        }
        
        target.value = target.value.trim();
        //console.log(target.value)
      }

      export const hideElementById = (elemId) => {
        const elem  = document.getElementById(elemId);
        if(elem){
            elem.style.display = "none";
        }
      }

      export const hideElemetAfterSomeDelay = (elemId, delay) =>{
        setTimeout(() => {
            hideElementById(elemId);
        }, delay);
      }

      export const getLyricsFromLRC = (lrc) => {
        const lycArr = lrc.split("\n");
        let lyrics = "";
        lycArr.forEach(line =>{
            line = line.trim();
            if(line.lastIndexOf("]")+1 !== line.length){
                line = line.substring(line.lastIndexOf("]")+1,line.length).trim();
                if(lyrics!==""){
                    lyrics+="\n";
                }
                lyrics+=line;
            }
        })
        return lyrics;
      }