looker.plugins.visualizations.add({
  id: "xy_map_viz",
  label: "X-Y Map Visualization",
  options: {
    image_url: {
      type: "string",
      label: "Map Image URL",
      default: "https://images.app.goo.gl/Qa97W1g1ci1m1E2S6",  // Default image URL
    },
    marker_color: {
      type: "string",
      label: "Marker Color",
      default: "#FF0000"
    },
    marker_size: {
      type: "number",
      label: "Marker Size",
      default: 5
    },
  },
  create: function(element, config) {
    element.innerHTML = `
      <div id="map-container" style="position: relative;">
        <img id="background-image" src="${config.image_url}" style="width: 100%;" />
        <canvas id="canvas-overlay" style="position: absolute; top: 0; left: 0;"></canvas>
      </div>
    `;
    this.container = element.querySelector("#map-container");
    this.canvas = element.querySelector("#canvas-overlay");
    this.image = element.querySelector("#background-image");
  },
  updateAsync: function(data, element, config, queryResponse, details, done) {
    if (queryResponse.fields.dimensions.length < 2) {
      this.addError({title: "Data Error", message: "This visualization requires at least two dimensions for X and Y coordinates."});
      return;
    }

    const xField = queryResponse.fields.dimensions[0].name;
    const yField = queryResponse.fields.dimensions[1].name;
    const points = data.map(row => ({
      x: row[xField].value,
      y: row[yField].value
    }));

    const context = this.canvas.getContext("2d");
    this.canvas.width = this.image.clientWidth;
    this.canvas.height = this.image.clientHeight;

    // Clear the canvas
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Plot each point using raw x and y values from the data
    points.forEach(point => {
      context.beginPath();
      context.arc(point.x, point.y, config.marker_size, 0, 2 * Math.PI);
      context.fillStyle = config.marker_color;
      context.fill();
    });

    done();
  }
});
