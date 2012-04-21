// ==UserScript==
// @name asSiSsed
// @version 1.2.5HvA
// @author Koen Bollen & Jan Derriks
// @include http://*sis.hva.nl/*
// @include https://*sis.hva.nl/*
// @include http://*sis.hva.nl:8011/*
// @include https://*sis.hva.nl:8011/*
// @include https://home.informatica.hva.nl/assissed/*
// @run-at document-end
// ==/UserScript==

// April 19, 2012  changed csv format from "," into ";". Now decimals in grades are allowed too 

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

	// Show assissed version on login page
	var assissedVersion = "Assissed1.2.5HvA";
	var but = $("input.psloginbutton");
	but.css("border","3px solid green");
	but.attr("value",assissedVersion);

	// enable password saving
	$("form[autocomplete=off]").attr("autocomplete","on");

	function insertPasteArea() {
		if( !document.getElementById( "dropzone" ) )
		{
			var table = $("span:contains(Sessie)").closest("table");
			var html = "";
			html += "<div id='dropzone' title='Liefs, Koen &amp; Jan' style='margin:20px;font-family: Arial,sans-serif;font-size:11px;'><span class='PATRANSACTIONTITLE'>asSiSsed</span>";
			html += "Klik eerst op 'Alles Tonen' en plak dan studnr;cijfer regels hier:<br/><textarea id='dropzone_text' style='float:left;width:450px;height:100px;'></textarea>";
			html += "<div id='droplog' style='font-family:monospace;font-size:10px;float:right;width:190px;height:100px;border:1px solid gray;white-space: nowrap;overflow-y:scroll;overflow-x:auto'><b>asSiSsed log:</b><hr/></div>";
			html += "<div style='clear:both'>Klik daarna op: <span style='margin:4px;display:inline-block;' class='SSSBUTTON_CONFIRMLINK'><a href='#' class='SSSBUTTON_CONFIRMLINK'>Energize!</a></span></div>";
			html += "</div>";
			var dz = $(html);
			table.parent().prepend( dz );
			$("a",dz).click(function(e) {
				e.preventDefault();

				var raw = $("textarea", dz).val();
				raw = raw.replace(/\t/g, ";");
				var lines = raw.split('\n');

				$("#droplog").append( lines.length + " input regels gevonden<br/>");

				var total = 0;
				var setcount = 0;
				$.each(lines, function() {
					var fields = this.split(";");
					if( fields.length == 2 )
					{
						var id = fields[0].trim();
						var grade = fields[1].trim();

						if( isNaN(id) )
						{
							return true; // continue;
						}
						total += 1;
						var idtd = $("span.PSEDITBOX_DISPONLY[innerHTML="+id+"]");
						idtd.css("border","1px solid green"); // show selected id
						if( idtd.length > 0 )
						{
							setcount += 1
							var input = $(".PSEDITBOX", idtd.closest( "tr" ) );
							input.val( grade );
							input.css("border","1px solid blue");
						}
						else
						{
							$("#droplog").append("<font color=orange>"+id+" niet gevonden</font><br/>");
						}
					}
				});
				$("#droplog").append( "<font color=green>" + setcount + " cijfer"+(setcount!=1?"s":"")+" ingevoerd van de " + total + "</font><br /><br />" );
				$("#droplog").attr({ scrollTop: $("#droplog").attr("scrollHeight") });
			});
		}
	}

	//var col = $(":contains('Cijfer op lijst')");
	var tab = $("table[id^=GRADE_ROSTER]").css("border","4px solid blue");
	var col = $("input[id^=SNS_DERIVED_CRSE_GRADE_INPUT]", tab);
	col.css("border","1px solid red");
	if( col.length > 0 )
	{
		insertPasteArea();
		setInterval(insertPasteArea, 2000); // check dropzone every 2 secs
	}
}

addJQuery(main);
