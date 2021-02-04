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

/* @var $params Joomla\Registry\Registry Object */
$__v = '?v='.$params->get('__v' , '1.1.9');
if ( $params->get('development_on' ,  false ) ) $__v = null;  #END IF
if (!defined('MOD_ROKAJAXSEARCH_VERSION')) define('MOD_ROKAJAXSEARCH_VERSION', $__v );

JLoader::registerNamespace( 'GNZ11' , JPATH_LIBRARIES . '/GNZ11' , $reset = false , $prepend = false , $type = 'psr4' );






require_once( dirname( __FILE__ ) . '/helper.php' );
$helper = new modRokajaxsearchHelper();

/**
 * Добавить языковой файл для удаления - перед обновлением модуля
 */
/* $pathFileJson = '/modules/mod_rokajaxsearch/assets/files' ;
$arrFiles = [
    # Файлы которые удалить при обновлени
    # Указываем путь от корня сайта
    'DelFiles' => [
        '/language/en-GB/en-GB.mod_rokajaxsearch.ini' ,
    ],
    'IncludeFiles' => [
//        'https://gist.github.com/gartes/046f0f4a6dae64465060cecaaa0ee83f/raw/06da6a55c06b56456cc853eccaa25d41daf696fe/correcting.php'

//        '/tmp/correcting.php'
    ]
];
\GNZ11\Extensions\ScriptFile::addFilesToUpdateExt( $pathFileJson , $arrFiles) ;*/
/**
 * @var $params object Настройки модуля
 */
$css_style = $params->get('include_css') ;
$offset = $params->get('offset_search_result') ;
$helper->inizialize( $css_style , $offset , $params);

require(JModuleHelper::getLayoutPath('mod_rokajaxsearch'));