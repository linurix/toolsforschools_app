// Init
var offline = false;
var data_cache = JSON.parse(localStorage.getItem('data_cache'));

if(data_cache.mitteilungen == null || data_cache.mitteilungen == undefined) {
    data_cache.mitteilungen = {};
    localStorage.setItem('data_cache', JSON.stringify(data_cache));
}

if(localStorage.getItem('mitteilungen_to_send') == null ) {
    localStorage.setItem('mitteilungen_to_send', '[]')
}


// Trigger
$('body').on('click', '[data-chat_id]', function() { 
       
    var chat_id = $(this).data('chat_id');
    fingerprint: localStorage.setItem('chat_id', chat_id);
          
    load_section('mitteilungen_chat');    
});

$('#mitteilungen_chat div.neue_mitteilung button').click(function() {nachricht_senden();});



// functions

function load_chat_liste() {
    
    if (navigator.onLine) {
        
        // Online
        $.ajax({
            url: server,
            method: 'post',
            dataType: 'json',
            data: {
                section: 'mitteilungen',             
                fingerprint: localStorage.getItem('fingerprint')
            }
        }).done(function( data ) {
            
            if(data.update == true) {                
                
                var data_cache = JSON.parse(localStorage.getItem('data_cache'));
                
                // Altes Updaten
                for (var chat_id in data_cache.mitteilungen) {                    
                    var chat = data_cache.mitteilungen[chat_id];                    
                    chat.chat_name = data.chats[chat_id].chat_name;
                    chat.chat_neue_mitteilungen = data.chats[chat_id].chat_neue_mitteilungen;                     
                    delete data.chats[chat_id];                        
                }
                
                // Neues Speichern
                for (var chat_id in data.chats) {
                    data_cache.mitteilungen[chat_id] = data.chats[chat_id];  
                }
                                
                localStorage.setItem('data_cache', JSON.stringify(data_cache));
                
            }
            
            show_chat_liste();
            
        });
        
    }
    
}

function show_chat_liste() {
    
    var data_cache = JSON.parse(localStorage.getItem('data_cache'));        
    var html = '<ul>';
    
    var chats = data_cache.mitteilungen;
    var sortlist = [];
    
    for (var key in chats) {        
        sortlist.push([chats[key].chat_letzte_mitteilung, key]);
    }
    sortlist = sortlist.sort().reverse();
        
    for (var item in sortlist) {
        
        var key = sortlist[item][1];        
        var chat = data_cache.mitteilungen[key];
        
        html += '<li data-chat_id="' + chat.chat_id + '">';
        html += chat.chat_name;
        if(chat.chat_neue_mitteilungen != 0) {
            html += '<span class="badge">' + chat.chat_neue_mitteilungen + '</span>';
        }
        html += '</li>';   
        
    }
       
    $('section#mitteilungen div.content').html(html);  
    
    show_section('mitteilungen'); 
    
}

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
            
            if(data.update == true) {  
                              
                var data_cache = JSON.parse(localStorage.getItem('data_cache'));
                data_cache.mitteilungen[localStorage.getItem('chat_id')]['mitteilungen'] = data.mitteilungen;
                localStorage.setItem('data_cache', JSON.stringify(data_cache));
                
            }
            
            show_chat();
            
        });
        
    }    
}

function show_chat() {
    
    var date_old = '';    
    var html = '';  
    
    var data_cache = JSON.parse(localStorage.getItem('data_cache'));
    var chat = data_cache.mitteilungen[localStorage.getItem('chat_id')];
    console.log(chat);
                
    $('#chatname').html(chat.chat_name);
        
    if(chat.mitteilungen != undefined) {
        
        chat.mitteilungen.forEach(function (mitteilung) {
            
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
        
    }
        
    
    
    // Offline Nachrichten
    var mitteilungen_to_send = JSON.parse(localStorage.getItem('mitteilungen_to_send'));
    
    mitteilungen_to_send.forEach(function(mitteilung) {
        
        if(offline == false) {
            html += '<div class="mitteilungsdatum"><span>Offline gespeicherte Mitteilungen</span></div>'; 
        }
        offline = true;       
        
        html += '<div class="mitteilung eigen offline">';       
        html += '<div>' + mitteilung[1] + '</div>'; 
        html += '</div>';
        
    });
    
    // Nachrichten anzeigen    
    $('section#mitteilungen_chat div.content').html(html);    
    show_section('mitteilungen_chat');
    
    // nach unten scrollen
    var scrollTopMax = $('section#mitteilungen_chat div.content').prop('scrollHeight')-816
    $('section#mitteilungen_chat div.content').animate({scrollTop: scrollTopMax}, 800); 
    
}

function nachricht_senden() {
    
    var textarea = $('#mitteilungen_chat div.neue_mitteilung textarea');
    
    if(textarea.val() == '') {return false;}
    
    if (navigator.onLine) {
        
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
            
            textarea.val('');
            load_chat();
            
        });
        
    } else {
        
        // offline        
        var neue_mitteilung = [localStorage.getItem('chat_id'), textarea.val()];
        var mitteilungen = localStorage.getItem('mitteilungen_to_send');
        
        mitteilungen = JSON.parse(mitteilungen);         
        mitteilungen.push(neue_mitteilung);
        localStorage.setItem('mitteilungen_to_send', JSON.stringify(mitteilungen));
        
        textarea.val('');
        show_chat();        
        
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