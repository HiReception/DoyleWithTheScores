/**
 * Starts the client and server pushing functionality
 */

 function generateImage (image) {
    return function getImage(ctx, x, y, radius, shadow) {
        var img = new Image();
        img.onload = function() {
            ctx.drawImage(img, x+radius, y+radius, img.width, img.height)
        }
        img.src = image;
    }
 }
var startClientServer = function() {

    //Get the URL to hand into the connect call
    var http = location.protocol;
    var slashes = http.concat("//");
    var host = slashes.concat(window.location.hostname);

    //Socket IO communications
    var socket = io.connect(host);

	$.getJSON("averageforagainst.json", function(json) {
	    var data = [];
	    for (var i = 0; i < json.length; i++) {
	        data.push({
	            label: json[i]["name"],
	            data: [[json[i]["ave-agst"], json[i]["ave-for"]]],
	            points: {
	                radius: 10,
	                symbol: generateImage(json[i]["name"] + "-circle")
	            }
	        })
	    }
	    console.log(data)

	    $.plot("#placeholder", data, {
                        series: {
                            shadowSize: 0,	// Drawing is faster without shadows
                            hoverable: true,
                            points: {
                                show: true
                            },
                            lines: {
                                show: false
                            },
                        },
                        yaxis: {
                            axisLabel: 'Average Points For per Game',
                            axisLabelFontSizePixels: 12,
                            axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
                            axisLabelPadding: 5,
                            min: 50,
                            max: 120
                        },
                        xaxis: {
                            axisLabel: 'Average Points Against per Game',
                            axisLabelFontSizePixels: 12,
                            axisLabelFontFamily: 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
                            axisLabelPadding: 5,
                            min: 50,
        					max: 120
                        },
                        grid: {
                            markings: [
                                {
                                    xaxis: { from: 0, to: 80 },
                                    yaxis: { from: 100, to: 120 },
                                    color: "#88ff88"
                                },
                                {
                                    xaxis: { from: 0, to: 120 },
                                    yaxis: { from: 100, to: 100 },
                                    color: "#00bb00"
                                },
                                {
                                    xaxis: { from: 80, to: 80 },
                                    yaxis: { from: 0, to: 120 },
                                    color: "#00bb00"
                                },
                            ],
                            hoverable: true
                        },
                        legend: {
                            show: false
                        }
                    });

                    $("<div id='tooltip'><div id='tooltip-label'></div><div id='tooltip-for'></div><div id='tooltip-agst'></div></div>").css({
                                position: "absolute",
                                display: "none",
                            }).appendTo('body');
                    $("#placeholder").bind("plothover", function(event, pos, item) {
                        if (item) {
                        var pa = item.datapoint[0].toFixed(2);
                        var pf = item.datapoint[1].toFixed(2);
                            $("#tooltip-label").html(item.series.label + " - " + (pf/pa * 100).toFixed(2) + "%")
                            $("#tooltip-for").html(pf + " scored per game")
                            $("#tooltip-agst").html(pa + " conceded per game")
                            $("#tooltip").css({top: item.pageY+5, left: item.pageX+5})
                        	    .fadeIn(200);
                                console.log(item.series.label);
                        } else {
                            $("#tooltip").hide();
                        }
                    })

	})
};

/*Format for Team Probability line:
				<tr class="team-prob-row">
					<td class=\"teamicon\" style=\'background: url(\"[full team name]-left\") left center no-repeat\'>[full team name]</td>
					<td>[record]</td>
					<td>[percentage]</td>
					<td>[top 8 chance]</td>
					<td>[top 4 chance]</td>
					for i <- 1 to 18
						<td>[chance of finishing ith]</td>
					<td>[last game - format tbd]</td>
					<td>[next game - format tbd]</td>
				</tr>			
*/

