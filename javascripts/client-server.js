/**
 * Starts the client and server pushing functionality
 */

var teamNames = [];
var generateImage = function (ctx, image) {
    console.log("generateImage(" + image + ") called")
        var img = new Image();
        img.src = image;
        img.onload = function() {
            console.log("onload called for " + image)
            return ctx.createPattern(img, 'repeat')
        }
}

var startClientServer = function(competition) {
    var ctx = $("#placeholder").get(0).getContext("2d");
    //Get the URL to hand into the connect call
    var http = location.protocol;
    var slashes = http.concat("//");
    var host = slashes.concat(window.location.hostname);


	$.getJSON(competition + "-averageforagainst", function(json) {
	    var data = {
	        datasets: []
	    };
	    for (var i = 0; i < json.length; i++) {
	        data.datasets.push({
	            label: json[i].name,
	            data: [{
	                x: json[i]["ave-agst"],
	                y: json[i]["ave-for"],

	            }],
	            pointBackgroundColor: generateImage(ctx, "/" + competition + "/" + json[i].name + "-circle"),
	            pointRadius: 5
	        })
	    }
	    console.log(data);


	    console.log(ctx);
	    console.log("context.canvas = " + ctx.canvas)

	    new Chart(ctx).Scatter(data, {
	        scales: {
	            xaxes: [{
	                scaleLabel: {
	                    display: true,
	                    labelString: "Average Points Against per Game"
	                }
	            }],
	            yaxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Average Points For per Game"
                    }
                }]
	        },
	        hover: {
	            mode: 'single',
	        },
            grid: {
                markings: [
                    {
                        xaxis: { from: 0, to: 86 },
                        yaxis: { from: 100 },
                        color: "#88ff88"
                    },
                    {
                        yaxis: { from: 100, to: 100 },
                        color: "#00bb00"
                    },
                    {
                        xaxis: { from: 86, to: 86 },
                        color: "#00bb00"
                    },
                ],
                hoverable: true
            },
            responsive: true,
            pointDotRadius: 10,

        });

        $("<div id='tooltip'><div id='tooltip-label'></div><div id='tooltip-for'></div><div id='tooltip-agst'></div></div>").css({
            position: "absolute",
            display: "none",
        }).appendTo('body');
        var chartHover = function (event, pos, item) {
            if (item) {
                var pa = item.datapoint[0].toFixed(2);
                var pf = item.datapoint[1].toFixed(2);
                $("#tooltip-label").html(item.series.label + " - " + (pf/pa * 100).toFixed(2) + "%")
                $("#tooltip-for").html(pf + " scored per game")
                $("#tooltip-agst").html(pa + " conceded per game")
                $("#tooltip").css({top: item.pageY+5, left: item.pageX+5}).fadeIn(200);
                console.log(item.series.label);
            } else {
                $("#tooltip").hide();
            }
        }
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

