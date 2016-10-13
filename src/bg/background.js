/*
 * Catch any resolution errors thrown via HTTP/HTTPS requests.
 */
chrome.webRequest.onErrorOccurred.addListener(
    function( details ) {
        if( "error" in details && details[ "error" ] == "net::ERR_NAME_NOT_RESOLVED" ) {
            // Get the page details where the expired domain occured.
            chrome.tabs.get( details.tabId, function( tab ) {
                // Hack to get base domain
                var a = document.createElement( "a" );
                a.href = details[ "url" ];
                var base_domain = window.publicSuffixList.getDomain( a["hostname"] )
                var results = {
                    "type": details[ "type" ],
                    "url": details[ "url" ],
                    "base_domain": base_domain,
                    "resource_url": details.url,
                    "host_page": tab.url
                }
                if( results[ "base_domain" ] != "" ) {
                    var base_domain = results[ "base_domain" ];
                    console.log( "Checking " + base_domain + "..." );
                    domainr_domain_check( base_domain, function( is_available ) {
                        if( is_available ) {
                            console.log( "Domain " + base_domain + " is available!" );
                            var window_new = window.open( "/src/bg/alertpage/index.html#" + JSON.stringify( results ) );
                        } else {
                            console.log( "Domain " + base_domain + " is not available." );
                        }
                    });
                }
            });
        }
    },
    {
        urls: ["<all_urls>"]
    }
);

// Bypass origin checks for domainr API
chrome.webRequest.onBeforeSendHeaders.addListener(function( details ){
    details.requestHeaders.push({
        "name": "Origin",
        "value": "https://domainr.build",
    });
    details.requestHeaders.push({
        "name": "Referer",
        "value": "http://domainr.build/",
    });
    return {requestHeaders: details.requestHeaders};
}, {urls: [ "https://api.domainr.com/*" ]}, ["blocking", "requestHeaders"]);


// Domainr
function domainr_domain_check( domain, cb ) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if( xhr.readyState == XMLHttpRequest.DONE ) {
            var domain_data = JSON.parse( xhr.responseText );
            if( "status" in domain_data ) {
                var domain_status = domain_data[ "status" ].filter( function( result_element) {
                    return ( "domain" in result_element && result_element[ "domain" ] == domain );
                });

                if( domain_status.length > 0 && domain_status[ 0 ][ "status" ] ) {
                   cb( ( domain_status[ 0 ][ "status" ] != "active" ) );
                } else {
                    godaddy_domain_check( domain, cb );
                }
            } else {
                // Fail over to next registrar
                godaddy_domain_check( domain, cb );
            }
        }
    };
    xhr.open( "GET", "https://api.domainr.com/v2/status?domain=" + encodeURIComponent( domain ) + "&client_id=domainr-readme-io", true );
    xhr.send( null );
}

// API is not always accurate so this is our failover instead of our primary.
function godaddy_domain_check( domain, cb ) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var domain_check_results = JSON.parse( xhr.responseText );
            cb( ( domain_check_results && "available" in domain_check_results && domain_check_results[ "available" ] == true ) );
        }
    }
    xhr.open( "GET", "https://api.ote-godaddy.com/v1/domains/available?domain=" + encodeURIComponent( domain ) + "&checkType=FULL&forTransfer=false", true );
    xhr.setRequestHeader( "Accept", "application/json" );
    xhr.send( null );
}
