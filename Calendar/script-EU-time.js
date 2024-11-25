function EventCalendarApp(date) {
  
  if (!(date instanceof Date)) {
    date = new Date();
  }
  
  this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  this.quotes = ['Scheduling made easy.', 'Never get late anymore.', 'Punctuality is a virtue.', 'We love being punctual.', 'Arrange your schedule properly.', 'We came to arrange your life.', 'The best calendar syncing tool in the planet.'];
  // fixed appointments(=apts) that can be set in advance like public holidays
  this.apts = [
    {
      name: 'Easter sunday',
      endTime: new Date(2023, 3, 9, 23),
      startTime: new Date(2023, 3, 9, 21),
      day: new Date(2023, 3, 9).toString()
    },
     {
      name: 'Easter monday',
      endTime: new Date(2023, 3, 10, 23, 59),
      startTime: new Date(2023, 3, 10, 0),
      day: new Date(2023, 3, 10).toString()
    },
    
  ];
  
  this.aptDates = [new Date(2023, 3, 9).toString(),new Date(2023, 3, 10).toString()];
  this.elements = {
  };
  this.calDaySelected = null;
  
  this.calendar = document.getElementById("event_calendar");
  
  this.calendarMain = document.getElementById("dates");
  
  this.calendarMonthDiv = document.getElementById("calendar_Header_Current_Month");
  this.calendarMonthLastDiv = document.getElementById("calendar_Header_Last_Month");
  this.calendarMonthNextDiv = document.getElementById("calendar_Header_Next_Month");
  
  this.eventSloganQuote = document.getElementById("quote_Event_Card");
   
  this.todayIsDate = document.getElementById("header_Current_Date");
  // this.eventsCountSpan = document.getElementById("footer-events");
  this.eventCard = document.getElementById("event_Card");
  this.exitEventCard = document.getElementById("open_Event_Card_Exit");
  this.eventCardTitle = document.getElementById("event_Card_Title_Date");
  this.addNewEvent = document.getElementById("add_New_Event_btn");
  this.numberOfEvents = document.getElementById("event_Card_Number_Events");
  
  this.addEventForm = {
    cancelBtn: document.getElementById("cancel_Event"),
    addBtn: document.getElementById("save_Event"),
    nameEvent: document.getElementById("input_Event_Name"),
    startTime: document.getElementById("input_Event_Start_Time"),
    endTime: document.getElementById("input_Event_End_Time")
  };
  this.activeEvents = document.getElementById("list_Active_Events");
  this.newEventBox = document.getElementById("add_New_Event_Box");
  
  /* Start the app */
  this.showView(date);
  this.addEventListeners();
  this.todayIsDate.textContent = "Today is " + this.months[date.getMonth()] + " " + date.getDate();  
}


EventCalendarApp.prototype.addEventListeners = function() {
  
  this.calendar.addEventListener("click", this.mainCalendarClickClose.bind(this));
  this.todayIsDate.addEventListener("click", this.showView.bind(this));
  this.calendarMonthLastDiv.addEventListener("click", this.showNewMonth.bind(this));
  this.calendarMonthNextDiv.addEventListener("click", this.showNewMonth.bind(this));
  this.exitEventCard.addEventListener("click", this.closeDayWindow.bind(this));
  this.eventCardTitle.addEventListener("click", this.showNewMonth.bind(this));
  this.addNewEvent.addEventListener("click", this.addNewEventBox.bind(this));
  this.addEventForm.cancelBtn.addEventListener("click", this.closeNewEventBox.bind(this));
  this.addEventForm.cancelBtn.addEventListener("keyup", this.closeNewEventBox.bind(this));
  this.addEventForm.startTime.addEventListener("keyup",this.inputChangeLimiter.bind(this));
  this.addEventForm.endTime.addEventListener("keyup",this.inputChangeLimiter.bind(this));
  this.addEventForm.addBtn.addEventListener("click",this.saveAddNewEvent.bind(this));
};

