<?php
/**
 * RokAjaxSearch Module
 *
 * @package RocketTheme
 * @subpackage rokajaxsearch
 * @version   2.0.3 May 2, 2014
 * @author    RocketTheme http://www.rockettheme.com
 * @copyright Copyright (C) 2007 - 2014 RocketTheme, LLC
 * @license   http://www.gnu.org/licenses/gpl-2.0.html GNU/GPLv2 only
 *
 *
 * Inspired on PixSearch Joomla! module by Henrik Hussfelt <henrik@pixpro.net>
 */

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Uri\Uri;

defined('_JEXEC') or die('Restricted access');
/**
 * @package RocketTheme
 * @subpackage rokajaxsearch
 */
class modRokajaxsearchHelper {
    /**
     * @var object параметры модуля
     * @since 3.9
     */
    private $params;

    /**
     * modRokajaxsearchHelper constructor.
     * @param bool|object $params
     * @throws Exception
     * @since 3.9
     */
	public function __construct ( $params = false )
	{
	    $this->params = $params ;
	    
	    $app = Factory::getApplication();
		$app->input->get('modRokajaxsearchHelper' , 0 , 'INT');

		if( $app->input->get('modRokajaxsearchHelper' , 0 , 'INT') )
		{
			return ;
		}#END IF
		JLoader::registerNamespace( 'GNZ11' , JPATH_LIBRARIES . '/GNZ11' , $reset = false , $prepend = false , $type = 'psr4' );
		GNZ11\Core\Js::instance();

        $this->getVersion();

		$doc = Factory::getDocument();
		$uri = Uri::getInstance( $uri = 'SERVER' );


		$root = $uri->root($pathonly = false, $path = null);
		$doc->addScriptDeclaration('
			window.CoreGnz11= window.CoreGnz11 || {};
			window.CoreGnz11.SiteUrl = "'.$root .'";
		');
		$app->input->set('modRokajaxsearchHelper' , 1 );
		
	}

    /**
     *
     * @param $css_style
     * @param $offset
     * @param $params object Настройки модуля
     * @throws Exception
     * @since 3.9
     * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date 28.08.2020 01:32
     */
	function inizialize($css_style, $offset, object &$params){







        $doc = Factory::getDocument();
        $helper = new modRokajaxsearchHelper( $params );



        $iebrowser = $helper->getBrowser();


        # Тема стиля
	    $theme = $params->get('theme', 'blue');
	    # Оптимизированная загрузка CSS
        $optimization_load_css = $params->get( 'optimization_load_css' , 1 );


        $cssRootPath =   Uri::root().'modules/mod_rokajaxsearch/css/rokajaxsearch.css' . MOD_ROKAJAXSEARCH_VERSION;
        # Если Загружать стили модуля === НЕТ то подключить файл из шаблона
        if( !$params->get('include_css', true ) )
        {
            $cssRootPath = Uri::root().'templates/' . Factory::getApplication()->getTemplate() . '/css/rokajaxsearch.css';
        }#END IF





        if( $css_style == 1 )
        {
            if( !$optimization_load_css )
            {
                $doc->addStyleSheet( $cssRootPath );
                $doc->addStyleSheet( Uri::root() . "modules/mod_rokajaxsearch/themes/$theme/rokajaxsearch-theme.css" . MOD_ROKAJAXSEARCH_VERSION);
            }#END IF

            # Подключаем критические стили
            $criticalPathCss = Uri::root() . 'modules/mod_rokajaxsearch/assets/css/rokajaxsearch-critical.css' . MOD_ROKAJAXSEARCH_VERSION ;
            if ($params->get('compres_critical_css', true ))
            {
                $criticalPathCss = Uri::root() . 'modules/mod_rokajaxsearch/assets/css/rokajaxsearch-critical.min.css' . MOD_ROKAJAXSEARCH_VERSION;
            }#END IF

//            $paramsLoadCss = [
//                # Показывать в стилях комментарий из какого файла взяты стили
//                'debug' => $optimization_load_css && $params->get('show_commetn_critical_css' , false),
//                # Загружать как файл CSS - Если отключена оптимизация
//                'asFile'=> ( !$optimization_load_css ? true : false ) ,
//            ] ;
//            \GNZ11\Document\Document::addIncludeStyleDeclaration( $criticalPathCss , $paramsLoadCss );
            $doc->addStyleSheet( $criticalPathCss );

            if( $iebrowser )
            {
                $style =   "/modules/mod_rokajaxsearch/themes/$theme/rokajaxsearch-theme-ie$iebrowser";
                $check = dirname(__FILE__) . "/themes/$theme/rokajaxsearch-theme-ie$iebrowser";

                if( file_exists($check . ".css") )
                    $doc->addStyleSheet($style . ".css");
                elseif( file_exists($check . ".php") )
                    $doc->addStyleSheet($style . ".php");
            }
        }

        /* RokAjaxSearch Init */
		$paramsJs = [
		    # Оптимизарованая загрузка CSS
		    'optimization_load_css' => $optimization_load_css ,
            # Количество символов до которого поиск вести по словарю
            'minLengthWordSearchInDic' => 2 ,

		    'RokajaxsearchDrive' =>  Uri::base(true).'/modules/mod_rokajaxsearch/assets/js/mod_rokajaxsearch.drive.js' ,
            '__v' =>   MOD_ROKAJAXSEARCH_VERSION  ,
            'siteUrlsiteUrl' =>   Uri::base(true)  ,
            'selectors' => [
                'searchIcon' => '#rokajaxsearch-icon' ,
                'input' => '#roksearch_search_str'  ,
            ],
            'results'=> Text::_('RESULTS') ,
             'close' => '',
             'websearch' => ($params->get('websearch', 0)) ? 1 : 0,
             'blogsearch' => ($params->get('blogsearch', 0)) ? 1 : 0,
             'imagesearch' => ($params->get('imagesearch', 0)) ? 1 : 0,
             'videosearch' => ($params->get('videosearch', 0)) ? 1 : 0,
             'imagesize' => $params->get('image_size', 'MEDIUM'),
             'safesearch' => $params->get('safesearch', 'MODERATE'),
             'search' => Text::_('SEARCH'),
             'readmore' => Text::_('READMORE'),
             'noresults' => Text::_('NORESULTS'),
             'advsearch' => Text::_('ADVSEARCH'),
             'page' => Text::_('PAGE'),
             'page_of' => Text::_('PAGE_OF'),
             'searchlink' => JRoute::_(JURI::Base() . htmlentities($params->get('search_page')), true),
             'advsearchlink' => JRoute::_(JURI::Base() . htmlentities($params->get('adv_search_page')), true),
             'uribase' => JRoute::_(JURI::Base(), true),
             'limit' => $params->get('limit', '10'),
             'perpage' => $params->get('perpage', '3'),
            'ordering' => $params->get('ordering', 'newest'),
            // TODO Удалить после отключения rokajaxsearch.js
            'phrase' => $params->get('searchphrase', 'any'),
            'hidedivs' => $params->get('hide_divs', ''),
            'includelink' => $params->get('include_link', 1),
            'viewall' => JText::_('VIEWALL'),
            'estimated' => JText::_('ESTIMATED'),
            'showestimated' => $params->get('show_estimated', 1),
            'showpagination' => $params->get('show_pagination', 1),
            'showcategory' => $params->get('include_category', 1),
            'showreadmore' => $params->get('show_readmore', 1),
            'showdescription' => $params->get('show_description', 1),
        ];
        $doc->addScriptOptions('mod_rokajaxsearch' , $paramsJs ) ;
        $doc->addScriptOptions('siteUrlsiteUrl'  , Uri::base(true) ) ;

        $HtmlDocument = new \Joomla\CMS\Document\HtmlDocument();
//        $doc->addCustomTag('<link rel="preload" as="script" href="'.$paramsJs['RokajaxsearchDrive'].'?i='.MOD_ROKAJAXSEARCH_VERSION.'">');





		/* Google API */
		if ($params->get('websearch', 0) == 1 && $params->get('websearch_api') != '') {
			$doc->addScript("http://www.google.com/jsapi?key=".$params->get('websearch_api'));
			$doc->addScriptDeclaration("google.load('search', '1.0', {nocss: true});");
		}
	}



	public static function getBrowser()
	{
		$agent = ( isset( $_SERVER['HTTP_USER_AGENT'] ) ) ? strtolower( $_SERVER['HTTP_USER_AGENT'] ) : false;
		$ie_version = false;

		if (preg_match("/msie/", $agent) && !preg_match("/opera/", $agent)){
            $val = explode(" ",stristr($agent, "msie"));
            $ver = explode(".", $val[1]);
			$ie_version = $ver[0];
			$ie_version = preg_replace("#[^0-9,.,a-z,A-Z]#", "", $ie_version);
		}

		return $ie_version;
	}

	public static function _getJSVersion() {

        return "";
    }

	function getVersion(){
        if (!defined('MOD_ROKAJAXSEARCH_VERSION')){
            $xml_file = JPATH_ROOT . '/modules/mod_rokajaxsearch/mod_rokajaxsearch.xml';
            $dom = new DOMDocument("1.0", "utf-8");
            $dom->load($xml_file);
            $version = $dom->getElementsByTagName('version')->item(0)->textContent;
            define('MOD_ROKAJAXSEARCH_VERSION', $version );
        }
    }

    
}
