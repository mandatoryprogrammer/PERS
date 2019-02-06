if( window.location.hash ) {
    var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
    hash = decodeURIComponent(hash);
    var fire_details = JSON.parse( hash );
    console.log( fire_details );
    document.getElementById( "vulnerable_domain" ).innerText = fire_details[ "base_domain" ];
    document.getElementById( "vulnerable_url" ).innerText = fire_details[ "host_page" ];
    document.getElementById( "full_resource_url" ).innerText = fire_details[ "resource_url" ];
    document.getElementById( "resource_type" ).innerText = capitalize_first_letter( fire_details[ "type" ] );
    document.getElementById( "gandi_button" ).href = "https://www.gandi.net/domain/suggest?domain_list=" + encodeURIComponent( fire_details[ "base_domain" ] );
    document.getElementById( "namecheap_button" ).href = "https://www.namecheap.com/domains/registration/results.aspx?domain=" + encodeURIComponent( fire_details[ "base_domain" ] );
    document.getElementById( "godaddy_button" ).href = "https://www.godaddy.com/domains/searchresults.aspx?checkAvail=1&tmskey=&domainToCheck=" + encodeURIComponent( fire_details[ "base_domain" ] );
    document.getElementById( "google_button" ).href = "https://domains.google.com/registrar?s=" + encodeURIComponent( fire_details[ "base_domain" ] );
} else {
    window.close();
}

function capitalize_first_letter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
