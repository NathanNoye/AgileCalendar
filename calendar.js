var Agile = Agile || {};
Agile.components = Agile.components || {};

/**
 * TODO
 * Selecting the date
 * allow for switching between months and years
 * show remaining days from previous month
 */
Agile.components.DropDownCalendar = function (rootEl) {
    var self = this;

    this.rootEl = rootEl;
    this.monthYear = rootEl.querySelector('[data-month-year]');
    this.calendarDates = rootEl.querySelector('[data-dates]');


    this.date = new Date();
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.days_short = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


    this.displayCalendar();

    //this.displayCalendar({ month: 4, year: 2019 });
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
 * Gets the total number of days in the chosen month
 * @param {int} year ie 2019
 * @param {int} month index for months array (0 = January)
 * @return {int} total number of days in the month
 */
Agile.components.DropDownCalendar.prototype.getTotalDaysOfMonth = function (year, month) {
    return new Date(year, month + 1, 0).getDate();
}

/**
 * Get Short Months
 * @param {int} index shortens the chosen month to 3 characters based on the index in the array
 * @return {string} 3 letter format of the month
 */
Agile.components.DropDownCalendar.prototype.getShortMonths = function (index) {
    return this.months[index].substr(0, 3);
}

/**
 * Get Short Days
 * @param {int} index shortens the chosen day to 3 characters based on the index in the array
 * @return {string} shortened string of the chosen day (3 letter format)
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

            td.setAttribute('data-epoch', this.convertToUnix(new Date(config.year, config.month, parseInt(td.innerHTML))));
            td.addEventListener('click', () => {
                this.dateClickEvent(td);
            });

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

                td.setAttribute('data-epoch', this.convertToUnix(new Date(config.year, config.month, parseInt(td.innerHTML))));
                td.addEventListener('click', () => {
                    this.dateClickEvent(td);
                });

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

    config.month = config.month || this.getCurrentMonth();
    config.year = config.year || this.getCurrentYear();

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
    return new Date(unix);
}

/**
 * dateClickEvent
 * @param {HTML element} el element to attach the click event to
 */
Agile.components.DropDownCalendar.prototype.dateClickEvent = function (el) {
    console.log(this.convertToDate(parseInt(el.getAttribute('data-epoch'))));
    this.rootEl.setAttribute('data-selected-date', this.convertToDate(parseInt(el.getAttribute('data-epoch'))))
}

/***************************| Helper Functions |*********************************/




document.addEventListener('DOMContentLoaded', function () {
    let calendars = document.querySelectorAll("[data-component='dropDownCalendar']");
    calendars.forEach(function (componentEl) {
        new Agile.components.DropDownCalendar(componentEl);
    });
});