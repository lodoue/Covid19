import * as d3 from "d3";
import { max } from "d3";

export function chartGrids(svg, gridposition, width, height) {
  // gridlines in x axis function
  function make_x_gridlines(x, ticks) {
      return d3.axisBottom(x).ticks(ticks)
  }

  // gridlines in y axis function
  function make_y_gridlines(y, ticks) {
      return d3.axisLeft(y).ticks(ticks);
  }

  svg.selectAll('.grid').remove();

  if (gridposition.hasOwnProperty("x")) {
      // add the X gridlines
      svg.append("g")
          .attr("class", "grid")
          .attr("transform", "translate(0," + (gridposition.x.top - 15) + ")")
          .call(make_x_gridlines(gridposition.x.scale, gridposition.x.ticks)
              .tickSize(-height)
              .tickFormat("")
          )
  }

  if (gridposition.hasOwnProperty("y")) {
      // add the Y gridlines
      svg.append("g")
          .attr("class", "grid")
          // .attr("transform", "translate(" + gridposition.y.left + "," + gridposition.y.top + ")")
          .call(make_y_gridlines(gridposition.y.scale, gridposition.y.ticks)
              .tickSize(-width)
              .tickFormat("")
          )
  }

  svg.selectAll('.grid line')
      .style("stroke", "#999999")
      .style("stroke-opacity", 1)
      .style("shape-rendering", "crispEdges")
      .style("stroke-dasharray", "3 3");

  svg.selectAll('.grid path').style("stroke-width", 0);
}

export function pathColor(areaCode){
  var index = this.calculatePerformance(this.geodata[areaCode]);
  var color = '#ccc';

  if(index!=null)
  this.legends.forEach((leg,leg_index)=>{
    switch (leg_index) {
      case 0:
        if(index <= leg.to)
        color = leg.color
        break;
      case 3:
         if(index >= leg.from)
         color = leg.color
         break;
      default :
        if(index >= leg.from && index <= leg.to)
        color = leg.color;
    }
  })
  return color;
}

export function calculatePerformance(data){
  var index = null;

  if(data){
    if(data.actual && data.planned){
      if(data.high && +data.planned.value != 0){
        index = (+data.actual.value / +data.planned.value) * 100;
      } else if(data.unit.toLowerCase() == 'percent'){  //If Unit is equal to percent
        index = ((100-(+data.actual.value)) / (100-(+data.planned.value))) * 100;
      } else if(data.planned.value != 0){ //If high is bad and planned value is not equal to 0
          index = 100 - (((+data.actual.value) - (+data.planned.value)) / (+data.planned.value)) * 100;
      } else { //If planned value is equal to 0
        index = 100 - (((+data.actual.value) - (+data.planned.value)) * 100);
      }
    }
  }
  return (index!=null)?Math.round(index):index;
}

export function calculateTextWidth(text, fs) {
  var fontFace = "SF Pro Text",
    fontSize = (fs)? fs : 12;
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  context.font = fontSize + "px " + fontFace;
  return context.measureText(text).width + fontSize;
}

export function map_svg2png(done) {
  var year = !this.periodSelected?'Most Recent':this.periodSelected;
  var outer = this.svg.getBoundingClientRect();
  var svgString = new XMLSerializer().serializeToString(this.svg);
  
  // Create Canvas
  var canvas = document.createElement('canvas');
  canvas.width = outer.width;
  canvas.height = outer.height + 100;
  var ctx = canvas.getContext("2d");
  var DOMURL = self.URL || self.webkitURL || self;
  var img = new Image();
  var svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  var url = DOMURL.createObjectURL(svg);
  img.onload = () => {
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 45);
    ctx.font = "15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#262424";
    ctx.fillText(`${this.activeData.ius.name.indicator} | ${this.activeData.ius.name.unit} | ${this.activeData.ius.name.subgroup.name} `, canvas.width / 2, 30);
    console.log(this.activeData)
    ctx.fillText(year, canvas.width / 2, 46);
    ctx.textAlign = "end";
    ctx.fillText(`${this.sourceList}`?`Source:${this.sourceList}`:'', canvas.width -30, canvas.height - 40 );
    if (done instanceof Function) done(canvas);
  };
  img.src = url;
}

