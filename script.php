<?php


use Joomla\CMS\Component\ComponentHelper;
use Joomla\CMS\Filesystem\File;
use Joomla\CMS\Installer\InstallerScript;
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;

// No direct access to this file
defined('_JEXEC') or die;

/**
 * Script file of HelloWorld module
 *  @since 3.9
 */
class mod_rokajaxsearchInstallerScript
{
    const Gnz11InstallUrl = 'https://github.com/gartes/GNZ11/archive/master.zip';
    /**
     * Минимальная требуемая версия библиотеки GNZ11
     * @var string
     * @since 3.9
     */
    protected $minimum_version_gnz11;
    /**
     * @var \Joomla\CMS\Application\CMSApplication|null
     * @since 3.9
     */
    private $app;
    protected $VersionGnz11;

    /**
     * mod_rokajaxsearchInstallerScript constructor.
     * @throws Exception
     * @since 3.9
     */
    public function __construct()
    {
        $this->app = Factory::getApplication();
    }
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
        $this->release = (string)$parent->get('manifest')->version;

        # Проверить версию Gnz11
        if( !$this->checkVersionGnz11( $parent ) ) {
            $result = $this->InstalGnz11($parent);
            if( !$result )
            {

                $this->app->enqueueMessage('Не удалось скачать и установить библиатеку GNZ11' , 'error' ) ;
                return false;

            }#END IF
            echo'<pre>';print_r( $result );echo'</pre>'.__FILE__.' '.__LINE__;
            
        } #END IF
        echo'<pre>';print_r( $this->VersionGnz11 );echo'</pre>'.__FILE__.' '.__LINE__;
        
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
                $this->app->enqueueMessage('Error msg' , 'error' ) ;

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
     * Проверить версию библиотеки GNZ11
     * @param $parent
     * @return bool
     * @throws Exception
     * @since 3.9
     */
    protected function checkVersionGnz11($parent){
        $this->minimum_version_gnz11 = (string)$parent->get('manifest')->version_gnz11 ;
        $this->VersionGnz11 = $this->getVersionGnz11();

        if ( version_compare( $this->VersionGnz11 , $this->minimum_version_gnz11  , '<') )
        {
            $ErrorMsg = 'Необходимая минимальная версия библиотеи GNZ11 <b>'.$this->minimum_version_gnz11.'</b>' . PHP_EOL;
            $ErrorMsg .= 'Установленная версия <b>' . $this->VersionGnz11.'</b>' ;

            # Выдать сообщение об ошибке и вернуть false
            # Throw some error message and return false
            Factory::getApplication('administrator')->enqueueMessage( $ErrorMsg , 'error' ) ;
            return false;
        }
        return true ;
    }

