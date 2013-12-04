# Ambient

![A television on a wall running an Ambient instance][instance]

A trivial [Status Board][panic] ripoff. Pictured above is the instance that
runs in the office at [@rkhleics][rkh], and the example config in this repository is
demonstrated [here][demo].

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

Widget names are optional, but space is always made for headings above widgets
in order to keep alignment consistent. `"width"` and `"height"`, if specified,
will be applied to the widget, otherwise they'll be left default.

You can provide custom JS and custom CSS in custom.js and custom.css files in
the project root.  You'll stop getting warnings in your console about 404s that
way, too.

[instance]: https://raw.github.com/colons/ambient/master/instance.jpg
[panic]: http://www.panic.com/statusboard/
[rkh]: https://github.com/rkhleics
[demo]: http://colons.co/ambient/
