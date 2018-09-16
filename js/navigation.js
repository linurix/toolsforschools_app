if(localStorage.getItem('section') == undefined 
    || localStorage.getItem('benutzername') == undefined 
    || localStorage.getItem('fingerprint') == undefined) 
{    
    show_section('login')  
} else {
    load_section(localStorage.getItem('section'));    
}

if(localStorage.getItem('data_cache') == undefined) {    
    localStorage.setItem('data_cache', '{}');    
}


$('[data-section]').click(function() {
    var section = $(this).data('section');
    load_section(section);
});




// Functions
function load_section(section) {
    
    if(localStorage.getItem('fingerprint') == 'undefined') {                
        localStorage.setItem('section', 'login');
    } else {
        
        switch(section) {
            
            case 'mitteilungen':
                load_chat_liste();
                break;
            
            case 'mitteilungen_chat':
                load_chat();
                break;                
            
            case 'notizen':
                show_section(section);
                break;
            
            case 'abwesenheiten':
                show_section(section);
                break;
            
            default:
                show_section(section);
                break;
        }
        
    }
        
}


function show_section(section) {
    
    localStorage.setItem('section', section);
    $('section').hide();
    $('section#' + section).show();

}
