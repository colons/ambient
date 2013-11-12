#!/usr/bin/env python


def generate(conf):
    print conf


if __name__ == "__main__":
    import json
    from sys import argv

    conf_path = argv[-1]
    conf_file = open(conf_path)
    conf = json.load(conf_file)
    conf_file.close()

    generate(conf)
