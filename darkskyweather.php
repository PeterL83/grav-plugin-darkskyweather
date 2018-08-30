<?php
namespace Grav\Plugin;

use Grav\Common\Plugin;
use RocketTheme\Toolbox\Event\Event;

/**
 * Class DarkSkyWeatherPlugin
 * @package Grav\Plugin
 */
class DarkSkyWeatherPlugin extends Plugin
{
    /**
     * @return array
     *
     * The getSubscribedEvents() gives the core a list of events
     *     that the plugin wants to listen to. The key of each
     *     array section is the event that the plugin listens to
     *     and the value (in the form of an array) contains the
     *     callable (or function) as well as the priority. The
     *     higher the number the higher the priority.
     */
    public static function getSubscribedEvents()
    {
        return [
            'onPluginsInitialized' => ['onPluginsInitialized', 0],
            'onTwigTemplatePaths' => ['onTwigTemplatePaths', 0],
            'onGetPageTemplates' => ['onGetPageTemplates', 0]
        ];
    }

    public function onTwigTemplatePaths()
    {
        $this->grav['twig']->twig_paths[] = __DIR__ . '/templates';
    }

    public function onGetPageTemplates(Event $event)
    {
        $types = $event->types;
        $types->scanTemplates('plugins://darkskyweather/templates');
    }

    public function onPluginsInitialized()
    {
        if ($this->isAdmin()) {
            return;
        }
			$this->enable([
				'onTwigSiteVariables' => ['onTwigSiteVariables', 0]
			]);
    }

    public function onTwigSiteVariables()
    {
        if ($this->config->get('plugins.darkskyweather.built_in_css')) {
            $this->grav['assets']->add('plugin://darkskyweather/css/darkskyweather.css');
        }

        if ($this->config->get('plugins.darkskyweather.built_in_js')) {
            $this->grav['assets']->addJs('plugin://darkskyweather/js/darkskyweather.js');
        }

		$this->apikey = 'k="' . ($this->config->get('plugins.darkskyweather.api_key')) . '";';
		$this->latitude = 'lat="' . ($this->config->get('plugins.darkskyweather.latitude')) . '";';
		$this->longitude = 'lon="' . ($this->config->get('plugins.darkskyweather.longitude')) . '";';
		$this->refreshtime = 'refreshTime="' . ($this->config->get('plugins.darkskyweather.refreshtime')) . '";';
		$this->lang = 'lang="'.$this->grav['language']->getActive().'";';
		$this->weekday = 'weekday=["'.$this->grav['language']->translateArray('DAYS_OF_THE_WEEK', 6).'",';
		for ($this->i = 0; $this->i < 5; $this->i++) {
			$this->weekday = $this->weekday.'"'.$this->grav['language']->translateArray('DAYS_OF_THE_WEEK', $this->i).'",';
		}
		$this->weekday = $this->weekday.'"'.$this->grav['language']->translateArray('DAYS_OF_THE_WEEK', 5).'"];';

		$this->winddirect = 'windDirection=[';
        for ($this->i = 0; $this->i < 15; $this->i++) {
			$this->winddirect = $this->winddirect.'"'.$this->grav['language']->translateArray('WEATHER_CONFIG.WINDDIRECTION', $this->i).'",';
		}
		$this->winddirect = $this->winddirect.'"'.$this->grav['language']->translateArray('WEATHER_CONFIG.WINDDIRECTION', 15).'"];';

        $this->grav['assets']->addInlineJs(
			$this->latitude.
			$this->longitude.
            $this->winddirect.
			$this->refreshtime.
			$this->apikey.
			$this->lang.
			$this->weekday
		);
    }
}

