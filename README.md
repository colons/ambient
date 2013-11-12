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

## Notes on configuring

Names are optional, but space is always made for headings above widgets in
order to keep alignment consistent. Width and height, if specified, will be
applied to the widget, otherwise they'll be left default.
