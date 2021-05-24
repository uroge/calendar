import '../sass/main.scss';
import Modal from './modal';

(function() {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        prevMonthButton = document.querySelector('.js-main__arrow-left'),
        nextMonthButton = document.querySelector('.js-main__arrow-right'),
        mainHeader = document.querySelector('.js-main__header h1'),
        calendar = document.querySelector('.js-main__calendar'),
        modalElement = document.querySelector('.js-modal'),
        modalTitle = document.querySelector('.js-modal__title'),
        modalSaveButton = document.querySelector('.js-modal__save'),
        modalCloseButton = document.querySelector('.js-modal__close'),
        modalInput = document.getElementById('eventTitleInput');

    let currentMonth = 0,
        clicked = null,
        events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [],
        updateEventModal = new Modal(modalElement, true, false, modalTitle),
        newEventModal = new Modal(modalElement, false, true, modalTitle);


    document.body.addEventListener('click', event => {
        let target = event.target;

        if(target.classList.contains('main__new-event')) {
            // openModal();
        }
    });

    /**
     * A function that calculates current day, month and year
     * and displays it on the calendar
    */
    const calculateCalendar = () => {
        const date = new Date();
        if(currentMonth !== 0) {
            date.setMonth(new Date().getMonth() + currentMonth);
        }

        const day = date.getDate(),
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

        if(mainHeader) {
            mainHeader.textContent = `${date.toLocaleDateString('en-GB', {month: 'long'})} ${year}`;   
        }

        calendar.innerHTML = '';

        for(let i = 1; i <= passiveDays + daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('main__day');
            const dayHolder = document.createElement('p');
            const newEventIcon = document.createElement('i');
            newEventIcon.classList.add('fas', 'fa-plus-circle', 'main__new-event');

            if(i > passiveDays) {
                dayElement.appendChild(dayHolder);
                dayHolder.innerText = i - passiveDays;
                dayElement.appendChild(newEventIcon);

                if(newEventIcon) {
                    newEventIcon.addEventListener('click', () => {
                        openModal(`${i - passiveDays}/${month + 1}/${year}`)
                    });
                }

                if(currentMonth === 0) {
                    if(i === passiveDays + day) {
                        dayHolder.classList.add('current-day');
                    }
                }

            } else {
                dayElement.classList.add('main__day-passive');
            }

            calendar.appendChild(dayElement);
        }
    };


    /**
     * Function that opens modal
    */
    const openModal = (date) => {
        clicked = date;

        const eventForDay = events.find(event => event.date === clicked);

        if(eventForDay) {
            console.log('Event already exists');
        } else {
            newEventModal.showModal();
        }
    };

    const saveEvent = () => {
        if(modalInput.value) {
            modalInput.classList.remove('error');
            if(!events.find(event => event.date === clicked)){
                events.push({
                    date: clicked,
                    title: modalInput.value
                });
            }
            console.log(events);
        } else {
            modalInput.classList.add('error');
        }
    };

    /**
     * Function that adds event listeners to the
     * buttons on the page
    */
    const initButtons = () => {
        /**
         * Function that increments month by 1
         * and recalculates calendar
        */
        if(nextMonthButton) {
            nextMonthButton.addEventListener('click', () => {
                currentMonth++;
                calculateCalendar();
            });
        }

        /**
         * Function that decrements month by 1
         * and recalculates calendar
        */
        if(prevMonthButton) {
            prevMonthButton.addEventListener('click', () => {
                currentMonth--;
                calculateCalendar();
            });
        }

        /**
         * Function that closes modal when x button is clicked 
        */
        if(modalCloseButton) {
            modalCloseButton.addEventListener('click', () => {
                modalInput.classList.remove('error');
                newEventModal.closeModal();
            });
        }

        /**
         * Function that closes modal when x button is clicked 
        */
        if(modalSaveButton) {
            modalSaveButton.addEventListener('click', saveEvent);
        }
    };

    initButtons();
    calculateCalendar();
})();