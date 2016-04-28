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

    var buffer = [];
    var minBufferSize = 50;
    var maxBufferSize = 300;
    var clientInterval = null;
    var rebuffer = true;
    var serverUpdates = 1;
    var clientUpdates = 30;

    /**
     * Repaint graph function.  This repaints the graph
     * at a timed interval
     */
    function repaintGraph() {
        $("#buffer").text(Math.floor(buffer.length / maxBufferSize * 100));
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
            //If we don't have data, then we have to re-buffer
            //so there's nothing new to draw.
            repaintGraph.plot.setData([buffer.shift()]);
            repaintGraph.plot.draw();
        }
    }
	repaintGraph();
};