/**
 * Starts the client and server pushing functionality
 */

var teamNames = [];
 function generateImage (image) {
    console.log("generateImage(" + image + ") called")
    return function getImage(ctx, x, y, radius, shadow) {
    console.log(shadow)
        if (shadow) return; // don't draw the image if it's for a shadow
        console.log("returned function called for " + image)
        var img = new Image();
        img.onload = function() {
            console.log("onload called for " + image)
            ctx.drawImage(img, x+radius, y+radius, img.width, img.height)
        }
        img.src = image;
    }
 }
var startClientServer = function(competition) {

    //Get the URL to hand into the connect call
    var http = location.protocol;
    var slashes = http.concat("//");
    var host = slashes.concat(window.location.hostname);

    //Socket IO communications
    var socket = io.connect(host);

	$.getJSON(competition + "-averageforagainst", function(json) {
	    var data = [];
	    for (var i = 0; i < json.length; i++) {
	        data.push({
	            label: json[i]["name"],
	            data: [[json[i]["ave-agst"], json[i]["ave-for"]]],
	            points: {
	                radius: 0,
	                symbol: generateImage("/" + competition + "/" + json[i]["name"] + "-circle")
	            }
	        })
	    }
	    console.log(data)

	    $.plot("#placeholder", data, {
	        shadowSize: 0,
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
                axisLabelPadding: 0,
                autoscaleMargin: 0.2,
                tickSize: 10,
            },
            xaxis: {
                axisLabel: 'Average Points Against per Game',
                axisLabelPadding: 0,
                autoscaleMargin: 0.2,
                tickSize: 10,
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
                $("#tooltip").css({top: item.pageY+5, left: item.pageX+5}).fadeIn(200);
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

var drawTeamProbTable = function(competition) {
	console.log("TESTING");
	var tableDiv = document.getElementById('team-probability-wrapper');
	var tableArray = [];
	$.getJSON("/" + competition + "-teampositions", function(json) {
	$.getJSON("/" + competition + "-teampositionsheader", function(headerjson) {
		var table = document.createElement("table");
		table.setAttribute("id", "team-probability-table");
		table.setAttribute("class", "table table-striped table-condensed")
		var tableHead = document.createElement("thead");
		tableHead.setAttribute("class", "team-prob-header")
		var headerRow = document.createElement("tr");
		headerRow.setAttribute("class", "team-prob-header");
		var headerName = document.createElement("th");
		headerName.setAttribute("class", "team-prob-header");
		headerName.setAttribute("rowspan", "2");
		var headerNameText = document.createTextNode("Team Name");
		headerName.appendChild(headerNameText);
		headerRow.appendChild(headerName);

		for (var i = 0; i < headerjson.length; i++) {
		    var headerColumn = document.createElement("th");
            headerColumn.setAttribute("class", "team-prob-header");
            headerColumn.setAttribute("rowspan", "2");
            var headerColumnText = document.createTextNode(headerjson[i].title);
            headerColumn.appendChild(headerColumnText);
            headerRow.appendChild(headerColumn);
		}
				
		var headerPosTop = document.createElement("th");
		headerPosTop.setAttribute("class", "team-prob-header");
		headerPosTop.setAttribute("colspan", json.length.toString());
		var headerPosTopText = document.createTextNode("Chance of finishing in position:");
		headerPosTop.appendChild(headerPosTopText);
		headerRow.appendChild(headerPosTop);
				
		var headerLast = document.createElement("th");
		headerLast.setAttribute("class", "team-prob-header");
		headerLast.setAttribute("rowspan", "2");
		var headerLastText = document.createTextNode("Last Game");
		headerLast.appendChild(headerLastText);
		headerRow.appendChild(headerLast);
				
		var headerNext = document.createElement("th");
		headerNext.setAttribute("class", "team-prob-header");
		headerNext.setAttribute("rowspan", "2");
		var headerNextText = document.createTextNode("Next Game");
		headerNext.appendChild(headerNextText);
		headerRow.appendChild(headerNext);

		var headerAve = document.createElement("th");
        headerAve.setAttribute("class", "team-prob-header");
        headerAve.setAttribute("rowspan", "2");
        headerAve.appendChild(document.createTextNode("Ave"));
        headerAve.appendChild(document.createElement("br"));
        headerAve.appendChild(document.createTextNode("Seed"));
        headerRow.appendChild(headerAve);

        var headerRPI = document.createElement("th");
        headerRPI.setAttribute("class", "team-prob-header");
        headerRPI.setAttribute("rowspan", "2");
        var headerRPIText = document.createTextNode("RPI");
        headerRPI.appendChild(headerRPIText);
        headerRow.appendChild(headerRPI);
				
		tableHead.appendChild(headerRow);
		var headerSecondRow = document.createElement("tr");
		headerSecondRow.setAttribute("class", "team-prob-header")
				
		for (var p = 1; p <= json.length; p++) {
			var headerPos = document.createElement("th");
			headerPos.setAttribute("class", "team-prob-header");
			var headerPosText = document.createTextNode("" + p);
			headerPos.appendChild(headerPosText);
			headerSecondRow.appendChild(headerPos);
		}
		tableHead.appendChild(headerSecondRow);
		table.appendChild(tableHead);
			
		var tableBody = document.createElement("tbody");
		for (var i = 0; i < json.length; i++) {
			var teamData = json[i];
			teamNames[i] = teamData.name.toString();
			var teamRow = document.createElement("tr");
			teamRow.setAttribute("class", "team-prob-row");

			var teamName = document.createElement("td");
			teamName.setAttribute("class", "teamicon");
			var styleString = "background: url(\"" + competition + "/" + teamData.name + "-left\") left center no-repeat"
			teamName.setAttribute("style", styleString)
			var teamNameText = document.createTextNode(teamData.name);
			teamName.appendChild(teamNameText);
			teamRow.appendChild(teamName);

			for (var h = 0; h < headerjson.length; h++) {
			    console.log(headerjson[h])
			    var teamValue = document.createElement("td");
                teamValue.setAttribute("class", headerjson[h].class);
                var teamValueText;
                if (headerjson[h].type === "text") {
                    teamValueText = document.createTextNode(headerjson[h].prefix + teamData[headerjson[h].attribute] + headerjson[h].suffix);
                } else {
                    teamValueText = document.createTextNode(headerjson[h].prefix + parseFloat(teamData[headerjson[h].attribute]).toFixed(headerjson[h].decimals) + headerjson[h].suffix);
                }
                teamValue.appendChild(teamValueText);
                teamRow.appendChild(teamValue);
			}
				
			for (var p = 1; p <= json.length; p++) {
					
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
				
				
			tableBody.appendChild(teamRow);
		}
		table.appendChild(tableBody);
		tableDiv.appendChild(table);
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
	var tableDiv = document.getElementById('last-nine-div');
	var tableArray = [];
	$.getJSON("/" + competition + "-mostrecentgames", function(json) {
			var table = document.createElement("table");
			table.setAttribute("id", "team-probability-table");
			table.setAttribute("class", "table table-striped table-condensed");

			var tableBody = document.createElement("tbody");

			for (var i = 0; i < json.length; i++) {
				var gameData = json[i];
				var gameFirstRow = document.createElement("tr");
				var gameSecondRow = document.createElement("tr");
				
				var homeTeam = document.createElement("td");
				homeTeam.setAttribute("class", "gameteamicon-left");
				var homeStyleString = "background: url(\"" + competition + "/" + gameData.hometeam + "-left\") left center no-repeat"
				homeTeam.setAttribute("style", homeStyleString)
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
				awayTeam.setAttribute("style", "background: url(\"" + competition + "/" + gameData.awayteam + "-right\") right center no-repeat")
				awayTeam.appendChild(document.createTextNode(gameData.awayteam));
				gameFirstRow.appendChild(awayTeam);
				
				var gameDetails = document.createElement("td");
				gameDetails.setAttribute("class", "gamedetails");
				gameDetails.setAttribute("colspan", "5");
				gameDetails.appendChild(document.createTextNode(gameData.date + " - Predicted chance of this result: " + parseFloat(gameData.chanceofresult).toFixed(1) + "%"))
				gameSecondRow.appendChild(gameDetails);
				
				
				tableBody.appendChild(gameFirstRow);
				tableBody.appendChild(gameSecondRow);
			}

			table.appendChild(tableBody)
			tableDiv.appendChild(table);
	});
}

var drawUpcomingGamesTable = function(competition) {
	var tableDiv = document.getElementById('next-nine-div');
	var tableArray = [];
	$.getJSON(competition + "-upcominggames", function(json) {
			var table = document.createElement("table");
			table.setAttribute("id", "team-probability-table");
			table.setAttribute("class", "table table-striped table-condensed")
			var tableBody = document.createElement("tbody");
			
			for (var i = 0; i < json.length; i++) {
				var gameData = json[i];
				var gameFirstRow = document.createElement("tr");
				var gameSecondRow = document.createElement("tr");
				
				var homeTeam = document.createElement("td");
				homeTeam.setAttribute("class", "gameteamicon-left");
				homeTeam.setAttribute("style", "background: url(\"" + competition + "/" + gameData.hometeam + "-left\") left center no-repeat")
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
				awayTeam.setAttribute("style", "background: url(\"" + competition + "/" + gameData.awayteam + "-right\") right center no-repeat")
				awayTeam.appendChild(document.createTextNode(gameData.awayteam));
				gameFirstRow.appendChild(awayTeam);
				
				var gameDetails = document.createElement("td");
				gameDetails.setAttribute("class", "gamedetails");
				gameDetails.setAttribute("colspan", "5");
				gameDetails.appendChild(document.createTextNode(gameData.date + " - Chance of Draw: " + parseFloat(gameData.drawchance).toFixed(1) + "%"))
				gameSecondRow.appendChild(gameDetails);
				
				
				tableBody.appendChild(gameFirstRow);
				tableBody.appendChild(gameSecondRow);
			}
			table.appendChild(tableBody);
			tableDiv.appendChild(table);
		});
}

var drawFirstFinalOpponentTable = function(competition) {
	var tableDiv = document.getElementById('first-final-opponent-div');
	var tableArray = [];
	$.getJSON(competition + "-firstFinalOpponent", function(json) {
	    console.log(teamNames)

		var table = document.createElement("table");
		table.setAttribute("id", "team-probability-table");
		table.setAttribute("class", "table table-striped table-condensed");
		var tableHead = document.createElement("thead");
		var headerRow = document.createElement("tr");

		var headerName = document.createElement("th");
		headerName.setAttribute("class", "team-prob-header");
		headerName.setAttribute("rowspan", "2");
		var headerNameText = document.createTextNode("Team Name");
		headerName.appendChild(headerNameText);
		headerRow.appendChild(headerName);

		var headerPosTop = document.createElement("th");
		headerPosTop.setAttribute("class", "team-prob-header");
		headerPosTop.setAttribute("colspan", teamNames.length.toString());
		var headerPosTopText = document.createTextNode("Chance of playing team in the first week of the Finals:");
		headerPosTop.appendChild(headerPosTopText);
		headerRow.appendChild(headerPosTop);

		tableHead.appendChild(headerRow);
		var headerSecondRow = document.createElement("tr");

		for (var p = 0; p < teamNames.length; p++) {
			var headerOpp = document.createElement("th");
			headerOpp.setAttribute("class", "team-prob-header");
			headerOpp.setAttribute("title", teamNames[p]);
			var headerOppIcon = document.createElement("img");
			headerOppIcon.setAttribute("src", competition + "/" + teamNames[p] + "-square")
			headerOpp.appendChild(headerOppIcon);
			headerSecondRow.appendChild(headerOpp);
		}
		tableHead.appendChild(headerSecondRow);
		table.appendChild(tableHead);

        var tableBody = document.createElement("tbody");
    	for (var i = 0; i < teamNames.length; i++) {
			var teamData = json[teamNames[i]];
			console.log(teamNames[i])
			console.log(teamData)
			var teamRow = document.createElement("tr");
			teamRow.setAttribute("class", "team-prob-row");

			var teamName = document.createElement("td");
			teamName.setAttribute("class", "teamicon");
			var styleString = "background: url(\"" + competition + "/" + teamNames[i] + "-left\") left center no-repeat"
			teamName.setAttribute("style", styleString)
			var teamNameText = document.createTextNode(teamNames[i]);
			teamName.appendChild(teamNameText);
			teamRow.appendChild(teamName);

			for (var p = 0; p < teamNames.length; p++) {
				var teamPos = document.createElement("td");
				var teamPosSpan = document.createElement("span");
				teamPosSpan.setAttribute("title", parseFloat(teamData[teamNames[p]]) + "%");
				teamPos.setAttribute("class", "team-prob-position");
				teamPos.setAttribute("style", "background-color: rgba(127,127,255," + parseFloat(teamData[teamNames[p]]).toFixed(2) / 100 + ")");
				if (teamData[teamNames[p]] != 0) {
					var teamPosText = document.createTextNode(parseFloat(teamData[teamNames[p]]).toFixed(0));
					teamPosSpan.appendChild(teamPosText);
					teamPos.appendChild(teamPosSpan);
				}
				teamRow.appendChild(teamPos);
			}
			tableBody.appendChild(teamRow);
		}
		table.appendChild(tableBody);
		tableDiv.appendChild(table);
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
                    nrlLink.setAttribute("href", "#");
                    nrlLink.appendChild(document.createTextNode("NRL (soon)"));

                nrlButton.appendChild(nrlLink);

            navbarList.appendChild(nrlButton);

                var superRugbyButton = document.createElement("li")
                if (thispage === "superrugby") {
                    superRugbyButton.setAttribute("class", "active")
                }
                    var superRugbyLink = document.createElement("a")
                    superRugbyLink.setAttribute("href", "#");
                    superRugbyLink.appendChild(document.createTextNode("Super Rugby (soon)"))
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