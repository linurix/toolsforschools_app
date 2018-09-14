var server = "https://g132.toolsforschools.ch/appserver/";


if(localStorage.getItem('section') == undefined 
    || localStorage.getItem('benutzername') == undefined 
    || localStorage.getItem('fingerprint') == undefined) 
{
    
    localStorage.setItem('section', 'login');
    $('section#' + localStorage.getItem('section')).show();
    
} else {

    loadSection(localStorage.getItem('section'));
    
}

$('[data-section]').click(function() {
    var section = $(this).data('section');
    loadSection(section);
});


function loadSection(section, id) {
    
    if(localStorage.getItem('fingerprint') == 'undefined') {
        
        localStorage.setItem('section', 'login');
        $('section').hide();
        $('section#login').show();
        
    } else {
        
        if(section == 'mitteilungen') {
            
            $.ajax({
                url: server,
                method: 'post',
                dataType: 'json',
                data: {
                    section: section,             
                    fingerprint: localStorage.getItem('fingerprint')
                }
            }).done(function( data ) {
                chat_liste(data.chats);
            }).fail(function (){
                console.log(JSON.parse(localStorage.getItem('chat_liste')));
                chat_liste(JSON.parse(localStorage.getItem('chat_liste')));
            }).always(function(data) {
                switch_section(section);
            });
            
        } else if(section == 'mitteilungen_chat') {
            
            $.ajax({
                url: server,
                method: 'post',
                dataType: 'json',
                data: {
                    section: section, 
                    chat_id: localStorage.getItem('chat_id'),
                    fingerprint: localStorage.getItem('fingerprint')
                }
            }).done(function( data ) {
                $('#chatname').html(data.chatname);
                chat_anzeigen(data.chat);
            }).fail(function (){
                var chat_id = localStorage.getItem('chat_id');
                var offline_data = JSON.parse(localStorage.getItem('chats'));
                chat_anzeigen(offline_data[localStorage.getItem('chat_id')]);                
            }).always(function(){
                switch_section(section);                
            });
            
        } else {

            switch_section(section);
            
        }
        
        
    }

}

function switch_section(section) {
    localStorage.setItem('section', section);
    $('section').hide();
    $('section#' + section).show();
    console.log("Switch to: " + section)
}
