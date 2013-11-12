$(function() {
  var frameSource = $("#frame").html();
  var frame = Handlebars.compile(frameSource);

  $.getJSON('config.json', function(data) {
    $('title').text(data.title);

    $.each(data.widgets, function(i, widget) {
      var source = $("#type-" + widget.type).html();
      var template = Handlebars.compile(source);
      unframed = new Handlebars.SafeString(template(widget));
      $('#widgets').append(frame({unframed: unframed, widget: widget}));

      var element = $('#widgets > :last-child');
      element.addClass(widget.type);

      var content = element.find('> :last-child');
      content.addClass('content');

      if (widget.reload !== undefined) {
        setInterval(function() {element.html(element.html());}, widget.reload);
      }

      $.each(['width', 'height'], function(i, key) {
        var value = widget[key];
        if (value !== undefined) { 
          content.css(key, widget[key]);
        }
      });
    });
  });
});