var drawTeamProbTable = function(competition, division, targetDiv) {
    console.log("drawTeamProbTable")
    var tableDiv;
	if (typeof targetDiv === 'undefined') {
	    tableDiv = $('#team-probability-wrapper');
	} else {
	    tableDiv = $(targetDiv);
	}

	var tableArray = [];

	var positionsFilename, headerFilename;
	if (typeof division === 'undefined') {
	    positionsFilename = "/" + competition + "-teampositions"
	    headerFilename = "/" + competition + "-teampositionsheader"
	} else {
	    positionsFilename = "/" + competition + "/" + division + "-teampositions"
	    headerFilename = "/" + competition + "/" + division + "-teampositionsheader"
	}

	$.getJSON(positionsFilename, function(json) {
	$.getJSON(headerFilename, function(headerjson) {
		var table = $("<table></table>")
		    .attr("id", "team-probability-table")
		    .addClass("table table-hover table-condensed");

		var tableHead = $("<thead></thead>")
		    .addClass("team-prob-header");

		var headerRow = $("<tr></tr>")
		    .addClass("team-prob-header");

		var headerName = $("<th></th>")
		    .addClass("team-prob-header")
		    .attr("rowspan", "2")
		    .html("Team Name");
		headerRow.append(headerName);

		for (var i = 0; i < headerjson.length; i++) {
		    var headerColumn = $("<th></th>")
                .addClass("team-prob-header")
                .attr("rowspan", "2")
                .html(headerjson[i].title);
            headerRow.append(headerColumn);
		}
				
		var headerPosTop = $("<th></th>")
		    .addClass("team-prob-header")
		    .attr("colspan", json.length.toString())
		    .html("Chance of finishing in position:");
		headerRow.append(headerPosTop);
				
		var headerLast = $("<th></th>")
		    .addClass("team-prob-header")
		    .attr("rowspan", "2")
		    .html("Last Game")
		headerRow.append(headerLast);
				
		var headerNext = $("<th></th>")
		    .addClass("team-prob-header")
		    .attr("rowspan", "2")
		    .html("Next Game");
		headerRow.append(headerNext);

		var headerAve = $("<th></th>")
            .addClass("team-prob-header")
            .attr("rowspan", "2")
            .html("Ave<br/>Seed");
        headerRow.append(headerAve);

        var headerRPI = $("<th></th>")
            .addClass("team-prob-header")
            .attr("rowspan", "2")
            .html("RPI");
        headerRow.append(headerRPI);

        var headerElo = $("<th></th>")
            .addClass("team-prob-header")
            .attr("rowspan", "2")
            .html("Elo");
        headerRow.append(headerElo);
				
		tableHead.append(headerRow);

		var headerSecondRow = $("<tr></tr>")
		.addClass("team-prob-header");
				
		for (var p = 1; p <= json.length; p++) {
			var headerPos = $("<th></th>")
			    .addClass("team-prob-header")
			    .text(p);
			headerSecondRow.append(headerPos);
		}
		tableHead.append(headerSecondRow);
		table.append(tableHead);
			
		var tableBody = $("<tbody></tbody>");
		for (var i = 0; i < json.length; i++) {
			var teamData = json[i];
			teamNames[i] = teamData.name.toString();
			var teamRow = $("<tr></tr>")
			    .addClass("team-prob-row")
			    .attr("data-clubname", teamData.name)
			    .click(function() {
                    window.document.location = "/" + competition + "/team?club=" + $(this).data("clubname");
                });

			var teamName = $("<td></td>")
			    .addClass("teamicon")
			    .attr("style", "background: url(\"" + competition + "/" + teamData.name + "-left\") left center no-repeat")
			    .text(teamData.name);
			teamRow.append(teamName);

			for (var h = 0; h < headerjson.length; h++) {
			    var teamValue = $("<td></td>")
			    .addClass(headerjson[h].class);
                if (headerjson[h].type === "text") {
                    teamValue.html(headerjson[h].prefix + teamData[headerjson[h].attribute] + headerjson[h].suffix);
                } else {
                    teamValue.html(headerjson[h].prefix + parseFloat(teamData[headerjson[h].attribute]).toFixed(headerjson[h].decimals) + headerjson[h].suffix);
                }
                teamRow.append(teamValue);
			}
				
			for (var p = 1; p <= json.length; p++) {
					
				var teamPos = $("<td></td>")
				    .addClass("team-prob-position")
                    .attr("style", "background-color: rgba(127,127,255," + parseFloat(teamData.positionchance[p.toString()]).toFixed(2) / 100 + ")");

				var teamPosSpan = $("<span></span>")
				    .attr("title", parseFloat(teamData.positionchance[p.toString()]) + "%");
				if (teamData.positionchance[p.toString()] != 0) {
					teamPosSpan.text(parseFloat(teamData.positionchance[p.toString()].toFixed(0)));
					teamPos.append(teamPosSpan);
				}
					
				teamRow.append(teamPos);
			}
				
			var teamLast = $("<td></td>")
			    .addClass("team-prob-lastnext")
			    .text(teamData.lastgame);
			teamRow.append(teamLast);
				
			var teamNext = $("<td></td>")
			    .addClass("team-prob-lastnext")
			    .text(teamData.nextgame);
			teamRow.append(teamNext);

			var teamAve = $("<td></td>")
			    .addClass("team-prob-ave")
                .text(parseFloat(teamData.averageseed).toFixed(1));
            teamRow.append(teamAve);

            var teamRPI = $("<td></td>")
                .addClass("team-prob-withrank")
                .text(parseFloat(teamData.rpi).toFixed(3) + " (#" + teamData.rpirank + ")")
            teamRow.append(teamRPI);

            var teamElo = $("<td></td>")
                .addClass("team-prob-withrank")
                .text(parseInt(teamData.elo) + " (#" + teamData.elorank + ")");
            teamRow.append(teamElo);
				
				
			tableBody.append(teamRow);
		}
		table.append(tableBody);
		tableDiv.empty();
		tableDiv.append(table);
	});
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
	
var drawRecentGamesTable = function(competition) {
    console.log("drawRecentGamesTable");
	var tableDiv = $('#last-nine-div');
	var tableArray = [];
	$.getJSON("/" + competition + "-mostrecentgames", function(json) {
	    if (json.length == 0) {
	        tableDiv.empty();
    	    $("<div></div>").addClass("alert alert-info").text("No Matches Played").appendTo(tableDiv);
    	} else {
			var table = $("<table></table>")
			.attr("id", "team-probability-table")
			.addClass("table table-striped table-condensed");

			var tableBody = $("<tbody></tbody>");


			for (var i = 0; i < json.length; i++) {
				var gameData = json[i];
				var gameFirstRow = $("<tr></tr>");
				var gameSecondRow = $("<tr></tr>");
				
				var homeTeam = $("<td></td>")
				    .addClass("gameteamicon-left")
				    .attr("style", "background: url(\"" + competition + "/" + gameData.hometeam + "-left\") left center no-repeat")
				    .text(gameData.hometeam);
				gameFirstRow.append(homeTeam);
				
				var homeScore = $("<td></td>")
				    .text(gameData.homescore);
				gameFirstRow.append(homeScore);
				
				var centre = $("<td></td>")
				    .addClass("gamecentre")
				    .text("vs");
				gameFirstRow.append(centre);
				
				var awayScore = $("<td></td>")
				    .text(gameData.awayscore);
				gameFirstRow.append(awayScore);

				if (parseInt(gameData.homescore) > parseInt(gameData.awayscore)) {
					homeScore.addClass("gamescore-win");
					awayScore.addClass("gamescore-lose");
				} else if (parseInt(gameData.homescore) < parseInt(gameData.awayscore)) {
					homeScore.addClass("gamescore-lose");
					awayScore.addClass("gamescore-win");
				} else {
					homeScore.addClass("gamescore");
					awayScore.addClass("gamescore");
				}
				
				var awayTeam = $("<td></td>")
				    .addClass("gameteamicon-right")
				    .attr("style", "background: url(\"" + competition + "/" + gameData.awayteam + "-right\") right center no-repeat")
				    .text(gameData.awayteam);
				gameFirstRow.append(awayTeam);
				
				var gameDetails = $("<td></td>")
				    .addClass("gamedetails")
				    .attr("colspan", "5")
				    .text(gameData.date + " - Predicted chance of this result: " + parseFloat(gameData.chanceofresult).toFixed(1) + "%")
				gameSecondRow.append(gameDetails);
				
				
				tableBody.append(gameFirstRow);
				tableBody.append(gameSecondRow);
			}

			table.append(tableBody)
			tableDiv.empty();
			tableDiv.append(table);
		}
	});
}

var drawUpcomingGamesTable = function(competition) {
    console.log("drawUpcomingGamesTable")
	var tableDiv = $('#next-nine-div');
	var tableArray = [];
	$.getJSON(competition + "-upcominggames", function(json) {
	    if (json.length == 0) {
	        tableDiv.empty();
            $("<div></div>").addClass("alert alert-info").text("No Matches to be Played").appendTo(tableDiv);
	    } else {
			var table = $("<table></table>")
			    .attr("id", "team-probability-table")
			    .addClass("table table-striped table-condensed");
			var tableBody = $("<tbody></tbody>");
			
			for (var i = 0; i < json.length; i++) {
				var gameData = json[i];
				var gameFirstRow = $("<tr></tr>");
				var gameSecondRow = $("<tr></tr>");
				
				var homeTeam = $("<td></td>")
                    .addClass("gameteamicon-left")
				    .attr("style", "background: url(\"" + competition + "/" + gameData.hometeam + "-left\") left center no-repeat")
				    .text(gameData.hometeam);
				gameFirstRow.append(homeTeam);
				
				var homePerc = $("<td></td>")
				    .addClass("gameperc")
				    .text(parseFloat(gameData.homechance).toFixed(1) + "%");
				gameFirstRow.append(homePerc);
				
				var centre = $("<td></td>")
				    .addClass("gamecentre")
				    .text("vs");
				gameFirstRow.append(centre);
				
				var awayPerc = $("<td></td>")
				    .addClass("gameperc")
				    .text(parseFloat(gameData.awaychance).toFixed(1) + "%");
				gameFirstRow.append(awayPerc);
				
				var awayTeam = $("<td></td>")
				    .addClass("gameteamicon-right")
				    .attr("style", "background: url(\"" + competition + "/" + gameData.awayteam + "-right\") right center no-repeat")
				    .text(gameData.awayteam);
				gameFirstRow.append(awayTeam);
				
				var gameDetails = $("<td></td>")
				    .addClass("gamedetails")
				    .attr("colspan", "5")
				    .text(gameData.date + " - Chance of Draw: " + parseFloat(gameData.drawchance).toFixed(1) + "%");
				gameSecondRow.append(gameDetails);

				tableBody.append(gameFirstRow);
				tableBody.append(gameSecondRow);
			}
			table.append(tableBody);
			tableDiv.empty();
			tableDiv.append(table);
		}
	});
}

var drawFirstFinalOpponentTable = function(competition) {
    console.log("drawFirstFinalOpponentTable")
	var tableDiv = $('#first-final-opponent-div');
	var tableArray = [];
	$.getJSON(competition + "-firstFinalOpponent", function(json) {


		var table = $('<table></table>')
		    .attr("id","team-probability-table")
		    .addClass("table table-striped table-condensed");
		var tableHead = $('<thead></thead>');
		var headerRow = $('<tr></tr>');

		var headerName = $("<th></th>")
		    .addClass("team-prob-header")
            .attr("rowspan", "2")
            .html("Team Name");
		headerRow.append(headerName);

		var headerPosTop = $("<th></th>")
		    .addClass("team-prob-header")
		    .attr("colspan", json.length.toString())
		    .html("Chance of playing team in the first week of the Finals:");
		headerRow.append(headerPosTop);

		tableHead.append(headerRow);

		var headerSecondRow = $("<tr></tr>");

		for (var p = 0; p < json.length; p++) {
			var headerOpp = $("<th></th>")
			    .addClass("team-prob-header")
			    .attr("title", json[p].name);
			var headerOppIcon = $("<img></img>")
			    .attr("src", competition + "/" + json[p].name + "-square");
			headerOpp.append(headerOppIcon);
			headerSecondRow.append(headerOpp);
		}
		tableHead.append(headerSecondRow);
		table.append(tableHead);

        var tableBody = $("<tbody></tbody>");
    	for (var i = 0; i < json.length; i++) {
			var teamData = json[i];
			var teamRow = $("<tr></tr>")
			.addClass("team-prob-row");

			var teamName = $("<td></td>")
			    .addClass("teamicon")
			    .attr("style", "background: url(\"" + competition + "/" + json[i].name + "-left\") left center no-repeat")
			    .html(json[i].name);
			teamRow.append(teamName);

			for (var p = 0; p < json.length; p++) {
				var teamPos = $("<td></td>")
				.attr("style", "background-color: rgba(127,127,255," + parseFloat(teamData.probabilities[json[p].name]).toFixed(2) / 100 + ")")
				.addClass("team-prob-position")
				var teamPosSpan = $("<span></span>")
				.attr("title", parseFloat(teamData.probabilities[json[p].name]) + "%")

				if (teamData.probabilities[json[p].name] != 0) {
					teamPosSpan.text(parseFloat(teamData.probabilities[json[p].name]).toFixed(0));
				}
				teamPos.append(teamPosSpan);
				teamRow.append(teamPos);
			}
			tableBody.append(teamRow);
		}
		table.append(tableBody);
		tableDiv.empty();
		tableDiv.append(table);
	});
}

var drawMatchFinalsImpactTable = function(competition) {
    console.log("drawMatchFinalsImpactTable")
    var targetDiv = $('#match-finals-impact-div');
    var tableArray = [];
    var newDiv = $('<div></div>');
    $.getJSON(competition + "-matchfinalsimpact", function(json) {
    $.getJSON(competition + "-matchfinalsimpactheader", function(headerjson) {
        if (json.length == 0) {
            targetDiv.empty();
            $("<div></div>").addClass("alert alert-info").text("No Matches to be Played").appendTo(targetDiv);
        } else {
        for (var game = 0; game < json.length; game++) {
            var gameData = json[game];
            newDiv.append("<h2>" + gameData.homeTeam + " vs " + gameData.awayTeam + "</h2>");
            if (gameData.hasOwnProperty('venue')) {
                newDiv.append("<p>" + gameData.date + ", " + gameData.venue + "</p>");
            } else {
                newDiv.append("<p>" + gameData.date + "</p>");
            }

            var table = $('<table></table>')
                .addClass("table table-striped table-condensed");
            var tableHead = $('<thead></thead>');
                var topHeaderRow = $('<tr></tr>')
                    .append($('<th></th>')
                        .addClass("impactheader-draw")
                        .attr("rowspan", "2")
                        .text("Team Name")
                    );

                for (var i=0; i < headerjson.categories.length; i++) {
                    var topHeaderCat = $('<th></th>')
                        .addClass("impactheader-draw")
                        .text(headerjson.categories[i].title);


                    if (headerjson["include-draw"] === "true") {
                        topHeaderCat.attr("colspan", 3);
                    } else {
                        topHeaderCat.attr("colspan", 2);
                    }

                    topHeaderRow.append(topHeaderCat);
                }
                tableHead.append(topHeaderRow);

                var secondHeaderRow = $('<tr></tr>');
                for (var i=0; i < headerjson.categories.length; i++) {
                    secondHeaderRow.append($('<th></th>')
                        .addClass("impactheader-left")
                        .attr("style", "background: url(\"" + competition + "/" + gameData.homeTeam + "-left\") left center no-repeat")
                        .text(gameData.homeAbbr + " win")
                    )
                    secondHeaderRow.append($('<th></th>')
                        .addClass("impactheader-draw")
                        .text("Draw")
                    )
                    secondHeaderRow.append($('<th></th>')
                        .addClass("impactheader-right")
                        .attr("style", "background: url(\"" + competition + "/" + gameData.awayTeam + "-right\") right center no-repeat")
                        .text(gameData.awayAbbr + " win")
                    )
                }
                tableHead.append(secondHeaderRow);
            table.append(tableHead);

            var tableBody = $('<tbody></tbody>');
            var sortedTeamNames = Object.keys(gameData.homeWinImpact).sort(function(a,b) {
                var aTotalAbsoluteChange = 0;
                var bTotalAbsoluteChange = 0;
                for (var i = 0; i < headerjson.categories.length; i++) {
                    // add absolute change in this category for home win
                    aTotalAbsoluteChange += Math.abs(parseFloat(gameData.homeWinImpact[a][headerjson.categories[i]["change-attr"]]));
                    bTotalAbsoluteChange += Math.abs(parseFloat(gameData.homeWinImpact[b][headerjson.categories[i]["change-attr"]]));

                    // add absolute change in this category for draw (if applicable)
                    if (headerjson["include-draw"]) {
                        aTotalAbsoluteChange += Math.abs(parseFloat(gameData.drawImpact[a][headerjson.categories[i]["change-attr"]]));
                        bTotalAbsoluteChange += Math.abs(parseFloat(gameData.drawImpact[b][headerjson.categories[i]["change-attr"]]));
                    }

                    // add absolute change in this category for away win
                    aTotalAbsoluteChange += Math.abs(parseFloat(gameData.awayWinImpact[a][headerjson.categories[i]["change-attr"]]));
                    bTotalAbsoluteChange += Math.abs(parseFloat(gameData.awayWinImpact[b][headerjson.categories[i]["change-attr"]]));
                }
                return bTotalAbsoluteChange - aTotalAbsoluteChange
            });

            for (var t = 0; t < sortedTeamNames.length; t++) {
                var teamName = sortedTeamNames[t];
                var teamRow = $('<tr></tr>');
                teamRow.append($('<td></td>').addClass("teamicon")
                    .attr("style", "background: url(\"" + competition + "/" + teamName + "-left\") left center no-repeat")
                    .text(teamName));
            // finals chance

                for (var i = 0; i < headerjson.categories.length; i++) {
                    var homeWinProb = parseFloat(gameData.homeWinImpact[teamName][headerjson.categories[i]["probability-attr"]]);
                    var homeWinChange = parseFloat(gameData.homeWinImpact[teamName][headerjson.categories[i]["change-attr"]]);

                    if (homeWinProb === -1) {
                        teamRow.append($('<td></td>').addClass("impactcell").text("-"));
                    } else if (homeWinChange > 0) {
                        teamRow.append($('<td></td>').addClass("impactcell-up")
                            .text(homeWinProb.toFixed(2) + "%"
                                + " (+" + homeWinChange.toFixed(2) + "%)")
                        )
                    } else if (homeWinChange < 0) {
                        teamRow.append($('<td></td>').addClass("impactcell-down")
                            .text(homeWinProb.toFixed(2) + "%"
                                + " (" + homeWinChange.toFixed(2) + "%)")
                        )
                    } else {
                        teamRow.append($('<td></td>').addClass("impactcell")
                            .text(homeWinProb.toFixed(2) + "%" + " (0.00%)")
                                )
                    }

                    if (headerjson["include-draw"]) {
                        var drawProb = parseFloat(gameData.drawImpact[teamName][headerjson.categories[i]["probability-attr"]]);
                        var drawChange = parseFloat(gameData.drawImpact[teamName][headerjson.categories[i]["change-attr"]]);

                        if (drawProb === -1) {
                            teamRow.append($('<td></td>').addClass("impactcell").text("-"));
                        } else if (drawChange > 0) {
                            teamRow.append($('<td></td>').addClass("impactcell-up")
                                .text(drawProb.toFixed(2) + "%"
                                    + " (+" + drawChange.toFixed(2) + "%)")
                            )
                        } else if (drawChange < 0) {
                            teamRow.append($('<td></td>').addClass("impactcell-down")
                                .text(drawProb.toFixed(2) + "%"
                                    + " (" + drawChange.toFixed(2) + "%)")
                            )
                        } else {
                            teamRow.append($('<td></td>').addClass("impactcell")
                                .text(drawProb.toFixed(2) + "%" + " (0.00%)")
                            )
                        }
                    }

                    var awayWinProb = parseFloat(gameData.awayWinImpact[teamName][headerjson.categories[i]["probability-attr"]]);
                    var awayWinChange = parseFloat(gameData.awayWinImpact[teamName][headerjson.categories[i]["change-attr"]]);

                    if (awayWinProb === -1) {
                        teamRow.append($('<td></td>').addClass("impactcell").text("-"));
                    } else if (awayWinChange > 0) {
                        teamRow.append($('<td></td>').addClass("impactcell-up")
                            .text(awayWinProb.toFixed(2) + "%"
                                + " (+" + awayWinChange.toFixed(2) + "%)")
                        )
                    } else if (awayWinChange < 0) {
                        teamRow.append($('<td></td>').addClass("impactcell-down")
                            .text(awayWinProb.toFixed(2) + "%"
                                + " (" + awayWinChange.toFixed(2) + "%)")
                        )
                    } else {
                        teamRow.append($('<td></td>').addClass("impactcell")
                            .text(awayWinProb.toFixed(2) + "%" + " (0.00%)")
                        )
                    }
                }

                tableBody.append(teamRow);
            }

            table.append(tableBody);

            newDiv.append(table);

        }

        targetDiv.empty();
        targetDiv.append(newDiv);
        }
    })
    })
}

var drawWinLossWormChart = function(competition) {
    var ctx = $("#wl-placeholder").get(0).getContext("2d");
        //Get the URL to hand into the connect call
        var http = location.protocol;
        var slashes = http.concat("//");
        var host = slashes.concat(window.location.hostname);


    	$.getJSON(competition + "-winsminuslosses", function(json) {
    	    var data = {
    	        datasets: []
    	    };
    	    for (var i = 0; i < json.length; i++) {
    	        data.datasets.push({
    	            label: json[i].name,
    	            data: json[i].points,
    	        })
    	    }
    	    console.log(data);


    	    console.log(ctx);
    	    console.log("context.canvas = " + ctx.canvas)

    	    new Chart(ctx, {
    	        type: 'line',
    	        data: data,
    	        options: {
    	            scales: {
    	                xaxes: [{
    	                    type: 'time',
                            time: {
                                displayFormats: {
                                    month: 'MMM'
                                }
                            },
    	                    scaleLabel: {
    	                        display: true,
    	                        labelString: "Date"
    	                    }
    	                }],
    	                yaxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: "Wins Above/Below Even"
                            }
                        }]
    	            },
    	            hover: {
    	                mode: 'single',
    	            },
                    grid: {
                        hoverable: true
                    },
                    responsive: true,
                    pointDotRadius: 10,
                }
            });
    	})
}

