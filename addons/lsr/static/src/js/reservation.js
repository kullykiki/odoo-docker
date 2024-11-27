$(document).ready(function(){

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
        d.datepicker("setDate", "today");
        $('#start_time').val('08:00');
        $('#end_time').val('09:00');
        get_detailroom($("#datepicker").val(),'08:00','09:00');
    }, 500);

});

$("#roomsearch").on("click", function() {
    var date = $("#datepicker").val();
    var s_time = $("#start_time").val();
    var e_time = $("#end_time").val();
    // console.log('date : ' + date + " " + s_time + " - " +date+" "+e_time);
    get_detailroom(date,s_time,e_time);
});


function get_detailroom(date,s_time,e_time){
    $('#listroom_detail').empty();
    jQuery.ajax({
        url: host+'/api/room_get/date/'+date+" "+s_time+'/to/'+date+" "+e_time,
        type: 'GET',
        dataType: 'json',
        data: '',
        success: function (doc) {
            if (doc.results.data != null) {
                // $('#text-section').text(doc.results.type);
                var docs = doc.results.data;            
                docs.forEach(function (evt) {
                    $('#listroom_detail').append(
                        '<div class="border-gradient-2 mx-4 my-4 py-4 px-4 row">'+
                        '<div id="detailroom" class="col-lg-6 pt16 pb16 o_draggable o_colored_level">'+
                        '    <h2 id="nameroom" class="o_default_snippet_text">'+evt.name + '</h2>'+
                        '    <p id="descriptroom" class="o_default_snippet_text">'+evt.description+'</p>'+
                        '    <div class="pt-3 d-grid gap-2 d-md-flex justify-content-md-start">'+
                        '       <a href="/lsr/reservation_form?room='+evt.id+'&floor='+evt.floor+'&dateStr='+date+'&s_time='+s_time+'&e_time='+e_time+'" class="btn btn-base4 o_default_snippet_text">Reserve</a>'+
                        '    </div>'+
                        '</div>'+
                        '<div id="imgroom" class="col-lg-6 pt16 pb16 o_draggable o_colored_level">'+
                        '    <img src="'+host+evt.images+'" class="img mx-auto img-crop" alt="" loading="lazy" data-mimetype="image/jpeg" data-original-id="250">'+
                        '</div>'+
                        '</div>'
                    );
                });
            }
        }
    });

}