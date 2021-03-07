const CLEAR = document.getElementById("clear");
const LIST = document.getElementById("list");
const INPUT = document.getElementById("input");
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle";
const SOLID_ICON = "fas";
const REGULAR_ICON = "far";
const LINE_THROUGH = "line-through";
const NO_LINE_THROUGH = "";
let list = [];
let id = 0;
let data = localStorage.getItem("TODO");

// If local storage data exists it is parsed and passed to the loadList function.
if (data) {
    list = JSON.parse(data);
    id = list.length;
    loadList(list);
} else {
    list = [];
    id = 0;
}

// Each item in local storage is supplied to the addToDo function.
function loadList(list) {
    list.forEach(function (ITEM) {
        addToDo(ITEM.name, ITEM.id, ITEM.done, ITEM.trash);
    });
}

// This function displays the To-Do list on the screen.
function addToDo(toDo, id, done, trash) {
    // If an item's trash key is set to true it is prevented from being displayed by returning from the function.
    if (trash) {
        return;
    }

    let style;
    let check;
    let line;

    // The display settings for an item is set based on whether or not it is done.
    if (done == true) {
        style = SOLID_ICON;
        check = CHECK;
        line = LINE_THROUGH;
    } else if (done == false) {
        style = REGULAR_ICON;
        check = UNCHECK;
        line = NO_LINE_THROUGH;
    }

    // The HTML for an item is set using string interprolation to add the variable values.
    // Clicking the icons or the textfield will cause their respective functions to be called.
    const ITEM = ` <li class="item">
    <i id="${id}" class="${style} ${check} complete"  onclick="completeToDo(event)"></i>
    <p id="${id}" class="text ${line}"  contenteditable="true" onkeydown="editToDo(event)" onblur="editToDo(event)" spellcheck="false">${toDo}</p>
    <i id="${id}" class="far fa-trash-alt delete" onclick="removeToDo(event)"></i>
    </li>`;

    // The item is inserted as the last child of the list.
    const POSITION = "beforeend";
    LIST.insertAdjacentHTML(POSITION, ITEM);
}

// When the enter key is pressed the value in the input field is displayed to the screen and added to local storage.
document.getElementById("input").addEventListener("keydown", function (event) {
    if (event.key == "Enter") {
        const toDo = INPUT.value;
        if (toDo) {
            addToDo(toDo, id, false, false);
            list.push({
                name: toDo,
                id: id,
                done: false,
                trash: false,
            });
            localStorage.setItem("TODO", JSON.stringify(list));
            id++;
        }
        INPUT.value = "";
    }
});

// When the add item button is pressed the value in the input field is displayed to the screen and added to local storage.
function button() {
    const toDo = INPUT.value;
    if (toDo) {
        addToDo(toDo, id, false, false);
        list.push({
            name: toDo,
            id: id,
            done: false,
            trash: false,
        });
        localStorage.setItem("TODO", JSON.stringify(list));
        id++;
    }
    INPUT.value = "";
}

// The appearance of an item is changed when the check circle icon it clicked.
// The value of the done key for the item is also toggled.
function completeToDo(event) {
    const ELEMENT = event.target;
    ELEMENT.classList.toggle(SOLID_ICON);
    ELEMENT.classList.toggle(REGULAR_ICON);
    ELEMENT.classList.toggle(CHECK);
    ELEMENT.classList.toggle(UNCHECK);
    ELEMENT.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);
    if (list[ELEMENT.id].done == false) {
        list[ELEMENT.id].done = true;
    } else if (list[ELEMENT.id].done == true) {
        list[ELEMENT.id].done = false;
    }
    localStorage.setItem("TODO", JSON.stringify(list));
}

// The item is edited if the enter key is pressed or if the user navigates away from the text field.
function editToDo(event) {
    if (event.key == "Enter") {
        event.preventDefault();
        const ELEMENT = event.target;
        list[ELEMENT.id].name = ELEMENT.textContent;
        document.activeElement.blur();
        localStorage.setItem("TODO", JSON.stringify(list));
    } else if (event.type == "blur") {
        const ELEMENT = event.target;
        list[ELEMENT.id].name = ELEMENT.textContent;
        localStorage.setItem("TODO", JSON.stringify(list));
    }
}

// The list item containing the element is removed from the unordered list.
// The value of the trash key is set to true.
function removeToDo(event) {
    const ELEMENT = event.target;
    ELEMENT.parentNode.parentNode.removeChild(ELEMENT.parentNode);
    list[ELEMENT.id].trash = true;
    localStorage.setItem("TODO", JSON.stringify(list));
}

// If the clear button is pressed the contents of local storage are deleted and the page is reloaded.
CLEAR.addEventListener("click", function () {
    localStorage.clear();
    location.reload();
});