var drawNavbar = function(thispage) {
    var navbar = $("#navbar-nav");

    var container = $("<div></div>")
        .addClass("container");

        var navbarHeader = $("<div></div>").addClass("navbar-header");

            var toggleButton = $("<button></button>")
            .addClass("navbar-toggle collapsed")
            .attr("data-toggle", "collapse")
            .attr("data-target", "#navbar")
            .attr("aria-expanded", "false")
            .attr("aria-controls", "navbar");

                var toggleSR = $("<span></span>")
                .addClass("sr-only")
                .text("Toggle navigation");

            toggleButton.append(toggleSR);
            toggleButton.append($("<span></span>").addClass("icon-bar"));
            toggleButton.append($("<span></span>").addClass("icon-bar"));
            toggleButton.append($("<span></span>").addClass("icon-bar"));

        navbarHeader.append(toggleButton);

            var titleButton = $("<a></a>")
                .addClass("navbar-brand")
                .attr("href", "/")
                .text("Doyle with the Scores");

        navbarHeader.append(titleButton)

    container.append(navbarHeader);

        var navbarDiv = $("<div></div>")
            .attr("id", "navbar")
            .addClass("navbar-collapse collapse");

            var navbarList = $("<ul></ul>")
                .addClass("nav navbar-nav");

                var homeButton = $("<li></li>")
                if (thispage === "home") {
                    homeButton.addClass("active");
                }

                    var homeLink = $("<a></a>")
                        .attr("href", "/")
                        .text("Home");

                homeButton.append(homeLink);

            navbarList.append(homeButton);

                var aflButton = $("<li></li>");
                if (thispage === "afl") {
                    aflButton.addClass("active")
                }
                    var aflLink = $("<a></a>")
                        .attr("href", "/afl")
                        .text("AFL");

                aflButton.append(aflLink);

            navbarList.append(aflButton);

                var nrlButton = $("<li></li>")
                if (thispage === "nrl") {
                    nrlButton.addClass("active")
                }
                    var nrlLink = $("<a></a>")
                        .attr("href", "/nrl")
                        .text("NRL");

                nrlButton.append(nrlLink);

            navbarList.append(nrlButton);

                var superRugbyButton = $("<li></li>")
                if (thispage === "superrugby") {
                    superRugbyButton.addClass("active")
                }
                    var superRugbyLink = $("<a></a>")
                        .attr("href", "/superrugby")
                        .text("Super Rugby");
                superRugbyButton.append(superRugbyLink);

            navbarList.append(superRugbyButton);

                var aleagueButton = $("<li></li>")
                if (thispage === "aleague") {
                    aleagueButton.addClass("active")
                }
                    var aleagueLink = $("<a></a>")
                        .attr("href", "/aleague")
                        .text("A-League");
                aleagueButton.append(aleagueLink);

            navbarList.append(aleagueButton);

                var shieldButton = $("<li></li>")
                if (thispage === "sheffieldshield") {
                    shieldButton.addClass("active")
                }
                    var shieldLink = $("<a></a>")
                        .attr("href", "#")
                        .text("Sheffield Shield (soon)")
                shieldButton.append(shieldLink);

            navbarList.append(shieldButton);

                var dropdown = $("<li></li>")
                    .addClass("dropdown")

                    var dropdownToggle = $("<a></a>")
                        .attr("href", "#")
                        .addClass("dropdown-toggle")
                        .attr("data-toggle", "dropdown")
                        .attr("role", "button")
                        .attr("aria-haspopup", "true")
                        .attr("aria-expanded", "false")
                        .text("Other Sports")
                        .append($("<span></span>").addClass("caret"));

                dropdown.append(dropdownToggle);

                    var dropdownMenu = $("<ul></ul>")
                        .addClass("dropdown-menu");

                        var cfbButton = $("<li></li>");
                            var cfbLink = $("<a></a>")
                                .attr("href", "#")
                                .text("College Football (soon)")
                        cfbButton.append(cfbLink);

                    dropdownMenu.append(cfbButton);

                        var nflButton = $("<li></li>");
                            var nflLink = $("<a></a>")
                                .attr("href", "#")
                                .text("NFL (soon)");
                        nflButton.append(nflLink);

                    dropdownMenu.append(nflButton);

                dropdown.append(dropdownMenu);

            navbarList.append(dropdown);

        navbarDiv.append(navbarList);

    container.append(navbarDiv);

    navbar.append(container);
}