var drawTeamProbTable = function() {
	console.log("TESTING");
	var tableDiv = document.getElementById('team-probability-wrapper');
	var tableArray = [];
	$.getJSON("teampositions.json", function(json) {
			var table = document.createElement("table");
			table.setAttribute("id", "team-probability-table");
			var headerRow = document.createElement("tr");
			
				var headerName = document.createElement("th");
				headerName.setAttribute("class", "team-prob-row");
				headerName.setAttribute("rowspan", "2");
				var headerNameText = document.createTextNode("Team Name");
				headerName.appendChild(headerNameText);
				headerRow.appendChild(headerName);
				
				var headerWDL = document.createElement("th");
				headerWDL.setAttribute("class", "team-prob-row");
				headerWDL.setAttribute("rowspan", "2");
				var headerWDLText = document.createTextNode("W-D-L");
				headerWDL.appendChild(headerWDLText);
				headerRow.appendChild(headerWDL);
				
				var headerPerc = document.createElement("th");
				headerPerc.setAttribute("class", "team-prob-row");
				headerPerc.setAttribute("rowspan", "2");
				var headerPercText = document.createTextNode("%");
				headerPerc.appendChild(headerPercText);
				headerRow.appendChild(headerPerc);
				
				var headerTop8 = document.createElement("th");
				headerTop8.setAttribute("class", "team-prob-row");
				headerTop8.setAttribute("rowspan", "2");
				headerTop8.appendChild(document.createTextNode("Chance of"));
				headerTop8.appendChild(document.createElement("br"));
				headerTop8.appendChild(document.createTextNode("Finals"));
				headerRow.appendChild(headerTop8);
				
				var headerTop4 = document.createElement("th");
				headerTop4.setAttribute("class", "team-prob-row");
				headerTop4.setAttribute("rowspan", "2");
				headerTop4.appendChild(document.createTextNode("Chance of"));
				headerTop4.appendChild(document.createElement("br"));
				headerTop4.appendChild(document.createTextNode("Top 4"));
				headerRow.appendChild(headerTop4);
				
				var headerPosTop = document.createElement("th");
				headerPosTop.setAttribute("class", "team-prob-row");
				headerPosTop.setAttribute("colspan", "18");
				var headerPosTopText = document.createTextNode("Chance of finishing in position:");
				headerPosTop.appendChild(headerPosTopText);
				headerRow.appendChild(headerPosTop);
				
				var headerLast = document.createElement("th");
				headerLast.setAttribute("class", "team-prob-row");
				headerLast.setAttribute("rowspan", "2");
				var headerLastText = document.createTextNode("Last Game");
				headerLast.appendChild(headerLastText);
				headerRow.appendChild(headerLast);
				
				var headerNext = document.createElement("th");
				headerNext.setAttribute("class", "team-prob-row");
				headerNext.setAttribute("rowspan", "2");
				var headerNextText = document.createTextNode("Next Game");
				headerNext.appendChild(headerNextText);
				headerRow.appendChild(headerNext);

				var headerAve = document.createElement("th");
                headerAve.setAttribute("class", "team-prob-ave");
                headerAve.setAttribute("rowspan", "2");
                var headerAveText = document.createTextNode("Ave Seed");
                headerAve.appendChild(headerAveText);
                headerRow.appendChild(headerAve);

                var headerRPI = document.createElement("th");
                                headerRPI.setAttribute("class", "team-prob-rpi");
                                headerRPI.setAttribute("rowspan", "2");
                                var headerRPIText = document.createTextNode("RPI");
                                headerRPI.appendChild(headerRPIText);
                                headerRow.appendChild(headerRPI);
				
				table.appendChild(headerRow);
				var headerSecondRow = document.createElement("tr");
				
				for (var p = 1; p <= 18; p++) {
					var headerPos = document.createElement("th");
					headerPos.setAttribute("class", "team-prob-row");
					var headerPosText = document.createTextNode("" + p);
					headerPos.appendChild(headerPosText);
					headerSecondRow.appendChild(headerPos);
				}
				table.appendChild(headerSecondRow);
			
			
			for (var i = 0; i < json.length; i++) {
				var teamData = json[i];
				var teamRow = document.createElement("tr");
				teamRow.setAttribute("class", "team-prob-row");
				
				var teamName = document.createElement("td");
				teamName.setAttribute("class", "teamicon");
				teamName.setAttribute("style", "background: url(\"" + teamData.name + "-left\") left center no-repeat")
				var teamNameText = document.createTextNode(teamData.name);
				teamName.appendChild(teamNameText);
				teamRow.appendChild(teamName);
				
				var teamWDL = document.createElement("td");
				teamWDL.setAttribute("class", "team-prob-wdl");
				var teamWDLText = document.createTextNode(teamData.wdl);
				teamWDL.appendChild(teamWDLText);
				teamRow.appendChild(teamWDL);
				
				var teamPerc = document.createElement("td");
				teamPerc.setAttribute("class", "team-prob-perc");
				var teamPercText = document.createTextNode(parseFloat(teamData.percentage * 100).toFixed(1));
				teamPerc.appendChild(teamPercText);
				teamRow.appendChild(teamPerc);
				
				var teamTop8 = document.createElement("td");
				teamTop8.setAttribute("class", "team-prob-finals");
				var teamTop8Text = document.createTextNode(parseFloat(teamData.finalschance).toFixed(2) + "%");
				teamTop8.appendChild(teamTop8Text);
				teamRow.appendChild(teamTop8);
				
				var teamTop4 = document.createElement("td");
				teamTop4.setAttribute("class", "team-prob-finals");
				var teamTop4Text = document.createTextNode(parseFloat(teamData.top4chance).toFixed(2) + "%");
				teamTop4.appendChild(teamTop4Text);
				teamRow.appendChild(teamTop4);
				
				for (var p = 1; p <= 18; p++) {
					
					var teamPos = document.createElement("td");
					var teamPosSpan = document.createElement("span");
					teamPosSpan.setAttribute("title", parseFloat(teamData.positionchance[p.toString()]) + "%");
					teamPos.setAttribute("class", "team-prob-position");
					teamPos.setAttribute("style", "background-color: rgba(127,127,255," + parseFloat(teamData.positionchance[p.toString()]).toFixed(2) / 100 + ")");
					if (teamData.positionchance[p.toString()] != 0) {
						var teamPosText = document.createTextNode(parseFloat(teamData.positionchance[p.toString()].toFixed(0)));
						teamPosSpan.appendChild(teamPosText);
						teamPos.appendChild(teamPosSpan);
					}
					
					teamRow.appendChild(teamPos);
				}
				
				var teamLast = document.createElement("td");
				teamLast.setAttribute("class", "team-prob-lastnext")
				var teamLastText = document.createTextNode(teamData.lastgame);
				teamLast.appendChild(teamLastText);
				teamRow.appendChild(teamLast);
				
				var teamNext = document.createElement("td");
				teamNext.setAttribute("class", "team-prob-lastnext")
				var teamNextText = document.createTextNode(teamData.nextgame);
				teamNext.appendChild(teamNextText);
				teamRow.appendChild(teamNext);

				var teamAve = document.createElement("td");
				teamAve.setAttribute("class", "team-prob-ave")
                var teamAveText = document.createTextNode(parseFloat(teamData.averageseed).toFixed(1));
                teamAve.appendChild(teamAveText);
                teamRow.appendChild(teamAve);

                var teamRPI = document.createElement("td");
                				teamRPI.setAttribute("class", "team-prob-rpi")
                                var teamRPIText = document.createTextNode(parseFloat(teamData.rpi).toFixed(3));
                                teamRPI.appendChild(teamRPIText);
                                teamRow.appendChild(teamRPI);
				
				
				table.appendChild(teamRow);
			}
			tableDiv.appendChild(table);
		});
}
	/*Format for completed game:
		<tr class="game-list-header"><th colspan="5">Last Nine Games</th></tr>
				<tr>
					<td class="gameteamicon-left" style='background: url("[full home team name]-left") left center no-repeat'>[home team nickname]</td>
					if home team won
						<td class="gamescore-win">[home score]</td>
					else if home team lost
						<td class="gamescore-lose">[home score]</td>
					else
						<td class="gamescore">[home score]</td>
					<td class="gamecentre">vs</td>
					if away team won
						<td class="gamescore-win">[away score]</td>
					else if away team lost
						<td class="gamescore-lose">[away score]</td>
					else
						<td class="gamescore">[home score]</td>
					<td class="gameteamicon-right" style='background: url("[full away team name]-right.png") right center no-repeat'>[away team nickname]</td>
				</tr>
				<tr><td colspan="5" class="gamedetails">Predicted chance of this result: [result chance]</td></tr>
	*/
	
