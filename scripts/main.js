const CLEAR = document.getElementById("clear");
const LIST = document.getElementById("list");
const INPUT = document.getElementById("input");
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle";
const LINE_THROUGH = "line-through";
let list = [];
let id = 0;
let data = localStorage.getItem("TODO");

if (data) {
    list = JSON.parse(data);
    id = list.length;
    loadList(list);
} else {
    list = [];
    id = 0;
}

function loadList(array) {
    array.forEach(function (ITEM) {
        addToDo(ITEM.name, ITEM.id, ITEM.done, ITEM.trash);
    });
}

CLEAR.addEventListener("click", function () {
    localStorage.clear();
    location.reload();
});

function addToDo(toDo, id, done, trash) {
    if (trash) {
        return;
    }

    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";

    const ITEM = ` <li class="item">
    <i class="far ${DONE} complete" job="complete" id="${id}"></i>
    <p class="text ${LINE}">${toDo}</p>
    <i class="far fa-trash-alt delete" job="delete" id="${id}"></i>
    </li>`;
    const POSITION = "beforeend";
    LIST.insertAdjacentHTML(POSITION, ITEM);
}

document.addEventListener("keyup", function (event) {
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

function completeToDo(ELEMENT) {
    ELEMENT.classList.toggle(CHECK);
    ELEMENT.classList.toggle(UNCHECK);
    ELEMENT.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);
    list[ELEMENT.id].done = list[ELEMENT.id].done ? false : true;
}

function removeToDo(ELEMENT) {
    ELEMENT.parentNode.parentNode.removeChild(ELEMENT.parentNode);
    list[ELEMENT.id].trash = true;
}

LIST.addEventListener("click", function (event) {
    const ELEMENT = event.target;
    const ELEMENT_JOB = ELEMENT.attributes.job.value;
    if (ELEMENT_JOB == "complete") {
        completeToDo(ELEMENT);
    } else if (ELEMENT_JOB == "delete") {
        removeToDo(ELEMENT);
    }
    localStorage.setItem("TODO", JSON.stringify(list));
});
