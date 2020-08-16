<?php
// No direct access to this file
use Joomla\CMS\Application\CMSApplication;
use Joomla\CMS\Factory;

defined('_JEXEC') or die;

/**
 * Script file of HelloWorld module
 *  @since 3.9
 */
class mod_rokajaxsearchInstallerScript
{
    /**
     * Метод установки расширения
     * $parent - это класс, вызывающий этот метод
     *
     * Method to install the extension
     * $parent is the class calling this method
     *
     * @return void
     *  @since 3.9
     */
    function install($parent)
    {
        echo '<p>The module has been installed.</p>';
    }

    /**
     * Метод удаления расширения
     * $parent - это класс, вызывающий этот метод
     *
     * Method to uninstall the extension
     * $parent is the class calling this method
     *
     * @return void
     *  @since 3.9
     */
    function uninstall($parent)
    {
        echo '<p>The module has been uninstalled.</p>';
    }

    /**
     * Метод обновления расширения
     * $parent - это класс, вызывающий этот метод
     *
     * Method to update the extension
     * $parent is the class calling this method
     *
     * @return void
     * @since 3.9
     */
    function update($parent)
    {
        echo '<p>Модуль обновлен до версии ' . $parent->get('manifest')->version . '.</p>';
    }

    /**
     * Метод, запускаемый перед методом install/update/uninstall method
     * $parent - это класс, вызывающий этот метод
     * $type - это тип изменения (установка, обновление или обнаружение_инсталляции)
     *
     * Method to run before an install/update/uninstall method
     * $parent is the class calling this method
     * $type is the type of change (install, update or discover_install)
     *
     * @return false
     * @since 3.9
     */
    function preflight($typeExt, $parent)
    {
        // manifest file version
        $this->release = $parent->get('manifest')->version;
        $this->minimum_version_gnz11 = (string)$parent->get('manifest')->version_gnz11 ;
        $VersionGnz11 = $this->getVersionGnz11();

         



        if ( version_compare( $VersionGnz11 , $this->minimum_version_gnz11  , '<') )
        {
            die(__FILE__ .' '. __LINE__ );
            # Выдать сообщение об ошибке и вернуть false
            # Throw some error message and return false
            Factory::getApplication('administrator')->enqueueMessage('Error msg' , 'error' ) ;

            return false;
            die(__FILE__ .' '. __LINE__ );
        }
        die(__FILE__ .' '. __LINE__ );
        
        # Отменить, если устанавливаемый модуль не новее, чем текущая установленная версия
        # Abort if the module being installed is not newer than the currently installed version
        if (strtolower($typeExt) === 'update')
        {
            $manifest   = $this->getItemArray( Factory::getDbo()->quote($this->extension));
            $oldRelease = $manifest['version'];

            # Кто-то пытается установить более раннюю версию, чем установлена сейчас
            # Someone is trying to install a lower version than is currently installed
            if (version_compare($this->release, $oldRelease, '<'))
            {
                # Выдать сообщение об ошибке и вернуть false
                # Throw some error message and return false
                JApplicationCms::getInstance('site')->enqueueMessage('Error msg' , 'error' ) ;

                return false;
            }

            # Устанавливаемая версия выше той, которая установлена в настоящее время
            # The version being installed is higher than what is currently installed
            if (version_compare($oldRelease, $this->release, '<'))
            {
                # Здесь вы можете выполнить функцию
                # You can execute a function here

                # Если вы хотите сравнить конкретную версию.
                # If you want to compare a specific version.
                if (version_compare($oldRelease, '2.0.0', '<='))
                {
                    # Функция обновления для версии 2.0.0
                    # Update function for version 2.0.0
                    # $this->updateToVersionTwo();
                }
            }
        }
        JLoader::registerNamespace( 'GNZ11' , JPATH_LIBRARIES . '/GNZ11' , $reset = false , $prepend = false , $type = 'psr4' );
        \GNZ11\Extensions\ScriptFile::updateProcedure($typeExt, $parent);
    }

    /**
     * Метод, запускаемый после метода install / update / uninstall
     * $parent - это класс, вызывающий этот метод
     * $type - это тип изменения (установка, обновление или discover_install)
     *
     * Method to run after an install/update/uninstall method
     * $parent is the class calling this method
     * $type is the type of change (install, update or discover_install)
     *
     * @return void
     *  @since 3.9
     */
    function postflight($type, $parent)
    {
//        echo '<p>Anything here happens after the installation/update/uninstallation of the module.</p>';
    }

    /**
     * Получить версию library Gnz11
     * @return mixed
     * @since 3.9
     */
    protected function getVersionGnz11(){
        $manifest   = $this->getItemArray( Factory::getDbo()->quote('GNZ11'));
        return $manifest['version'];
    }
    protected function getItemArray($identifier)
    {
        $db = JFactory::getDbo();

        $query = $db->getQuery(true)
            ->select($db->qn('manifest_cache'))
            ->from($db->qn('#__extensions'))
            ->where($db->qn('element') . ' = ' . $identifier);
        $db->setQuery($query);

        // Load the single cell and json_decode data
        $array = json_decode($db->loadResult(), true);

        return $array;
    }




}