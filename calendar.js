var Agile = Agile || {};
Agile.components = Agile.components || {};

/**
 * TODO
 * show remaining days from previous month
 * offset today
 */
Agile.components.DropDownCalendar = function (rootEl) {
    var self = this;

    this.rootEl = rootEl;

    this.options = rootEl.dataset.options || { startFromToday: false, offsetToday: 0 };
    if (rootEl.dataset.options != undefined) {
        this.options = JSON.parse(this.options)
        this.options.startFromToday = (this.options.startFromToday === 'true') || false;
        this.options.offsetToday = parseInt(this.options.offsetToday);
    }

    this.chosenDates = rootEl.querySelector('[data-chosen-dates]');
    this._day = this.chosenDates.querySelectorAll('p')[0]
    this._month = this.chosenDates.querySelectorAll('p')[1]

    this.table = rootEl.querySelector('[data-table]');
    this.header = rootEl.querySelector('[data-header]');
    this.monthYear = rootEl.querySelector('[data-month-year]');
    this.dropDownContent = rootEl.querySelector('[data-drop-down-content]');
    this.dropDownMonth = this.dropDownContent.querySelector('[data-dropdown-month]');
    this.dropDownYear = this.dropDownContent.querySelector('[data-dropdown-year]');
    this.calendarDates = rootEl.querySelector('[data-dates]');


    this.date = new Date();
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.days_short = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    this._day.innerHTML = this.getCurrentDay();
    this._month.innerHTML = this.months[this.getCurrentMonth()].substring(0, 3);


    this.chosenDates.addEventListener('click', () => {
        this.table.classList.toggle('hide');
    });

    this.header.addEventListener('click', () => {
        this.dropDownContent.classList.toggle('show-content');
        this.header.classList.toggle('set-color');
    });

    /* Setting up the Months and Years for the drop down content */
    let _monthCounter = 0;
    this.months.forEach((month) => {
        this.dropDownMonth.innerHTML += `<p data-val="${_monthCounter}">${month}</p>`;
        _monthCounter++;
    });

    let _offsetYears = 2;
    for (let i = this.getCurrentYear() - _offsetYears; i < this.getCurrentYear() + _offsetYears + 1; i++) {
        this.dropDownYear.innerHTML += `<p data-val="${i}">${i}</p>`;
    }

    let _selectedMonth = this.getCurrentMonth();
    let _selectedYear = this.getCurrentYear();
    /* Adding click even to each dropdown item */
    [].slice.call(this.dropDownMonth.querySelectorAll('p')).forEach((month) => {
        month.addEventListener('click', () => {
            _selectedMonth = parseInt(month.getAttribute("data-val"));
            this.monthYear.innerHTML = `${this.months[_selectedMonth]} ${_selectedYear}`;
            this.displayCalendar({
                month: _selectedMonth,
                year: _selectedYear
            });
        });
    });

    /* Adding click even to each dropdown item */
    [].slice.call(this.dropDownYear.querySelectorAll('p')).forEach((year) => {
        year.addEventListener('click', () => {
            _selectedYear = parseInt(year.getAttribute("data-val"));
            this.monthYear.innerHTML = `${this.months[_selectedYear]} ${_selectedYear}`;
            this.displayCalendar({
                month: _selectedMonth,
                year: _selectedYear
            });
        });
    });


    /* Setting the default */
    this.displayCalendar({ month: this.getCurrentMonth(), year: this.getCurrentYear() });
}

/**
 * Get Current Year
 */
Agile.components.DropDownCalendar.prototype.getCurrentYear = function () {
    return this.date.getFullYear();
}

/**
 * Get Current Month
 */
Agile.components.DropDownCalendar.prototype.getCurrentMonth = function () {
    return this.date.getMonth();
}

/**
 * Get Current Day
 */
Agile.components.DropDownCalendar.prototype.getCurrentDay = function () {
    return this.date.getDate();
}

/**
 * Get First Day of Month
 * @param {int} month index for months array (0 = January)
 * @param {int} year ie 2019
 */
