# Ambient

![A television on a wall running an Ambient instance][instance]

A trivial [Status Board][panic] ripoff. Pictured above is the instance that
runs in the office at [@rkhleics][rkh], and the example config in this repository is
demonstrated [here][demo].

Ambient provides basic widgets for embedding auto-refreshing images, iframes or
raw HTML as well as custom widgets designed to give quick, abstract summaries
of the state of things on a Trello board or a Jenkins server.

## Requirements

- A webserver that can serve files from a directory
- A browser that supports flexbox and, ideally, can go fullscreen with all its
  UI hidden (I currently target Chrome, other browsers may break)

## Setup

- Clone the repository
- Copy config.example.json to config.json and season to taste
- Make custom.css and custom.js files, if you so desire
- Point your browser at a webserver hosting the directory you cloned to

## Notes

You probably don't want your instance to be public, so you can easily get away
with just running `python -m SimpleHTTPServer` from the repository and visiting
localhost:8000 in your browser. You can then kill the server, as it will not be
needed until you update your config or need to reload for some other reason.

Widgets will appear as wrapped flexbox rows; they will be drawn from left to
right and wrap downwards. If you want to include two widgets directly on top of
each other, put them in an array nested inside the widgets array like the
clock and Jenkins widgets in the example config.

Widget names are optional, but space is always made for headings above widgets
in order to keep alignment consistent. `"width"` and `"height"`, if specified,
will be applied to the widget, otherwise they'll be left default.

You can provide custom JS and custom CSS in custom.js and custom.css files in
the project root.  You'll stop getting warnings in your console about 404s that
way, too.

The Jenkins widget violates CORS, so in order for it to work, you'll need to
somehow proxy your Jenkins API with a server that adds a
`Access-Control-Origin: *` header, configure Jenkins to serve that itself, or
[disable CORS checking][cors] in your browser. The latter is probably easiest.

The Trello widget, as well as violating CORS, requires authentication details.
You provide these in a `"trelloAuth"` attribute of your config. Each widget
also requires a `"board"` attribute. For example:

```json
{
  "title": "Ambient",
  "trelloAuth": {
    "key": "[applicationKey]",
    "token": "[userToken]"
  },
  "widgets": [
    {
      "type": "trello",
      "board": "[boardId]",
      "height": "300px",
      "scale": 0.7,
      "reload": 10000
    }
  ]
}
```

[instance]: https://raw.github.com/colons/ambient/master/instance.jpg
[panic]: http://www.panic.com/statusboard/
[rkh]: https://github.com/rkhleics
[demo]: http://colons.co/ambient/
[cors]: http://stackoverflow.com/questions/3102819/chrome-disable-same-origin-policy
