'use strict'
const body = document.body;
//Container is a div where the search field will be.
const container = document.createElement('div');
      container.setAttribute('class','container');
//The title of this page
const title = document.createElement('h1');
      title.innerHTML = 'World clock';
      container.appendChild(title)
//searchIn is a search field
const searchIn = document.createElement('input');
      searchIn.setAttribute("placeholder", 'Write City name');
      searchIn.setAttribute('class','searchIn');
      container.appendChild(searchIn);
//select is a selection field
const select = document.createElement('select');
      select.setAttribute('id','select');

      container.appendChild(select);
//creating option for default 
const option = document.createElement('option');
      option.setAttribute('value','Other');
      option.innerHTML = option.value;
      option.selected = true;

      select.appendChild(option);
//searchButton is a button for sending  request 
const searchButton = document.createElement('button');
      searchButton.innerHTML = 'Search';
      searchButton.setAttribute('class','searchButton')
      container.appendChild(searchButton);

      body.appendChild(container)

//teritory is a array of default teritory names 
const territory = ['Africa','America','America/Indiana',
                'America/Argentina','America/Kentucky/',
                'America/North_Dakota','Antarctica','Asia',
                'Europe','Indian','Pacific'];
//adding teritory names for each option
territory.forEach(val =>{ 
    const option = document.createElement('option');
    option.setAttribute('value',val);
    option.innerHTML = val;
    select.appendChild(option)
});

let selectedTerritory;
let searchText = '';
//creating error massage paragraph
const errorMsg = document.createElement('p');
                    errorMsg.style.color = 'red';
                    container.appendChild(errorMsg);
//remembering teritory name
select.onchange = function(){
    selectedTerritory =  document.getElementById('select').value;
   }
//when user click search button 
searchButton.onclick = function(){
    //set select value in selectedTerritory
    selectedTerritory =  document.getElementById('select').value;
    //set validated text in textValid
    let textValid = searchTextValid(searchIn.value);
    //checking existence
        if(textValid){
            //checking selectedTerritory
            if(selectedTerritory === 'Other'){
                requestTime(textValid)
            }
            else{
                requestTime(textValid,selectedTerritory)
            }
        }
        //checking invalid case
        else if(!textValid){
            errorMsg.innerHTML = 'Please enter city name';
            searchIn.style.border = '1px solid red';
        }
    }


//text validation function 
function searchTextValid(text) {
        return text.split(" ").map(function (value) {
            return value.substring(0, 1).toUpperCase() + value.substring(1, value.length).toLowerCase();
        }).join(" ").trim();
}





//sending request due to its arguments
function requestTime(city,ter){
    //clear error message and style borders for each request 
    errorMsg.innerHTML = '';
    select.style.border = '1px solid rgb(0, 166, 255)';
    searchIn.style.border = '1px solid rgb(0, 166, 255)';
    //checking arguments count do request according to that count
    if(arguments.length === 2){
    fetch(`http://worldtimeapi.org/api/timezone/${ter}/${city}`).then(function (response) {
        return response.json();
            }).then(function (data) {
                //checking error from API
                if(data.error){
                    errorMsg.innerHTML = 'Invalid city/territory name';
                    select.style.border = '1px solid red'
                    searchIn.style.border = '1px solid red';
                }
                //show data from API
                else{
                    responseCity(city,data)
                }
                })
            }
            //checking arguments count do request according to that count
            else if(arguments.length === 1){
                fetch(`http://worldtimeapi.org/api/timezone/${city}`).then(function (response) {
                    return response.json();
                        }).then(function (data) {
                            //checking error from API
                            if(data.error){
                                errorMsg.innerHTML = 'Invalid city name';
                                searchIn.style.border = '1px solid red';
                            }
                            //show data from API
                            else{
                                responseCity(city,data)
                                }
                            })
            }  
    }
//creating window for data
function responseCity(name,data){
    const div = document.createElement('div');
                div.setAttribute('class','showCity');
    //creating window closing sign(x)
    const closer = document.createElement('div');
                closer.innerHTML= '&#x2715';
                closer.setAttribute('class','closer');
                div.appendChild(closer);
    //creating city name as title
    const nameCity = document.createElement('h1');
                     nameCity.innerHTML = name;
                     div.appendChild(nameCity);
    //printing data
    for(let key in data){
            const str = document.createElement('p');
            if(key === 'client_ip'){
                continue;
            }
            str.innerHTML = beautifulTxt(key) + '----------------' + data[key];
            div.appendChild(str)
    }
    //when user  clicks window(responseCity()) close button(x)
    closer.onclick = function(){
        //clear last data
        div.innerHTML = '';
        searchIn.value = '';
        select.value = 'Other';
    }
    container.appendChild(div);
}
//function for making readable text
function beautifulTxt(txt){
    let newtxt = txt.split('');
    for(let i = 0; i < newtxt.length;i++){
        if(newtxt[i] === '_'){
            newtxt[i] = ' ';
        }
    }
        txt = newtxt.join('')
    return txt.substring(0,1).toUpperCase() + txt.substring(1,txt.length);
}


