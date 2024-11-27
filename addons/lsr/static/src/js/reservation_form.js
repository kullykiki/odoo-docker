$(document).ready(function(){
    // Initialize the datepicker on the input field
    var type = getUrlParam("type") ? getUrlParam("type") : 0 ;
    var room = getUrlParam("room") ? getUrlParam("room") : 0 ;
    var floor = getUrlParam("floor")? getUrlParam("floor") : 0 ;
    var dateStr = getUrlParam("dateStr")? formattedDate(getUrlParam("dateStr")) : "today" ;
    var s_time = getUrlParam("s_time")? getUrlParam("s_time") : "08:00" ;
    var e_time = getUrlParam("e_time")? getUrlParam("e_time") : "09:00" ;
    var iconprev = !getUrlParam("s_time") ? '/lsr/calendar?type='+type+'&room='+room : '/lsr/reservation';
    $('#icon-prev').attr('href',iconprev);

    
    console.log(dateStr);  // Output: '11/15/2024'

    dropdowmfloor(floor,room);

    var d = $("#datepicker").datepicker({
        dateFormat: "dd-mm-yy",
    });
    
    $('.timepicker').timepicker({
        timeFormat: 'HH:mm',
        interval: 60,
        minTime: '08:00am',
        maxTime: '11:00pm',
        // defaultTime: new Date(),
        startTime: '08:00am',
        dynamic: false,
        // dropdown: true,
        // scrollbar: true
    });

    setTimeout(function() { 
        d.datepicker("setDate", dateStr);
        $('#start_time').val(s_time);
        $('#end_time').val(e_time);
    }, 500);

});
function formattedDate(dateStr){
    var date = new Date(dateStr);
    var day = ('0' + date.getDate()).slice(-2);    // Pad day with leading 0 if needed
    var month = ('0' + (date.getMonth() + 1)).slice(-2); // Get month (0-indexed)
    var year = date.getFullYear(); // Full year
    
    var formattedDate = day + '-' + month + '-' + year; // Format as MM/DD/YYYY
    return formattedDate;
} 
function dropdowmfloor(id,roomid){
    $('#floor').empty();
    jQuery.ajax({
        url: 'http://localhost:8069/api/floor_get',
        type: 'GET',
        dataType: 'json',
        data: '',
        success: function (doc) {
            if (doc.results.data != null) {
                var docs = doc.results.data;
                var i = 0;
                docs.forEach(function (evt) {
                    var str = "";
                    if (id != 0 && id == evt){
                        str = 'selected="selected"';
                        console.log("if2 "+id + " " + evt);
                    }else if (id == 0 && id == i) {
                        str = 'selected="selected"';
                        console.log("if1 "+id + " " + evt);
                    }
                    
                    $('#floor').append( 
                        '<option value="'+evt+'"'+str+'>'+evt+'</option>'
                    );
                    i++;
                });
                // $('#floor option[value="'+str+'"]').prop("selected", true);
                dropdowmroom(id,roomid);
            }
        }
    });
}

function dropdowmroom(floor,roomid){
    $('#room').empty();
    jQuery.ajax({
        url: 'http://localhost:8069/api/room_get/floor/'+floor,
        type: 'GET',
        dataType: 'json',
        data: '',
        success: function (doc) {
            if (doc.results.data != null) {
                var docs = doc.results.data;
                var str = "";
                docs.forEach(function (evt) {
                    if (roomid == evt.id){
                        str = "selected";
                    }
                    $('#room').append( 
                        '<option value="'+evt.id+'" selected="'+str+'">'+evt.name+'</option>'
                    );
                });
            }
        }
    });
}

$(document).on('change','#floor' ,function(){
    var val = $('#floor option:selected').val();
    dropdowmroom(val,"");
})



