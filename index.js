    //ladda in html&css
window.onload = function () {


    //variabler först att arbeta med

    //slider variabler
    const slider = document.querySelector("input.slider");
    let sliderNum = document.querySelector("div.length-result");

    //checkboxar variabler

    const checkboxes = document.getElementsByClassName("checkbox");
    const incUpper = document.getElementById("include-uppercase");
    const incLower = document.getElementById("include-lowercase");
    const incNumber = document.getElementById("include-numbers");
    const incSymbol = document.getElementById("include-symbols");
    const incSimple = document.getElementById("include-simple");

    //levels variabler

    const levels = document.getElementsByClassName("level");
    const level1 = document.getElementById("level1");
    const level2 = document.getElementById("level2");
    const level3 = document.getElementById("level3");
    const level4 = document.getElementById("level4");

    //knapp variabler
    const generate = document.getElementById("generate-button");
    const copyButton = document.getElementById("copy-button");

    //ingredienser
    const upperLetters = "ABCDEFGHIJKLMNOPQRSTUWXYZ";
    const lowerLetters = "abcdefgihjklmnopqrstuwxyz";
    const numbers = "0123456789";
    const symbols = "#$%^&*()-_+.,;:`~|[]{}";
    const simple = "!?%@/=";

    //texters variabler
    const complexText = document.getElementById("complex-level-text");
    const password = document.getElementById("password");

    //det grafiska för slidern, värden & färg
    //sifforna
    sliderNum.innerHTML = slider.value;
    //siffror baserat på var slidern är
    slider.oninput = function () {
        sliderNum.innerHTML = this.value;
        if (this.value < minimumValue()) {
            sliderNum.innerHTML = minimumValue();
        }
    };

    //checkboxarna
    //?
    for (let box of checkboxes) {
        box.addEventListener("click", function () {
            const inputEvent = new Event("input", {bubbles:true});
            slider.dispatchEvent(inputEvent);
        });

    }

    //minvärde slider
    slider.addEventListener("input", function () {
        if(slider.value < minimumValue()) {
            slider.value = minimumValue();
        }
    })
    //färgen följer med
    slider.addEventListener("input", function () {
        let x = slider.value * 3.3 - 1;
        let color = `linear-gradient(90deg, #A638F6 ${x}%, #2a2438 ${x}%)`;
        slider.style.background = color;
    });

    //minsta tillåtna värde, passlängd beroende på checkboxarna, array
    function minimumValue() {
        let checkboxList = [
            "include-uppercase",
            "include-lowercase",
            "include-numbers",
            "include-symbols",
            "include-simple",
        ];
        let checkedCount = 0;
        for (let i of checkboxList) {
            if (document.getElementById(i).checked) {
                checkedCount++;
            }
        }
        return checkedCount;
    }

    function noLevel(level) {
        level.style.border = "solid #ffffff 1px";
        level.style.background = "#A638F6";
    }
    
    function levelOn(level, color) {
        level.style.border = `solid ${color} 1px`;
        level.style.background = color;
    }

    //räkna ut complexlevel
    function calcComplex() {
        let complex = 0;
        complex = password.textContent.length;
        if(incUpper.checked) complex += 1;
        if(incLower.checked) complex += 1;
        if(incNumber.checked) complex += 1;
        if(incSymbol.checked) complex += 1;
        if(incSimple.checked) complex += 1;
        return complex;
    }
    //slumpa random
    function randomIndex(item) {
        return Math.floor(Math.random() * item.length);
    }
    //slå in i array
    function randomizeArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() *(i +1)); 
        [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    //skapa lösenordet, beroende på vad som är checkat
    function generatePassword(sliderNum) {
        let startList = [];
        let optionList = [];
        

        if (incUpper.checked) {
            startList.push(upperLetters[randomIndex(upperLetters)]);
            optionList.push(upperLetters);
            
        }
        if (incLower.checked) {

            startList.push(lowerLetters[randomIndex(lowerLetters)]);
            optionList.push(lowerLetters);
            
        }
        if (incNumber.checked) {

            startList.push(numbers[randomIndex(numbers)]);
            optionList.push(numbers);
           
        }
        if (incSymbol.checked) {

            startList.push(symbols[randomIndex(symbols)]);
            optionList.push(symbols);
            
        }
        if (incSimple.checked) {

            startList.push(simple[randomIndex(simple)]);
            optionList.push(simple);
          
        }

        if (optionList.length === 0) {
            return "Please check at least one box to generate a valid password";
        }

       

        for (let i = 0; i < sliderNum - optionList.length; i++) {
            const randomOptionIndex = randomIndex(optionList);
            const randomOption = optionList[randomOptionIndex];
            const randomcharacterIndex = randomIndex(randomOption);
            const randomCharacter = randomOption[randomcharacterIndex];
            startList.push(randomCharacter);
        }
        return randomizeArray(startList).join("");


    }

    generate.addEventListener("click", function () {
        const originalString = generatePassword(slider.value);
        const rawString = String.raw`${originalString}`;

        password.innerHTML = rawString;

        let complex = calcComplex();

        let checkboxChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

         if (!checkboxChecked) {
        complexText.innerHTML = "...";
         }

       else if (complex <= 8) {
            complexText.innerHTML = "Weak";
            levelOn(level1, "#910000");
            noLevel(level2);
            noLevel(level3);
            noLevel(level4);
        } else if (complex <= 10) {
            complexText.innerHTML = "Medium";
            levelOn(level1, "#ff0101");
            levelOn(level2, "#ff0101");
            noLevel(level3);
            noLevel(level4);
        } else if (complex <= 18) {
            complexText.innerHTML = "Strong";
            levelOn(level1, "#ffa257");
            levelOn(level2, "#ffa257");
            levelOn(level3, "#ffa257");
            noLevel(level4);
        }
        else if (complex > 25) {
            complexText.innerHTML = "Great";
            levelOn(level1, "#4ABEA0");
            levelOn(level2, "#4ABEA0");
            levelOn(level3, "#4ABEA0");
            levelOn(level4, "#4ABEA0");
        }
    });

//kopiera!
copyButton.addEventListener("click", function () {
        const passwordToCopy = password.textContent;
        navigator.clipboard.writeText(passwordToCopy)
        alert("Your password is now copied to clipboard")
    });

}