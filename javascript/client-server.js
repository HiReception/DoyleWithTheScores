var startClientServer = function() {
	var http = location.protocol;
	var slashes = http.concat("//");
	var host = slashes.concat(window.location.hostname);
	
	var socket = io.connect(host);
	
	var buffer = [];
	var minBufferSize = 50;
	var maxBufferSize = 300;
	var clientInterval = null;
	var rebuffer = true;
	var serverUpdates = 1;
	var clientUpdates = 30;
	
	function repaintGraph() {
		$("#buffer").text(Math.floor(buffer.length/maxBufferSize * 100));
		if (!repaintGraph.init && buffer.length > 0) {
			repaintGraph.init = true;
			
			repaintGraph.plot = $.plot("#placeholder", [ buffer.shift() ], {
				series: {
                    shadowSize: 0	// Drawing is faster without shadows
                },
                yaxis: {
                    min: 0,
                    max: 100
                },
                xaxis: {
                    show: false
                }
			});
		} else if (!rebuffer && buffer.length > 0) {
			repaintGraph.plot.setData([buffer.shift()]);
			repaintGraph.plot.draw();
		}
	}
	
	socket.on('dataSet', function(data) {
		if (buffer.length == 0) {
			rebuffer = true;
		} else if (buffer.length > minBufferSize) {
			rebuffer = false;
		}
		if (buffer.length <= maxBufferSize) {
			buffer.push(data);
		}
	});
	
	$("#updateInterval").val(clientUpdates);
	$("#serverInterval").val(serverUpdates);
	
	clientInterval = setInterval(function () {
		repaintGraph();
	}, clientUpdates)


}