import { weeks, months, applicationsInit, sizeListInit } from "./init.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let sizeList = JSON.parse(localStorage.getItem("sizeList")) || 0;

const app = (() => {
    const applications =
        JSON.parse(localStorage.getItem("applications")) || applicationsInit;

    return {
        lastClicked: 0,
        renderIcon() {
            $(".main-list").style.width = `${sizeListInit[sizeList]}px`;

            if (sizeList == 0) {
                $$(".size-icon .right-click__item")[2].classList.add("active");
            } else if (sizeList == 1) {
                $$(".size-icon .right-click__item")[1].classList.add("active");
            } else {
                $$(".size-icon .right-click__item")[0].classList.add("active");
            }
        },
        renderApp() {
            const htmls = applications
                .map((app, index) => {
                    return `
                <li class="main-item" index="${index}" title="${app.name}">
                    <div class="main-item__icon">
                        <img src="${app.icon}" alt="">
                    </div>
                    <input readonly value="${app.name}" class="main-item__name">    
                </li>
                `;
                })
                .join("");
            $(".main-list").innerHTML = htmls;
        },
        newApp(type, name) {
            const types = ["folder", "shortcut", "text", "word"];
            const icons = [
                "./assets/img/apps/icon-folder.png",
                "./assets/img/apps/icon-shortcut.png",
                "./assets/img/apps/icon-text.png",
                "./assets/img/apps/icon-word.png",
            ];
            const names = [
                "New Folder",
                "New Shortcut",
                "New Text",
                "New Word",
            ];

            let iconApp, nameApp;
            types.forEach((item, index) => {
                if (item == type) {
                    iconApp = icons[index];
                    nameApp = name || names[index];
                }
            });

            const obj = {
                id: applications.length,
                iconApp,
                nameApp,
            };

            applications.push(obj);
            localStorage.setItem("applications", JSON.stringify(applications));
            this.renderApp();
        },
        handle() {
            const _this = this;
            const mainItems = $$(".main-item");
            const powerOnBtn = $(".power-on-btn");
            const modalPower = $(".modal-power");
            const modalPowerLoading = $(".modal-power__loading");
            const modalPowerOn = $(".modal-power__power-on");
            const modalPowerLogin = $(".modal-power__login");
            const inputPIN = $(".modal-power__PIN-input");
            const modalPowerStatus = $(".modal-power__status");
            const shutdownBtns = $$(".shutdown-btn");
            const restartBtn = $(".restart-btn");
            const main = $(".main");
            const rightBox = $(".right-click");
            const itemsRightClick = $$(".right-click__item");
            const widthMain = main.offsetWidth;
            const heightMain = main.offsetHeight;
            const widthRightBox = rightBox.offsetWidth;
            const heightRightBox = rightBox.offsetHeight;

            //right click
            main.oncontextmenu = function (e) {
                e.preventDefault();
                let top, left;
                e.clientX + widthRightBox <= widthMain
                    ? (left = e.clientX)
                    : (left = e.clientX - widthRightBox);
                e.clientY + heightRightBox <= heightMain
                    ? (top = e.clientY)
                    : (top = e.clientY - heightRightBox);

                Object.assign(rightBox.style, {
                    top: top + "px",
                    left: left + "px",
                    visibility: "visible",
                });
            };

            //hover menu right click
            itemsRightClick.forEach((item) => {
                const width = $(".right-click__sub-menu").offsetWidth;

                item.onmouseover = function () {
                    const left = rightBox.offsetLeft;
                    const top = rightBox.offsetTop;
                    const subMenu = this.querySelector(
                        ".right-click__sub-menu"
                    );
                    if (subMenu) {
                        if (left + widthRightBox + width <= widthMain) {
                            Object.assign(subMenu.style, {
                                left: "100%",
                            });
                        } else {
                            Object.assign(subMenu.style, {
                                left: "-110%",
                            });
                        }

                        if (top + heightRightBox + 20 <= heightMain) {
                            Object.assign(subMenu.style, {
                                top: "-2px",
                                transform: "translateY(0%)",
                            });
                        } else {
                            Object.assign(subMenu.style, {
                                top: "100%",
                                transform: "translateY(-100%)",
                            });
                        }
                        subMenu.classList.add("active");
                    }
                };
                item.onmouseout = function () {
                    const subMenu = this.querySelector(
                        ".right-click__sub-menu"
                    );
                    if (subMenu) {
                        subMenu.classList.remove("active");
                    }
                };
            });

            //power status
            const loadingScreen = (status) => {
                modalPower.classList.add("active");
                modalPowerOn.classList.remove("active");
                modalPowerLogin.classList.remove("active");
                modalPowerStatus.innerHTML = status;
                modalPowerLoading.classList.add("active");
            };

            const loginScreen = () => {
                modalPowerLoading.classList.remove("active");
                modalPowerLogin.classList.add("active");
                inputPIN.focus();
            };

            const powerOnScreen = () => {
                modalPowerLoading.classList.remove("active");
                modalPowerOn.classList.add("active");
            };

            const pcScreen = () => {
                modalPower.classList.remove("active");
                modalPowerLogin.classList.remove("active");
                modalPowerOn.classList.remove("active");
                modalPowerLoading.classList.remove("active");
            };

            powerOnBtn.onclick = function () {
                loadingScreen("Starting");
                setTimeout(loginScreen, 3000);
            };

            inputPIN.oninput = function () {
                const value = this.value.trim();
                if (value == "1410") {
                    this.value = null;
                    loadingScreen("Starting");
                    setTimeout(pcScreen, 3000);
                }
            };

            shutdownBtns.forEach((item) => {
                item.onclick = () => {
                    $(".start-box").classList.remove("active");
                    loadingScreen("Shutting down");
                    setTimeout(powerOnScreen, 3000);
                };
            });

            restartBtn.onclick = () => {
                $(".start-box").classList.remove("active");
                loadingScreen("Restarting");
                setTimeout(loginScreen, 3000);
            };

            //size icon
            const styleList = $$(".size-icon .right-click__item");
            styleList.forEach((item) => {
                item.onclick = function () {
                    const itemActive = $(".right-click__item.active");
                    if (itemActive) {
                        itemActive.classList.remove("active");
                    }

                    if (this.classList.contains("size-L")) {
                        sizeList = 2;
                    }
                    if (this.classList.contains("size-M")) {
                        sizeList = 1;
                    }
                    if (this.classList.contains("size-S")) {
                        sizeList = 0;
                    }
                    localStorage.setItem("sizeList", JSON.stringify(sizeList));
                    this.classList.add("active");
                    _this.renderIcon();
                    _this.renderApp();
                };
            });

            //show desktop icon desktop
            const showHideIcon = $(".show-hide-icon");
            showHideIcon.onclick = function () {
                if (this.classList.contains("active")) {
                    $(".main-list").style.visibility = "hidden";
                } else {
                    $(".main-list").style.visibility = "visible";
                }
                this.classList.toggle("active");
            };

            //F5
            const F5Btn = $(".F5-btn");
            F5Btn.onclick = () => {
                $(".main-list").style.visibility = "hidden";
                setTimeout(() => {
                    $(".main-list").style.visibility = "visible";
                }, 200);
                rightBox.style.visibility = "hidden";
            };

            //new app
            const type = ["folder", "shortcut", "text", "word"];
            const newAppList = $$(".new-app-list .right-click__item");

            newAppList.forEach((item, index) => {
                item.onclick = function () {
                    _this.newApp(type[index]);
                    rightBox.style.visibility = "hidden";
                };
            });

            //onclick main list
            const listApp = $(".main-list");
            listApp.onclick = (e) => {
                const app = e.target.closest(".main-item");

                if (app) {
                    const itemActive = $(".main-item.active");
                    if (itemActive) {
                        itemActive.classList.remove("active");
                    }

                    app.classList.add("active");
                }
            };

            //window
            window.onkeydown = function (e) {
                if (e.which === 116) {
                    e.preventDefault();

                    $(".main-list").style.visibility = "hidden";
                    setTimeout(() => {
                        $(".main-list").style.visibility = "visible";
                    }, 300);
                }
            };
        },
        start() {
            this.renderIcon();
            this.renderApp();
            this.handle();
        },
    };
})().start();

