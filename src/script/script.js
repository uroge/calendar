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
        modalInput = document.getElementById('eventTitleInput'),
        eventStartInput = document.getElementById('eventFrom'),
        eventEndInput = document.getElementById('eventTo'),
        searchDateButton = document.querySelector('.js-search__button'),
        searchDatePicker = document.getElementById('datepicker'),
        date = new Date(),
        today = date.getDate(),
        thisMonth = date.getMonth(),
        thisYear = date.getFullYear();

    let currentMonth = 0,
        clicked = null,
        events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [],
        newEventModal = new Modal(modalElement, modalTitle);

    /**
    * Function that set's modal title to
    * Update Event when modal is in update mode
    */
    const updateEvent = () => {
        if(modalTitle) {
            modalTitle.textContent = 'Update Event';
        }
    };

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

        if(calendar) {
            calendar.innerHTML = '';
        }

        for(let i = 1; i <= passiveDays + daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('main__day');
            const dayHolder = document.createElement('p');
            const eventHolder = document.createElement('div');
            eventHolder.classList.add('main__event-holder');
            const newEventIcon = document.createElement('i');
            newEventIcon.classList.add('fas', 'fa-plus-circle', 'main__new-event');
            const daysUntilEvent = document.createElement('p');
            daysUntilEvent.classList.add('main__day-counter');

            const currentDayString = '';
            
            if((i-passiveDays) < 10 && month + 1 < 10) {
                currentDayString = `${year}-0${month + 1}-0${i - passiveDays}`;
            } else if ((i-passiveDays) < 10) {
                currentDayString = `${year}-${month + 1}-0${i - passiveDays}`;
            } else if (month + 1 < 10) {
                currentDayString = `${year}-0${month + 1}-${i - passiveDays}`;
            } else {
                currentDayString = `${year}-${month + 1}-${i - passiveDays}`;
            }

            if(i > passiveDays) {
                dayElement.appendChild(dayHolder);
                dayHolder.innerText = i - passiveDays;

                const eventForDay = events.find(event => currentDayString >= event.start &&  currentDayString <= event.end);
                const daysFromToday = Math.floor((
                    (new Date(currentDayString).getTime() - new Date(thisYear, thisMonth, today).getTime())
                    / (1000 * 3600 * 24)));

                if(eventForDay) {
                    if(daysFromToday === 0) {
                        daysUntilEvent.textContent = `Today`;
                    } else if (daysFromToday < 0) {
                        daysUntilEvent.textContent = `Event has passed`;
                    } else if (daysFromToday === 1) {
                        daysUntilEvent.textContent = `Event in ${daysFromToday} day`;
                    } else {
                        daysUntilEvent.textContent = `Event in ${daysFromToday} days`;
                    }
                    
                    dayElement.appendChild(daysUntilEvent);
                    eventHolder.textContent = eventForDay.title;
                    dayElement.appendChild(eventHolder);
                } else if(daysFromToday > 0){
                    dayElement.appendChild(newEventIcon);
                }

                if(newEventIcon) {
                    newEventIcon.addEventListener('click', () => {
                        openModal(currentDayString);
                    });
                }

                if(eventHolder) {
                    eventHolder.addEventListener('click', () => {
                        openModal(currentDayString, updateEvent);
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
     * @param date - day which was clicked
     * @param updateEvent - callback function that sets modal to update mode
    */
    const openModal = (date, updateEvent) => {
        if(eventStartInput && modalInput && eventEndInput && modalTitle) {
            if(updateEvent) {
                updateEvent();
                clicked = date; 
    
               
                eventStartInput.disabled = false;
                const eventForDay = events.find(event => event.start <= clicked && event.end >= clicked);
                modalInput.value = eventForDay.title;
                
                eventEndInput.value = eventForDay.end;
                eventStartInput.value = eventForDay.start;
                if(eventForDay) {
                    newEventModal.showModal();
                }
            } else {
                clicked = date; 
    
                eventStartInput.value = clicked;
                modalTitle.textContent = 'New Event';
                eventStartInput.disabled = true;
    
                eventStartInput.value = clicked;
        
                newEventModal.showModal();
            }  
        }
    };

    /**
     * Function that saves event to local storage
    */
    const saveEvent = () => {
        if(modalInput && eventEndInput && eventStartInput) {
            if(modalInput.value && eventEndInput.value && eventStartInput.value) {
                modalInput.classList.remove('error');
                if(!events.find(event => event.start <= clicked && event.end >= clicked)){
                    console.log('nema event');
                    events.push({
                        date: clicked,
                        title: modalInput.value,
                        start: eventStartInput.value,
                        end: eventEndInput.value
                    });
    
                    localStorage.setItem('events', JSON.stringify(events));
                    closeModal();
                    calculateCalendar();
                } else {
                    events.splice(events.indexOf(events.find(event => event.start <= clicked && event.end >= clicked)), 1);

                    events.push({
                        date: clicked,
                        title: modalInput.value,
                        start: eventStartInput.value,
                        end: eventEndInput.value
                    });
    
                    localStorage.setItem('events', JSON.stringify(events));
                    closeModal();
                    calculateCalendar();
                }
            } else {
                modalInput.classList.add('error');
                eventEndInput.classList.add('error');
            }
        }
    };

    /**
     * Function that closes modal when inputs are saved
    */
    const closeModal = () => {
        if(modalInput && newEventModal) {
            modalInput.classList.remove('error');
            newEventModal.closeModal();
        }
    };

    /**
     * Function that adds event listeners to the
     * buttons on the page
    */
    const initButtons = () => {
        if(searchDateButton && searchDatePicker) {
            searchDateButton.addEventListener('click', () => {
                if(searchDatePicker.value) {
                    const pickedMonth = new Date(searchDatePicker.value).getMonth();
                    const pickedYear = new Date(searchDatePicker.value).getFullYear();
    
                    if(pickedYear !== thisYear) {
                        currentMonth = ((thisYear - pickedYear) * -12) + (pickedMonth - thisMonth);
                    } else {
                        currentMonth = (pickedMonth - thisMonth);
                    }
                    
                    calculateCalendar();
                }
                
            });
        }

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
                closeModal();
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