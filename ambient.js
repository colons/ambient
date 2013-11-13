$(function() {
  var frameSource = $("#frame").html();
  var frame = Handlebars.compile(frameSource);

  $.getJSON('config.json', function(data) {
    $('title').text(data.title);

    $.each(data.widgets, function(i, widget) {
      var unframed;

      if (widget.type === "raw") {
        unframed = new Handlebars.SafeString(widget.content);
      } else {
        var source = $("#type-" + widget.type).html();
        var template = Handlebars.compile(source);
        unframed = new Handlebars.SafeString(template(widget));
      }

      $('#widgets').append(frame({unframed: unframed, widget: widget}));

      var element = $('#widgets > :last-child');
      element.addClass(widget.type);

      var content = element.find('> :last-child');
      content.addClass('content');

      var reload;

      switch (widget.type) {
        case 'image':
          var originalSrc = content.attr('src');
          reload = function() { content.attr('src', originalSrc + '?' + Date.now()); };
          break;
        default:
          reload = function() { element.html(element.html()); };
      }
      

      if (widget.reload !== undefined) {
        setInterval(reload, widget.reload);
      }

      if (widget.id !== undefined) {
        element.attr('id', widget.id);
      }

      $.each(['style', 'script'], function(i, attr) {
        if (widget[attr] !== undefined) {
          var element = document.createElement(attr);
          $(element).text(widget[attr]);
          $('head').append(element);
        }
      });

      $.each(['width', 'height'], function(i, key) {
        var value = widget[key];
        if (value !== undefined) {
          content.css(key, widget[key]);
        }
      });
    });
  });
});