export function ataglance_svg2png(done) {
  var outer = this.svg.getBoundingClientRect();
  var svgString = new XMLSerializer().serializeToString(this.svg);
  
  // Create Canvas
  var canvas = document.createElement('canvas');
  canvas.width = outer.width;
  canvas.height = outer.height;

  var ctx = canvas.getContext("2d");
  var DOMURL = self.URL || self.webkitURL || self;
  var img = new Image();
  var svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  var url = DOMURL.createObjectURL(svg);
  img.onload = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    // ctx.font = "15px sans-serif";
    // ctx.textAlign = "center";
    // ctx.fillStyle = "#262424";
    // ctx.fillText(this.ius.indicator, canvas.width / 2, 30);
    // ctx.fillText(this.ius.unit, 30, 50);
    if (done instanceof Function) done(canvas);
  };
  img.src = url;
}


export function monitoring_svg2png(done) {
  var outer = this.svg.getBoundingClientRect();
  var svgString = new XMLSerializer().serializeToString(this.svg);
  
  // Create Canvas
  var canvas = document.createElement('canvas');
  canvas.width = outer.width;
  canvas.height = outer.height;

  var ctx = canvas.getContext("2d");
  var DOMURL = self.URL || self.webkitURL || self;
  var img = new Image();
  var svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  var url = DOMURL.createObjectURL(svg);
  img.onload = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0,0);
    if (done instanceof Function) done(canvas);
  };
  img.src = url;
}




export function getDashArray(xScale, data, path, position) {
  const DASH_LENGTH = 5,
    DASH_SEPARATOR_LENGTH = 5;

  const dashedRanges = getDashedRanges(data, position);
  if (dashedRanges.length === 0) return null;

  const lengths = data.map(d => getPathLengthAtX(path, xScale(d.period)));
  return buildDashArray(dashedRanges, lengths);

  function getDashedRanges(data, position) {
    const hasOpenRange = arr =>
      arr[arr.length - 1] && !("end" in arr[arr.length - 1]);
    const lastIndex = data.length - 1;

    return data.reduce((res, d, i) => {
      const isRangeStart = !hasOpenRange(res) && isDashed(d);
      if (isRangeStart) res.push({ start: lastIndex - position });

      const isRangeEnd = hasOpenRange(res) && (!isDashed(d) || i === lastIndex);
      if (isRangeEnd) res[res.length - 1].end = i;
      
      return res;
    }, []);
  }

  function getPathLengthAtX(path, x) {
    const EPSILON = 1;
    let point;
    let target;
    let start = 0;
    let end = path.getTotalLength();
    // Mad binary search, yo
    while (true) {
      target = Math.floor((start + end) / 2);
      point = path.getPointAtLength(target);

      if (Math.abs(point.x - x) <= EPSILON) break;

      if ((target >= end || target <= start) && point.x !== x) {
        break;
      }

      if (point.x > x) {
        end = target;
      } else if (point.x < x) {
        start = target;
      } else {
        break;
      }
    }

    return target;
  }

  function buildDashArray(dashedRanges, lengths) {
    return dashedRanges.reduce((res, { start, end }, i) => {
      const prevEnd = i === 0 ? 0 : dashedRanges[i - 1].end;

      const normalSegment = lengths[start] - lengths[prevEnd];
      const dashedSegment = getDashedSegment(lengths[end] - lengths[start]);

      return res.concat([normalSegment, dashedSegment]);
    }, []);
  }

  function getDashedSegment(length) {
    const totalDashLen = DASH_LENGTH + DASH_SEPARATOR_LENGTH;
    const dashCount = Math.floor(length / totalDashLen);
    const range = (start, stop, step) =>
      Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step
      );

    return range(0, dashCount, 1)
      .map(() => DASH_SEPARATOR_LENGTH + "," + DASH_LENGTH)
      .concat(length - dashCount * totalDashLen)
      .join(",");
  }

  function isDashed(d) {
    return !d.certainty;
  }
}