EventCalendarApp.prototype.showView = function(date) {
  if (!date || (!(date instanceof Date))) date = new Date();
  var now = new Date(date),
      y = now.getFullYear(),
      m = now.getMonth();
  var today = new Date();
  
  var lastDayOfMonth = new Date(y, m + 1, 0).getDate();
  var startDate = new Date(y, m, 1).getDay();
  var lastMonth = new Date(y, now.getMonth()-1, 1);
  var nextMonth = new Date(y, now.getMonth()+1, 1);
 
  this.calendarMonthDiv.classList.remove("calendar-month-header-activate");
  this.calendarMonthDiv.classList.add("calendar-month-header-reset");
  
  while(this.calendarMain.firstChild) {
    this.calendarMain.removeChild(this.calendarMain.firstChild);
  }
  
  // build up spacers
  for (var x = 0; x < startDate; x++) {
    var spacer = document.createElement("div");
    spacer.className = "calendar-spacer";
    this.calendarMain.appendChild(spacer);
  }
  
  for ( var z = 1; z <= lastDayOfMonth; z++ ) {
   
    var calendarDates = new Date(y, m , z);
    var day = document.createElement("div");
    day.className = "calendar-date";
    day.textContent = z;
    day.setAttribute("data-date", calendarDates);
    day.onclick = this.showDay.bind(this);
    
    // check if todays date
    if (z == today.getDate() && y == today.getFullYear() && m == today.getMonth()) {
      day.classList.add("today");
    }
    
     // check if has events to show
    if (this.aptDates.indexOf(calendarDates.toString()) !== -1 ) {
      day.classList.add("calendar-event-marks");
    }
    
    this.calendarMain.appendChild(day);
  }
  
  // animation time for calendar month header by switch
  var headerTimeOut = this;
  setTimeout(function(){
    headerTimeOut.calendarMonthDiv.classList.add("calendar-month-header-activate");
  }, 50);
  
  this.calendarMonthDiv.textContent = this.months[now.getMonth()] + " " + now.getFullYear();
  this.calendarMonthDiv.setAttribute("data-date", now);

  
  this.calendarMonthLastDiv.textContent = "\u2B9C " + this.months[lastMonth.getMonth()];
  this.calendarMonthLastDiv.setAttribute("data-date", lastMonth);
  
  this.calendarMonthNextDiv.textContent = this.months[nextMonth.getMonth()] + " \u2B9E";
  this.calendarMonthNextDiv.setAttribute("data-date", nextMonth);
  
}


EventCalendarApp.prototype.showDay = function(e, dayEl) {
  e.stopPropagation();
  if ( !dayEl ) {
    dayEl = e.currentTarget;
  }
  var dayDate = new Date(dayEl.getAttribute('data-date'));
  
  this.calDaySelected = dayEl;
  
  this.openDayWindow(dayDate);
  
};

EventCalendarApp.prototype.openDayWindow = function(date) {
  
  var now = new Date();
  var day = new Date(date);
  this.eventCardTitle.textContent = this.days[day.getDay()] + ", " + this.months[day.getMonth()] + " " + day.getDate() + ", " + day.getFullYear();
  this.eventCardTitle.setAttribute('data-date', day);
  this.eventCard.classList.add("event-card_active");
  
  /* Contextual lang changes based on tense. Also show btn for scheduling future events */
  // info text if or how many events are coming up
  var eventCardInfoText = '';
  if (day < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
    eventCardInfoText = "You had ";
    this.addNewEvent.style.display = "none";
  } else {
    eventCardInfoText = "You have ";
     this.addNewEvent.style.display = "inline";
  }
  this.addNewEvent.setAttribute("data-date", day);
  
  // displays the randomly selected quotes or appointment
  var eventsToday = this.showEventsByDay(day);
  if (!eventsToday ) {
    eventCardInfoText += "no ";
    var randomQuote = Math.round(Math.random() * ((this.quotes.length - 1 ) - 0) + 0);
    this.eventSloganQuote.textContent = this.quotes[randomQuote];
  } else {
      // only shows a quote if no appointment
    eventCardInfoText += eventsToday.length + " ";
    this.eventSloganQuote.textContent = null;
  }
  // this.activeEvents.innerHTML = this.showEventsCreateHTMLView(eventsToday);
  while(this.activeEvents.firstChild) {
    this.activeEvents.removeChild(this.activeEvents.firstChild);
  }
  
  this.activeEvents.appendChild(this.showEventsCreateElesView(eventsToday));
  
  this.numberOfEvents.textContent = eventCardInfoText + "events on " + this.months[day.getMonth()] + " " + day.getDate() + ", " + day.getFullYear();
    
};

// shows active events
EventCalendarApp.prototype.showEventsCreateElesView = function(events) {
  var ul = document.createElement("ul");
  ul.className = 'active-events-list-ul';
  events = this.sortEventsByTime(events);
  var thisEvent = this;
  events.forEach(function(event){
    var startEvent = new Date(event.startTime);
    var endEvent = new Date(event.endTime);
    var idx = event.index;
    var li = document.createElement("li");
    li.className = "event-dates";
    // li.innerHtml
    var createEvent = "<span class='start-time'>" + startEvent.toLocaleTimeString(navigator.language,{hour: '2-digit', minute:'2-digit'}) + "</span> <small>through</small> ";
    createEvent += "<span class='end-time'>" + endEvent.toLocaleTimeString(navigator.language,{hour: '2-digit', minute:'2-digit'}) + ( (endEvent.getDate() != startEvent.getDate()) ? ' <small>on ' + endEvent.toLocaleDateString() + "</small>" : '') +"</span>";
    

    createEvent += "<span class='event-name'>" + event.name + "</span>";
    
    var div = document.createElement("div");
    div.className = "event-dates";
    div.innerHTML = createEvent;
    
    var deleteBtn = document.createElement("span");
    var deleteText = document.createTextNode("delete");
    deleteBtn.className = "event-delete";
    deleteBtn.setAttribute("data-idx", idx);
    deleteBtn.appendChild(deleteText);
    deleteBtn.onclick = thisEvent.deleteEvent.bind(thisEvent);
    
    div.appendChild(deleteBtn);
    
    li.appendChild(div);
    ul.appendChild(li);
  });
  return ul;
};

