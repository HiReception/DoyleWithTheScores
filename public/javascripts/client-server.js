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
		[1,12], [2, 24], [3,36]
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