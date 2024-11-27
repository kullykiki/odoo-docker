
$(document).ready(function(){
    var room = 0 ;
    var floor = 0 ;
    var calendarEl = document.getElementById('calendar_profile');
    var calendar = new FullCalendar.Calendar(calendarEl,  {
    themeSystem: 'bootstrap5',
    initialView: 'dayGridMonth',
    headerToolbar: {
        left: 'prev',
        center: 'title',
        right: 'next', 
        // 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    aspectRatio:  1 ,
    dayMaxEvents: 1,
    moreLinkContent:function(args){
        return '+'+args.num+' More items';
    },
    // moreLinkClick: function() {
    //     calendar.setOption('dayMaxEvents', 10);
    //     return "dayGridMonth";
    // },
    eventDidMount: function(info) {
    $(info.el).tooltip({
        title: info.event.extendedProps.description,
        placement: 'top',
        trigger: 'hover',
        container: 'body'
      });
    },
    events: function( fetchInfo, successCallback, failureCallback ) { //include the parameters fullCalendar supplies to you!
        jQuery.ajax({
            url: 'http://localhost:8069/api/userbooking_get/date/0/room/'+room,
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
                            title: evt.title, //get_time(evt.start_date) + "-" +get_time(evt.end_date) + " " + evt.title,
                            start: evt.start_date,
                            end: evt.end_date,
                            description: get_time(evt.start_date) + "-" +get_time(evt.end_date) + " " + evt.title +"\n" +evt.purpose,
                            name : evt.title,
                            time: get_time(evt.start_date) + "-" +get_time(evt.end_date),
                            getdate: get_date(evt.start_date),
                            // allDay: true,
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
    displayEventEnd: true,
    height: 650,
    contentHeight:'auto',
    handleWindowResize:true,
    

    }
    );
    calendar.render();

    $('#history_profile_body').empty();
    var idtable = document.getElementById('history_profile');
    jQuery.ajax({
        url: 'http://localhost:8069/api/userbooking_get/date/0/room/0',
        type: 'GET',
        dataType: 'json',
        data: '',
        success: function (doc) {
            // console.log(doc.results.data)
            var events = [];
            if (doc.results.data != null) {
                var docs = doc.results.data;
                docs.forEach(function (evt) {
                    var status = (evt.status == "pending") ? "pending" : evt.status_approved;
                    $('#history_profile_body').append(
                    '<tr>'+
                        // '<td class="text-center">'+evt.id+'</td>'+
                        '<td class="text-center">'+evt.title+'</td>'+
                        '<td class="text-center">'+evt.purpose+'</td>'+
                        '<td class="text-center">'+evt.room+" ชั้น : "+evt.floor+'</td>'+
                        '<td class="text-center">'+get_date(evt.start_date)+'</td>'+
                        '<td class="text-center">'+get_time(evt.start_date)+" - "+get_time(evt.end_date)+'</td>'+
                        '<td class="text-center"><button type="button" class="btn btn-sm btnView btn-'+status+' col-lg-10 col-sm-8" value="'+status+'">'+status+'</button></td>'+
                    '</tr>'
                    );
                });
            } 
            var table = new DataTable(idtable, {
                responsive: true,
                ordering: false,
            });
            
            // const table = $("<table>");
            // table.DataTable();
        }
    });
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