export function svg2dataUrl(container,titleText,areaName,sourceSelected,done) {
  var svgs = d3.selectAll("#" + container + " svg").nodes();
  var svg = svgs.find(item => {
    return item.style.display != "none";
  });
  var legend = document.getElementById(container).nextSibling;

  var w = svg.getBoundingClientRect().width * 2;
  var h = svg.getBoundingClientRect().height * 2;

  svg.setAttribute('width', w)
  svg.setAttribute('height', h)
  
  w = w, h = h + 200 + legend.scrollHeight;

  var svgString = new XMLSerializer().serializeToString(svg);

  svg.setAttribute('width',svg.getBoundingClientRect().width / 2)
  svg.setAttribute('height',svg.getBoundingClientRect().height / 2)

  var canvas = document.getElementById("canvas2d");
  canvas.setAttribute("width", w);
  canvas.setAttribute("height", h);
  var ctx = canvas.getContext("2d");
  var DOMURL = self.URL || self.webkitURL || self;
  var img = new Image();
  var svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  var url = DOMURL.createObjectURL(svgBlob);

  img.onload = function() {
    var y = 40;
    var line_height = ctx.measureText("H").width * 2.6;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Add Area name
    var text = areaName;
    ctx.font = "20px SF Pro Text";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText(text, w / 2, y);

    // Add Indicator name with time period
    y += 25;
    var text = titleText;
    ctx.font = "18px SF Pro Text";
    ctx.textAlign = "center";
    ctx.fillStyle = "#333";
    var wrap_y = wrapText(ctx, text, w / 2, y, w, line_height);
    if (y != wrap_y) {
      var newlines = (wrap_y - y) / line_height;
      y += newlines * line_height + 10;
    } else {
      y += 25;
    }
    ctx.drawImage(img, 0, 125);
    var rect = { x: 5, y: h + 100, w: 10, h: 10 };
    Array.from(document.getElementById(container).nextSibling.querySelectorAll(".legend_specific_box  li")).forEach(leg => {
      var text = leg.textContent.trim();
      if (ctx.measureText(text).width + rect.w + rect.x > w) {
        rect.x = 5;
        rect.y += ctx.measureText("H").width + 10;
      }
      ctx.beginPath();
      ctx.fillStyle = leg.querySelector("span").style.backgroundColor;
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      ctx.stroke();

      ctx.font = "14px SF Pro Text";
      ctx.textAlign = "start";
      ctx.fillStyle = "#b5b3b3";

      ctx.fillText(
        text,
        rect.x + rect.w + 5,
        rect.y + ctx.measureText("H").width
      );
      rect.x += ctx.measureText(text).width + rect.w + 15;
    });
    // Add Source
    var text = "Source:" + sourceSelected.join(", ");
    ctx.textAlign = "left";
    ctx.fillStyle = "#a7a2a2";
    ctx.font='12px sans-serif';

    wrapText(ctx, text,  15, h - 15, w, line_height);

    var imgs = document.getElementById('powerdbyItm');
   
    // imgs.setAttribute

    ctx.drawImage(imgs, w-183, h - 15 - 29, 163, 29);

    if (done instanceof Function) done(canvas);
  };
  img.src = url;
}
export function wrapText(context, text, x, y, line_width, line_height) {
  var line = "";
  var paragraphs = text.split("\n");
  for (var i = 0; i < paragraphs.length; i++) {
    var words = paragraphs[i].split(" ");
    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + " ";
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > line_width && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + " ";
        y += line_height;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
    y += line_height;
    line = "";
  }
  return y;
}

export function getPrecision(v) {
  if (Math.floor(v) === v) return 0;
  var str = v.toString();
  var ep = str.split("e-");
  if (ep.length > 1) {
    var np = Number(ep[0]);
    return np.getPrecision() + Number(ep[1]);
  }
  var dp = str.split(".");
  if (dp.length > 1) {
    return dp[1].length;
  }
  return 0;
}

export function getTextWidth(text, size) {
  var fontFace = "SF Pro Text",
    fontSize = (size)? size : 12;

  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  context.font = fontSize + "px " + fontFace;
  return context.measureText(text).width + fontSize;
}

