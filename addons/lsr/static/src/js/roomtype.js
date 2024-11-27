$(document).ready(function(){
    // dropdowmTyperoom();
    // dropdowmfloor();
    get_detailroom();
    
});

function get_detailroom(){

    $('#listroom').empty();
    jQuery.ajax({
        url: '/api/roomtype_get',
        type: 'GET',
        dataType: 'json',
        data: '',
        success: function (doc) {
            if (doc.results.data != null) {
                var docs = doc.results.data;
                docs.forEach(function (evt) {
                    $('#listroom').append(
                        '<div class="border-gradient-2 mx-4 my-4 py-4 px-4 row">'+
                        '<div id="detailroom" class="col-lg-6 pt16 pb16 o_draggable o_colored_level">'+
                        '    <h2 id="nameroom" class="o_default_snippet_text">'+evt.name + '</h2>'+
                        '    <p id="descriptroom" class="o_default_snippet_text">'+evt.description+'</p>'+
                        '    <div class="pt-3 d-grid gap-2 d-md-flex justify-content-md-start">'+
                        '       <a href="/lsr/roomdetail?type='+evt.id+'" class="btn btn-base2 o_default_snippet_text">View Detail</a>'+
                        // '       <a href="/lsr/calendar?room='+evt.id+'&floor='+evt.floor+'" class="btn btn-base4 o_default_snippet_text">Reserve</a>'+
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