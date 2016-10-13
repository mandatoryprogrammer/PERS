hljs.initHighlightingOnLoad();

function SelectText(element) {
    var text = document.getElementById(element);
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
}

$( "#highlight-code" ).click(function() {
    SelectText( "modal-code" );
});

function viewcookies( row_id ) {
	$( "#myModalLabel" ).text( "Cookies" );
	$( "#modal-inner-code" ).html( $( "#cookie_data_row_" + row_id ).html() );
	$( '#myModal' ).modal( 'show' );
	$('pre code').each( function(i, block) {
		hljs.highlightBlock( block );
	});
}

function viewhtml( row_id ) {
	$( "#myModalLabel" ).text( "HTML" );
	$( "#modal-inner-code" ).html( $( "#html_data_row_" + row_id ).html() );
	$( '#myModal' ).modal( 'show' );
	$('pre code').each( function(i, block) {
		hljs.highlightBlock( block );
	});
}