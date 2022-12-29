// import bot from './assets/bot.svg'
// import user from './assets/user.svg'
// // get the form element
// // form will have users input
// const form = document.querySelector('form')
// // get te chatconainer 
// const chatContainer = document.querySelector('#chat_container')
// // from data will be sent to api and api will return some answer
// // to chatcontainer we will add both the qse which is the data from the from
// // and the answer given by the ChatGPT 
// // lets create a function to genterate random id 
// // as for ever div addtion to the page we have to give it id
// function loader(element){
//     element.textContent = ''

//     loadInterval = setInterval(() => {
//         // Update the text content of the loading indicator
//         element.textContent += '.';

//         // If the loading indicator has reached three dots, reset it
//         if (element.textContent === '....') {
//             element.textContent = '';
//         }
//     }, 300);
// }
// function generateRandomId()
// {
//     const timestamp = Date.now();
//     const random = Math.random();
//     const hexcode = random.toString(16);
//     return `${timestamp}-${random}-${hexcode}`;
// }
// function settext(block,text){
//     let idx = 0;
//     let addtext = setInterval(() => {
//    if(idx===text.length) clearInterval(addtext);
//    else block.innerHTML+=charAt(idx);
//    idx++;    
//     }, 20);
// }
// // function for making html 
// function createhtml(isAi,value,uniqueId){
//     return (
//         `
//         <div class="wrapper ${isAi && 'ai'}">
//     <div class="chat">
//         <div class="profile">
//             <img 
//               src=${isAi ? bot : user} 
//               alt="${isAi ? 'bot' : 'user'}" 
//             />
//         </div>
//         <div class="message" id=${uniqueId}>${value}</div>
//     </div>
// </div>
// `)
// }
// // after press enter 
// const handelSubmit = async (e) =>{
//   // to prevent the default behaviour of reloading of entire pase on submiting request
//     e.preventDefault();
//     const Data = new FormData(form);
//     // user request should be added to the html
//     chatContainer.innerHTML+=createhtml(false,Data.get('prompt'))
//     // reset the form
//     form.reset()
//     // generate random id 
//     const rand = generateRandomId();
//     // make a block for ai message
//     chatContainer.innerHTML+=createhtml(true,'',rand);
//     // block for the ai ans
//     const aiblock = document.getElementById(rand);
//    // untill we get the answer the block will run this dots animation thing
//     loader(aiblock)
//     console.log('hello');
//    // get the data from api end point 
//    // const response = await fetch('apiendpoint', schema)
//    const response = await fetch('http://localhost:5000/',{
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//         prompt: Data.get('prompt')
//     })
// })
//    clearInterval(loadInterval)
//    aiblock.innerHTML=" ";
//  // if we get ok response we can fetch the json given by ai
//    if(response.ok){
//     const data = await response.json();
//     const parsedData = data.bot.trim();
//     settext(aiblock,parsedData);
//    }
// // if we get an error we would display that error
//    else {
//       const data =await response.text();
//       aiblock.innerHTML+=`something went wrong`;
//       alert(data)
//    }
// }
// // event listnerr when user press submit
// form.addEventListener('submit', handelSubmit)
// form.addEventListener('keyup', (e) => {
//     if (e.keyCode === 13) {
//         handelSubmit(e)
//     }
// })

import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        alert(err)
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})