export function groupBy(dataset, field) {
  var keys = [
    ...new Set(
      dataset.map(function(d) {
        return d[field];
      })
    )
  ];
  var data = {};
  keys.forEach(function(key) {
    data[key] = dataset.filter(function(d) {
      return d[field] == key;
    });
  });
  return data;
}

export function difference(arr1, arr2) {
  return arr1.filter(x => !arr2.includes(x));
}

export function formatAbbreviation(x) {
  var formatNumber = d3.format("d"),
    formatFloat = d3.format(".2f"),
    formatBillion = function(x) {
      return formatFloat(x / 1e9) + "B";
    },
    formatMillion = function(x) {
      return formatFloat(x / 1e6) + "M";
    },
    formatThousand = function(x) {
      return x % 1 === 0
        ? formatNumber(x / 1e3) + "K"
        : formatFloat(x / 1e3) + "K";
    },
    formatHundred = function(x) {
      return x % 1 === 0 ? formatNumber(x) : formatFloat(x);
    };

  var v = Math.abs(x);

  return (v >= 0.9995e9
    ? formatBillion
    : v >= 0.9995e6
    ? formatMillion
    : v >= 1000
    ? formatThousand
    : formatHundred)(x);
}

export function getSmartTicks(val) {
  val = val <= 0 ? 0.01 : val;
  //base step between nearby two ticks
  var step = Math.pow(10, Math.ceil(val).toString().length - 1);
  
  //modify steps either: 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000...
  if (val / step < 2) {
  step = step / 5;
  } else if (val / step < 5) {
  step = step / 2;
  }
  
  //add one more step if the last tick value is the same as the max value
  //if you don't want to add, remove "+1"
  var slicesCount = Math.ceil(val / step);
  
  var count = Math.min(10, slicesCount); //show max 10 ticks
  
  return {
  endPoint: slicesCount * step + step,
  count: count==1?2:count
  };
}

export function getSmartTicks2(val) {
  val = val <= 0 ? 0.3 : val;
  
  //base step between nearby two ticks
  var step = Math.pow(10, Math.ceil(val).toString().length - 1);

  //modify steps either: 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000.
  if (val / step < 2) {
    step = step / 5;
  } else if (val / step < 5) {
    step = step / 2;
  }

  //add one more step if the last tick value is the same as the max value
  //if you don't want to add, remove "+1"
  var slicesCount = Math.ceil(val / step);

  return {
    endPoint: slicesCount * step,
    count: Math.min(10, slicesCount) //show max 10 ticks
  };
}

export function dataURLtoBlob(dataURL) {
  var binary = atob(dataURL.split(",")[1]);
  // Create 8-bit unsigned array
  var array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  // Return our Blob object
  return new Blob([new Uint8Array(array)], { type: "image/png" });
}

export function shareSocial(sharetype, shared_url, done) {
  var encod = encodeURI(shared_url);
  if (sharetype == "facebook") {
    window.fbAsyncInit = function() {
      FB.init({
        appId: "514766589149224",
        cookie: true,
        status: true,
        xfbml: true,
        version: "v2.8"
      });

      FB.ui(
        {
          method: "feed",
          link: shared_url,
          display: "popup"
        },
        function(response) {
          if (response && !response.error_message) {
          } else {
          }
        }
      );
    };
    fbAsyncInit();
  } else if (sharetype == "twitter") {
    window.open(
      "https://twitter.com/intent/tweet?url=" + encodeURIComponent(encod)
    );
  } else if (sharetype == "linkedin") {
    var title = "Replace this with a title.";
    var text = "Replace this with your share copy.";
    window.open(
      "http://www.linkedin.com/shareArticle?mini=true&url=" +
        encodeURIComponent(encod) +
        "&title=This%20is%20my%20first%20post&summary=I%20want%20to%20create%20this%20post%20on&source=LinkedIn"
    );
  } else if (sharetype == "google") {
    window.open(
      "https://plus.google.com/share?url=" + encodeURIComponent(encod)
    );
  }
  if (done instanceof Function) done();
}
