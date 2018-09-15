// Trigger
$('section#login form button').click(function() {login()});
$('section#logout form button').click(function() {logout()});

// Functions
function login() {
    
    if(navigator.onLine) {
        
        console.log("App ist online")
        
        benutzername = $('#login form input[name="benutzername"]').val();    
        passwort = sha256($('#login form input[name="passwort"]').val());
        
        localStorage.setItem('benutzername', benutzername);
        
        $('section#login form button').html('wird überprüft')
        
        $.ajax({            
            url: server,
            method: 'post',
            dataType: 'json',
            data: {benutzername: benutzername, passwort:passwort, useragent:navigator.userAgent}
        }).done(function(data) {
            
            localStorage.setItem('section', data.section);
            localStorage.setItem('fingerprint', data.fingerprint);
            
            $('section').hide();
            $('section#' + data.section).show();
            $('section#login form button').addClass('error').html(data.alert);
            
            setTimeout(function(){
                $('section#login form button').removeClass('error').html('prüfen');
            }, 3000);            
                 
        }).fail(function() {
            
            $('section#login form button').addClass('error').html('Logindaten konnten nicht geprüft werden')
            
            setTimeout(function(){
                $('section#login form button').removeClass('error').html('prüfen');
            }, 3000);
            
        });
        
    } else {
        
        alert('Um die Benutzereingaben zu überprüfen brauchen Sie eine Internetverbindung.');
        
    }   
    
    return false;
}

function logout() {
    
    localStorage.clear();
    $('section').hide();
    $('section#login').show();
    
}