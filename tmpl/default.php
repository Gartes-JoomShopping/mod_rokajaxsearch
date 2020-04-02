<?php
	/**
	 * RokAjaxSearch Module
	 *
	 * @package   RocketTheme
	 * @version   2.0.3 May 2, 2014
	 * @author    RocketTheme http://www.rockettheme.com
	 * @copyright Copyright (C) 2007 - 2014 RocketTheme, LLC
	 * @license   http://www.gnu.org/licenses/gpl-2.0.html GNU/GPLv2 only
	 *
	 *
	 * Inspired on PixSearch Joomla! module by Henrik Hussfelt <henrik@pixpro.net>
	 */
	
	// no direct access
	defined( '_JEXEC' ) or die( 'Restricted access' );
	
	$websearch = ( $params->get( 'websearch', 0 ) ) ? 1 : 0;
	$blogsearch = ( $params->get( 'blogsearch', 0 ) ) ? 1 : 0;
	$imagesearch = ( $params->get( 'imagesearch', 0 ) ) ? 1 : 0;
	$videosearch = ( $params->get( 'videosearch', 0 ) ) ? 1 : 0;
	
	$theme = $params->get( 'theme', 'blue' );
	
	$api = ( $params->get( 'websearch_api' ) != '' );
	
	$app = JFactory::getApplication();
	$limit = $app->getUserStateFromRequest( 'com_search.limit', 'limit', $app->getCfg( 'list_limit' ), 'int' );
	
	$where = array();
	$user = JFactory::getUser();
	$groups = implode( ',', $user->getAuthorisedViewLevels() );
	$where[] = 'access IN (' . $groups . ')';
	$where[] = 'category_publish = 1';
	
	$db = JFactory::getDBO();
	$query = 'SELECT
       category_id,
       `name_ru-RU` as title
        FROM #__jshopping_categories
        WHERE category_id <> 857
          AND category_parent_id = 0
          AND ' . implode( ' AND ', $where ) . '
          ORDER BY ordering';
	$db->setQuery( $query );
	$categories = $db->loadObjectList();

?>
<svg style="display: none;">
    <defs id="symbols">
        
        <symbol viewBox="0 0 24 24" id="search-img">
            <g>
                <path clip-rule='evenodd' d='M10 2a8 8 0 1 0 4.906 14.32l5.387 5.387a1 1 0 0 0 1.414-1.414l-5.387-5.387A8 8 0 0 0 10 2zm-6 8a6 6 0 1 1 12 0 6 6 0 0 1-12 0z'/>
            </g>
        </symbol>
    </defs>
</svg>


<form name="rokajaxsearch" id="rokajaxsearch" class="<?php echo $theme; ?>" action="<?php echo JURI::Base() ?>"
      method="get">
    <div class="rokajaxsearch <?php echo $params->get( 'moduleclass_sfx' ); ?>">
        <div class="roksearch-wrapper"
             data-title="Если Вы скопировали название товара на сторонних ресурсах и хотите их найти на нашем сайте, то для вставки в строку поиска используйте вместо правой кнопки мыши комбинацию клавиш CTRL+V">
            <input id="roksearch_search_str" name="searchword" type="text" class="inputbox roksearch_search_str"
                   placeholder="<?php echo JText::_( 'SEARCH' ); ?>"/>
            <div id="rokajaxsearch-icon" class="search-form__icon">
                <svg _ngcontent-c65="" height="28" width="28"  >
                    <use _ngcontent-c65="" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#search-img"></use>
                </svg>
            </div>
            <div class="rok_search_category">
                <input type="hidden" name="category_id" id="category_id" value=""/>
            </div>
        </div>
        
        <input type="hidden" name="searchphrase" value="<?php echo $params->get( "searchphrase" ) ?>"/>
        <input type="hidden" name="limit" value="<?php echo $limit; ?>"/>
        <input type="hidden" name="start" value="0"/>
        <input type="hidden" name="ordering" value="<?php echo $params->get( "ordering" ) ?>"/>
        <input type="hidden" name="view" value="search"/>
        <input type="hidden" name="option" value="com_search"/>
		
		<?php if( ( $websearch || $blogsearch || $imagesearch || $videosearch ) && $api ): ?>
            <div class="search_options">
                <label style="float: left; margin-right: 8px">
                    <input type="radio" name="search_option[]" value="local"
                           checked="checked"/><?php echo JText::_( 'LOCAL_SEARCH' ); ?>
                </label>
				
				<?php if( $websearch ): ?>
                    <label style="float: left;">
                        <input type="radio" name="search_option[]" value="web"/><?php echo JText::_( 'WEB_SEARCH' ); ?>
                    </label>
				<?php endif; ?>
				
				<?php if( $blogsearch ): ?>
                    <label style="float: left;">
                        <input type="radio" name="search_option[]"
                               value="blog"/><?php echo JText::_( 'BLOG_SEARCH' ); ?>
                    </label>
				<?php endif; ?>
				
				<?php if( $imagesearch ): ?>
                    <label style="float: left;">
                        <input type="radio" name="search_option[]"
                               value="images"/><?php echo JText::_( 'IMAGE_SEARCH' ); ?>
                    </label>
				<?php endif; ?>
				
				<?php if( $videosearch ): ?>
                    <label style="float: left;">
                        <input type="radio" name="search_option[]"
                               value="videos"/><?php echo JText::_( 'VIDEO_SEARCH' ); ?>
                    </label>
				<?php endif; ?>
            </div>
            <div class="clr"></div>
		<?php endif; ?>

        <div id="roksearch_results"></div>
    </div>
    <div id="rokajaxsearch_tmp" style="visibility:hidden;display:none;"></div>
</form>
