$(document).ready(function () {
    $('#top_menu').removeClass('o_menu_loading');
    var urlpath = window.location.pathname;
    var domainpath = urlpath.split("/")[1];
    var path = urlpath.split("/")[2];
    var group = "";
    console.log('Current Path: ' + path);
    
    $('.nav-link.menu-link').hide();
    $('.nav-link.'+domainpath).show();
    var textHeader = "";
    if(domainpath == 'lsr'){textHeader = 'Learning Space Reservation';}
    $('#text-header').text(textHeader);
    $('#text-header-mobile').text(textHeader);

    $('.dropdown-item.t-menu').removeClass('active');
    $('.dropdown-item.t-menu').each(function() {
        console.log("dropdown " + $(this).attr('href'));
        if($(this).attr('href') == path){
            $(this).addClass('active');
            group = $(this).attr('data-group');
        }
    });
    $('.nav-link').removeClass('active');
    $('.nav-link').each(function() {
        // console.log("nav " + $(this).attr('data-group'));
        if(path != "/" && $(this).attr('data-group') == group){
            $(this).addClass('active');
        }else if($(this).attr('href') == path){
            $(this).addClass('active');
        }
    });   

});

// document.getElementById('dropdownToggle').addEventListener('click', function(event) {
//     event.preventDefault();
//     var dropdownMenu = document.getElementById('dropdownMenu');
//     dropdownMenu.style.display = (dropdownMenu.style.display === 'block' ? 'none' : 'block');
// });

// $('li .nav-link').click(function(){
//     console.log('nav-link2');
//     $('.nav-link').removeClass('active');   // it remove all the active links
//     $(this).addClass('active');    // it adds active class to the current link you have opened
//  });