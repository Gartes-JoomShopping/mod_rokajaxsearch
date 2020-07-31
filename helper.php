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

defined('_JEXEC') or die('Restricted access');
/**
 * @package RocketTheme
 * @subpackage rokajaxsearch
 */
class modRokajaxsearchHelper {
	
	/**
	 * modRokajaxsearchHelper constructor.
	 * @since 3.9
	 */
	public function __construct ()
	{
		$app = \Joomla\CMS\Factory::getApplication();
		$app->input->get('modRokajaxsearchHelper' , 0 , 'INT');
		if( $app->input->get('modRokajaxsearchHelper' , 0 , 'INT') )
		{
			return ;
		}#END IF
		JLoader::registerNamespace( 'GNZ11' , JPATH_LIBRARIES . '/GNZ11' , $reset = false , $prepend = false , $type = 'psr4' );
		GNZ11\Core\Js::instance();


		$doc = \Joomla\CMS\Factory::getDocument();
		$uri = \Joomla\CMS\Uri\Uri::getInstance( $uri = 'SERVER' );


		$root = $uri->root($pathonly = false, $path = null);
		$doc->addScriptDeclaration('
			window.CoreGnz11= window.CoreGnz11 || {};
			window.CoreGnz11.SiteUrl = "'.$root .'";
			console.log(window.CoreGnz11);
		');
		$app->input->set('modRokajaxsearchHelper' , 1 );
		
	}
	
	function inizialize( $css_style, $offset, &$params){

	    $theme = $params->get('theme', 'blue');

        JHtml::_('behavior.framework', true);
		$doc = JFactory::getDocument();

		$doc->addScriptOptions('siteUrlsiteUrl'  , JURI::base(true) ) ;
		
		
        $helper = new modRokajaxsearchHelper();
		$css = $helper->getCSSPath('rokajaxsearch.css', 'mod_rokajaxsearch');
		$iebrowser = $helper->getBrowser();

		if($css_style == 1 && $css != false) {
			$doc->addStyleSheet($css);
			$doc->addStyleSheet(JURI::root(true) ."/modules/mod_rokajaxsearch/themes/$theme/rokajaxsearch-theme.css");

			if ($iebrowser) {
				$style = JURI::root(true) ."/modules/mod_rokajaxsearch/themes/$theme/rokajaxsearch-theme-ie$iebrowser";
				$check = dirname(__FILE__)."/themes/$theme/rokajaxsearch-theme-ie$iebrowser";

				if (file_exists($check.".css")) $doc->addStyleSheet($style.".css");
				elseif (file_exists($check.".php")) $doc->addStyleSheet($style.".php");
			}

		}






		$doc->addScript(JURI::root(true) ."/modules/mod_rokajaxsearch/js/rokajaxsearch.js?v_3.0.6");


		
		$Link = JURI::base(true).'/modules/mod_rokajaxsearch/assets/js/mod_rokajaxsearch.drive.js' ;
		$this->_addScript( $Link );
		$this->_addStyleDeclaration();
		
		
		
		
		
		/* RokAjaxSearch Init */
		$websearch = ($params->get('websearch', 0)) ? 1 : 0;
		$blogsearch = ($params->get('blogsearch', 0)) ? 1 : 0;
		$imagesearch = ($params->get('imagesearch', 0)) ? 1 : 0;
		$videosearch = ($params->get('videosearch', 0)) ? 1 : 0;
		$ras_init = "window.addEvent((window.webkit) ? 'load' : 'domready', function() {
				window.rokajaxsearch = new RokAjaxSearch({
					'results': '".JText::_('RESULTS')."',
					'close': '',
					'websearch': ".$websearch.",
					'blogsearch': ".$blogsearch.",
					'imagesearch': ".$imagesearch.",
					'videosearch': ".$videosearch.",
					'imagesize': '".$params->get('image_size', 'MEDIUM')."',
					'safesearch': '".$params->get('safesearch', 'MODERATE')."',
					'search': '".JText::_('SEARCH')."',
					'readmore': '".JText::_('READMORE')."',
					'noresults': '".JText::_('NORESULTS')."',
					'advsearch': '".JText::_('ADVSEARCH')."',
					'page': '".JText::_('PAGE')."',
					'page_of': '".JText::_('PAGE_OF')."',
					'searchlink': '".JRoute::_(JURI::Base().htmlentities($params->get('search_page')), true)."',
					'advsearchlink': '".JRoute::_(JURI::Base().htmlentities($params->get('adv_search_page')), true)."',
					'uribase': '".JRoute::_(JURI::Base(), true)."',
					'limit': '".$params->get('limit', '10')."',
					'perpage': '".$params->get('perpage', '3')."',
					'ordering': '".$params->get('ordering', 'newest')."',
					'phrase': '".$params->get('searchphrase', 'any')."',
					'hidedivs': '".$params->get('hide_divs', '')."',
					'includelink': ".$params->get('include_link', 1).",
					'viewall': '".JText::_('VIEWALL')."',
					'estimated': '".JText::_('ESTIMATED')."',
					'showestimated': ".$params->get('show_estimated', 1).",
					'showpagination': ".$params->get('show_pagination', 1).",
					'showcategory': ".$params->get('include_category', 1).",
					'showreadmore': ".$params->get('show_readmore', 1).",
					'showdescription': ".$params->get('show_description', 1)."
				});
			});";
		$doc->addScriptDeclaration($ras_init);


