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

    //Socket IO communications
    var socket = io.connect(host);

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
		    .addClass("table table-striped table-condensed");

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
			    .addClass("team-prob-row");

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
                .addClass("team-prob-rpi")
                .text(parseFloat(teamData.rpi).toFixed(3))
            teamRow.append(teamRPI);
				
				
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
    console.log("drawRecentGamesTable")
	var tableDiv = $('#last-nine-div');
	var tableArray = [];
	$.getJSON("/" + competition + "-mostrecentgames", function(json) {
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
	});
}

var drawUpcomingGamesTable = function(competition) {
    console.log("drawUpcomingGamesTable")
	var tableDiv = $('#next-nine-div');
	var tableArray = [];
	$.getJSON(competition + "-upcominggames", function(json) {
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
			console.log(teamData)
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

var drawNavbar = function(thispage) {
    var navbar = document.getElementById("navbar-nav");

    var container = document.createElement("div");
    container.setAttribute("class", "container");

        var navbarHeader = document.createElement("div");
        navbarHeader.setAttribute("class", "navbar-header");

            var toggleButton = document.createElement("button");
            toggleButton.setAttribute("class", "navbar-toggle collapsed");
            toggleButton.setAttribute("data-toggle", "collapse");
            toggleButton.setAttribute("data-target", "#navbar");
            toggleButton.setAttribute("aria-expanded", "false");
            toggleButton.setAttribute("aria-controls", "navbar");

                var toggleSR = document.createElement("span");
                toggleSR.setAttribute("class", "sr-only");
                toggleSR.appendChild(document.createTextNode("Toggle navigation"));

            toggleButton.appendChild(toggleSR);
            var iconBar = document.createElement("span");
            iconBar.setAttribute("class", "icon-bar");
            toggleButton.appendChild(iconBar);
            toggleButton.appendChild(iconBar);
            toggleButton.appendChild(iconBar);

        navbarHeader.appendChild(toggleButton);

            var titleButton = document.createElement("a");
            titleButton.setAttribute("class", "navbar-brand");
            titleButton.setAttribute("href", "/");
            titleButton.appendChild(document.createTextNode("Doyle with the Scores"));

        navbarHeader.appendChild(titleButton)

    container.appendChild(navbarHeader);

        var navbarDiv = document.createElement("div");
        navbarDiv.setAttribute("id", "navbar")
        navbarDiv.setAttribute("class", "navbar-collapse collapse")

            var navbarList = document.createElement("ul");
            navbarList.setAttribute("class", "nav navbar-nav")

                var homeButton = document.createElement("li")
                if (thispage === "home") {
                    homeButton.setAttribute("class", "active")
                }
                    var homeLink = document.createElement("a")
                    homeLink.setAttribute("href", "/");
                    homeLink.appendChild(document.createTextNode("Home"));

                homeButton.appendChild(homeLink);

            navbarList.appendChild(homeButton);

                var aflButton = document.createElement("li")
                if (thispage === "afl") {
                    aflButton.setAttribute("class", "active")
                }
                    var aflLink = document.createElement("a")
                    aflLink.setAttribute("href", "/afl");
                    aflLink.appendChild(document.createTextNode("AFL"));

                aflButton.appendChild(aflLink);

            navbarList.appendChild(aflButton);

                var nrlButton = document.createElement("li")
                if (thispage === "nrl") {
                    nrlButton.setAttribute("class", "active")
                }
                    var nrlLink = document.createElement("a")
                    nrlLink.setAttribute("href", "/nrl");
                    nrlLink.appendChild(document.createTextNode("NRL"));

                nrlButton.appendChild(nrlLink);

            navbarList.appendChild(nrlButton);

                var superRugbyButton = document.createElement("li")
                if (thispage === "superrugby") {
                    superRugbyButton.setAttribute("class", "active")
                }
                    var superRugbyLink = document.createElement("a")
                    superRugbyLink.setAttribute("href", "/superrugby");
                    superRugbyLink.appendChild(document.createTextNode("Super Rugby"))
                superRugbyButton.appendChild(superRugbyLink);

            navbarList.appendChild(superRugbyButton);

                var aleagueButton = document.createElement("li")
                if (thispage === "aleague") {
                    aleagueButton.setAttribute("class", "active")
                }
                    var aleagueLink = document.createElement("a")
                    aleagueLink.setAttribute("href", "/aleague")
                    aleagueLink.appendChild(document.createTextNode("A-League"))
                aleagueButton.appendChild(aleagueLink);

            navbarList.appendChild(aleagueButton);

                var shieldButton = document.createElement("li")
                if (thispage === "sheffieldshield") {
                    shieldButton.setAttribute("class", "active")
                }
                    var shieldLink = document.createElement("a")
                    shieldLink.setAttribute("href", "#")
                    shieldLink.appendChild(document.createTextNode("Sheffield Shield (soon)"))
                shieldButton.appendChild(shieldLink);

            navbarList.appendChild(shieldButton);

                var dropdown = document.createElement("li")
                dropdown.setAttribute("class", "dropdown")

                    var dropdownToggle = document.createElement("a")
                        dropdownToggle.setAttribute("href", "#")
                        dropdownToggle.setAttribute("class", "dropdown-toggle")
                        dropdownToggle.setAttribute("data-toggle", "dropdown")
                        dropdownToggle.setAttribute("role", "button")
                        dropdownToggle.setAttribute("aria-haspopup", "true")
                        dropdownToggle.setAttribute("aria-expanded", "false")
                        dropdownToggle.appendChild(document.createTextNode("Other Sports"))
                            var caret = document.createElement("span")
                            caret.setAttribute("class", "caret");
                        dropdownToggle.appendChild(caret);

                dropdown.appendChild(dropdownToggle);

                    var dropdownMenu = document.createElement("ul")
                    dropdownMenu.setAttribute("class", "dropdown-menu");

                        var cfbButton = document.createElement("li")
                            var cfbLink = document.createElement("a");
                            cfbLink.setAttribute("href", "#");
                            cfbLink.appendChild(document.createTextNode("College Football (soon)"))
                        cfbButton.appendChild(cfbLink);

                    dropdownMenu.appendChild(cfbButton);

                        var nflButton = document.createElement("li")
                            var nflLink = document.createElement("a")
                            nflLink.setAttribute("href", "#")
                            nflLink.appendChild(document.createTextNode("NFL (soon)"))
                        nflButton.appendChild(nflLink);

                    dropdownMenu.appendChild(nflButton);

                dropdown.appendChild(dropdownMenu);

            navbarList.appendChild(dropdown);

        navbarDiv.appendChild(navbarList);

    container.appendChild(navbarDiv);

    navbar.appendChild(container);
}