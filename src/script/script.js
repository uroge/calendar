import '../sass/main.scss';

(function() {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        arrowLeft = document.querySelector('.js-main__arrow-left'),
        arrowRight = document.querySelector('.js-main__arrow-right'),
        mainHeader = document.querySelector('.js-main__header h1'),
        calendar = document.querySelector('.js-main__calendar');

    let currentMonth = 0;

    const checkMonth = () => {
        switch (currentMonth) {
            case 0: mainHeader.textContent = 'January'
                break;
            case 1: mainHeader.textContent = 'February'
                break;
            case 2: mainHeader.textContent = 'March'
                break;
            case 3: mainHeader.textContent = 'April'
                break;
            default:
                break;
        }
    };

    const calculateCalendar = () => {
        const date = new Date(),
        day = date.getDate(),
        month = date.getMonth(),
        year = date.getFullYear(),
        daysInMonth = new Date(year, month + 1, 0).getDate(),
        fisrtDayInMonth = new Date(year, month, 1),
        dateString = fisrtDayInMonth.toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            day: 'numeric',
            month: 'numeric'
        }),
        passiveDays = weekdays.indexOf(dateString.split(', ')[0]);

        mainHeader.textContent = `${date.toLocaleDateString('en-GB', {month: 'long'})} ${year}`

        console.log(day, month, year);
        console.log('Days in may 2021', daysInMonth);
        console.log('First day of may', dateString);
        console.log(passiveDays);

        for(let i = 1; i <= passiveDays + daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('main__day');
            const dayHolder = document.createElement('p');


            dayElement.addEventListener('click', () => {console.log(i, passiveDays)});
            if(i > passiveDays) {
                dayElement.appendChild(dayHolder);
                dayHolder.innerText = i - passiveDays;

                if(i === passiveDays + day) {
                    dayHolder.classList.add('current-day');
                }

                dayElement.addEventListener('click', () => {console.log('click')});
            } else {
                dayElement.classList.add('main__day-passive');
            }

            calendar.appendChild(dayElement);
        }
    }

    calculateCalendar();
})();