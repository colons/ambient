var frame;

function Widget(config) {
  var widget = this;

  widget.config = config;

  var templateSource = $('#type-' + config.type).html();
  widget.template = new Handlebars.compile(templateSource);

  $('#widgets').append(frame({widget: widget}));

  widget.element = $('#widgets > :last-child');
  widget.sandbox = widget.element.find('.sandbox');
  widget.drawer = getDrawer(widget);

  if (config.id !== undefined) {
    widget.element.attr('id', config.id);
  }

  $.each(['width', 'height'], function(i, key) {
    var value = config[key];
    if (value !== undefined) {
      widget.sandbox.css(key, value);
    }
  });

  if (config.scale !== undefined) {
    widget.sandbox.css('font-size', config.scale.toString() + 'em');
  }

  if (config.reload !== undefined) {
    setInterval(widget.drawer, config.reload);
  }

  widget.drawer(true);
}

function defaultDrawer(initial, widget, context) {
  console.log('drawing ' + widget.config.type);
  if (context === undefined) {
    console.log('resetting context');
    context = {};
  }
  context.widget = widget;
  console.log(context);
  widget.sandbox.html(widget.template(context));
}

function getDrawer(widget) {
  var drawer;

  if (widget.config.type in drawers) {
    drawer = drawers[widget.config.type];
  } else {
    drawer = defaultDrawer;
  }

  return function(initial) {
    drawer(initial, widget);
  };
}

$(function() {
  var frameSource = $("#frame").html();
  frame = Handlebars.compile(frameSource);

  $.getJSON('config.json', function(data) {
    $('title').text(data.title);

    $.each(data.widgets, function(i, widgetConfig) {
      new Widget(widgetConfig);
    });
  });
});


/* --- WIDGETS --- */

// helpers
function zeroPad(number) {
  var s = '00' + number.toString();
  return s.substr(s.length-2);
}

var weekdays = [
  "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
];

// the actual widgets
var drawers = {
  image: function(initial, widget) {
    if (initial) {
      defaultDrawer(initial, widget);
    }
    widget.sandbox.find('img').attr('src', widget.config.url + '?' + Date.now());
  },

  clock: function(initial, widget) {
    now = new Date();
    widget.sandbox.html(widget.template({
      hours: zeroPad(now.getHours()),
      minutes: zeroPad(now.getMinutes()),
      weekday: weekdays[now.getDay() - 1],
      date: zeroPad(now.getDate()),
      month: zeroPad(now.getMonth() + 1)
    }));
  },

  jenkins: function(initial, widget) {
    $.getJSON(widget.config.url, function(data) {
      defaultDrawer(initial, widget, {jobs: data.jobs});
    });
  }
};