Agile.components.DropDownCalendar.prototype.getFirstDayOfMonth = function (month, year) {
    return new Date(this.months[month] + " " + 1 + " " + year).toDateString().substring(0, 3);
}

/**
 * Gets the index on the calendar of the first day
 * @param {int} month index for months array (0 = January)
 * @param {int} year ie 2019
 * @return {string} gets the shortened version of the first day name of the month (ie mon, tue, wed...)
 */
Agile.components.DropDownCalendar.prototype.getFirstIndexOfMonth = function (month, year) {
    return this.days_short.indexOf(this.getFirstDayOfMonth(month, year));
}

/**
 * Gets the total number of days in the chosenDates month
 * @param {int} year ie 2019
 * @param {int} month index for months array (0 = January)
 * @return {int} total number of days in the month
 */
Agile.components.DropDownCalendar.prototype.getTotalDaysOfMonth = function (year, month) {
    return new Date(year, month + 1, 0).getDate();
}

/**
 * Get Short Months
 * @param {int} index shortens the chosenDates month to 3 characters based on the index in the array
 * @return {string} 3 letter format of the month
 */
Agile.components.DropDownCalendar.prototype.getShortMonths = function (index) {
    return this.months[index].substr(0, 3);
}

/**
 * Get Short Days
 * @param {int} index shortens the chosenDates day to 3 characters based on the index in the array
 * @return {string} shortened string of the chosenDates day (3 letter format)
 */
Agile.components.DropDownCalendar.prototype.getShortDays = function (index) {
    return this.days[index].substr(0, 3);
}

/**
 * isToday
 * @param {int} day
 * @param {int} month
 * @param {int} year
 * @return {Boolean} 
 */
Agile.components.DropDownCalendar.prototype.isToday = function (day, month, year) {
    return day == this.getCurrentDay() && month == this.getCurrentMonth() && year == this.getCurrentYear();
}

/**
 * Build Calendar
 * @param {int} firstDayOfMonth the number index for the first day of the month for the first week (ie Friday = 5)
 * @param {int} days total number of days in the month
 * @param {object} config Month & Year
 * @returns {HTML} Calendar
 */
