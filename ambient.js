var frame;

function initWidget(widget) {
  var source = $('#type-' + widget.type).html();
  var template = new Handlebars.compile(source);

  $('#widgets').append(frame({widget: widget}));

  var element = $('#widgets > :last-child');
  var sandbox = element.find('.sandbox');
  var drawer = getDrawer(widget, sandbox, template);
  if (widget.id !== undefined) {
    element.attr('id', widget.id);
  }
  $.each(['width', 'height'], function(i, key) {
    var value = widget[key];
    if (value !== undefined) {
      sandbox.css(key, widget[key]);
    }
  });

  if (widget.reload !== undefined) {
    console.log(widget.reload);
    setInterval(drawer, widget.reload);
  }

  drawer(true);
}

function defaultDrawer(initial, widget, sandbox, template) {
  sandbox.html(template({widget: widget}));
}

function getDrawer(widget, sandbox, template) {
  var drawer;

  if (widget.type in drawers) {
    drawer = drawers[widget.type];
  } else {
    drawer = defaultDrawer;
  }

  return function(initial) {
    drawer(initial, widget, sandbox, template);
  };
}

$(function() {
  var frameSource = $("#frame").html();
  frame = Handlebars.compile(frameSource);

  $.getJSON('config.json', function(data) {
    $('title').text(data.title);

    $.each(data.widgets, function(i, widget) {
      initWidget(widget);
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
  image: function(initial, widget, sandbox, template) {
    if (initial) {
      defaultDrawer(initial, widget, sandbox, template);
    }
    sandbox.find('img').attr('src', widget.url + '?' + Date.now());
  },

  clock: function(initial, widget, sandbox, template) {
    now = new Date();
    sandbox.html(template({
      hours: zeroPad(now.getHours()),
      minutes: zeroPad(now.getMinutes()),
      weekday: weekdays[now.getDay() - 1],
      date: zeroPad(now.getDate()),
      month: zeroPad(now.getMonth() + 1)
    }));
  }
};

