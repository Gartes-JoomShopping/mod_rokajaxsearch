(function () {

    setTimeout(function () {
        var Drive = new window.modRokajaxsearchDrive();
        Drive.Init() ;
    },1000 )

})();







window.modRokajaxsearchDrive = function () {
    var $ = jQuery ;
    var self = this ;
    this._Setting = {
         selectorInput : '#roksearch_search_str'
    };

    this.speechGo = false ;
    /**
     * Поиск количества результатов поиска
     * @param e
     */
    this.parseResultCount = function (e) {
        var $html = $(e.detail) ;
        var count = $html.find('.badge.badge-info').text();
        if ( typeof count === 'undefined' ) count = 0 ;
        var a = wgnz11.declOfNum( count , ['найден ', 'найдено ', 'найдено '] );
        var b = wgnz11.declOfNum( count , ['товар ', 'товара ', 'товаров '] );
        var text = a + wgnz11.getLettersSumm(count) + b  ;

        if (self.speechGo) return ;

        /*utter = new window.SpeechSynthesisUtterance(text);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);*/
        self.speechGo = true ;
        setTimeout(function () {
            self.speechGo = false ;
        }, 5000)
        console.log( text  )
    };

    this.Init = function () {
        $('#rokajaxsearch-icon').on('click' , self.onSearchIconClick );

        // Слушаем событие
        document.addEventListener('onKeyUpSuccess', self.parseResultCount, false);

        var input = document.getElementById('roksearch_search_str');
        var $b = $('body') ;
        var $overlay = $('<div />' , {
            id : 'roksearch_overlay',
        });
        input.onblur = function () {
           $b.find('#roksearch_overlay').remove();
           $b.removeClass('roksearch-active')
        };
        input.onfocus = function() {
            $b.append($overlay);
            $b.addClass('roksearch-active') ;
        };
        if ('webkitSpeechRecognition' in window) {
            self.RecognitionInit();
        }
    };
    /**
     * Событие нажатие на лупу
     * @param event
     */
    this.onSearchIconClick = function (event) {
        event.preventDefault();
        var $results = $('#roksearch_results').children();
        if (!$results[0]) return ;
        document.id("rokajaxsearch").submit();
    };


    /**
     * Загрузка модуля  Recognition
     * @constructor
     */
    this.RecognitionInit  =function () {

        var siteUrl = Joomla.getOptions('siteUrlsiteUrl' , '' ) ;
        // var urlLib = window.CoreGnz11.SiteUrl+'libraries/GNZ11/assets/js/gnz11.js' ;
        var urlLib = siteUrl+'/libraries/GNZ11/assets/js/gnz11.js' ;
        if (window.CoreGnz11.Status === 'loading'){
            var I = setInterval(function () {
                if ( typeof wgnz11 === 'object') {
                    clearInterval(I)
                    self.speechRecognitionInit()
                }
            },1000 );
        }
        else{
            self._loadJsFile( urlLib , self.speechRecognitionInit ) ;
        }
    };
    /**
     * Событие - начало распознования речи
     */
    this.onStartSpeechRecognition = function ($target) {
        $target = $($target) ;
        // Очитстить поле ввода при старте записи
        $(self._Setting.selectorInput).val('')
    };



    /**
     * Событие - окончание распознования речи
     */
    this.onEndSpeechRecognition = function () {
        $(self._Setting.selectorInput).trigger('keydown')
        $(self._Setting.selectorInput).trigger('keyup')
        var element = document.getElementById('roksearch_search_str');
        /**
         * Программная генерация событий DOM 2 Events
         * @see https://habr.com/ru/post/114244/
         */
        var o;
        if( window.KeyEvent ) // Для FF
        {
            o = document.createEvent('KeyEvents');
            o.initKeyEvent( 'keyup', true, true, window, false, false, false, false, 8 , 0 );
        }
        else // Для остальных браузеров
        {
            o = document.createEvent('UIEvents');
            o.initUIEvent( 'keyup', true, true, window, 1 );
            o.keyCode = 8 ; // Указываем дополнительный параметр, так как initUIEvent его не принимает
        }
        element.dispatchEvent(o);
    };

    /**
     * INIT Module Recognition
     */
    this.speechRecognitionInit = function () {

        wgnz11.getModul('Recognition'   ).then(function(Recognition){
            /**
             * Загрузка темы (html) Для кнопки
             */
            Recognition.loadTheme('microphone').then(function (Theme) {
                var RecognitionConfig = {
                    /**
                     * Распознавание речи
                     */
                    addSpeechRecognition : [
                        {
                            'parent' : false , // родительский блок где искать (msg_element)
                            'key' : false, // селектор элемента || jQuery объект  в которой устанавливать кнопки
                            'target_element' : self._Setting.selectorInput, // селектор элемента или || jQuery объект в который вставлять текст
                        },
                    ],
                    /**
                     * События Распознавание речи
                     */
                    SpeechRecognition: {
                        /**
                         *  FALSE - Значение по умолчанию для interimResults false - это означает, что единственные результаты,
                         *  возвращаемые распознавателем, являются окончательными и не изменятся.
                         *
                         *  TRUE - получаем ранние промежуточные результаты, которые могут измениться
                         */
                        interimResults : true ,
                        onStart : self.onStartSpeechRecognition ,
                        onend : self.onEndSpeechRecognition ,
                        // beforeInsert: selectRu(),
                        /**
                         * Событие после добавление кнопок Rec.
                         * @param GNZ11Recognition
                         * @param $btns
                         */
                        afterInsertButton: function ( GNZ11Recognition,  $btns) {
                            /*var $source =  $('#jform_source');
                            var $target = $textarea ;
                            var sourceLang = 'en';
                            var targetLang = 'ru';

                            var translateBtn = GNZ11Recognition.getTranslateBtn(
                                $source ,
                                $target ,
                                sourceLang ,
                                targetLang
                            );
                            $($btns).after( translateBtn );
                            $('#jform_source-lbl').after('<input type="button" value="Copy" onclick="CopySource()"  class="btn btn-success btn-mini btn-sm">')



                            console.log( GNZ11Recognition )
                            console.log( $btns )*/


                        },
                    },
                    btn : {
                        /**
                         * Шаблоны кнопки распознавание речи
                         */
                        speechRecognition :  Theme,
                    }
                };
                Recognition.setConfig(RecognitionConfig) ;
                Recognition.bundle();


            },function (err) {
                console.error(err)
            });

            console.log( Recognition.Config );
        },function(err){
            console.error(err)
        });
    };
    /**
     * Загрузка JS файлов
     * @param url - файл
     * @param callback - после загрузки файла
     * @private
     */
    this._loadJsFile = function(url, callback ){
        var script = document.createElement("script")
        script.type = "text/javascript";
        if (typeof callback === 'function'){
            if (script.readyState){  //IE
                script.onreadystatechange = function(){
                    if (script.readyState === "loaded" || script.readyState === "complete"){
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {  //Others
                script.onload = function(){ callback();  };
            }
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }
};