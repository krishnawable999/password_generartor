const inputSlider = document.querySelector("[data-length-slider]");
const lengthDisplay = document.querySelector("[data-length-container]");
const passDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#number");
const symbolsCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allcheckBox = document.querySelectorAll("input[type=checkbox]");
const symbol = '`-=~!@#$%^&*()_+[ ]\{}|;:",./<>?';


let password = "";
let passLength = 10;
let checkCount = 0;
handleSlider();
//set strgth circle color to grey
setIndicator('#ccc')
//sets the passwordlength
function handleSlider(){
    inputSlider.value = passLength;
    lengthDisplay.innerText = passLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize =( (passLength - min)*100/(max-min)) + "%100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px${color}`;
}

function getRndinteger(min,max){
    return Math.floor(Math.random()*(max-min)) + min;
}

function generateRandomnumber(){
    return getRndinteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndinteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRndinteger(65,91));
}

function generateSymbol(){
    const randomNum = getRndinteger(0,symbol.length);
    return symbol.charAt(randomNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) &&
    (hasNum || hasSym) && passLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    //copy is visible
    copyMsg.classList.add("active");
   setTimeout(() => {
    copyMsg.classList.remove("active");
   }, 2000);

}

inputSlider.addEventListener('input',(e) => {
    passLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',() => {
    if(passDisplay.value){
        copyContent();
    }
})

function handleCheckboxchange(){
    checkCount = 0;
    allcheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
        });
    //special condition
    if(passLength < checkCount){
        passLength = checkCount;
        handleSlider();
    }
}


allcheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckboxchange);
})

function shufflePassword(array){
    //fischer Yates method
    for(let i=array.length -1 ; i>0 ; i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

generateBtn.addEventListener('click',() => {
    //none of checkbox selected
    if(checkCount == 0)
        return;
    if(passLength < checkCount){
        passLength = checkCount;
        handleSlider();
    }
    //start journey to find new password

    //remove old password
    console.log("Starting new journey");
    password = "";
    //put the values mentioned by checkbox
    
    // if(uppercaseCheck.checked){
    //     password = generateUppercase();
    // }
    // if(lowercaseCheckCheck.checked){
    //     password = generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password = generateRandomnumber();
    // }
    // if(symbolsCheck.checked){
    //     password = generateSymbol();
    // }

    let funArr = [];
    
    if(uppercaseCheck.checked){
        funArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        funArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funArr.push(generateRandomnumber);
    }
    if(symbolsCheck.checked){
        funArr.push(generateSymbol);
    }
    //compulsory addition
    for(let i=0 ; i<funArr.length; i++){
        password += funArr[i]();
    }

    //remaining addition
    for(let i=0 ; i<passLength-funArr.length ; i++){
        let randomind = getRndinteger(0,funArr.length);
        console.log("randomind"+randomind);
        password += funArr[randomind]();
    }

    //shuffle passwoed
    password = shufflePassword(Array.from(password));

    passDisplay.value = password;
    console.log('UI Addition done');
    //calculate strength
    calcStrength();
});