    protected function InstalGnz11($parent){
        $result = $this->installDownload('Gnz11', self::Gnz11InstallUrl);
//        JLoader::registerNamespace( 'GNZ11' , JPATH_LIBRARIES . '/GNZ11' , $reset = false , $prepend = false , $type = 'psr4' );
//        $result = \GNZ11\Extensions\ScriptFile::installDownload('Gnz11', self::Gnz11InstallUrl) ;


        if( $result )
        {
            return $this->checkVersionGnz11( $parent );
        }#END IF
        return false ;
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

    /**
     * Получить manifest_cache для установленного расшерения
     * @param $identifier
     * @return mixed
     * @since 3.9
     */
    protected function getItemArray($identifier)
    {
        $db = Factory::getDbo();

        $query = $db->getQuery(true)
            ->select($db->qn('manifest_cache'))
            ->from($db->qn('#__extensions'))
            ->where($db->qn('element') . ' = ' . $identifier);
        $db->setQuery($query);

        // Load the single cell and json_decode data
        return json_decode($db->loadResult(), true);
    }

    /**
     * Определяет, загружено ли указанное расширение.
     * @link https://php.net/manual/en/function.extension-loaded.php
     * @param   array  $extensions  extensions
     *
     * @return integer
     *
     * @throws Exception
     * @since version
     */
    protected function checkExtensions($extensions)
    {
        $app = Factory::getApplication();

        $pass = 1;

        foreach ($extensions as $name)
        {
            if (!extension_loaded($name))
            {
                $pass = 0;
                $app->enqueueMessage(sprintf("Required PHP extension '%s' is missing. Please install it into your system.", $name), 'notice');
            }
        }

        return $pass;
    }

    /**
     * проверить установлер копонент или нет
     * @param $componentName
     * @since 3.9
     */
    protected function checkComponentIsInstalled ($componentName ){
        # Checks if the component is enabled
        if ( !ComponentHelper::isEnabled( $componentName  ) )
        {
            echo $componentName . ' is either not enabled or not installed';
            //How to stop installation process and output an error here?
            return;
        }
        else
        {
            echo $componentName . ' is installed and enabled';
        } 
    }

    private function installDownload(string $id, string $url)
    {
        if( !self::checkTmpDir() )
        {
            return false ;
        }#END IF

        $tmp_path = \Joomla\CMS\Factory::getApplication()->get('tmp_path') ;

        if (!is_string($url))
        {
            return \Joomla\CMS\Language\Text::_('NNEM_ERROR_NO_VALID_URL');
        }




        //        $url = 'http://' . str_replace('http://', '', $url);
        $target = $tmp_path . '/' . uniqid($id) . '.zip';




        jimport('joomla.filesystem.file');
        \Joomla\CMS\Factory::getLanguage()->load('com_installer', JPATH_ADMINISTRATOR);

        // Download the package at the URL given.
        $p_file = \Joomla\CMS\Installer\InstallerHelper::downloadPackage($url);




        // Was the package downloaded?
        if (!$p_file)
        {
            \Joomla\CMS\Factory::getApplication()->enqueueMessage( 'Не удалось скачать пакет установки' , 'error');
            return false;
        }
        // Распакуй скачанный файл пакета.
        $package = \Joomla\CMS\Installer\InstallerHelper::unpack($tmp_path . '/' . $p_file, true);
        // Get an installer instance.
        $installer = new \Joomla\CMS\Installer\Installer();
        /*
         * Проверьте наличие основного пакета Joomla.
         * Для этого нам нужно указать исходный путь для поиска манифеста (тот же первый шаг, что и JInstaller :: install ())
         *
         * Это необходимо сделать перед распакованной проверкой, потому что JInstallerHelper :: detectType () возвращает логическое значение false, поскольку манифест
         * не может быть найден в ожидаемом месте.
		 */
        if (is_array($package) && isset($package['dir']) && is_dir($package['dir']))
        {
            $installer->setPath('source', $package['dir']);
            if (!$installer->findManifest())
            {
                # Если манифест не найден в источнике, это может быть пакет Joomla; проверьте каталог пакета для манифеста Joomla
                # If a manifest isn't found at the source, this may be a Joomla package; check the package directory for the Joomla manifest
                \Joomla\CMS\Factory::getApplication()->enqueueMessage('Ошибка! Не удалось найти файл ианифест' , 'warning' );
                return false;

                /*if (file_exists($package['dir'] . '/administrator/manifests/files/joomla.xml'))
                {
                    // We have a Joomla package
                    if (in_array($installType, array('upload', 'url')))
                    {
                        JInstallerHelper::cleanupInstall($package['packagefile'], $package['extractdir']);
                    }

                    $app->enqueueMessage(
                        JText::sprintf('COM_INSTALLER_UNABLE_TO_INSTALL_JOOMLA_PACKAGE', JRoute::_('index.php?option=com_joomlaupdate')),
                        'warning'
                    );

                    return false;
                }*/
            }
        }
        if (!$package || !$package['type'])
        {
            \Joomla\CMS\Installer\InstallerHelper::cleanupInstall($package['packagefile'], $package['extractdir']);
            \Joomla\CMS\Factory::getApplication()->enqueueMessage( 'Не удалось найти пакет установки' , 'error');
            return false;
        }

        // Install the package.
        if (!$installer->install($package['dir']))
        {
            // There was an error installing the package.
            $msg = \Joomla\CMS\Language\Text::sprintf('COM_INSTALLER_INSTALL_ERROR', \Joomla\CMS\Language\Text::_('COM_INSTALLER_TYPE_TYPE_' . strtoupper($package['type'])));
            $result = false;
            $msgType = 'error';
        }
        else
        {
            // Package installed successfully.
            $msg = \Joomla\CMS\Language\Text::sprintf('COM_INSTALLER_INSTALL_SUCCESS', \Joomla\CMS\Language\Text::_('COM_INSTALLER_TYPE_TYPE_' . strtoupper($package['type'])));
            $result = true;
            $msgType = 'message';
        }
        \Joomla\CMS\Factory::getApplication()->enqueueMessage( $msg ,  $msgType );
        // Cleanup the install files.
        if (!is_file($package['packagefile']))
        {
            $package['packagefile'] = $tmp_path . '/' . $package['packagefile'];
        }

        \Joomla\CMS\Installer\InstallerHelper::cleanupInstall($package['packagefile'], $package['extractdir']);


        return $result ;
    }
    /**
     * Проверка директории TMP
     * @return bool
     * @throws \Exception
     * @since 3.9
     */
    public static function checkTmpDir(){
        $tmp_path = \Joomla\CMS\Factory::getApplication()->get('tmp_path');
        $tmp_pathLogic = JPATH_ROOT . '/tmp'  ;
        if( \Joomla\CMS\Filesystem\Folder::exists( $tmp_pathLogic ) && $tmp_path != $tmp_pathLogic )
        {
            $mes = 'В настройках Joomla путь к директории TMP ведет не к той директории которая в корне сайта.' ;
            \Joomla\CMS\Factory::getApplication()->enqueueMessage($mes , 'warning');
            return true ;
        }#END IF
        return true ;
    }


}