var drawRecentGamesTable = function() {
	var tableDiv = document.getElementById('last-nine-div');
	var tableArray = [];
	$.getJSON("mostrecentgames.json", function(json) {
			var table = document.createElement("table");
			table.setAttribute("id", "team-probability-table");
			var headerRow = document.createElement("tr");
			headerRow.setAttribute("class", "game-list-header");
			
			var headerCell = document.createElement("th");
			headerCell.setAttribute("colspan", "5");
			headerCell.appendChild(document.createTextNode("Last Nine Games"));
			
			headerRow.appendChild(headerCell);
			table.appendChild(headerRow);
			
			console.log(json.length)
			for (var i = 0; i < json.length; i++) {
				var gameData = json[i];
				var gameFirstRow = document.createElement("tr");
				var gameSecondRow = document.createElement("tr");
				
				var homeTeam = document.createElement("td");
				homeTeam.setAttribute("class", "gameteamicon-left");
				homeTeam.setAttribute("style", "background: url(\"" + gameData.hometeam + "-left\") left center no-repeat")
				homeTeam.appendChild(document.createTextNode(gameData.hometeam));
				gameFirstRow.appendChild(homeTeam);
				
				var homeScore = document.createElement("td");
				homeScore.appendChild(document.createTextNode(gameData.homescore));
				gameFirstRow.appendChild(homeScore);
				
				var centre = document.createElement("td");
				centre.setAttribute("class", "gamecentre");
				centre.appendChild(document.createTextNode("vs"));
				gameFirstRow.appendChild(centre);
				
				var awayScore = document.createElement("td");
				awayScore.appendChild(document.createTextNode(gameData.awayscore));
				gameFirstRow.appendChild(awayScore);
				if (parseInt(gameData.homescore) > parseInt(gameData.awayscore)) {
					homeScore.setAttribute("class", "gamescore-win");
					awayScore.setAttribute("class", "gamescore-lose");
				} else if (parseInt(gameData.homescore) < parseInt(gameData.awayscore)) {
					homeScore.setAttribute("class", "gamescore-lose");
					awayScore.setAttribute("class", "gamescore-win");
				} else {
					homeScore.setAttribute("class", "gamescore");
					awayScore.setAttribute("class", "gamescore");
				}
				
				var awayTeam = document.createElement("td");
				awayTeam.setAttribute("class", "gameteamicon-right");
				awayTeam.setAttribute("style", "background: url(\"" + gameData.awayteam + "-right\") right center no-repeat")
				awayTeam.appendChild(document.createTextNode(gameData.awayteam));
				gameFirstRow.appendChild(awayTeam);
				
				var gameDetails = document.createElement("td");
				gameDetails.setAttribute("class", "gamedetails");
				gameDetails.setAttribute("colspan", "5");
				gameDetails.appendChild(document.createTextNode(gameData.date + " - Predicted chance of this result: " + parseFloat(gameData.chanceofresult).toFixed(1) + "%"))
				gameSecondRow.appendChild(gameDetails);
				
				
				table.appendChild(gameFirstRow);
				table.appendChild(gameSecondRow);
			}
			tableDiv.appendChild(table);
	});
}

