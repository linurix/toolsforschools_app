var offline = false;

if(localStorage.getItem('mitteilungen_to_send') == null ) {
    localStorage.setItem('mitteilungen_to_send', '[]')
}
    
$('body').on('click', '[data-chat_id]', function() {
    
    var chat_id = $(this).data('chat_id');
    fingerprint: localStorage.setItem('chat_id', chat_id);  
    loadSection('mitteilungen_chat', chat_id);
    
});

$('#mitteilungen_chat div.neue_mitteilung button').click(function() {
    nachricht_senden();
});


function chat_liste(chats) {
    
    var html = '<ul>';
    console.log(chats);
    
    chats.forEach(function(chat){
        
        html += '<li data-chat_id="' + chat.chat_id + '">';
        html += chat.chat_name;
        if(chat.chat_neue_mitteilungen != 0) {
            html += '<span class="badge">' + chat.chat_neue_mitteilungen + '</span>';
        }
        html += '</li>';
        
        
    });
    
    $('section#mitteilungen div.content').html(html);

}

function chat_anzeigen(chat)  {
    
    var date_old = '';
    
    var html = '<ul>';
    console.log(chat);    
            
    chat.forEach(function(mitteilung){
                
        if(mitteilung.datum != date_old) {
            html += '<div class="mitteilungsdatum"><span>' + mitteilung.datum + '</span></div>'; 
            date_old = mitteilung.datum;            
        }
        
        if(mitteilung.absender == localStorage.getItem('benutzername')) {
            if(mitteilung.gelesen == 0) {
                html += '<div class="mitteilung eigen">';                 
            } else {
                html += '<div class="mitteilung eigen gelesen">';       
            }
                html += '<div>' + mitteilung.mitteilung + '</div>'; 
                html += '<div class="time">' + mitteilung.zeit + '</div>';                  
            html += '</div>';
        } else {
            html += '<div class="mitteilung empfangen">'; 
                html += '<div>' + mitteilung.mitteilung + '</div>';       
                html += '<div class="time">' ;   
                if(mitteilung.name != '') {
                    html += mitteilung.name + ', ';
                }
                html += mitteilung.zeit + '</div>';   
            html += '</div>';
        }
        
    });
    
    var container = $('section#mitteilungen_chat div.content'); 
    container.html(html).animate({scrollTop: 99999}, 600);
    
}

function nachricht_senden() {
    
    var textarea = $('#mitteilungen_chat div.neue_mitteilung textarea');
    
    if(textarea.val() == '') {return false;}
    
    $.ajax({
        url: server,
        method: 'post',
        dataType: 'json',
        data: {
            section: 'mitteilungen_chat', 
            nachricht: textarea.val(),
            chat_id: localStorage.getItem('chat_id'),
            fingerprint: localStorage.getItem('fingerprint'),
            offline_nachrichten: localStorage.getItem('mitteilungen_to_send')
        }        
    }).done(function( data ) {
        localStorage.setItem('mitteilungen_to_send', '[]');
        chat_anzeigen(data.chat);
    }).fail(function( data ) {
        
        var neue_mitteilung = [localStorage.getItem('chat_id'), textarea.val()];
        var mitteilungen = localStorage.getItem('mitteilungen_to_send');
        
        mitteilungen = JSON.parse(mitteilungen);         
        mitteilungen.push(neue_mitteilung)        
        localStorage.setItem('mitteilungen_to_send', JSON.stringify(mitteilungen)) 
        
        var html = ''
        if(offline == false) {
            html += '<div class="mitteilungsdatum"><span>Offline gespeicherte Mitteilungen</span></div>'; 
        }
        offline = true;       
        
        html += '<div class="mitteilung eigen offline">';       
        html += '<div>' + textarea.val() + '</div>'; 
        html += '</div>';
        $('section#mitteilungen_chat div.content').append(html);
        
    }).always(function() {
        textarea.val('');
    });
    
}