		/* Google API */
		if ($params->get('websearch', 0) == 1 && $params->get('websearch_api') != '') {
			$doc->addScript("http://www.google.com/jsapi?key=".$params->get('websearch_api'));
			$doc->addScriptDeclaration("google.load('search', '1.0', {nocss: true});");
		}
	}

    public static function getCSSPath($cssfile, $module) {

		$tPath = 'templates/'.JFactory::getApplication()->getTemplate().'/css/' . $cssfile . '-disabled';
		$bPath = 'modules/'.$module.'/css/' . $cssfile;

		// If the template is asking for it,
		// don't include default rokajaxsearch css
		if (!file_exists(JPATH_BASE.'/'.$tPath)) {
			return JURI::root(true) .'/'.$bPath;
		} else {
			return false;
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

    /*
     * Добавить стили поля поиска в хедер !
     */
    private function  _addStyleDeclaration(){
		$doc = JFactory::getDocument();
		$doc->addStyleDeclaration('
			#roksearch_search_str {
    box-sizing: border-box;
    border: 1px solid #ff7800;
    height: 44px;
    color: #000000;
    margin: 0 auto;
    padding: 0 55px 0 10px;
    vertical-align: middle;
    width: 100%;
    background-color: #fff;
}
#roksearch_search_str::placeholder {
    color: #aba8a8;
}

#rokajaxsearch-icon {
    position: absolute;
    top: 2px;
    right: 1px;
    /* width: 44px; */
    cursor: pointer;
}
.search-form__icon {
    position: relative;
    display: none;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: none;
    background: #fff;
}
.search-form__icon svg {
    fill: #ff7700;
}
.search-form__icon:hover svg {
    fill: #df182b;
}
@media (min-width: 768px)
{
  .search-form__icon {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    }
}

.search-form__icon:before {
    position: absolute;
    left: -2px;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    height: 30px;
    border-left: 2px solid #e9e9e9;
    content: "";
}
button.search-form__microphone.speechRecognition{
    position:absolute;
    top: 2px;
    right: 42px;
}
button.search-form__microphone.speechRecognition:before{

border-left: 2px solid #e9e9e9;
}
button.search-form__microphone.speechRecognition svg {
    fill: #0052b9;
}
button.search-form__microphone.speechRecognition:hover svg {
    fill: #ff7878;
}
		');
//	    echo'<pre>';print_r( $doc );echo'</pre>'.__FILE__.' '.__LINE__;
//	    die(__FILE__ .' '. __LINE__ );
		
    }
    
    private function _addScript( $Link = null , $value = null , $async = 1  ){
	   if( !$Link && !$value  ) return false ;  #END IF
	    $dom = new \GNZ11\Document\Dom();
	    $script = $dom->createElement ( 'script', $value  ) ;
	    $dom::fetchAttr($dom ,$script , ['src'=>$Link , 'async'=>$async ] );
	    $dom->appendChild($script);
	    echo  $dom->saveHTML() ;
	   
    }
    
}
