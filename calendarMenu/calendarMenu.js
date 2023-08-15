function CalendarControl() {


    const calendar = new Date();
    const calendarControl = {
        localDate: new Date(),
        prevMonthLastDate: null,
        calWeekDays: ["D", "S", "T", "Q", "Q", "S", "S"],
        calMonthName: [
            "JANEIRO",
            "FEVEREIRO",
            "MARÇO",
            "ABRIL",
            "MAIO",
            "JUNHO",
            "JULHO",
            "AGOSTO",
            "SETEMBRO",
            "OUTUBRO",
            "NOVEMBRO",
            "DEZEMBRO"
        ],
        daysInMonth: function (month, year) {
            return new Date(year, month, 0).getDate();
        },
        firstDay: function () {
            return new Date(calendar.getFullYear(), calendar.getMonth(), 1);
        },
        lastDay: function () {
            return new Date(calendar.getFullYear(), calendar.getMonth() + 1, 0);
        },
        firstDayNumber: function () {
            return calendarControl.firstDay().getDay() + 1;
        },
        lastDayNumber: function () {
            return calendarControl.lastDay().getDay() + 1;
        },
        getPreviousMonthLastDate: function () {
            let lastDate = new Date(
                calendar.getFullYear(),
                calendar.getMonth(),
                0
            ).getDate();
            return lastDate;
        },
        navigateToPreviousMonth: function () {
            calendar.setMonth(calendar.getMonth() - 1);
            calendarControl.attachEventsOnNextPrev();
        },
        navigateToNextMonth: function () {
            calendar.setMonth(calendar.getMonth() + 1);
            calendarControl.attachEventsOnNextPrev();
        },
        navigateToCurrentMonth: function () {
            let currentMonth = calendarControl.localDate.getMonth();
            let currentYear = calendarControl.localDate.getFullYear();
            calendar.setMonth(currentMonth);
            calendar.setYear(currentYear);
            calendarControl.attachEventsOnNextPrev();
        },
        displayYear: function () {
            let yearLabel = document.querySelector(".calendar-menu .calendar-year-label");
            yearLabel.innerHTML = calendar.getFullYear();
        },
        displayMonth: function () {
            let monthLabel = document.querySelector(
                ".calendar-menu .calendar-month-label"
            );
            monthLabel.innerHTML = calendarControl.calMonthName[calendar.getMonth()];
        },
        
        selectDate: function (e) {


            // Verificar se a data clicada já possui a classe "selectedDay"
            const isSelected = e.target.classList.contains("selectedDay");

            // Remover a classe "selectedDay" de todas as datas
            const dateNumbers = document.querySelectorAll(".calendar-menu .dateNumber");
            dateNumbers.forEach((dateNumber) => {
                dateNumber.classList.remove("selectedDay");
            });

            // Adicionar ou remover a classe "selectedDay" com base na seleção atual
            if (!isSelected) {
                e.target.classList.add("selectedDay");
            }

            // Obter informações da data selecionada, se houver uma seleção
            let selectedInfo = "";
            if (isSelected) {
                selectedInfo = "";
            } else {
                const selectedDay = e.target.textContent;
                const selectedMonth = calendarControl.calMonthName[calendar.getMonth()];
                const selectedYear = calendar.getFullYear();
                selectedInfo = `<h2><strong>${selectedDay} ${selectedMonth} de ${selectedYear}</strong></h2>`;
            }

            if (selectedInfo == '') {
                selectedInfo = `<h2><strong>Selecione uma data para o novo prato</strong></h2>`;
            }

            // Atualizar o conteúdo da div com a data selecionada ou vazia, dependendo da seleção
            const dateDescriptionDiv = document.getElementById("selectedDateDescription");
            dateDescriptionDiv.innerHTML = selectedInfo;

            //exibi no console a data selecionada
            const dataSelecionada = `${calendar.getFullYear()}-${String(calendar.getMonth() + 1).padStart(2, '0')}-${String(e.target.textContent).padStart(2, '0')}`;
            console.log("Data selecionada: " + dataSelecionada);
        },
        plotSelectors: function () {
            document.querySelector(
                ".calendar-menu"
            ).innerHTML += `
            <div class="calendar-inner">
        <div class="calendar-controls">
            <div class="calendar-year-month">
            -
                <div class="calendar-year-label"></div>
                -
            </div>
            <div class="calendar-month-arrow">
                <div class="calendar-month-label"></div>
                <span class="calendar-arrow">
                    <div class="calendar-prev"><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="10"
                            viewBox="0 0 128 128">
                            <path fill="#FFF"
                                d="M88.2 3.8L35.8 56.23 28 64l7.8 7.78 52.4 52.4 9.78-7.76L45.58 64l52.4-52.24z" />
                        </svg></a>
                        </div>
                    <div class="calendar-next"><a href="#"><svg xmlns="http://  www.w3.org/2000/svg" width="14" height="10"
                            viewBox="0 0 128 128">
                            <path fill="#FFF"
                                d="M38.8 124.2l52.4-52.42L99 64l-7.77-7.78-52.4-52.4-9.8 7.77L81.44 64 29 116.42z" />
                        </svg></a>
                    </div>
                </span>
            </div>
        </div>
        <div class="calendar-today-date" style="display:none;">Today:
            ${calendarControl.calWeekDays[calendarControl.localDate.getDay()]},
            ${calendarControl.localDate.getDate()},
            ${calendarControl.calMonthName[calendarControl.localDate.getMonth()]}
            ${calendarControl.localDate.getFullYear()}
        </div>
        <div class="calendar-body"></div>
    </div>`;
        },
        plotDayNames: function () {
            for (let i = 0; i < calendarControl.calWeekDays.length; i++) {
                document.querySelector(
                    ".calendar-menu .calendar-body"
                ).innerHTML += `<div>${calendarControl.calWeekDays[i]}</div>`;
            }
        },
        plotDates: function () {
            // Declaração da variável calendarDays
            calendarControl.calendarDays = calendarControl.daysInMonth(
                calendar.getMonth() + 1,
                calendar.getFullYear()
            );

            // fazendo a integração com a api de feriados
            const countryCode = 'BR'; // Código do país (Brasil)
            const year = calendar.getFullYear(); // Obtém o ano atual
            //https://date.nager.at/api/v3/PublicHolidays/2023/br
            fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`)
                .then(response => response.json())
                .then(data => {
                    // Data contém uma lista de feriados
                    // console.log(data);

                    // Chamando o método para marcar os feriados no calendário
                    this.markHolidays(data);
                })
                .catch(error => {
                    console.error('Erro ao buscar feriados:', error);
                });


            document.querySelector(".calendar-menu .calendar-body").innerHTML = "";
            calendarControl.plotDayNames();
            calendarControl.displayMonth();
            calendarControl.displayYear();
            let count = 1;
            let prevDateCount = 0;

            calendarControl.prevMonthLastDate = calendarControl.getPreviousMonthLastDate();
            let prevMonthDatesArray = [];
            calendarDays = calendarControl.daysInMonth(
                calendar.getMonth() + 1,
                calendar.getFullYear()
            );
            // dates of current month
            for (let i = 1; i < calendarDays; i++) {
                if (i < calendarControl.firstDayNumber()) {
                    prevDateCount += 1;
                    document.querySelector(
                        ".calendar-menu .calendar-body"
                    ).innerHTML += `<div class="prev-dates"></div>`;
                    prevMonthDatesArray.push(calendarControl.prevMonthLastDate--);
                } else {
                    document.querySelector(
                        ".calendar-menu .calendar-body"
                    ).innerHTML += `<div class="number-item" data-num=${count}><a class="dateNumber" href="#">${count++}</a></div>`;
                }
            }
            
            for (let j = 0; j < prevDateCount + 1; j++) {
                document.querySelector(
                    ".calendar-menu .calendar-body"
                ).innerHTML += `<div class="number-item" data-num=${count}><a class="dateNumber" href="#">${count++}</a></div>`;
            }
            calendarControl.highlightToday();
            calendarControl.plotPrevMonthDates(prevMonthDatesArray);
            calendarControl.plotNextMonthDates();

            // Chama a função para marcar os finais de semana
            calendarControl.markWeekends();
        },
        attachEvents: function () {
            let prevBtn = document.querySelector(".calendar-menu .calendar-prev a");
            let nextBtn = document.querySelector(".calendar-menu .calendar-next a");
            let todayDate = document.querySelector(".calendar-menu .calendar-today-date");
            let dateNumber = document.querySelectorAll(".calendar-menu .dateNumber");
            prevBtn.addEventListener(
                "click",
                calendarControl.navigateToPreviousMonth
            );
            nextBtn.addEventListener("click", calendarControl.navigateToNextMonth);
            todayDate.addEventListener(
                "click",
                calendarControl.navigateToCurrentMonth
            );
            for (var i = 0; i < dateNumber.length; i++) {
                dateNumber[i].addEventListener(
                    "click",
                    calendarControl.selectDate,
                    false
                );
            }
        },
        markWeekends: function () {
            const dateNumbers = document.querySelectorAll(".calendar-menu .dateNumber");
            dateNumbers.forEach((dateNumber) => {
                const dayNumber = parseInt(dateNumber.textContent);
                const currentYear = calendar.getFullYear();
                const currentMonth = calendar.getMonth();
                const currentDate = new Date(currentYear, currentMonth, dayNumber);
                console.log(currentDate);
                const dayOfWeek = currentDate.getDay(); // 0 para domingo, 1 para segunda, ..., 6 para sábado
                console.log(dayOfWeek);
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    dateNumber.classList.add("weekend");
                } else {
                    dateNumber.classList.remove("weekend");
                }
            });
        },
        markHolidays: function (feriados) {
            const dateNumbers = document.querySelectorAll(".calendar-menu .dateNumber");
            dateNumbers.forEach((dateNumber) => {
                const dayNumber = parseInt(dateNumber.textContent);

                const currentDate = new Date(
                    calendarControl.localDate.getFullYear(),
                    calendarControl.localDate.getMonth(),
                    dayNumber
                );

                const formattedCurrentDate = `${calendar.getFullYear()}-${String(calendar.getMonth() + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;

                // console.log(formattedCurrentDate);

                const isFeriado = feriados.some((feriado) => {

                    const feriadoDate = new Date(feriado.date + 'T00:00:00');
                    const formattedFeriadoDate = `${feriadoDate.getFullYear()}-${String(feriadoDate.getMonth() + 1).padStart(2, '0')}-${String(feriadoDate.getDate()).padStart(2, '0')}`;

                    return formattedFeriadoDate === formattedCurrentDate;
                });

                if (isFeriado) {
                    dateNumber.classList.add("feriado");
                } else {
                    dateNumber.classList.remove("feriado");
                }
            });

        },
        highlightToday: function () {
            let currentMonth = calendarControl.localDate.getMonth() + 1;
            let changedMonth = calendar.getMonth() + 1;
            let currentYear = calendarControl.localDate.getFullYear();
            let changedYear = calendar.getFullYear();
            if (
                currentYear === changedYear &&
                currentMonth === changedMonth &&
                document.querySelectorAll(".number-item")
            ) {
                document
                    .querySelectorAll(".number-item")[calendar.getDate() - 1].classList.add("calendar-today");
            }
        },
        plotPrevMonthDates: function (dates) {
            dates.reverse();
            for (let i = 0; i < dates.length; i++) {
                if (document.querySelectorAll(".prev-dates")) {
                    document.querySelectorAll(".prev-dates")[i].textContent = dates[i];
                }
            }
        },
        plotNextMonthDates: function () {
            let childElemCount = document.querySelector('.calendar-body').childElementCount;
            //7 lines
            if (childElemCount > 42) {
                let diff = 49 - childElemCount;
                calendarControl.loopThroughNextDays(diff);
            }

            //6 lines
            if (childElemCount > 35 && childElemCount <= 42) {
                let diff = 42 - childElemCount;
                calendarControl.loopThroughNextDays(42 - childElemCount);
            }

        },
        loopThroughNextDays: function (count) {
            if (count > 0) {
                for (let i = 1; i <= count; i++) {
                    document.querySelector('.calendar-body').innerHTML += `<div class="next-dates">${i}</div>`;
                }
            }
        },
        attachEventsOnNextPrev: function () {
            calendarControl.plotDates();
            calendarControl.attachEvents();
            calendarControl.markWeekends(); // Chama a função para marcar os finais de semana
        },
        init: function () {
            calendarControl.plotSelectors();
            calendarControl.plotDates();
            calendarControl.attachEvents();
        }
    };
    calendarControl.init();
}

const calendarControl = new CalendarControl();