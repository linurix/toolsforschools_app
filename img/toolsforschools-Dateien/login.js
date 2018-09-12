$('section#login form button').click(function() {
    
    benutzername = $('#login form input[name="benutzername"]').val();
    passwort = $('#login form input[name="passwort"]').val();
    passwort = sha256(passwort);
    
    localStorage.setItem('benutzername', benutzername);
    localStorage.setItem('useragent', navigator.userAgent);
    
    $.ajax({
        url: server,
        method: 'post',
        dataType: 'json',
        data: {benutzername: benutzername, passwort:passwort, useragent:navigator.userAgent}
    }).done(function(data) {
        console.log('Logindaten werden gespeichert ...')
        localStorage.setItem('section', data.section);
        localStorage.setItem('fingerprint', data.fingerprint);
        $('section').hide();
        $('section#' + data.section).show();
        console.log(data.alert)        
    });
    
    return false;
    
});

$('section#logout form button').click(function() {
    
    localStorage.clear();
    $('section').hide();
    $('section#login').show();
        
    return false;
    
});