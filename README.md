# Ambient

A trivial [Status Board](http://www.panic.com/statusboard/) ripoff. Example
setup, using the config in this repository, [here](http://colons.co/ambient/).

## Requirements

- A webserver that can serve files from a directory
- A browser that supports flexbox and, ideally, can go fullscreen with all its
  UI hidden (I currently target Chrome, other browsers may break)

## Setup

- Clone the repository
- Copy config.example.json to config.json and season to taste
- Point your browser at a webserver hosting the directory you cloned to

## Notes

Widget names are optional, but space is always made for headings above widgets
in order to keep alignment consistent. Width and height, if specified, will be
applied to the widget, otherwise they'll be left default.

You probably don't want your instance to be public, so you can easily get away
with just running `python -m SimpleHTTPServer` from the repository and visiting
localhost:8000 in your browser. You can then kill the server, as it will not be
needed until you update your config or need to reload for some other reason.

If you want custom CSS to override something in an iframe or make the page look
all metal or something and don't want a dirty working branch, put it in a file
called custom.css and it will load.
