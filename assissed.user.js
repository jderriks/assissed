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
			var table = $("span:contains(Sessie)").closest("table");
			var html = "";
			html += "<div id='dropzone' title='Liefs, Koen &amp; Jan' style='margin:20px;font-family: Arial,sans-serif;font-size:11px;'><span class='PATRANSACTIONTITLE'>asSiSsed</span>";
			html += "Klik eerst op 'Alles Tonen' en plak dan studnr,cijfer regels hier:<br/><textarea id='dropzone_text' style='float:left;width:450px;height:100px;'></textarea>";
			html += "<div id='droplog' style='font-family:monospace;font-size:10px;float:right;width:190px;height:100px;border:1px solid gray;white-space: nowrap;overflow-y:scroll;overflow-x:auto'><b>asSiSsed log:</b><hr/></div>";
			html += "<div style='clear:both'>Klik daarna op: <span style='margin:4px;display:inline-block;' class='SSSBUTTON_CONFIRMLINK'><a href='#' class='SSSBUTTON_CONFIRMLINK'>Energize!</a></span></div>";
			html += "</div>";
			var dz = $(html);
			table.parent().prepend( dz );
			$("a",dz).click(function(e) {
				e.preventDefault();

				var raw = $("textarea", dz).val();
				raw = raw.replace(/\t/g, ",");
				var lines = raw.split('\n');

				$("#droplog").append( lines.length + " regels gevonden<br/>");

				var total = 0;
				var setcount = 0;
				$.each(lines, function() {
					var fields = this.split(",");
					if( fields.length == 2 )
					{
						var id = fields[0].trim();
						var grade = fields[1].trim();

						if( !( isNaN(id) || isNaN(grade) || grade < 1 || grade > 10 ) )
						{
							total += 1;
							var idtd = $("span.PSEDITBOX_DISPONLY[innerHTML="+id+"]");
							if( idtd.length != 0 )
							{
								setcount += 1
								var select = $(".PSDROPDOWNLIST", idtd.closest( "tr" ) );
								select.val( grade );
							}
							else
							{
								$("#droplog").append("<font color=red>"+id+" niet gevonden</font><br/>");
							}
						}
					}
				});
				$("#droplog").append( "<font color=green>" + setcount + " cijfer"+(setcount!=1?"s":"")+" ingevoerd van de " + total + "</font><br /><br />" );
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
