var widgetIndex;

if (document.location.hash) {
  widgetIndex = parseInt(document.location.hash.slice(1), 10);
}

var globalConfig;

function complainAboutSomethingBeingBroken(string) {
  console.log(string);
}

$(document).ajaxError(function(ev, xhr, settings) {
  complainAboutSomethingBeingBroken('Error loading ' + settings.url);
});

function Widget(config) {
  var widget = this;

  widget.config = config;

  var templateSource = $('#widget-' + config.type).html();
  widget.template = new Handlebars.compile(templateSource);
  widget.drawer = getDrawer(widget);
  document.body.classList.add('widget');
  document.body.classList.add(config.type);

  if (config.id !== undefined) {
    widget.element.attr('id', config.id);
  }

  if (config.scale !== undefined) {
    $(document.body).css('font-size', config.scale.toString() + 'em');
  }

  widget.drawer();
}

function defaultDrawer(widget, context) {
  console.log('drawing ' + widget.config.type);
  if (context === undefined) {
    context = {};
  }
  context.widget = widget;
  $(document.body).html(widget.template(context));
}

function getDrawer(widget) {
  var drawer;

  if (widget.config.type in drawers) {
    drawer = drawers[widget.config.type];
  } else {
    drawer = defaultDrawer;
  }

  return function() {
    drawer(widget);
  };
}

function manageWidget(index) {
  var config = globalConfig.widgets[index];
  var element = document.getElementById('widget-' + index.toString());

  $.each(['width', 'height'], function(i, key) {
    var value = config[key];
    if (value !== undefined) {
      $(element).css(key, value);
    }
  });

  if (config.height === undefined) {
    $(element).load(function() {
      // give it a chance to actually show the image
      setTimeout(function() {
        var body = element.contentWindow.document.body;
        $(element).height(body.scrollHeight);
      }, 1000);
    });
  }

  if (config.reload !== undefined) {
    console.log(config);
    setInterval(function() {
      element.contentDocument.location.reload(true);
    }, config.reload);
  }
}

$(function() {
  var frameSource = $("#frames").html();
  var frames = Handlebars.compile(frameSource);

  $.getJSON('config.json', function(data) {
    globalConfig = data;
    $('title').text(data.title);

    if (widgetIndex === undefined) {
      // this is the root page, we should draw templates
      document.body.classList.add('primary');
      $(document.body).html(frames(data));
      for (var i = 0; i < data.widgets.length; i++) {
        manageWidget(i);
      }
    } else {
      // this is a particular widget that we should draw
      new Widget(data.widgets[widgetIndex]);
    }
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

function colorFromSeed(seed) {
  function twoFiftySix() {
    seed = parseInt(Math.sin(seed).toString().substr(9), 10);
    return (seed % 256).toFixed();
  }
  var rgbstr = 'rgb(' + twoFiftySix() + ',' + twoFiftySix() + ',' + twoFiftySix() + ')';
  return rgbstr;
}

function getTrelloLists(board, callback) {
  var trelloArgs = $.extend({
    lists: 'open',
    cards: 'open'
  }, globalConfig.trelloAuth);

  var url = '//api.trello.com/1/boards/' + board + '/lists?' + $.param(trelloArgs);

  $.getJSON(url, function(data) {
    callback(data);
  });
}

// the actual widgets
var drawers = {
  image: function(widget) {
    defaultDrawer(widget);

    var sep;

    if (widget.config.url.indexOf('?') !== -1) {
        sep = '&';
    } else {
        sep = '?';
    }

    var src = widget.config.url + sep + 'ambient_timestamp=' + Date.now().toString();

    $(document.body).find('img').attr('src', src);
  },

  clock: function(widget) {
    now = new Date();
    $(document.body).html(widget.template({
      hours: zeroPad(now.getHours()),
      minutes: zeroPad(now.getMinutes()),
      weekday: weekdays[now.getDay() - 1],
      date: zeroPad(now.getDate()),
      month: zeroPad(now.getMonth() + 1)
    }));
  },

  forecast: function(widget) {
    var baseURL = 'http://api.forecast.io/forecast/' + globalConfig.forecastAPIKey + '/';
    $.getJSON(baseURL + widget.config.location + '?units=auto', function(data) {
      data.currently.temperature = data.currently.temperature.toFixed(0);
      defaultDrawer(widget, data);
    });
  },

  jenkins: function(widget) {
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
      defaultDrawer(widget, {jobs: jobs});
    });
  },

  trello: function(widget) {
    getTrelloLists(widget.config.board, function(lists) {
      $.each(lists, function(listIndex, list) {
        $.each(list.cards, function(cardIndex, card) {
          if (card.idMembers.length > 0) {
            card.color = (globalConfig.trelloColors !== undefined && globalConfig.trelloColors[card.idMembers[0]]) || colorFromSeed(parseInt(card.idMembers[0], 16));
          } else {
            card.color = null;
          }
        });
      });

      defaultDrawer(widget, {lists: lists});
    });
  }
};
