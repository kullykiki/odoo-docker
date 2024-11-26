$(document).ready(function(){
    // dropdowmTyperoom();
    // dropdowmfloor();
    get_detailroom();
    
});

// function dropdowmTyperoom(){
//     $('#typeroom').empty();
//     jQuery.ajax({
//         url: 'http://localhost:8069/api/roomtype_get',
//         type: 'GET',
//         dataType: 'json',
//         data: '',
//         success: function (doc) {
//             $('#typeroom').append('<li><a class="dropdown-item" href="#" value="0">ทั้งหมด</a></li>');
//             if (doc.results.data != null) {
//                 var docs = doc.results.data;
//                 docs.forEach(function (evt) {
//                     $('#typeroom').append(
//                         '<li><a class="dropdown-item" href="#" value="'+evt.id+'">'+evt.name+'</a></li>'                        
//                         // '<option value="'+evt.id+'">'+evt.name+'</option>'
//                     );
//                 });
//             }
//         }
//     });
// }
// function dropdowmfloor(){
//     $('#floorroom').empty();
//     jQuery.ajax({
//         url: 'http://localhost:8069/api/floor_get',
//         type: 'GET',
//         dataType: 'json',
//         data: '',
//         success: function (doc) {
//             $('#floorroom').append('<li><a class="dropdown-item" href="#" value="0">ทั้งหมด</a></li>');
//             if (doc.results.data != null) {
//                 var docs = doc.results.data;
//                 docs.forEach(function (evt) {
//                     $('#floorroom').append(
//                         '<li><a class="dropdown-item" href="#" value="'+evt+'">'+evt+'</a></li>'    
//                         // '<option value="'+evt+'">'+evt+'</option>'
//                     );
//                 });
//             }
//         }
//     });
// }

// $("#typeroom").on("change", function() {
//     var str = "";
//     $("#typeroom option:selected" ).each( function() {
//         str += $( this ).text() + " ";
//     });
//     console.log();
// });
// http://localhost:8069/api/room_get/type/2/floor/2
// $('#typeroom').on('click', 'li', function () {
//     $("#btntype").text($(this).text()).val($(this).find("a").attr('value')).change();
//     // console.log("type : "+$(this).find("a").attr('value') + ", floor : " + $("#btnfloor").val());
//     get_detailroom();

// });
// $('#floorroom').on('click', 'li', function () {
//     // console.log($(this).text());
//     $("#btnfloor").text($(this).text()).val($(this).find("a").attr('value')).change();
//     get_detailroom();
    
// });

function get_detailroom(){

    $('#listroom').empty();
    jQuery.ajax({
        url: host+'/api/roomtype_get',
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