# DarkSky Weather Plugin

The **DarkSky Weather** Plugin is for [Grav CMS](http://github.com/getgrav/grav). DarkSky Weather Plugin (Forecast.io) is a weather plugin based on data from the forecast.io API. It uses Javascript. It does not use PHP proxies.

## Installation

Installing the DarkSky Weather plugin can be done in one of two ways. The GPM (Grav Package Manager) installation method enables you to quickly and easily install the plugin with a simple terminal command, while the manual method enables you to do so via a zip file.

### GPM Installation (Preferred)

The simplest way to install this plugin is via the [Grav Package Manager (GPM)](http://learn.getgrav.org/advanced/grav-gpm) through your system's terminal (also called the command line).  From the root of your Grav install type:

    bin/gpm install darkskyweather

This will install the DarkSky Weather plugin into your `/user/plugins` directory within Grav. Its files can be found under `/your/site/grav/user/plugins/darkskyweather`.

### Manual Installation

To install this plugin, just download the zip version of this repository and unzip it under `/your/site/grav/user/plugins`. Then, rename the folder to `darkskyweather`. You can find these files on [GitHub](https://github.com/PeterL83/grav-plugin-darkskyweather) or via [GetGrav.org](http://getgrav.org/downloads/plugins#extras).

You should now have all the plugin files under

    /your/site/grav/user/plugins/darkskyweather

> NOTE: This plugin is a modular component for Grav which requires [Grav](http://github.com/getgrav/grav) and the [Error](https://github.com/getgrav/grav-plugin-error) and [Problems](https://github.com/getgrav/grav-plugin-problems) to operate.

### Admin Plugin

If you use the admin plugin, you can install directly through the admin plugin by browsing the `Plugins` tab and clicking on the `Add` button.

## Requirements

- API key from [DarkSky](https://darksky.net) ([forecast.io](https://forecast.io))

## Configuration

Before configuring this plugin, you should copy the `user/plugins/darkskyweather/darkskyweather.yaml` to `user/config/plugins/darkskyweather.yaml` and only edit that copy.

Here is the default configuration and an explanation of available options:

```yaml
enabled: true
built_in_css: true
built_in_js: true
caption: Weather
refreshtime: 60
```

Needed to set in Plugin Admin configuration:
- your API key
- coordinates of your location

Optional options:
- caption of widget
- refresh time of widget weather

Note that if you use the admin plugin, a file with your configuration, and named darkskyweather.yaml will be saved in the `user/config/plugins/` folder once the configuration is saved in the admin.

## Usage

DarkSky Weather Plugin contains two parts:
- widget
- full page with weather for 7 days

You can add the widget into your theme (sidebar for example) by using twig.
```
{% include 'partials/weather-widget.html.twig' %}
```

You can also use full page with weather for 7 days. You have to add new page using template called "weather".


## Credits

Thanks for [VClouds Weather Icons©](http://vclouds.deviantart.com/gallery/#/d2ynulp)

## To Do

- [ ] Later...