var drawFinalsChanceByRecordTable = function(competition, club, mode) {
    if (typeof mode === undefined) {
        mode = "allrecords"
    }
    console.log("drawFinalsChanceByRecordTable")
    var tableDiv;
	if (typeof targetDiv === 'undefined') {
	    tableDiv = $('#team-probability-wrapper');
	} else {
	    tableDiv = $(targetDiv);
	}

	var tableArray = [];

	var positionsFilename, headerFilename, positionsRecordFilename;
	positionsFilename = "/" + competition + "-teampositions"
	headerFilename = "/" + competition + "-finalschancebyrecordheader"
	positionsRecordFilename = "/" + competition + "-finalschancebyrecord"

	$.getJSON(positionsRecordFilename, function(recordjson) {
	$.getJSON(headerFilename, function(headerjson) {
	    var numTeams = Object.keys(recordjson).length
	    console.log(recordjson);
	    console.log("numTeams = " + numTeams);
	    console.log("mode = " + mode);
	    var overallPositionChances;
	    if (mode === "nodraws") {
	        overallPositionChances = recordjson[club]["overall-nodraws"];
	    } else if (mode === "onedrawmax") {
	        overallPositionChances = recordjson[club]["overall-onedrawmax"];
	    } else {
	        overallPositionChances = recordjson[club]["overall"];
	    }
	    console.log(overallPositionChances);

	    var positionsByRecord = recordjson[club].records;

		var table = $("<table></table>")
		    .attr("id", "team-probability-table")
		    .addClass("table table-striped table-condensed");

		var tableHead = $("<thead></thead>")
		    .addClass("team-prob-header");

		var headerRow = $("<tr></tr>")
		    .addClass("team-prob-header");

		var headerName = $("<th></th>")
		    .addClass("team-prob-header")
		    .attr("rowspan", "2")
		    .html("W-D-L");
		headerRow.append(headerName);

		for (var i = 0; i < headerjson.length; i++) {
		    var headerColumn = $("<th></th>")
                .addClass("team-prob-header")
                .attr("rowspan", "2")
                .html(headerjson[i].title);
            headerRow.append(headerColumn);
		}

		var headerPosTop = $("<th></th>")
		    .addClass("team-prob-header")
		    .attr("colspan", numTeams.toString())
		    .html("Chance of finishing in position:");
		headerRow.append(headerPosTop);

        var headerCount = $("<th></th>")
            .addClass("team-prob-header")
            .attr("rowspan", "2")
            .html("Number of<br/>Seasons");
        headerRow.append(headerCount);


		tableHead.append(headerRow);

		var headerSecondRow = $("<tr></tr>")
		.addClass("team-prob-header");

		for (var p = 1; p <= numTeams; p++) {
			var headerPos = $("<th></th>")
			    .addClass("team-prob-header")
			    .text(p);
			headerSecondRow.append(headerPos);
		}
		tableHead.append(headerSecondRow);
		table.append(tableHead);

		var tableBody = $("<tbody></tbody>");
		for (var i = 0; i < positionsByRecord.length; i++) {
		    var record = positionsByRecord[i];
		    console.log(record);

		    if (mode === "onedrawmax" && parseInt(record.draws) > 1) {continue;}
		    if (mode === "nodraws" && parseInt(record.draws) > 0) {continue;}

			var teamRow = $("<tr></tr>")
			    .addClass("team-prob-row");

			var teamName = $("<td></td>")
			    .addClass("team-prob-center")
			    .text(record.wins + "-" + record.draws + "-" + record.losses);
			teamRow.append(teamName);

			for (var h = 0; h < headerjson.length; h++) {
			    var teamValue = $("<td></td>")
			    .addClass(headerjson[h].class);
                if (headerjson[h].type === "text") {
                    teamValue.html(headerjson[h].prefix + record[headerjson[h].attribute] + headerjson[h].suffix);
                } else {
                    teamValue.html(headerjson[h].prefix + parseFloat(record[headerjson[h].attribute]).toFixed(headerjson[h].decimals) + headerjson[h].suffix);
                }
                teamRow.append(teamValue);
			}

			for (var p = 1; p <= numTeams; p++) {

				var teamPos = $("<td></td>")
				    .addClass("team-prob-position")
                    .attr("style", "background-color: rgba(127,127,255," + parseFloat(record.positionChance[p.toString()]).toFixed(2) / 100 + ")");

				var teamPosSpan = $("<span></span>")
				    .attr("title", parseFloat(record.positionChance[p.toString()]) + "%");
				if (record.positionChance[p.toString()] != 0) {
					teamPosSpan.text(parseFloat(record.positionChance[p.toString()].toFixed(0)));
					teamPos.append(teamPosSpan);
				}

				teamRow.append(teamPos);
			}
			var teamCount = $("<td></td>")
			    .addClass("border-left")
                .text(record.recordCount + " (" + (parseFloat(record.recordPerc) * 100).toFixed(2) + "%)");
            teamRow.append(teamCount);

			tableBody.append(teamRow);
		}

		var totalRow = $("<tr></tr>")
            .addClass("team-prob-row")
            .addClass("all-bold");

        var totalName = $("<td></td>")
            .addClass("team-prob-center")
            .text("Overall");
        totalRow.append(totalName);

        for (var h = 0; h < headerjson.length; h++) {
            var totalValue = $("<td></td>")
                .addClass(headerjson[h].class);
            if (headerjson[h].type === "text") {
                totalValue.html(headerjson[h].prefix + overallPositionChances[headerjson[h].attribute] + headerjson[h].suffix);
            } else {
                totalValue.html(headerjson[h].prefix + parseFloat(overallPositionChances[headerjson[h].attribute]).toFixed(headerjson[h].decimals) + headerjson[h].suffix);
            }
            totalRow.append(totalValue);
        }

            for (var p = 1; p <= numTeams; p++) {

                var totalPos = $("<td></td>")
                    .addClass("team-prob-position")
                    .attr("style", "background-color: rgba(127,127,255," + parseFloat(overallPositionChances.positionChance[p.toString()]).toFixed(2) / 100 + ")");

                var totalPosSpan = $("<span></span>")
                    .attr("title", parseFloat(overallPositionChances.positionChance[p.toString()]) + "%");
                if (overallPositionChances.positionChance[p.toString()] != 0) {
                    totalPosSpan.text(parseFloat(overallPositionChances.positionChance[p.toString()].toFixed(0)));
                    totalPos.append(totalPosSpan);
                }

                totalRow.append(totalPos);
            }

            var recordPerc = (overallPositionChances.recordPerc * 100).toFixed(2)
            var totalCount = $("<td></td>")
                .addClass("border-left")
                .text(overallPositionChances.recordCount + " (" + recordPerc + "%)");
            totalRow.append(totalCount);

            tableBody.append(totalRow);

		table.append(tableBody);
		tableDiv.empty();
		tableDiv.append(table);
	});
	});
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var drawTeamFinalsImpactTable = function(competition, club) {
    console.log("drawTeamFinalsImpactTable")
    var targetDiv = $('#team-finals-impact-div');
    var tableArray = [];
    var newDiv = $('<div></div>');
    $.getJSON("/" + competition + "-matchfinalsimpact", function(json) {
    $.getJSON("/" + competition + "-matchfinalsimpactheader", function(headerjson) {
        var table = $('<table></table>')
            .addClass("table table-striped table-condensed");
        var tableHead = $('<thead></thead>');
            var topHeaderRow = $('<tr></tr>')
                .append($('<th></th>')
                    .addClass("impactheader-draw")
                    .attr("rowspan", "2")
                    .text("Match")
                );

            for (var i=0; i < headerjson.categories.length; i++) {
                var topHeaderCat = $('<th></th>')
                    .addClass("impactheader-draw")
                    .addClass("border-left")
                    .text(headerjson.categories[i].title);


                if (headerjson["include-draw"] === "true") {
                    topHeaderCat.attr("colspan", 3);
                } else {
                    topHeaderCat.attr("colspan", 2);
                }

                topHeaderRow.append(topHeaderCat);
            }
            tableHead.append(topHeaderRow);

            var secondHeaderRow = $('<tr></tr>');
            for (var i=0; i < headerjson.categories.length; i++) {
                secondHeaderRow.append($('<th></th>')
                    .addClass("impactheader-left")
                    .addClass("border-left")
                    .text("Home win")
                )
                secondHeaderRow.append($('<th></th>')
                    .addClass("impactheader-draw")
                    .text("Draw")
                )
                secondHeaderRow.append($('<th></th>')
                    .addClass("impactheader-right")
                    .text("Away win")
                )
            }
            tableHead.append(secondHeaderRow);
        table.append(tableHead);

        var tableBody = $('<tbody></tbody>');
        for (var game = 0; game < json.length; game++) {
            var gameData = json[game];
            console.log(gameData);
                var teamRow = $('<tr></tr>');
                teamRow.append($('<td></td>').addClass("twoteamicons")
                    .attr("style", "background: url(\"" + "/" + competition + "/" + gameData.homeTeam + "-left\") left center no-repeat, " +
                    "url(\"" + "/" + competition + "/" + gameData.awayTeam + "-right\") right center no-repeat")
                    .text(gameData.homeAbbr + " vs " + gameData.awayAbbr));
            // finals chance

                for (var i = 0; i < headerjson.categories.length; i++) {
                    var homeWinProb = parseFloat(gameData.homeWinImpact[club][headerjson.categories[i]["probability-attr"]]);
                    var homeWinChange = parseFloat(gameData.homeWinImpact[club][headerjson.categories[i]["change-attr"]]);

                    if (homeWinProb === -1) {
                        teamRow.append($('<td></td>').addClass("impactcell").addClass("border-left").text("-"));
                    } else if (homeWinChange > 0) {
                        teamRow.append($('<td></td>').addClass("impactcell-up").addClass("border-left")
                            .text(homeWinProb.toFixed(2) + "%"
                                + " (+" + homeWinChange.toFixed(2) + "%)")
                        )
                    } else if (homeWinChange < 0) {
                        teamRow.append($('<td></td>').addClass("impactcell-down").addClass("border-left")
                            .text(homeWinProb.toFixed(2) + "%"
                                + " (" + homeWinChange.toFixed(2) + "%)")
                        )
                    } else {
                        teamRow.append($('<td></td>').addClass("impactcell").addClass("border-left")
                            .text(homeWinProb.toFixed(2) + "%" + " (0.00%)")
                                )
                    }

                    if (headerjson["include-draw"]) {
                        var drawProb = parseFloat(gameData.drawImpact[club][headerjson.categories[i]["probability-attr"]]);
                        var drawChange = parseFloat(gameData.drawImpact[club][headerjson.categories[i]["change-attr"]]);

                        if (drawProb === -1) {
                            teamRow.append($('<td></td>').addClass("impactcell").text("-"));
                        } else if (drawChange > 0) {
                            teamRow.append($('<td></td>').addClass("impactcell-up")
                                .text(drawProb.toFixed(2) + "%"
                                    + " (+" + drawChange.toFixed(2) + "%)")
                            )
                        } else if (drawChange < 0) {
                            teamRow.append($('<td></td>').addClass("impactcell-down")
                                .text(drawProb.toFixed(2) + "%"
                                    + " (" + drawChange.toFixed(2) + "%)")
                            )
                        } else {
                            teamRow.append($('<td></td>').addClass("impactcell")
                                .text(drawProb.toFixed(2) + "%" + " (0.00%)")
                            )
                        }
                    }

                    var awayWinProb = parseFloat(gameData.awayWinImpact[club][headerjson.categories[i]["probability-attr"]]);
                    var awayWinChange = parseFloat(gameData.awayWinImpact[club][headerjson.categories[i]["change-attr"]]);

                    if (awayWinProb === -1) {
                        teamRow.append($('<td></td>').addClass("impactcell").text("-"));
                    } else if (awayWinChange > 0) {
                        teamRow.append($('<td></td>').addClass("impactcell-up")
                            .text(awayWinProb.toFixed(2) + "%"
                                + " (+" + awayWinChange.toFixed(2) + "%)")
                        )
                    } else if (awayWinChange < 0) {
                        teamRow.append($('<td></td>').addClass("impactcell-down")
                            .text(awayWinProb.toFixed(2) + "%"
                                + " (" + awayWinChange.toFixed(2) + "%)")
                        )
                    } else {
                        teamRow.append($('<td></td>').addClass("impactcell")
                            .text(awayWinProb.toFixed(2) + "%" + " (0.00%)")
                        )
                    }
                }

                tableBody.append(teamRow);

            table.append(tableBody);

            newDiv.append(table);

        }

        targetDiv.empty();
        targetDiv.append(newDiv);
    })
    })
}