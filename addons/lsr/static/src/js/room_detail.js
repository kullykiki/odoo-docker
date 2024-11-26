$(document).ready(function(){
    var type = getUrlParam("type") ? getUrlParam("type") : 0 ;
    get_detailroom(type);
    console.log($('#text-section').text());
    // $('#text-header').html('xxxx');
});

function get_detailroom(id){
    $('#text-section').text('');
    $('#listroom_detail').empty();
    jQuery.ajax({
        url: host+'/api/room_get/type/'+id+'/floor/0',
        type: 'GET',
        dataType: 'json',
        data: '',
        success: function (doc) {
            if (doc.results.data != null) {
                $('#text-section').text(doc.results.type);
                var docs = doc.results.data;
                docs.forEach(function (evt) {
                    $('#listroom_detail').append(
                        '<div class="border-gradient-2 mx-4 my-4 py-4 px-4 row">'+
                        '<div id="detailroom" class="col-lg-6 pt16 pb16 o_draggable o_colored_level">'+
                        '    <h2 id="nameroom" class="o_default_snippet_text">'+evt.name + '</h2>'+
                        '    <p id="descriptroom" class="o_default_snippet_text">'+evt.description+'</p>'+
                        '    <div class="pt-3 d-grid gap-2 d-md-flex justify-content-md-start">'+
                        '       <a href="/lsr/calendar?type='+id+'&room='+evt.id+'&floor='+evt.floor+'" class="btn btn-base4 o_default_snippet_text">Reserve</a>'+
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