const footer = (() => {
    return {
        handle() {
            const startIcon = $(".footer-left__start-icon");
            const startBox = $(".start-box");
            const leftStartBox = $(".start-box__left");
            const date = new Date();
            const timeRight = $(".footer-right__time");
            const timeBox = $(".footer-right__time-time");
            const dateBox = $(".footer-right__time-date");

            //update time
            setInterval(() => {
                const hour = date.getHours();
                const min = date.getMinutes();
                const day = date.getDate();
                const month = date.getMonth();
                const year = date.getFullYear();
                const weekday = date.getDay();

                timeBox.innerHTML =
                    `0${hour}`.slice(-2) + ":" + `0${min}`.slice(-2);
                dateBox.innerHTML =
                    `0${month + 1}`.slice(-2) +
                    "/" +
                    `0${day}`.slice(-2) +
                    "/" +
                    `${year}`;

                timeRight.title = `${weeks[weekday]}, ${months[month]} ${day} ${year}`;
            }, 1000);

            //mở startBox
            startIcon.onclick = function () {
                startBox.classList.toggle("active");
            };
            //hover
            leftStartBox.onmouseover = () => {
                leftStartBox.classList.add("active");
            };

            leftStartBox.onmouseout = () => {
                leftStartBox.classList.remove("active");
            };

            //window
            window.onclick = (e) => {
                const startIconE = e.target.closest(".footer-left__start-icon");
                const startBoxE = e.target.closest(".start-box");
                const mainItem = e.target.closest(".main-item");
                const rightClickBox = e.target.closest(".right-click");

                if (
                    !startIconE &&
                    !startBoxE &&
                    startBox.classList.contains("active")
                ) {
                    startBox.classList.remove("active");
                }

                if (!mainItem) {
                    const itemActive = $(".main-item.active");
                    if (itemActive) {
                        itemActive.classList.remove("active");
                    }
                }

                if (!rightClickBox) {
                    $(".right-click").style.visibility = "hidden";
                }
            };
        },
        start() {
            this.handle();
        },
    };
})().start();
