/**
 * Starts the client and server pushing functionality
 */
var startClientServer = function() {

    //Get the URL to hand into the connect call
    var http = location.protocol;
    var slashes = http.concat("//");
    var host = slashes.concat(window.location.hostname);

    //Socket IO communications
    var socket = io.connect(host);

    var minBufferSize = 50;
    var maxBufferSize = 300;
    var clientInterval = null;
    var rebuffer = true;
    var serverUpdates = 1;
	var data = [
	{ label: "A", data: [ [1,12], [2, 24], [3,36] ]},
	{ label: "B", data: [ [1,25], [2, 50], [3,75] ]}
	];
    var clientUpdates = 30;

    /**
     * Repaint graph function.  This repaints the graph
     * at a timed interval
     */
            $.plot("#placeholder", data, {
                series: {
                    shadowSize: 0	// Drawing is faster without shadows
                },
                yaxis: {
                    min: 0,
                    max: 100
                },
                xaxis: {
                    min: 1,
					max: 3
                }
            });
		
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
	var filepath = '/teampositions.csv';
	$.ajax({
        url : filepath,
        dataType: "text",
        success : function (data) {
			var lines = data.split('\n');
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
			
			
			for (var i = 0; i < 18; i++) {
				var teamLine = lines[i].split(',');
				var teamRow = document.createElement("tr");
				teamRow.setAttribute("class", "team-prob-row");
				
				var teamName = document.createElement("td");
				teamName.setAttribute("class", "teamicon");
				teamName.setAttribute("style", "background: url(\"" + teamLine[0] + "-left\") left center no-repeat")
				var teamNameText = document.createTextNode(teamLine[0]);
				teamName.appendChild(teamNameText);
				teamRow.appendChild(teamName);
				
				var teamWDL = document.createElement("td");
				teamWDL.setAttribute("class", "team-prob-wdl");
				var teamWDLText = document.createTextNode(teamLine[1]);
				teamWDL.appendChild(teamWDLText);
				teamRow.appendChild(teamWDL);
				
				var teamPerc = document.createElement("td");
				teamPerc.setAttribute("class", "team-prob-perc");
				var teamPercText = document.createTextNode(parseFloat(teamLine[2] * 100).toFixed(1));
				teamPerc.appendChild(teamPercText);
				teamRow.appendChild(teamPerc);
				
				var teamTop8 = document.createElement("td");
				teamTop8.setAttribute("class", "team-prob-finals");
				var teamTop8Text = document.createTextNode(parseFloat(teamLine[3]).toFixed(2) + "%");
				teamTop8.appendChild(teamTop8Text);
				teamRow.appendChild(teamTop8);
				
				var teamTop4 = document.createElement("td");
				teamTop4.setAttribute("class", "team-prob-finals");
				var teamTop4Text = document.createTextNode(parseFloat(teamLine[4]).toFixed(2) + "%");
				teamTop4.appendChild(teamTop4Text);
				teamRow.appendChild(teamTop4);
				
				for (var p = 1; p <= 18; p++) {
					
					var teamPos = document.createElement("td");
					var teamPosSpan = document.createElement("span");
					teamPosSpan.setAttribute("title", parseFloat(teamLine[p + 4]) + "%");
					teamPos.setAttribute("class", "team-prob-position");
					teamPos.setAttribute("style", "background-color: rgba(127,127,255," + parseFloat(teamLine[p + 4]).toFixed(2) / 100 + ")");
					if (teamLine[p + 4] != 0) {
						var teamPosText = document.createTextNode(parseFloat(teamLine[p + 4]).toFixed(0));
						teamPosSpan.appendChild(teamPosText);
						teamPos.appendChild(teamPosSpan);
					}
					
					teamRow.appendChild(teamPos);
				}
				
				var teamLast = document.createElement("td");
				teamLast.setAttribute("class", "team-prob-lastnext")
				var teamLastText = document.createTextNode(teamLine[23]);
				teamLast.appendChild(teamLastText);
				teamRow.appendChild(teamLast);
				
				var teamNext = document.createElement("td");
				teamNext.setAttribute("class", "team-prob-lastnext")
				var teamNextText = document.createTextNode(teamLine[24]);
				teamNext.appendChild(teamNextText);
				teamRow.appendChild(teamNext);

				var teamAve = document.createElement("td");
				teamAve.setAttribute("class", "team-prob-ave")
                var teamAveText = document.createTextNode(parseFloat(teamLine[25]).toFixed(1));
                teamAve.appendChild(teamAveText);
                teamRow.appendChild(teamAve);
				
				
				table.appendChild(teamRow);
			}
			tableDiv.appendChild(table);
		}
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
	var filepath = '/mostrecentgames.csv';
	$.ajax({
        url : filepath,
        dataType: "text",
        success : function (data) {
			var lines = data.split('\n');
			var table = document.createElement("table");
			table.setAttribute("id", "team-probability-table");
			var headerRow = document.createElement("tr");
			headerRow.setAttribute("class", "game-list-header");
			
			var headerCell = document.createElement("th");
			headerCell.setAttribute("colspan", "5");
			headerCell.appendChild(document.createTextNode("Last Nine Games"));
			
			headerRow.appendChild(headerCell);
			table.appendChild(headerRow);
			
			
			for (var i = 0; i < lines.length - 1; i++) {
				var gameLine = lines[i].split(',');
				var gameFirstRow = document.createElement("tr");
				var gameSecondRow = document.createElement("tr");
				
				var homeTeam = document.createElement("td");
				homeTeam.setAttribute("class", "gameteamicon-left");
				homeTeam.setAttribute("style", "background: url(\"" + gameLine[1] + "-left\") left center no-repeat")
				homeTeam.appendChild(document.createTextNode(gameLine[1]));
				gameFirstRow.appendChild(homeTeam);
				
				var homeScore = document.createElement("td");
				homeScore.appendChild(document.createTextNode(gameLine[3]));
				gameFirstRow.appendChild(homeScore);
				
				var centre = document.createElement("td");
				centre.setAttribute("class", "gamecentre");
				centre.appendChild(document.createTextNode("vs"));
				gameFirstRow.appendChild(centre);
				
				var awayScore = document.createElement("td");
				awayScore.appendChild(document.createTextNode(gameLine[4]));
				gameFirstRow.appendChild(awayScore);
				if (parseInt(gameLine[3]) > parseInt(gameLine[4])) {
					homeScore.setAttribute("class", "gamescore-win");
					awayScore.setAttribute("class", "gamescore-lose");
				} else if (parseInt(gameLine[3]) < parseInt(gameLine[4])) {
					homeScore.setAttribute("class", "gamescore-lose");
					awayScore.setAttribute("class", "gamescore-win");
				} else {
					homeScore.setAttribute("class", "gamescore");
					awayScore.setAttribute("class", "gamescore");
				}
				
				var awayTeam = document.createElement("td");
				awayTeam.setAttribute("class", "gameteamicon-right");
				awayTeam.setAttribute("style", "background: url(\"" + gameLine[2] + "-right\") right center no-repeat")
				awayTeam.appendChild(document.createTextNode(gameLine[2]));
				gameFirstRow.appendChild(awayTeam);
				
				var gameDetails = document.createElement("td");
				gameDetails.setAttribute("class", "gamedetails");
				gameDetails.setAttribute("colspan", "5");
				gameDetails.appendChild(document.createTextNode(gameLine[0] + " - Predicted chance of this result: " + parseFloat(gameLine[5]).toFixed(1) + "%"))
				gameSecondRow.appendChild(gameDetails);
				
				
				table.appendChild(gameFirstRow);
				table.appendChild(gameSecondRow);
			}
			tableDiv.appendChild(table);
		}
	});
}

var drawUpcomingGamesTable = function() {
	var tableDiv = document.getElementById('next-nine-div');
	var tableArray = [];
	var filepath = '/upcominggames.csv';
	$.ajax({
        url : filepath,
        dataType: "text",
        success : function (data) {
			var lines = data.split('\n');
			var table = document.createElement("table");
			table.setAttribute("id", "team-probability-table");
			var headerRow = document.createElement("tr");
			headerRow.setAttribute("class", "game-list-header");
			
			var headerCell = document.createElement("th");
			headerCell.setAttribute("colspan", "5");
			headerCell.appendChild(document.createTextNode("Next Nine Games"));
			
			headerRow.appendChild(headerCell);
			table.appendChild(headerRow);
			
			
			for (var i = 0; i < lines.length - 1; i++) {
				var gameLine = lines[i].split(',');
				var gameFirstRow = document.createElement("tr");
				var gameSecondRow = document.createElement("tr");
				
				var homeTeam = document.createElement("td");
				homeTeam.setAttribute("class", "gameteamicon-left");
				homeTeam.setAttribute("style", "background: url(\"" + gameLine[1] + "-left\") left center no-repeat")
				homeTeam.appendChild(document.createTextNode(gameLine[1]));
				gameFirstRow.appendChild(homeTeam);
				
				var homePerc = document.createElement("td");
				homePerc.setAttribute("class", "gameperc");
				homePerc.appendChild(document.createTextNode(parseFloat(gameLine[3]).toFixed(1) + "%"));
				gameFirstRow.appendChild(homePerc);
				
				var centre = document.createElement("td");
				centre.setAttribute("class", "gamecentre");
				centre.appendChild(document.createTextNode("vs"));
				gameFirstRow.appendChild(centre);
				
				var awayPerc = document.createElement("td");
				awayPerc.setAttribute("class", "gameperc");
				awayPerc.appendChild(document.createTextNode(parseFloat(gameLine[4]).toFixed(1) + "%"));
				gameFirstRow.appendChild(awayPerc);
				
				var awayTeam = document.createElement("td");
				awayTeam.setAttribute("class", "gameteamicon-right");
				awayTeam.setAttribute("style", "background: url(\"" + gameLine[2] + "-right\") right center no-repeat")
				awayTeam.appendChild(document.createTextNode(gameLine[2]));
				gameFirstRow.appendChild(awayTeam);
				
				var gameDetails = document.createElement("td");
				gameDetails.setAttribute("class", "gamedetails");
				gameDetails.setAttribute("colspan", "5");
				gameDetails.appendChild(document.createTextNode(gameLine[0] + " - Chance of Draw: " + parseFloat(gameLine[5]).toFixed(1) + "%"))
				gameSecondRow.appendChild(gameDetails);
				
				
				table.appendChild(gameFirstRow);
				table.appendChild(gameSecondRow);
			}
			tableDiv.appendChild(table);
		}
	});
}