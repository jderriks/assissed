// ==UserScript==
// @name asSiSsed
// @author Koen Bollen & Jan Derriks
// @include http://*sis.hva.nl/*
// @include https://*sis.hva.nl/*
// @include http://*sis.hva.nl:8011/*
// @include https://*sis.hva.nl:8011/*
// @run-at document-end
// ==/UserScript==

// April 03, 2012

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

function main() {

	// haxx:
	$("form[autocomplete=off]").attr("autocomplete","on");

	function insertPasteArea() {
		if( !document.getElementById( "dropzone" ) )
		{
			var table = $("span:contains(Sessie)").closest("table")
			var dz = $("<div id='dropzone' title='Liefs, Koen &amp; Jan' style='margin:20px;font-family: Arial,sans-serif;font-size:11px;'><span class='PATRANSACTIONTITLE'>asSiSsed</span>Klik eerst op 'Alles Tonen' en plak dan studnr,cijfer regels hier:<br/><textarea id='dropzone_text' style='width:450px;height:100px;'></textarea><br/>Klik daarna op: <span style='margin:4px;display:inline-block;' class='SSSBUTTON_CONFIRMLINK'><a href='#' class='SSSBUTTON_CONFIRMLINK'>Energize!</a></span></div>");
			table.parent().prepend( dz );
			$("a",dz).click(function(e) {
				e.preventDefault();

				var raw = $("textarea", dz).val();
				raw = raw.replace(/\t/g, ",");
				var lines = raw.split('\n');
				$.each(lines, function() {
					var fields = this.split(",");
					if( fields.length == 2 )
					{
						var id = fields[0].trim();
						var grade = fields[1].trim();

						if( !( isNaN(id) || isNaN(grade) || grade < 1 || grade > 10 ) )
						{
							var idtd = $("span.PSEDITBOX_DISPONLY[innerHTML="+id+"]");
							var select = $(".PSDROPDOWNLIST", idtd.closest( "tr" ) );
							select.val( grade );
						}
					}
				});
			});
		}
	}

	var col = $(":contains('Cijfer op lijst')");
	if( col )
	{
		insertPasteArea();
		setInterval(insertPasteArea, 1000);
	}
}

addJQuery(main);
