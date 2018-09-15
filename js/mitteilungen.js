// Init
var offline = false;

if(localStorage.getItem('mitteilungen_to_send') == null ) {
    localStorage.setItem('mitteilungen_to_send', '[]')
}

if(localStorage.getItem('chat_liste') == null ) {
    localStorage.setItem('chat_liste', '{}')
}

if(localStorage.getItem('chats') == null ) {
    localStorage.setItem('chats', '{}')
}


// Trigger
$('body').on('click', '[data-chat_id]', function() {
    
    var chat_id = $(this).data('chat_id');
    fingerprint: localStorage.setItem('chat_id', chat_id); 
     
    load_chat();
    switchSection('mitteilungen_chat');
    
});

$('#mitteilungen_chat div.neue_mitteilung button').click(function() {nachricht_senden();});



// functions
function load_chat() {
    
    if (navigator.onLine) {
        
        // Online            
        $.ajax({
            url: server,
            method: 'post',
            dataType: 'json',
            data: {
                section: 'mitteilungen_chat',
                chat_id: localStorage.getItem('chat_id'),
                fingerprint: localStorage.getItem('fingerprint')
            }
        }).done(function( data ) {
            
            console.log(data);
            
            $('#chatname').html(data.chatname);
            localStorage.getItem('');
            
        }).fail(function (){
            
            var chat_id = localStorage.getItem('chat_id');
            var offline_data = JSON.parse(localStorage.getItem('chats'));
            chat_anzeigen(offline_data[localStorage.getItem('chat_id')]); 
            offline_nachrichten_anzeigen();  
                         
        });
        
    } else {
        
        // Offline
        var chat_id = localStorage.getItem('chat_id');
        var offline_data = JSON.parse(localStorage.getItem('chats'));
        var mitteilungen_to_send = JSON.parse(localStorage.getItem('mitteilungen_to_send'));
        
        mitteilungen_to_send.forEach(function(mitteilung) {
            
            if(mitteilung[0] == chat_id) {
                
                offline_data[localStorage.getItem('chat_id')].push({
                    datum: 'offline', 
                    absender: localStorage.getItem('benutzername'), 
                    gelesen: '',
                    mitteilung: mitteilung[1],
                    zeit: '',
                    name: ''
                });  
                
            }
        });
        
        chat_anzeigen(offline_data[localStorage.getItem('chat_id')]);
        offline_nachrichten_anzeigen();
        switch_section('mitteilungen_chat');
        
    }
    
}


function load_chat_liste() {
    
    if (navigator.onLine) {
        // Online
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
            chat_liste(JSON.parse(localStorage.getItem('chat_liste')));
        }).always(function(data) {
            switch_section(section);
        });
      
    } else {
        // Offline
        chat_liste(JSON.parse(localStorage.getItem('chat_liste')));
        switch_section(section);
    }
}


function chat_liste(chats) {
    
    var chat_liste = [];                

    var html = '<ul>';
        
    chats.forEach(function(chat){
        
        html += '<li data-chat_id="' + chat.chat_id + '">';
        html += chat.chat_name;
        if(chat.chat_neue_mitteilungen != 0) {
            html += '<span class="badge">' + chat.chat_neue_mitteilungen + '</span>';
        }
        html += '</li>';
        
        chat_liste.push({
            chat_id:chat.chat_id, 
            chat_name: chat.chat_name, 
            chat_neue_mitteilungen: chat.chat_neue_mitteilungen
        });
        
    });
    
    $('section#mitteilungen div.content').html(html);
    localStorage.setItem('chat_liste', JSON.stringify(chat_liste));

}

function chat_anzeigen(chat)  {
    
    var date_old = '';
    var chat_offline_content = [];
    
    var html = '';  
            
    if(chat != undefined && Array.isArray(chat)) {
        
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
            
            chat_offline_content.push({
                datum: mitteilung.datum, 
                absender: mitteilung.absender, 
                gelesen: mitteilung.gelesen,
                mitteilung: mitteilung.mitteilung,
                zeit: mitteilung.zeit,
                name: mitteilung.name
            });
            
        });
        
        var offline_data = JSON.parse(localStorage.getItem('chats'));
        offline_data[chat[0].chat_id] = chat_offline_content;
        localStorage.setItem('chats', JSON.stringify(offline_data));
        
    }
    
    var container = $('section#mitteilungen_chat div.content'); 
    container.html(html).animate({scrollTop: 99999}, 600);
    
    
}

function nachricht_senden() {
    
    var textarea = $('#mitteilungen_chat div.neue_mitteilung textarea');
    
    if(textarea.val() == '') {return false;}
    
    if (navigator.onLine) {
        // online
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
            
        }).always(function() {
            textarea.val('');
        });
    
    } else {
        // offline        
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
        
        textarea.val('');
        
    }
    
}

function offline_nachrichten_anzeigen() {
    
    var mitteilungen_to_send = JSON.parse(localStorage.getItem('mitteilungen_to_send'));
    
    mitteilungen_to_send.forEach(function(mitteilung) {
        
        console.log(mitteilung);
        
        if(offline == false) {
            html += '<div class="mitteilungsdatum"><span>Offline gespeicherte Mitteilungen</span></div>'; 
        }
        offline = true;       
        
        html += '<div class="mitteilung eigen offline">';       
        html += '<div>' + mitteilung[1] + '</div>'; 
        html += '</div>';
        
        $('section#mitteilungen_chat div.content').append(html);
        
    });
    
    
}