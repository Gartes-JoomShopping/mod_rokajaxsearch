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
    private $minimum_version_gnz11;
    /**
     * @var \Joomla\CMS\Application\CMSApplication|null
     * @since 3.9
     */
    private $app;

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
        if( !$this->checkVersionGnz11( $parent ) ) {
            $this->InstalGnz11();
            return false;
        } #END IF


        
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
     * Проверить версию библиотеки GNZ11
     * @param $parent
     * @return bool
     * @throws Exception
     * @since 3.9
     */
    protected function checkVersionGnz11($parent){
        $this->minimum_version_gnz11 = (string)$parent->get('manifest')->version_gnz11 ;
        $VersionGnz11 = $this->getVersionGnz11();

        if ( version_compare( $VersionGnz11 , $this->minimum_version_gnz11  , '<') )
        {
            $ErrorMsg = 'Необходимая минимальная версия библиотеи GNZ11 <b>'.$this->minimum_version_gnz11.'</b>' . PHP_EOL;
            $ErrorMsg .= 'Установленная версия <b>' . $VersionGnz11.'</b>' ;

            # Выдать сообщение об ошибке и вернуть false
            # Throw some error message and return false
            Factory::getApplication('administrator')->enqueueMessage( $ErrorMsg , 'error' ) ;
            return false;
        }
        return true ;
    }

    protected function InstalGnz11(){
        $this->installDownload('Gnz11', self::Gnz11InstallUrl);
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

    /**
     * Download and install
     * @param $id
     * @param $url
     * @return bool|string
     * @since 3.9
     */
    protected function installDownload($id, $url)
    {
        if (!is_string($url))
        {
            return Text::_('NNEM_ERROR_NO_VALID_URL');
        }



        $url = 'http://' . str_replace('http://', '', $url);
        $target = Factory::getApplication()->get('tmp_path') . '/' . uniqid($id) . '.zip';

        jimport('joomla.filesystem.file');
        Factory::getLanguage()->load('com_installer', JPATH_ADMINISTRATOR);

        
        
        
        if (!(function_exists('curl_init') && function_exists('curl_exec')) && !ini_get('allow_url_fopen'))
        {
            return JText::_('NNEM_ERROR_CANNOT_DOWNLOAD_FILE');
        }
        else if (function_exists('curl_init') && function_exists('curl_exec'))
        {
            /* USE CURL */
            $ch = curl_init();
            $options = array(
                CURLOPT_URL            => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => 30,
            );
            $params = JComponentHelper::getParams('com_nonumbermanager');
            if ($params->get('use_proxy') && $params->get('proxy_host'))
            {
                $options[CURLOPT_PROXY] = $params->get('proxy_host') . ($params->get('proxy_port') ? ':' . $params->get('proxy_port') : '');
                $options[CURLOPT_PROXYUSERPWD] = $params->get('proxy_login') . ':' . $params->get('proxy_password');
            }
            curl_setopt_array($ch, $options);
            $content = curl_exec($ch);
            curl_close($ch);
        }
        else
        {
            /* USE FOPEN */
            $handle = @fopen($url, 'r');
            if (!$handle)
            {
                return JText::_('SERVER_CONNECT_FAILED');
            }

            $content = '';
            while (!feof($handle))
            {
                $content .= fread($handle, 4096);
                if ($content === false)
                {
                    return JText::_('NNEM_ERROR_FAILED_READING_FILE');
                }
            }
            fclose($handle);
        }

        if (empty($content))
        {
            return Text::_('NNEM_ERROR_CANNOT_DOWNLOAD_FILE');
        }

        // Write buffer to file
        File::write($target, $content);

        jimport('joomla.installer.installer');
        jimport('joomla.installer.helper');

        // Get an installer instance
        $installer = \Joomla\CMS\Installer\Installer::getInstance();

        echo'<pre>';print_r( $installer );echo'</pre>'.__FILE__.' '.__LINE__;
        die(__FILE__ .' '. __LINE__ );


        // Unpack the package
        $package = JInstallerHelper::unpack($target);

        // Cleanup the install files
        if (!is_file($package['packagefile']))
        {
            $config = JFactory::getConfig();
            $package['packagefile'] = $config->get('tmp_path') . '/' . $package['packagefile'];
        }
        JInstallerHelper::cleanupInstall($package['packagefile'], $package['packagefile']);

        // Install the package
        if (!$installer->install($package['dir']))
        {
            // There was an error installing the package
            return JText::sprintf('COM_INSTALLER_INSTALL_ERROR', JText::_('COM_INSTALLER_TYPE_TYPE_' . strtoupper($package['type'])));
        }

        return true;
    }


}