$(document).ready(function(){
    var room = 1;
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl,  {
    themeSystem: 'bootstrap5',
    initialView: 'dayGridMonth',
    headerToolbar: {
        left: $(window).width() < 765 ? 'prev,next' : 'prev,next,today',
        center: 'title',
        right: $(window).width() < 765 ? 'dayGridMonth' : 'dayGridMonth,timeGridWeek,timeGridDay', 
        // 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    aspectRatio:  1 ,
    dayMaxEvents: 2,
    moreLinkContent:function(args){
        return '+'+args.num+' More items';
    },
    events: function( fetchInfo, successCallback, failureCallback ) { //include the parameters fullCalendar supplies to you!
        jQuery.ajax({
            url: 'http://localhost:8069/api/pending/booking_get',
            type: 'GET',
            dataType: 'json',
            data: '',
            success: function (doc) {
                // console.log(doc.results.data)
                var events = [];
                if (doc.results.data != null) {
                    var docs = doc.results.data;
                    docs.forEach(function (evt) {
                        events.push({
                            title: evt.title,
                            // title: get_time(evt.start_date) + "-" +get_time(evt.end_date) + " " + evt.title,
                            start: evt.start_date,
                            end: evt.end_date,
                            purpose: evt.purpose,
                            name : evt.name,
                            time: get_time(evt.start_date) + "-" +get_time(evt.end_date),
                            getdate: get_date(evt.start_date),
                            allDay: true,
                            room : evt.room,
                            floor : evt.floor,
                            room_type : evt.room_type
                            // backgroundColor: '#ED1317',
                        });
                    });
                }
                successCallback(events); //you have to pass the list of events to fullCalendar!
            }
        });
    },
    eventClick: function(info) {
        $('#eventorder').text(info.event._def.extendedProps.name);
        $('#eventName').text(info.event.title);
        $('#eventroom').text(info.event.extendedProps.room);
        $('#eventDueDate').text(info.event.extendedProps.time);
        $('#modalEvent').modal('show');
        // console.log(info)
    },
    eventTimeFormat: { 
        hour: '2-digit',
        minute: '2-digit',
        hour12:false
    },

    displayEventEnd: true,
    height: 650,
    contentHeight:'auto',
    handleWindowResize:true,
    }
    );
    calendar.render();
});


function get_time(events_time){
    var d = new Date(events_time);
    // var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // var date = d.getDate() + " " + month[d.getMonth()] + ", " +  d.getFullYear();
    var time = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    return (time); 
}
function get_date(events_time){
    var d = new Date(events_time);
    // var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    var date = d.getDate() + "/" + month[d.getMonth()] + "/" +  d.getFullYear();
    // var time = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    return (date); 
}