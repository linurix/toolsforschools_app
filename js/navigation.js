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
    } else {        
        if(section == 'mitteilungen') {        
            load_chat_liste();
        } else if(section == 'mitteilungen_chat') {
            load_chat();
        }
    }
    switch_section(section);
}

// Functions
function switch_section(section) {
    localStorage.setItem('section', section);
    $('section').hide();
    $('section#' + section).show();
}
