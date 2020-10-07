
/**
 *
 * @type {window}
 */
window.modRokajaxsearchDrive = function () {

    /**
     *
     * @type {jQuery|(function(*=, *=): jQuery|*)}
     */
    var $ = jQuery;
    /**
     * Element <body />
     * @type {jQuery}
     */
    var $b = $('body');
    var $$b = document.querySelector('body');
    /**
     * @type {Document}
     */
    var $$d = document ;
    const self = this;


    this.__module = 'mod_rokajaxsearch';
    /**
     * Имя модуля
     * @type {string}
     * @private
     */
    this.__param = Joomla.getOptions(this.__module, {});
    /**
     * группа плагина
     * @type {string}
     * @private
     */
    this.__group = 'search';
    /**
     * Плагин для посиска результатов
     * @type {string}
     * @private
     */
    this.__plugin = 'joomshopping_two_lang';

    /**
     * ********************************************************************************
     */

    /**
     * Хранение предедущего ввода с клавиатуры
     * @type {undefined}
     */
    this.prev_q = undefined;
    /**
     * таймаут между кнопками ввода
     * @type {number}
     */
    this.search_timeout = 300;


    /**
     * ********************************************************************************
     */


    /**
     * Локальный объект для хранения истории
     * @type {Object}
     */
    this._LocalStorage = !1;
    /**
     * Индикатор что загружены все необходимые ресурсы
     * @type {boolean}
     * @private
     */
    this.__AssetsIsLoaded = false ;
    /**
     * Ключ локального хранилища
     * @type {string}
     */
    this.StorageName = this.__module ;
    /**
     * Селекторы
     * @type {{
     * input: string поле поиска, form: string форма, overlay: string, searchSuggestItem: string, searchSuggest: string, wrapResult: string}}
     */
    this.selectors = {

        input: '#roksearch_search_str',
        // форма поиска
        form: '#rokajaxsearch',
        // Блок для вставки результатоов поиска
        wrapResult: 'div.rokajaxsearch ',
        // Блок с результатами поиска
        searchSuggest: '.search-suggest',
        // Строки товаров
        searchSuggestItem: '.search-suggest__item',
        overlay: '#roksearch_overlay',
    };
    /**
     * Классы
     * @type {{bodyLoading: string}}
     */
    this.classes = {
        // Класс элемента body в момет загрузки результатов поиска
        bodyLoading: 'search-loading',
    };
    /**
     * Елементы HTML :
     * @type {{
     *      $overlay: (jQuery|jQuery|HTMLElement),
     *      $HistoryLine: (jQuery|jQuery|HTMLElement) Html значения элемента истории
     *
     *      }}
     */
    this.elements = {
        $overlay : $('<div />', {id: 'roksearch_overlay',}),
        /*---------------------------------------------------------------*/
        $HistoryWrap : $('<div />' , {
            class : 'search-suggest hidde' ,
            attr : {"suggest-list" : "" },
            html : $('<ul />' , {
                class : 'suggest-list hidde' ,
                attr : {"_ngcontent-c9" : "" },
            })
        }),
        $HistoryLine : $('<li />', {
            class: 'search-suggest__item',
            attr : {
                '_ngcontent-c9' : "",
                'data-name' : "",
                'data-index' : "",
            },
            html: $('<a />' , {
                class : 'search-suggest__item-content search-suggest__item-text',
                attr : {
                    '_ngcontent-c9' : "",
                    'href' : "",
                },
                html: '<svg _ngcontent-c9="" class="search-suggest__item-icon" height="24" width="24">\n' +
                    '<use _ngcontent-c9="" xlink:href="#icon-magnifier" xmlns:xlink="http://www.w3.org/1999/xlink"></use>\n' +
                    '</svg>' +
                    '<span _ngcontent-c9="" class="search-suggest__item-text_type_nowrap"></span>'
            })
        }),
        $HistoryDel : $('<button />' , {
            class: 'search-suggest__item-remove js-rz-suggest-delete' ,
            attr : {
               '_ngcontent-c9' :'',
               'data-rz-gtm-event' : 'removeSuggestHistoryItem' ,
                'type' : 'button' ,
            },
            html :  '   <svg _ngcontent-c9="" height="12" width="12">\n' +
                '       <use _ngcontent-c9="" xlink:href="#icon-close-modal" xmlns:xlink="http://www.w3.org/1999/xlink"></use>\n' +
                '   </svg>\n'
        }),

    }
    /**
     * Домен сайта
     * @type {string}
     */
    this.Host = this.Options.Ajax.siteUrl;
    /**
     * Параметры Ajax по умолчанию
     * @type {{task: null, plugin: string, format: string, group: string, option: string}}
     */
    this.AjaxDefaultData = {
        group: this.__group,
        plugin: this.__plugin,
        option: 'com_ajax',
        format: 'json',
        task: null,
    };
    /**
     * @type {boolean} включает произношение результатов поиска
     */
    this.speechGo = false;
    /**
     * @type {boolean} Индикатор установленого фокуса
     */
    this.onFocusIn = false;
    /**
     * Храннение ссылки для редиректа
     * @type {string}
     */
    this.toRedirect = '' ;
    /**
     *
     * @constructor
     * @type {(function(*=, *=): jQuery|*)}
     */
    this.Init = function () {
        /**
         * Инит истории поиска
         */
        self.__History.Innit()
        /**
         * Поле поиска
         * @type {Element}
         */
        this.Input = document.querySelector(self.selectors.input);

        // Если поле не пустое в момент инита
        if (self.Input.value.length) {
            this._Request({target: {value: self.Input.value}});
        }

        // Вешаем обрабочики событий
        self.addEvents();

        // Событие нажатие на лупу
        $(this.__param.selectors.searchIcon).on('click', self.onSearchIconClick);

        // Если запись разрешена
        if ('webkitSpeechRecognition' in window) {
            self.RecognitionInit();
        }

        self.loadAssets();
    };
    /**
     * Очистить поле INPUT
     */
    this.inputClean = function (){
        $$d.querySelector(self.selectors.input).value = null ;
        $$d.querySelector(self.selectors.form).classList.add("empty-form");
        self.searchSuggest.Hide();
    };
    /**
     * Проверка поля поиска на содержания текста
     */
    this.checkValue = function (){
        var f = $$d.querySelector(self.selectors.form)
        if (!$$d.querySelector(self.selectors.input).value){
            f.classList.add("empty-form");
        }else{
            f.classList.remove("empty-form");
        }
        return ;


    };
    /**
     * Показать Overlay
     */
    this.overlayShow = function () {
        $b.append(self.elements.$overlay);
        self.Overlay = $(self.selectors.overlay);
        $b.addClass('roksearch-active');
    }
    /**
     * Клик по <body />
     * @param event
     */
    this.onBodyClick = function (event) {

    };
    /**
     * Поле с рузультатами поиска
     */
    this.searchSuggest = {
        Hide: function (saveOverlay) {
            if (typeof saveOverlay === 'undefined') saveOverlay = false;
            $(self.selectors.searchSuggest).hide().remove();
            if (!saveOverlay) {
                $($b).off('click.rokajaxsearch');
                self.Overlay.remove();
            }
            self.checkValue();
            // удалить с body класс активного поиска
            $b.removeClass('roksearch-active');
        },
        Show: function () {
            self.checkValue();
            $(self.selectors.searchSuggest).show();
        }
    }
    /**
     * Время Date.now() Последнего нажатия кнопки в INPUT
     * @type {number}
     */
    this.overTimeStamp = 0 ;

    /**
     * Добавление обработчиков событий
     */
    this.addEvents = function () {
        // Клик по <body />
        $$b.addEvents({
            click: function (event){
                if (typeof $(event.target).closest(self.selectors.form)[0] === "undefined"){
                    self.searchSuggest.Hide();
                    // self.checkValue();
                }
            },
        });
        /**
         * Событие для голосового сообщения о результатах поиска
         */
        document.addEventListener('onKeyUpSuccess', self.parseResultCount, false);
        /**
         * события Формы
         */
        document.querySelector(self.selectors.form).addEvents({
            click: function (event) {
                self.checkValue();
                var elLI, attrVal,
                    input = document.querySelector(self.selectors.input)

                // Если клик по кнопке удалить строку из истории
                if ( event.target.closest("button.search-suggest__item-remove") ){
                    event.preventDefault();
                    self.__History.DeleteItem(event)
                    return;
                }
                // Клик по кнопке очистить историю
                if ( event.target.hasClass('search-suggest__heading-action') ){
                    event.preventDefault();
                    self.__History.CleanAllHistory(event)
                    return;
                }

                // Получаем родительский <LI/> єллемент
                elLI = event.target.closest("li.search-suggest__item[data-name]");

                if ( !elLI || !elLI.hasAttribute('data-name')) return;
                event.preventDefault();

                attrVal = elLI.getAttribute('data-name');
                if (!attrVal.length) return;

                // Установить значение в поле поиска
                input.value = attrVal

                // если клик по ссылки на товар
                if (elLI.hasAttribute('redirect') ){
                    self.toRedirect = elLI.querySelector('a').getAttribute('href');

                    // Добавить слово в историю поиска
                    self.__History.AddToHistory( self.Input.value );

                    self.DB.Redirect = self.toRedirect ;
                    self._Request({ target: {value: self.Input.value}}  , 'AddHitDictionary' );
                    return  ;
                }

                // Добавить слово в историю поиска
                self.__History.AddToHistory(self.Input.value);


                // отправить запрос для поиска товаров
                self._Request({target: {value: self.Input.value}});
                setTimeout(function (){
                    self._Request({target: {value: self.Input.value}}  , 'AddHitDictionary' );
                },2000)
            },
        })
        /**
         * События поля Input
         */
        self.Input.addEvents({
            focus : function (event){
                console.log('--== Input ==-- 1.Event onfocus');
                self.overlayShow();



                if (event.target.value === ''){
                    console.log('Field EMPTY!')
                    self.__History.ShowHistory();
                }else{
                    self.searchSuggest.Show();
                }
            },
            /**
             * @param event Объект события PASTE
             */
            paste: function (event) {
                setTimeout(function () {
                    self.checkValue();
                    self._Request(event);
                }, 0);
            },
            /**
             * Нажатые кнопки в поле поиска
             * @param event
             * @returns {boolean}
             */
            keyup: function (event) {
                self.handleOnKeyUp(event)


            },
            /**
             * Клик по INPUT поиска
             * @param event
             */
            click: function (event) {
                // Сбрасываем выделенные строки подсказок
                $searchSuggest = $('.search-suggest');
                $searchSuggest.find('li.search-suggest__item_state_active').removeClass('search-suggest__item_state_active');
                $searchSuggest.find('ul.state_active').removeClass('state_active');


                // Скролл в верх найденных товаров к первому елементу
                $listProduct = $('ul.search-suggest-product');
                $listProduct.scrollTop(0);



                self.checkValue();
                if (!$(self.selectors.overlay)[0] || typeof $(self.selectors.overlay)[0] === 'undefined'){
                    self.overlayShow();
                }

                self.prepareSendFrase(event)

            }
        });
        /**
         * Получение фокуса поле Поиска
         */
        // self.Input.onfocus = function () { };
        // После init - вызываем событие фокус на поле Input поиска
        self.Input.dispatchEvent( new Event('focus') )
    };
    this.search = function (event){
        if ( event.key === 'up' || event.key === 'down' ){
            // Блок с рейльтатами поиска
            var $searchSuggest = $('.search-suggest')
            var $suggestList =  $searchSuggest.find('ul.suggest-list');
            var $itemLi = $suggestList.find('li.search-suggest__item');
            var $itemLiActive = $suggestList.find('.search-suggest__item_state_active')


            // Если нет отмеченных элементов
            if (!$itemLiActive[0]) {
                if ( event.key === 'up' ) {
                    return ;
                }
                // берем первый список и отмечаем первый элемент
                $itemLi.first().addClass('search-suggest__item_state_active');
                $itemLi.first().parent().addClass('state_active');
            }else{

                var $next = $itemLiActive.next();
                var $prev = $itemLiActive.prev();
                var $parentUl = $itemLiActive.closest('ul')


                if ( event.key === 'down' ){
                    // Если слудуюший элемент не существует
                    if (!$next[0]){

                        // Родитель UL Отмеченного элемента
                        var $parent = $itemLiActive.parent('ul')

                        // следующий родитель
                        var $parentNext = $parent.next();

                        if (!$parentNext[0]) {

                            // переход из группы перейти в категорию и поиск в категории
                            if ($parent.hasClass('search-suggest__group')){
                                // следующая грппа
                                var $nextGroup = $parent.closest('li').next();

                                if($nextGroup[0]){
                                    $itemLiActive.removeClass('search-suggest__item_state_active');
                                    $nextGroup.find('li').first().addClass('search-suggest__item_state_active')
                                }
                            }
                            return true ;
                        }
                        $parent.removeClass('state_active');
                        $itemLiActive.removeClass('search-suggest__item_state_active');
                        $parentNext.addClass('state_active')
                            .find('.search-suggest__item').first().addClass('search-suggest__item_state_active')
                    }else{
                        $itemLiActive.removeClass('search-suggest__item_state_active');
                        $next.addClass('search-suggest__item_state_active')
                    }
                }else if(event.key === 'up'){
                    // если существует предедущий елемент LI
                    if ($prev[0]){
                        $parentUl.find('li').removeClass('search-suggest__item_state_active');
                        $prev.addClass('search-suggest__item_state_active')
                    }else if(!$prev[0]){
                        console.log('$parentUl > ',$parentUl)
                        console.log('$prev > ' , $prev)
                    }

                }

                console.log( $parentUl )

                /**
                 * Если это список товаров то будем скролить от нажатых стрелок
                 */
                var DELTA
                if ($parentUl.hasClass('search-suggest-product') && event.key === 'down' ){
                    console.log( $parentUl )
                    console.log( $itemLiActive )
                    $parentUl.scrollTop(0);
                    DELTA = $itemLiActive.offset().top - $parentUl.height() + $itemLiActive.height() ;
                    $parentUl.scrollTop(DELTA);
                }else if($parentUl.hasClass('search-suggest-product') && event.key === 'up'){
                    /*$parentUl.scrollTop(0);
                    DELTA = $itemLiActive.offset().top - $parentUl.height() ;
                    $parentUl.scrollTop(DELTA);*/
                }



            }

        }
        if (event.code === 17 || event.code === 18 || event.code === 224 || event.alt || event.control || event.meta) return false;
        if (event.alt || event.control || event.meta || event.key === 'esc' || event.key === 'up' || event.key === 'down' || event.key === 'left' || event.key === 'right') return true;
        if (event.key === 'enter') event.stop();

        var now = Date.now() ;
        // if ( now - self.overTimeStamp < 800  ) return false  ;

        // запоминаем время последнего нажатия кнопок
        self.overTimeStamp = now

        var f = $$d.querySelector(self.selectors.form);
        // self.checkValue();

        if (this.value === '') {
            f.classList.add("empty-form");
            // self.checkValue();
            self.searchSuggest.Hide(true);

            // Todo отображать историю поиска
            return false;
        }else{
            f.classList.remove("empty-form");
        }
        self.prepareSendFrase(event) ;
    }
    /**
     * Обработка кнопок клавиатуры
     * @param event
     */
    this.handleOnKeyUp = function(event) {
        var input = $(event.target);
        if ( input.val().toLowerCase() !== this.prev_q) {
            this.prev_q = input.val().toLowerCase();
            clearTimeout(this.timeout);
            var e = this;
            this.timeout = setTimeout(function() {
                e.search(event)
            }, this.search_timeout );
        }
    };
    /**
     * Смотрим что в поле если больше 4 символов поиск по товарам
     * если меньше - поиск по словарю
     * @param event
     */
    this.prepareSendFrase = function (event){
        if(self.Input.value.length === 0 ) return ;
         
        if (self.Input.value.length > 4){
            self._Request(event);
        }else{
            self._Request({target: {value: self.Input.value}}, 'SearchInDictionary')
        }
    }
    /**
     * Объект Истории Поиска !
     * @type {{GetTemplateHistory: (function(): (undefined)), CleanAllHistory: Window.__History.CleanAllHistory, DeleteItem: Window.__History.DeleteItem, AddToHistory: Window.__History.AddToHistory, ShowHistory: (function(*=): (undefined)), Innit: Window.__History.Innit}}
     * @private
     */
    this.__History ={
        Innit : function(){
            /**
             * Достаем историю из LocalStorage
             */
            self.getModul('Storage_class').then(function () {
                self._LocalStorage = Storage_class.get(self.StorageName  );
            })
        },
        /**
         * Передаем список истории поиска - получаем макет html
         * @constructor
         */
        GetTemplateHistory : function (){
            //Если история пустая
            if ( !self._LocalStorage ) return  ;
            // Передаем историю поиска на сервер для создания списка
            self.DB.__history = { _LocalStorage : self._LocalStorage }
            self._Request({target: {value: null }}, 'LoadHistoryTemplate')
        },
        /**
         * Показать локальную историю поиска
         * @param html - мекет истории поиска - загружен с сервера
         * @constructor
         */
        ShowHistory  : function (html){
            // Если история пустая
            if ( Object.keys(self._LocalStorage).length === 0 && self._LocalStorage.constructor === Object ) return ;

            // Если шаблон html Истории не передан и рессурсы CSS загружены
            if (typeof html ==='undefined' && self.__AssetsIsLoaded ){
                self.__History.GetTemplateHistory();
                return  ;
            }
            $(self.selectors.wrapResult).find('div.search-suggest').remove();
            $(self.selectors.wrapResult).append(html);
        },
        /**
         * Добавить значение в Историю !
         * @param text
         * @constructor
         */
        AddToHistory : function (text){
            var _setQueryToLocalStorage = function(text) {
                if (text && -1 == text.search(/(<([^>]+)>)/gi)) {
                    var _LStorage = self._LocalStorage;
                    _LStorage || (_LStorage = {});
                    text = text.trim().toLowerCase();
                    console.log(text) ;
                    // return ;
                    _LStorage[text] = Date.now();
                    _LStorage = _sortQueries(_LStorage);
                    _LStorage = _removeUnnecessary(_LStorage);
                    self._LocalStorage = _LStorage ;
                    Storage_class.set( self.StorageName , self._LocalStorage  )
                }
            }
            //    удлить не нужное
            var _removeUnnecessary = function(LocalStorageData) {
                var e = Object.keys(LocalStorageData).length;
                return e > 10 && delete LocalStorageData[Object.keys(LocalStorageData)[e - 1]],
                    LocalStorageData
            };
            // Сортируем объек истории
            var _sortQueries = function(LocalStorageData) {
                if (Object.keys(LocalStorageData).length > 1) {
                    var tempArr = [];
                    for (var n in LocalStorageData) {
                        tempArr.push([n, LocalStorageData[n]]);
                    }
                    LocalStorageData = {};
                    tempArr.sort(function (t, e) {
                       return e[1] - t[1]
                    }),
                    tempArr.forEach(function (e) {
                        LocalStorageData[e[0]] = e[1]
                    })


                }
                return LocalStorageData
            };
            _setQueryToLocalStorage(text)
        },

        DeleteItem : function (event){
            event.preventDefault()
            var historyBlock = event.target.closest('.search-suggest.history');
            var li = event.target.closest('li[data-name]');
            var attrName = li.getAttribute('data-name');

            delete self._LocalStorage[attrName];
            Storage_class.set( self.StorageName , self._LocalStorage  );
            setTimeout(function (){
                li.parentNode.removeChild(li);
                if ( historyBlock.getElementsByTagName('li').length === 1 )
                    historyBlock.remove();
            },500)
            self.__History.Innit ;
        },
        CleanAllHistory : function (event){
            Storage_class.unset(self.StorageName)
            var historyBlock = event.target.closest('.search-suggest.history');
            setTimeout(function (){
                historyBlock.remove();
            },500);
        },

    }
    /**
     * Колбэк - загрузки html шаблона истории
     * @param r
     * @constructor
     */
    this.CallbackLoadHistoryTemplate = function (r){
        var $$wR = $$d.querySelector(self.selectors.wrapResult);

        // Если библиотека SVG еще не была устаановлена
        if ( !$('#search-suggest-symbols')[0] ){
            $$wR.insertAdjacentHTML('beforeend', r.data.symbols );
        }

        // Показать список с историей поиска !
        self.__History.ShowHistory(r.data.History.html)

    }
    /**
     * Данные системных комманд
     * @type {{countingAllProducts: number, offset: number}}
     */
    this.offset = 0 ;
    this.DB = {
        offset : 0 ,
        // Количество товаров
        countingAllProducts : 0 ,
        step : 500 ,
        Redirect : null ,

    }
    /**
     * инит статистики - маркер
     * @type {boolean}
     */
    this.StatisticInit = false ;
    /**
     * Добавить элемены статистики на страницу
     * @constructor
     */
    this.StatisticAdd = function () {
        var $el = $('<div />' , {
            id : 'Statistic' ,
            html : '<span class="added">Добавлено слов: <span>111</span></span>' +
                '<span class="words">Обработвно слов: <span>222</span></span>' +
                '<span class="prcn">Выполнено: <span>10%</span></span>'
        });
        $(self.selectors.wrapResult).append( $el );
    }
    /**
     * Хранение станистики
     * @type {{added: number, words: number, prcn: number}}
     */
    this.Statistic={
        added : 0 ,
        words : 0 ,
        prcn : 0
    }
    /**
     * Обновление данных стат. на странице
     * @param Data
     * @constructor
     */
    this.StatisticUpdate = function (Data) {
        self.Statistic.added += Data.statistic.added ;
        self.Statistic.words += Data.statistic.words ;


        self.Statistic.prcn  = Data.offset / Data.countingAllProducts * 100    ;

        $('#Statistic .added span').text( self.Statistic.added )
        $('#Statistic .words span').text(self.Statistic.words)
        $('#Statistic .prcn span').text( ( self.Statistic.prcn ).toFixed(2) +'%' )
        console.log( Data.statistic )
    }
    /**
     * Добавить Hit к слову и обработка системных комманд
     * @param r
     * @constructor
     */
    this.CallbackAddHitDictionary = function (r){
        // Если клие по ссылки на товар - переходим в товар
        if ( self.toRedirect ) {
            window.location.href = self.toRedirect ;
        }

        if ( !r.data.command ) return ;

        // Если очистить таблицу
        if (r.data.command === 'cleardictionary'){
            var text = 'Удалено '+r.data.statistic.AffectedRows + ' слов' ;
            alert( text ) ;
            return ;
        }

        if (!self.StatisticInit){
            self.StatisticAdd();
            self.StatisticInit = true ;  
        }



        if ( r.data.command ){
            self.DB.countingAllProducts = r.data.countingAllProducts  ;
            self.StatisticUpdate(r.data)
            console.log( self.DB   )
            if ( self.DB.offset < self.DB.countingAllProducts ){

                self.DB.offset =  self.offset  ;
                self._Request({target: {value: r.data.command }} , 'AddHitDictionary' ) ;
                self.offset += self.DB.step ;
                console.log(self.offset)
            }
        }
        console.log(r)
    }
    /**
     * Todo сделать правильную загрузку ресурсов в css
     * @type {}
     */
    this.loadAssets = function () {
        var opt = Joomla.getOptions('mod_rokajaxsearch',{});

        Promise.all([

            self.load.css(opt.uribase+'modules/mod_rokajaxsearch/css/rokajaxsearch.css?i='+opt.__v) ,
            self.load.css(opt.uribase+'modules/mod_rokajaxsearch/themes/blue/rokajaxsearch-theme.css?i='+opt.__v) ,
            self.load.css(opt.uribase+'plugins/search/joomshopping_two_lang/assets/css/products.css?i='+opt.__v) ,

        ]).then(function () {
            self.__AssetsIsLoaded = true ;
            self.__History.GetTemplateHistory();


        }, function (err) {
            console.log(err)
        })
    };
    /**
     * Событие нажатие на лупу
     * @param event
     */
    this.onSearchIconClick = function (event) {
        event.preventDefault();
        var $results = $('#roksearch_results').children();
        if (!$results[0]) return;
        document.id("rokajaxsearch").submit();
    };
    /**
     * Загрузка модуля  Recognition
     * @constructor
     */
    this.RecognitionInit = function () {
        self.speechRecognitionInit()
    };
    /**
     * Событие - начало распознования речи
     */
    this.onStartSpeechRecognition = function () {
        // Очитстить поле ввода при старте записи
        $(self.__param.selectors.input).val('');
        // TODO Добавить загрузку rokajaxsearch.js

    };
    /**
     * Событие - окончание распознования речи
     */
    this.onEndSpeechRecognition = function () {
        $(self.__param.selectors.input).trigger('keydown')
        $(self.__param.selectors.input).trigger('keyup')
        var element = document.getElementById('roksearch_search_str');
        /**
         * Программная генерация событий DOM 2 Events
         * @see https://habr.com/ru/post/114244/
         */
        var o;
        if (window.KeyEvent) // Для FF
        {
            o = document.createEvent('KeyEvents');
            o.initKeyEvent('keyup', true, true, window, false, false, false, false, 8, 0);
        } else // Для остальных браузеров
        {
            o = document.createEvent('UIEvents');
            o.initUIEvent('keyup', true, true, window, 1);
            o.keyCode = 8; // Указываем дополнительный параметр, так как initUIEvent его не принимает
        }
        element.dispatchEvent(o);
    };
    /**
     * INIT Module Recognition
     */
    this.speechRecognitionInit = function () {

        wgnz11.getModul('Recognition').then(function (Recognition) {

            var RecognitionConfig = {
                /**
                 * Распознавание речи
                 */
                addSpeechRecognition: [
                    {
                        'parent': false, // родительский блок где искать (msg_element)
                        'key': false, // селектор элемента || jQuery объект  в которой устанавливать кнопки
                        'target_element': self.__param.selectors.input, // селектор элемента или || jQuery объект в который вставлять текст
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
                    interimResults: true,
                    onStart: self.onStartSpeechRecognition,
                    onend: self.onEndSpeechRecognition,
                    // beforeInsert: selectRu(),
                    /**
                     * Событие после добавление кнопок Rec.
                     * @param GNZ11Recognition
                     * @param $btns
                     */
                    afterInsertButton: function (GNZ11Recognition, $btns) {
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
                btn: {
                    /**
                     * Шаблоны кнопки распознавание речи
                     */
                    speechRecognition: '#rokajaxsearch .search-form__microphone',
                }
            };
            console.log()
            Recognition.setConfig(RecognitionConfig);
            Recognition.bundle();

            /**
             * Загрузка темы (html) Для Recognition модуля
             */
            // Recognition.loadTheme('microphone').then(function (Theme) { },function (err) { });


        }, function (err) {
            console.error(err)
        });
    };
    /**
     * Произношение результатов поиска
     * @param e
     */
    this.parseResultCount = function (e) {
        var $html = $(e.detail);
        var count = $html.find('.badge.badge-info').text();
        if (typeof count === 'undefined') count = 0;
        var a = self.declOfNum(count, ['найден ', 'найдено ', 'найдено ']);
        var b = self.declOfNum(count, ['товар ', 'товара ', 'товаров ']);
        var text = a + wgnz11.getLettersSumm(count) + b;

        if (self.speechGo) return;

        /*utter = new window.SpeechSynthesisUtterance(text);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);*/
        self.speechGo = true;
        setTimeout(function () {
            self.speechGo = false;
        }, 5000)
        console.log(text)
    };
    /**
     * Получить данные формы поиска
     */
    this.getFormData = function (event) {
        return {
            'ordering': self.__param.ordering,
            /*'limit': self.options.limit ,*/
            'searchword': self.Input.value,
        }
    }
    /**
     * Отправить запрос при вводе слова в поиске
     * @private
     */
    this._Request = function (event, method) {
        var dataRequest = self.getFormData(event);
        var data;
        data = $.extend(true, self.AjaxDefaultData, dataRequest);
        data.option = 'com_ajax';
        data.areas = ['joomshopping'];
        data.tmpl = null;
        data.task = null;
        data.method = null ;
        data.DB = self.DB ;
        if (typeof method !== 'undefined'){
           data.method = (typeof method === 'undefined' ? null : method);
        }

        // Установка индикаторов загрузки
        $('body').addClass(self.classes.bodyLoading)
        $(self.selectors.input).addClass('')
        self.getModul("Ajax").then(function (Ajax) {
            // Не обрабатывать сообщения
            Ajax.ReturnRespond = true;
            // Отправить запрос
            Ajax.send(data).then(function (r) {
                // Убрать индикаторов загрузки
                $('body').removeClass(self.classes.bodyLoading);

                if (!r.data){
                    if (r.message.length){
                        console.log( r.message )
                        console.log( data )
                    }
                    return ;
                }
                // Если есть данные ответа
                if (Object.keys(r.data).length === 0 && r.data.constructor === Object) return  ;

                if (data.method) {
                    self['Callback' + data.method](r);
                    return;
                }

                getSefLink(r.data);
                self.renderProductResult(r.data.products.html)


            }, function (err) {
                console.error(err) ;
            });

            /**
             * Запросить SEF ссылки
             * @param arrLink
             */
            function getSefLink(arrLink) {
                data.task = 'getSefLink';
                data.arrSearchResult = JSON.stringify(arrLink);
                Ajax.send(data).then(function (r) {
                    setTimeout(function (){
                        console.log(self.Input);
                        console.log('self.Input > focus > select');
                        // Устанавливаем ФОКУС на поле INPUT
                        $(self.Input).focus()/*.select()*/

                    },500)
                    self.setLinkToProduct(r.data);

                })
            }
        });
    }
    /**
     * Callback для результатов из словаря
     * @param r
     * @constructor
     */
    this.CallbackSearchInDictionary = function (r) {
        if ( typeof r.data.Dictionary.queryResult === 'undefined' ) return
        console.log( r.data.Dictionary.queryResult.length );
        if (!r.data) {
            // Удаляем предедущий результат
            $(self.selectors.searchSuggest).remove();

            // Убрать индикаторов загрузки
            $('body').removeClass(self.classes.bodyLoading)
            return;
        }
        // Установить полученные результаты
        self.renderProductResult(r.data.Dictionary.html)
        if ( r.data.Dictionary.queryResult.length === 1 )
            self._Request({ target : { value: r.data.Dictionary.queryResult[1] } } );
    }
    /**
     * Установить полученные результаты
     * @param html
     */
    this.renderProductResult = function (html) {
        // Удаляем предедущий результат
        $(self.selectors.searchSuggest).remove();
        // Устанавливаем новый результат
        $(self.selectors.wrapResult).append(html);

        // Убрать индикаторов загрузки
        self.Loader.remove();

    }
    /**
     * Управление индикатором загрузки
     * @type {{remove: Window.Loader.remove}}
     */
    this.Loader = {
        /**
         * Удалить индикатор загрузки с INPUT ELEMENT
         */
        remove : function (){
            $b.removeClass(self.classes.bodyLoading)
        } ,
    }
    /**
     * Усановить ссылки для товаров
     * @param data
     */
    this.setLinkToProduct = function (data) {
        $(self.selectors.searchSuggestItem + ' a.search-suggest__show-all').attr('href', data.show_all);
        $.each(data.products, function (id, prodData) {
            $(self.selectors.searchSuggestItem + '[data-prod_id="' + id + '"] a').attr('href', prodData.link);

        });
        // ссылки для категорий + искать в категориях
        $.each(data.categorys, function (id, categoryData) {
            // ссылки для категорий
            $(self.selectors.searchSuggestItem + '.goto-catagory[data-category_id="' + id + '"] a')
                .attr('href', categoryData.href);

            // искать в категориях
            $(self.selectors.searchSuggestItem + '.search-in-category[data-category_id="' + id + '"] a')
                .attr('href', categoryData.hrefSearchInCategory);

        });
    }
    /**
     * Загрузка JS файлов
     * @param url - файл
     * @param callback - после загрузки файла
     * @private
     */
    this._loadJsFile = function (url, callback) {
        var script = document.createElement("script")
        script.type = "text/javascript";
        if (typeof callback === 'function') {
            if (script.readyState) {  //IE
                script.onreadystatechange = function () {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {  //Others
                script.onload = function () {
                    callback();
                };
            }
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

// END ***
};


(function (w) {
    w.modRokajaxsearchDrive.prototype = new GNZ11();
    w.winModRokajaxsearchDrive = new window.modRokajaxsearchDrive();
    w.winModRokajaxsearchDrive.Init();
})(window);

/**
 * ПОЛИФИЛЛ : Для браузеров не поддерживающих Element.closest()
 */
(function (ELEMENT) {
    ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
    ELEMENT.closest = ELEMENT.closest || function closest(selector) {
        if (!this) return null;
        if (this.matches(selector)) return this;
        if (!this.parentElement) {
            return null
        } else return this.parentElement.closest(selector)
    };
}(Element.prototype));
























