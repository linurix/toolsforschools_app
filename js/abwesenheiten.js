var data_cache = JSON.parse(localStorage.getItem('data_cache'));

if(data_cache.abwesenheiten == null || data_cache.abwesenheiten == undefined) {

    data_cache.abwesenheiten = [];
    localStorage.setItem('data_cache', JSON.stringify(data_cache));
}

function show_abwesenheiten() {
    
    aktualisiere_abwesenheiten();    
    show_section('abwesenheiten');
    
}


function aktualisiere_abwesenheiten() {
    
    if (navigator.onLine) {
        
        // Online
        $.ajax({
            url: server,
            method: 'post',
            dataType: 'json',
            data: {
                section: 'abwesenheiten',             
                fingerprint: localStorage.getItem('fingerprint')
            }
        }).done(function( data ) {
            
            if(data.update == true) {
                
                var data_cache = JSON.parse(localStorage.getItem('data_cache'));
                data_cache.abwesenheiten = data.abwesenheiten;
                localStorage.setItem('data_cache', JSON.stringify(data_cache));
                
            }
            
            build_abwesenheiten_liste();
            
        });
        
    }
    
}


function build_abwesenheiten_liste() {
    
    var data_cache = JSON.parse(localStorage.getItem('data_cache'));        
    var html = '<ul>';
        
    data_cache.abwesenheiten.forEach(function(abwesenheit) {   
        html += '<li class="' + abwesenheit.status + '" data-abwesenheiten_id="' + abwesenheit.abwesenheiten_id + '">';
        html += '<strong>'+abwesenheit.schüler+'</strong>';        
        html += '<br>';        
        html += abwesenheit.grund;         
        html += '<br>';        
        html += abwesenheit.von;
        html += ' - ';        
        html += abwesenheit.bis;             
        html += '</li>';        
    });
    
    $('section#abwesenheiten div.content').html(html);  
        
}