var drawUpcomingGamesTable = function() {
	var tableDiv = document.getElementById('next-nine-div');
	var tableArray = [];
	$.getJSON("upcominggames.json", function(json) {
			var table = document.createElement("table");
			table.setAttribute("id", "team-probability-table");
			var headerRow = document.createElement("tr");
			headerRow.setAttribute("class", "game-list-header");
			
			var headerCell = document.createElement("th");
			headerCell.setAttribute("colspan", "5");
			headerCell.appendChild(document.createTextNode("Next Nine Games"));
			
			headerRow.appendChild(headerCell);
			table.appendChild(headerRow);
			
			
			for (var i = 0; i < json.length; i++) {
				var gameData = json[i];
				var gameFirstRow = document.createElement("tr");
				var gameSecondRow = document.createElement("tr");
				
				var homeTeam = document.createElement("td");
				homeTeam.setAttribute("class", "gameteamicon-left");
				homeTeam.setAttribute("style", "background: url(\"" + gameData.hometeam + "-left\") left center no-repeat")
				homeTeam.appendChild(document.createTextNode(gameData.hometeam));
				gameFirstRow.appendChild(homeTeam);
				
				var homePerc = document.createElement("td");
				homePerc.setAttribute("class", "gameperc");
				homePerc.appendChild(document.createTextNode(parseFloat(gameData.homechance).toFixed(1) + "%"));
				gameFirstRow.appendChild(homePerc);
				
				var centre = document.createElement("td");
				centre.setAttribute("class", "gamecentre");
				centre.appendChild(document.createTextNode("vs"));
				gameFirstRow.appendChild(centre);
				
				var awayPerc = document.createElement("td");
				awayPerc.setAttribute("class", "gameperc");
				awayPerc.appendChild(document.createTextNode(parseFloat(gameData.awaychance).toFixed(1) + "%"));
				gameFirstRow.appendChild(awayPerc);
				
				var awayTeam = document.createElement("td");
				awayTeam.setAttribute("class", "gameteamicon-right");
				awayTeam.setAttribute("style", "background: url(\"" + gameData.awayteam + "-right\") right center no-repeat")
				awayTeam.appendChild(document.createTextNode(gameData.awayteam));
				gameFirstRow.appendChild(awayTeam);
				
				var gameDetails = document.createElement("td");
				gameDetails.setAttribute("class", "gamedetails");
				gameDetails.setAttribute("colspan", "5");
				gameDetails.appendChild(document.createTextNode(gameData.date + " - Chance of Draw: " + parseFloat(gameData.drawchance).toFixed(1) + "%"))
				gameSecondRow.appendChild(gameDetails);
				
				
				table.appendChild(gameFirstRow);
				table.appendChild(gameSecondRow);
			}
			tableDiv.appendChild(table);
		});
}