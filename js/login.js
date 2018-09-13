$('section#login form button').click(function() {
    
    benutzername = $('#login form input[name="benutzername"]').val();
    passwort = $('#login form input[name="passwort"]').val();
    passwort = sha256(passwort);
    
    localStorage.setItem('benutzername', benutzername);
    localStorage.setItem('useragent', navigator.userAgent);
    
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
        console.log('Logindaten werden gespeichert ...')
        console.log(data.alert)        
    }).fail(function() {
        console.log('Logindaten konnten nicht geprüft werden');
        
        alert('Hallo');
        $('section#login form button')
            .addClass('error').html('Logindaten konnten nicht geprüft werden')
            .delay(2000).html('überprüfen').removeClass('error');
    });
    
    return false;
    
});

$('section#logout form button').click(function() {
    
    localStorage.clear();
    $('section').hide();
    $('section#login').show();
        
    return false;
    
});