EventCalendarApp.prototype.deleteEvent = function(e) {
  var deleted = this.apts.splice(e.currentTarget.getAttribute("data-idx"),1);
  var deletedDate = new Date(deleted[0].day);
  var anyDatesLeft = this.showEventsByDay(deletedDate);
  if (anyDatesLeft === false) {
    // safe to remove from array
    var idx = this.aptDates.indexOf(deletedDate.toString());
    if (idx >= 0) {
       this.aptDates.splice(idx,1);
      // remove dot from calendar view
      var el = document.querySelector('.calendar-date[data-date="'+ deletedDate.toString() +'"]');
      if (el) {
        el.classList.remove("calendar-event-marks");
      }
    }
  }
  this.openDayWindow(deletedDate);;
};

EventCalendarApp.prototype.sortEventsByTime = function(events) {
  if (!events) return [];
  return events.sort(function compare(a, b) {
    if (new Date(a.startTime) < new Date(b.startTime)) {
      return -1;
    }
    if (new Date(a.startTime) > new Date(b.startTime)) {
      return 1;
    }
    // a must be equal to b
    return 0;
  });
};

EventCalendarApp.prototype.showEventsByDay = function(day) {
  var addEvents = [];
  this.apts.forEach(function(apt, idx){
    if (day.toString() == apt.day.toString()) {
      apt.index = idx;
      addEvents.push(apt);
    }
  });
  return (addEvents.length) ? addEvents : false;
};

EventCalendarApp.prototype.closeDayWindow = function() {
  this.eventCard.classList.remove("event-card_active");
  this.closeNewEventBox();
};

EventCalendarApp.prototype.mainCalendarClickClose = function(e) {
  if ( e.currentTarget != e.target ) {
    return;
  }
  this.eventCard.classList.remove("event-card_active");
  this.closeNewEventBox();
};

EventCalendarApp.prototype.addNewEventBox = function(e) {
  var target = e.currentTarget;
  this.newEventBox.setAttribute("data-active", "true"); 
  this.newEventBox.setAttribute("data-date", target.getAttribute("data-date")); 
};

EventCalendarApp.prototype.closeNewEventBox = function(e) {
  
  if (e && e.keyCode && e.keyCode != 13) return false;
  this.newEventBox.setAttribute("data-active", "false");
  // reset values
  this.resetAddEventBox(); 
};

EventCalendarApp.prototype.saveAddNewEvent = function() {
  var saveErrors = this.validateAddEventInput();
  if ( !saveErrors ) {
    this.addEvent();
  }
};

EventCalendarApp.prototype.addEvent = function() {
  
  var eventName = this.addEventForm.nameEvent.value.trim();
  var dayOfDate = this.newEventBox.getAttribute("data-date");
  var dateObjectDay =  new Date(dayOfDate);
  var cleanDates = this.cleanEventTimeStampDates();
  
  this.apts.push({
    name: eventName,
    day: dateObjectDay,
    startTime: cleanDates[0],
    endTime: cleanDates[1]
  });
  this.closeNewEventBox();
  this.openDayWindow(dayOfDate);
  this.calDaySelected.classList.add("calendar-event-marks");
  // add to dates
  if ( this.aptDates.indexOf(dateObjectDay.toString()) === -1 ) {
    this.aptDates.push(dateObjectDay.toString());
  } 
};


EventCalendarApp.prototype.convertTo23HourTime = function(stringOfTime, AMPM) {
  // convert to 0 - 23 hour time
  var mins = stringOfTime.split(":");
  var hours = stringOfTime.trim();
  if ( mins[1] && mins[1].trim() ) {
    hours = parseInt(mins[0].trim());
    mins = parseInt(mins[1].trim());
  } else {
    hours = parseInt(hours);
    mins = 0;
  }
  return [hours, mins];
};


