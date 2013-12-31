var globalConfig;

function Widget(config, container, frame) {
  var widget = this;

  widget.config = config;

  var templateSource = $('#widget-' + config.type).html();
  widget.template = new Handlebars.compile(templateSource);

  container.append(frame({widget: widget}));

  widget.element = container.find('> :last-child');
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
    context = {};
  }
  context.widget = widget;
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
  var nestedFrameSource = $("#nested-frame").html();
  nestedFrame = Handlebars.compile(nestedFrameSource);

  $.getJSON('config.json', function(data) {
    globalConfig = data;
    $('title').text(data.title);
    var widgetsElement = $('#widgets');

    $.each(data.widgets, function(i, widgetConfig) {
      if ($.isArray(widgetConfig)) {
        widgetsElement.append(nestedFrame());
        var container = widgetsElement.find(':last-child');

        $.each(widgetConfig, function(i, nestedWidgetConfig) {
            new Widget(nestedWidgetConfig, container, frame);
        });
      } else {
        new Widget(widgetConfig, widgetsElement, frame);
      }
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

function getTrelloLists(board, callback) {
  var trelloArgs = $.extend({
    lists: 'open',
    cards: 'open'
  }, globalConfig.trelloAuth);

  var url = '//api.trello.com/1/boards/' + board + '/lists?' + $.param(trelloArgs);
  console.log(url);

  $.getJSON(url, function(data) {
    console.log(data);
    callback(data);
  });
}

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
    var exclude = [];

    if (widget.config.exclude !== undefined) {
      exclude = widget.config.exclude;
    }

    $.getJSON(widget.config.url, function(data) {
      var jobs = [];
      $.each(data.jobs, function(i, job) {
        if ($.inArray(job.name, exclude) === -1) {
          jobs.push(job);
        }
      });
      defaultDrawer(initial, widget, {jobs: jobs});
    });
  },

  trello: function(initial, widget) {
    getTrelloLists(widget.config.board, function(lists) {
      defaultDrawer(initial, widget, {lists: lists});
    });
  }
};

