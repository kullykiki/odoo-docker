
$(document).ready(function(){
        var type = getUrlParam("type") ? getUrlParam("type") : 0 ;
        var room = getUrlParam("room") ? getUrlParam("room") : 0 ;
        var floor = getUrlParam("floor") ? getUrlParam("floor") : 0 ;

        $('#icon-prev').attr('href','/lsr/roomdetail?type='+type);

        if(room != 0){
            defaultRoom(room);
        }
 
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
        dateClick: function(info) {
            // info contains information about the clicked date
            var clickedDate = info.dateStr; // The clicked date in YYYY-MM-DD format
            var baseUrl = '/lsr/reservation_form';
            var params = { type: type, room: room, floor:floor, dateStr: clickedDate };
            
            // Convert parameters to a query string
            var queryString = $.param(params); // e.g. 'param1=value1&param2=value2'

            // Redirect using window.location.replace() to hide the current URL in the history
            window.location.replace(baseUrl + '?' + queryString);
    
            // You can perform other actions here, such as opening a modal or fetching data.
        },
        moreLinkContent:function(args){
            return '+'+args.num+' More items';
        },
        moreLinkClick: function() {
            modalEvent();
            return "dayGridMonth";
        },
        events: function( fetchInfo, successCallback, failureCallback ) { //include the parameters fullCalendar supplies to you!
            jQuery.ajax({
                url: 'http://localhost:8069/api/booking_get/date/0/room/'+room,
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
                                title: get_time(evt.start_date) + "-" +get_time(evt.end_date) + " " + evt.title,
                                start: evt.start_date,
                                end: evt.end_date,
                                description: evt.purpose,
                                name : evt.title,
                                room : evt.room	,
                                floor : evt.floor	,
                                booker : evt.booker	,
                                time: get_time(evt.start_date) + " - " +get_time(evt.end_date),
                                getdate: get_date(evt.start_date),
                                allDay: true,
                                // backgroundColor: '#ED1317',
                            });
                        });
                    }
                    console.log(events);
                    successCallback(events); //you have to pass the list of events to fullCalendar!
                }
            });
        },
        eventTimeFormat: { 
            hour: '2-digit',
            minute: '2-digit',
            hour12:false
        },
        eventClick: function(info) {
            console.log(info);
            $('#eventtitle').text("รายการจอง #"+info.event._def.extendedProps.name);
            $('#eventbooker').text("โดย "+info.event._def.extendedProps.booker);
            $('#roomName').text("floor "+info.event.extendedProps.floor+", "+info.event.extendedProps.room);
            $('#eventDueDate').text(info.event.extendedProps.getdate + " " +info.event.extendedProps.time);
            $('#eventName').text(info.event.extendedProps.name);
            $('#eventDescription').text(info.event.extendedProps.description);
            $('#modalEvent').modal('show');
        },
        displayEventEnd: true,
        height: 650,
        contentHeight:'auto',
        handleWindowResize:true,
        

        }
        );
        calendar.render();
});
function defaultRoom(id) {
    $('#h-room').text("");
    $('#detailroom').text("");
    $('#imgroom').attr("");
    jQuery.ajax({
        url: 'http://localhost:8069/api/room_get/room/'+id,
        type: 'GET',
        dataType: 'json',
        data: '',
        success: function (doc) {
            // console.log(doc.results.data)
            var events = [];
            if (doc.results.data != null) {
                var docs = doc.results.data;
                docs.forEach(function (evt) {
                    $('#h-room').text(evt.name);
                    $('#detailroom').text(evt.description);
                    $('#imgroom').attr("src",host+evt.images);
                });
            }
        }
    });
}
function modalEvent(){
    var room = getUrlParam("room") ? getUrlParam("room") : 0 ;
    var idtable = document.getElementById('example');
    $('#exampleBody').empty();
    jQuery.ajax({
        url: 'http://localhost:8069/api/booking_get/date/0/room/'+room,
        type: 'GET',
        dataType: 'json',
        data: '',
        success: function (doc) {
            // console.log(doc.results.data)
            var events = [];
            if (doc.results.data != null) {
                var docs = doc.results.data;
                docs.forEach(function (evt) {
                    $('#exampleBody').append(
                    '<tr>'+
                        '<td class="text-center">'+evt.id+'</td>'+
                        '<td class="text-center">'+evt.title+'</td>'+
                        '<td class="text-center">'+get_date(evt.start_date)+'</td>'+
                        '<td class="text-center">'+get_time(evt.start_date)+" - "+get_time(evt.end_date)+'</td>'+
                        '<td class="text-center"><button type="button" class="btn btn-sm btn-primary btnView" value="'+evt.id+'">View</button></td>'+
                    '</tr>'
                    );
                });
            } //you have to pass the list of events to fullCalendar!
            $('#staticBackdrop').modal('show');
            var table = new DataTable(idtable);
            // const table = $("<table>");
            // table.DataTable();
        }
    });
}

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



