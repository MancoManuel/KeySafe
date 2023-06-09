var passwords;

function generate() {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var allSymbols = "!*.-_$/&%?,;:+";
    const length = document.querySelector("#lengthSpinner").value;

    const pwd_field = document.querySelector("#pwd");
    const options = [
        document.querySelector("#uppercaseCb").checked,
        document.querySelector("#lowercaseCb").checked,
        document.querySelector("#numbersCb").checked,
        document.querySelector("#symbolsCb").checked
    ];
    
    const probabilities = [0.45, 0.45, 0.05, 0.05];
    var sum = 0, remaining = 0;
    for (let i = 0; i < probabilities.length; i++) {
        if (!options[i])
            probabilities[i] = 0;
        else {
            sum += probabilities[i];
            remaining++;
        }
    }

    const logLabel = document.querySelector("#logLabel");
    logLabel.innerHTML = "";
    if (remaining == 0) {
        logLabel.innerHTML = "Select at least one option!";
        logLabel.style = "color: red;";
        return;
    }

    var fraction = (1-sum)/remaining;
    var increaseAmts = [];
    for (let i = 0; i < probabilities.length; i++) {
        var incAmt;
        if (options[i]) {
            probabilities[i] += fraction;
            incAmt = (1-probabilities[i])/(length-1);
        } else incAmt = 0;
        increaseAmts.push(incAmt);
    }

    pwd_field.value = "";
    for (var i = 0; i < length; i++) {
        var index = -1;
        for (let j = 0; j < probabilities.length; j++)
            if (options[j] && (index == -1 || probabilities[j] > probabilities[index]))
                index = j;

        var char;
        if (index <= 1) {
            char = alphabet[Math.floor(Math.random() * alphabet.length)];
            if (index == 1)
                char = char.toLowerCase();
        } else if (index == 2)
            char = Math.floor(Math.random() * 10);
        else char = allSymbols[Math.floor(Math.random() * allSymbols.length)];
        
        probabilities[index] = 0;
        for (let j = 0; j < probabilities.length; j++)
            if (j != index)
                probabilities[j] += increaseAmts[j];
        pwd_field.value += char;
    }
}

function togglePwdVisibility() {
    const pwdField = document.querySelector("#pwd");
    const eyeBtn = document.querySelector("#eyeBtn");

    if (pwdField.getAttribute("type") == "password")
        pwdField.setAttribute("type", "text");
    else pwdField.setAttribute("type", "password");

    eyeBtn.classList.toggle("bi-eye-fill");
    eyeBtn.classList.toggle("bi-eye-slash-fill");
}

function toggleSinglePwdVisibility(index) {
    const pwdText = document.getElementById("pwd-text" + index);
    if (pwdText.getAttribute("type") == "text")
        pwdText.setAttribute("type", "password");
    else pwdText.setAttribute("type", "text");

    const eyeBtn = document.getElementById("eyeBtn" + index);
    eyeBtn.classList.toggle("bi-eye-fill");
    eyeBtn.classList.toggle("bi-eye-slash-fill");
}

function load(passwordList, success) {
    var label = document.querySelector("#logLabel");
    if (success == 1) {
        label.innerHTML = "Password created!";
        label.setAttribute("style", "color: green;");
        console.log("Password creata!");
    } else if (success == -1) {
        label.innerHTML = "Password not created!";
        label.setAttribute("style", "color: red;");
        console.log("Password non creata!");
    } else if (success == 2) {
        label.innerHTML = "Password already exists!";
        label.setAttribute("style", "color: red;");
    }

    passwords = JSON.parse(passwordList);

    showHideMakerForm();
    hideMenuShape(findMenu("stored-pwd-menu"));
    if (passwords.length == 0) {
        var arrow = findArrow(findMenu("stored-pwd-menu").parentNode);
        arrow.classList.add("disabled");
    }
}

function showHideMakerForm() {
    showHideMenu(findMenu("pwd-maker-menu"));
}

function showHidePasswords() {
    if (passwords.length > 0)
        showHideMenu(findMenu("stored-pwd-menu"));
}

function showHideMenu(menu) {
    var container = menu.parentNode;
    menu.classList.toggle("show");
        
    if (!menu.classList.contains("show")) {
        var listener = () => {
            hideMenuShape(menu);
            menu.removeEventListener("transitionend", listener);
        };
        menu.addEventListener("transitionend", listener);
    } else showMenuShape(menu);

    var arrow = findArrow(container);
    arrow.classList.toggle("open");
}

function hideMenuShape(menu) {
    menu.setAttribute("style", "position: absolute; visibility: hidden;");
}

function showMenuShape(menu) {
    menu.setAttribute("style", "position: relative; visibility: visible;");
}

function editPassword(index) {
    document.getElementById("actions" + index).classList.toggle("removed");

    const pwdContainer = document.getElementById("single-pwd-container" + index);
    pwdContainer.classList.toggle("disabled");
    const pwdText = document.getElementById("pwd-text" + index);
    pwdText.disabled = !pwdText.disabled;
    const accountText = document.getElementById("account-text" + index);
    accountText.disabled = !accountText.disabled;

    document.getElementById("submitButtons" + index).classList.toggle("removed");

    var confirmAction = document.getElementById("confirmAction" + index);
    confirmAction.setAttribute("onclick", "submitChange(" + index + ")");

    var cancelAction = document.getElementById("cancelAction" + index);
    cancelAction.setAttribute("onclick", "editPassword(" + index + ")");

    if (pwdContainer.classList.contains("disabled")) {
        console.log("Fatto");
        accountText.value = passwords[index].accountName;
        pwdText.value = passwords[index].password;
    }
}

function toggleSubmitButtons(index) {
    document.getElementById("submitButtons" + index).classList.toggle("removed");
}

function submitChange(index) {
    var actionSpec = document.getElementById("actionSpec" + index);
    actionSpec.setAttribute("value", "edit");
    document.getElementById("single-pwd-form" + index).submit();
}

function deletePassword(index) {
    document.getElementById("actions" + index).classList.toggle("removed");
    document.getElementById("submitButtons" + index).classList.toggle("removed");

    var confirmAction = document.getElementById("confirmAction" + index);
    confirmAction.setAttribute("onclick", "submitDeletion(" + index + ")");

    var cancelAction = document.getElementById("cancelAction" + index);
    cancelAction.setAttribute("onclick", "deletePassword(" + index + ")");
}

function copyPassword(index) {
    var copyText = document.getElementById("pwd-text" + index);
    navigator.clipboard.writeText(copyText.value);

    var copyIcon = document.getElementById("copyIcon" + index);
    copyIcon.classList.toggle("bi-clipboard-fill");
    copyIcon.classList.toggle("bi-clipboard-check-fill");
    setTimeout(() => {
        copyIcon.classList.toggle("bi-clipboard-check-fill");
        copyIcon.classList.toggle("bi-clipboard-fill");
    }, 2000);
}

function submitDeletion(index) {
    var actionSpec = document.getElementById("actionSpec" + index);
    actionSpec.setAttribute("value", "delete");
    document.getElementById("single-pwd-form" + index).submit();
}

function findMenu(containerId) {
    var container = document.getElementById(containerId);
    return container.getElementsByClassName("menu")[0];
}

function findArrow(container) {
    return container.getElementsByClassName("bi bi-chevron-up")[0];
}