Agile.components.DropDownCalendar.prototype.buildCalendar = function (firstDayOfMonth, days, config) {
    if (this.calendarDates) {
        this.calendarDates.innerHTML = null;
    }

    var table = document.createElement('table');
    var tr = document.createElement('tr');

    //row for the day letters
    for (var c = 0; c <= 6; c++) {
        var td = document.createElement('td');
        td.innerHTML = "SMTWTFS"[c];
        td.className = 'noHover'
        tr.appendChild(td);
    }
    table.appendChild(tr);

    //create 2nd row
    tr = document.createElement('tr');
    var c;
    for (c = 0; c <= 6; c++) {
        if (c == firstDayOfMonth) {
            break;
        }
        var td = document.createElement('td');
        td.innerHTML = "x";
        td.className = "otherMonth";
        tr.appendChild(td);
    }

    var count = 1;
    for (; c <= 6; c++) {
        (function () {
            var td = document.createElement('td');
            td.innerHTML = count;

            if (this.isToday(count, config.month, config.year)) {
                td.classList.add('today')
            }

            if (this.options.startFromToday) {
                //start filtering out dates
                if (config.month < this.getCurrentMonth()) {
                    if (config.year <= this.getCurrentYear()) {
                        td.classList.add('otherMonth');
                    }
                } else if (config.month > this.getCurrentMonth()) {
                    if (config.year < this.getCurrentYear()) {
                        td.classList.add('otherMonth');
                    }
                } else {
                    if (config.year < this.getCurrentYear()) {
                        td.classList.add('otherMonth');
                    }
                }

                if (config.month == this.getCurrentMonth() && config.year == this.getCurrentYear() && count < this.getCurrentDay() + this.options.offsetToday) {
                    td.classList.add('otherMonth');
                }
            }

            /* Add click event to valid dates */
            if (!td.classList.contains('otherMonth')) {
                td.setAttribute('data-epoch', this.convertToUnix(new Date(config.year, config.month, parseInt(td.innerHTML))));
                td.addEventListener('click', () => {
                    this.dateClickEvent(td);
                });
            }

            count++;
            tr.appendChild(td);
        }).bind(this)();
    }
    table.appendChild(tr);

    //rest of the date rows
    let nextMonthDays = 1;
    for (var r = 3; r <= 7; r++) {
        tr = document.createElement('tr');
        for (var c = 0; c <= 6; c++) {
            if (count > days) {
                var td = document.createElement('td');
                td.innerHTML = nextMonthDays;
                nextMonthDays++;
                td.className = "otherMonth";
                tr.appendChild(td);
                continue;
            }
            /* Setting to function scope */
            (function () {
                var td = document.createElement('td');
                td.innerHTML = count;

                if (this.isToday(count, config.month, config.year)) {
                    td.classList.add('today')
                }

                if (this.options.startFromToday) {
                    //start filtering out dates
                    if (config.month < this.getCurrentMonth()) {
                        if (config.year <= this.getCurrentYear()) {
                            td.classList.add('otherMonth');
                        }
                    } else if (config.month > this.getCurrentMonth()) {
                        if (config.year < this.getCurrentYear()) {
                            td.classList.add('otherMonth');
                        }
                    } else {
                        if (config.year < this.getCurrentYear()) {
                            td.classList.add('otherMonth');
                        }
                    }

                    if (config.month == this.getCurrentMonth() && config.year == this.getCurrentYear() && count < this.getCurrentDay() + this.options.offsetToday) {
                        td.classList.add('otherMonth');
                    }
                }

                /* Add click event to valid dates */
                if (!td.classList.contains('otherMonth')) {
                    td.setAttribute('data-epoch', this.convertToUnix(new Date(config.year, config.month, parseInt(td.innerHTML))));
                    td.addEventListener('click', () => {
                        this.dateClickEvent(td);
                    });
                }

                count++;
                tr.appendChild(td);
            }).bind(this)();
        }
        table.appendChild(tr);
    }
    return table;
}

/**
 * displayCalendar
 * @param {object} config
 * @param {int} config.month index of months array (0 = January)
 * @param {int} config.year ie 2019
 */
Agile.components.DropDownCalendar.prototype.displayCalendar = function (config = {}) {
    let builtCalendar = this.buildCalendar(this.getFirstIndexOfMonth(config.month, config.year), this.getTotalDaysOfMonth(config.year, config.month), config);
    this.monthYear.innerHTML = `${this.months[config.month]} ${config.year}`;
    this.calendarDates.appendChild(builtCalendar)
}

/**
 * Convert to unix time
 * @param {Date} date Date you are passing in
 * @return {int} unix datetime
 */
Agile.components.DropDownCalendar.prototype.convertToUnix = function (date) {
    return new Date(date).getTime();
}

/**
 * Convert to date
 * @param {int} unix unix datetime in int form
 * @return {Date} date object
 */
Agile.components.DropDownCalendar.prototype.convertToDate = function (unix) {
    return new Date(parseInt(unix));
}

/**
 * dateClickEvent
 * @param {HTML element} el element to attach the click event to
 */
Agile.components.DropDownCalendar.prototype.dateClickEvent = function (el) {
    this.rootEl.setAttribute('data-selected-date', el.getAttribute('data-epoch'));
    this.table.classList.toggle('hide');
    this.dropDownContent.classList.remove('show-content');
    this.header.classList.remove('set-color');

    this._day.innerHTML = new Date(parseInt(this.rootEl.getAttribute('data-selected-date'))).getDate()
    this._month.innerHTML = this.months[new Date(parseInt(this.rootEl.getAttribute('data-selected-date'))).getMonth()].substring(0, 3);
}




document.addEventListener('DOMContentLoaded', function () {
    let calendars = document.querySelectorAll("[data-component='dropDownCalendar']");
    calendars.forEach(function (componentEl) {
        new Agile.components.DropDownCalendar(componentEl);
    });
});