EventCalendarApp.prototype.cleanEventTimeStampDates = function() {
  
  var startTime = this.addEventForm.startTime.value.trim() || this.addEventForm.startTime.getAttribute("placeholder") || '8';
  var endTime = this.addEventForm.endTime.value.trim() || this.addEventForm.endTime.getAttribute("placeholder") || '9';
  var date = this.newEventBox.getAttribute("data-date");
  
  var startingTimeStamps = this.convertTo23HourTime(startTime);
  var endingTimeStamps = this.convertTo23HourTime(endTime);
  
  var dateOfEvent = new Date(date);
  var startDate = new Date(dateOfEvent.getFullYear(), dateOfEvent.getMonth(), dateOfEvent.getDate(), startingTimeStamps[0], startingTimeStamps[1]);
  var endDate = new Date(dateOfEvent.getFullYear(), dateOfEvent.getMonth(), dateOfEvent.getDate(), endingTimeStamps[0], endingTimeStamps[1]);
  
  // if end date is less than start date - set end date back another day
  if ( startDate > endDate ) endDate.setDate(endDate.getDate() + 1);
  
  return [startDate, endDate];
  
};

EventCalendarApp.prototype.validateAddEventInput = function() {

  var eventInputError = false;
  var eventNameError = this.addEventForm.nameEvent.value.trim();
  var startTime = this.addEventForm.startTime.value.trim();
  var endTime = this.addEventForm.endTime.value.trim();
  
  if (!eventNameError || eventNameError == null) {
    eventInputError = true;
    this.addEventForm.nameEvent.classList.add("event-box-input_error");
    this.addEventForm.nameEvent.focus();
  } else {
     this.addEventForm.nameEvent.classList.remove("event-box-input_error");
  }
  
//   if (!startTime || startTime == null) {
//     eventInputError = true;
//     this.addEventForm.startTime.classList.add("event-box-input_error");
//   } else {
//      this.addEventForm.startTime.classList.remove("event-box-input_error");
//   }
  
  return eventInputError;   
};

var timeOut = null;
var activeEl = null;
EventCalendarApp.prototype.inputChangeLimiter = function(el) {
  
  if ( el.currentTarget ) {
    el = el.currentTarget;
  }
  if (timeOut && el == activeEl){
    clearTimeout(timeOut);
  }
  
  var limiter = EventCalendarApp.prototype.textOptionLimiter;

  // option for time format 0-23
  var addEventOptions = el.getAttribute("data-options").split(",");
  var addEventOptionFormat = el.getAttribute("data-format") || 'text';
  timeOut = setTimeout(function(){
    el.value = limiter(addEventOptions, el.value, addEventOptionFormat);
  }, 600);
  activeEl = el;
  
};

EventCalendarApp.prototype.textOptionLimiter = function(options, input, format){
  if ( !input ) return '';
  
  if ( input.indexOf(":") !== -1 && format == 'datetime' ) {
 
    var splitInputTime = input.split(':', 2);
    if (splitInputTime.length == 2 && !splitInputTime[1].trim()) return input;
    var trailingInputTime = parseInt(splitInputTime[1]);
    /* Probably could be coded better -- a block to clean up trailing data */
    if (options.indexOf(splitInputTime[0]) === -1) {
      return options[0];
    }
    else if (splitInputTime[1] == "0" ) {
      return input;
    }
    else if (splitInputTime[1] == "00" ) {
      return splitInputTime[0] +  ":00";
    }
    else if (trailingInputTime < 10 ) {
      return splitInputTime[0] + ":" + "0" + trailingInputTime;
    }
    else if ( !Number.isInteger(trailingInputTime) || trailingInputTime < 0 || trailingInputTime > 59 )  {
      return splitInputTime[0];
    } 
    return splitInputTime[0] + ":" + trailingInputTime;
  }
  if ((input.toString().length >= 3) ) {
    var pad = (input.toString().length - 4) * -1;
    var inputHour, inputMin;
    if (pad == 1) {
      inputHour = input[0];
      inputMin = input[1] + input[2];
    } else {
      inputHour = input[0] + input[1];
      inputMin = input[2] + input[3];
    }
    
    inputHour = Math.max(1,Math.min(12,(inputHour)));
    inputMin = Math.min(59,(_min));
    if ( inputMin < 10 ) { 
      inputMin = "0" + inputMin;
    }
    inputMin = (isNaN(inputMin)) ? '00' : inputMin;
    inputHour = (isNaN(inputHour)) ? '9' : inputHour;

    return inputHour + ":" + inputMin;
    
  }

  if (options.indexOf(input) === -1) {
    return options[0];
  }
  
  return input;
};

EventCalendarApp.prototype.resetAddEventBox = function(){
  this.addEventForm.nameEvent.value = '';
  this.addEventForm.nameEvent.classList.remove("event-box-input_error");
  this.addEventForm.endTime.value = '';
  this.addEventForm.startTime.value = '';
};
EventCalendarApp.prototype.showNewMonth = function(e){
  var date = e.currentTarget.dataset.date;
  var newMonthDate = new Date(date);
  this.showView(newMonthDate);
  this.closeDayWindow();
  return true;
};

var calendar = new EventCalendarApp();
console.log(calendar);

