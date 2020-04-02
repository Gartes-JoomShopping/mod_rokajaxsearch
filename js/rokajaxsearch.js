var RokAjaxSearch = new Class({
    version: "2.0 (mt 1.2)",
    Implements: [Options, Events],
    options: {
        results: null,
        close: null,
        websearch: false,
        blogsearch: false,
        imagesearch: false,
        videosearch: false,
        imagesize: "MEDIUM",
        safesearch: "MODERATE",
        search: null,
        readmore: null,
        noresults: null,
        advsearch: null,
        searchlink: null,
        advsearchlink: null,
        page: null,
        page_of: null,
        uribase: null,
        limit: null,
        perpage: null,
        ordering: null,
        phrase: null,
        keyevents: true,
        hidedivs: null,
        includelink: null,
        viewall: null,
        estimated: null,
        showestimated: true,
        showpagination: true,
        showcategory: true,
        showreadmore: true,
        showdescription: true,
        wordpress: false
    },
    initialize: function(b) {
        this.setOptions(b);
        this.timer = null;
        this.rows = ["roksearch_odd", "roksearch_even"];
        this.searchphrase = this.options.phrase;
        this.inputBox = document.getElements("#rokajaxsearch input.inputbox").set("autocomplete", "off");
        var e = this.inputBox.getCoordinates();
        var d = document.id(document.body).getLast();
        if (d && d.get("id") == "roksearch_results") {
            this.results = d;
        } else {
            this.results = document.id("roksearch_results").setStyles({
                position: "absolute",
                top: e[0].top + e[0].height,
                left: this.getLeft()
            }).inject(document.body);
        }
        this.fx = new Fx.Tween(this.results).set("opacity", 0);
        this.current = 0;
        var a = this;
        window.addEvent("resize", function() {
            a.results.setStyle("left", a.getLeft());
        });
        this.type = "local";
        var c = this.options.perpage;
        if (this.options.websearch || this.options.blogsearch || this.options.imagesearch) {
            document.getElements("#rokajaxsearch .search_options input[type=radio]").each(function(f) {
                f.addEvent("click", function() {
                    this.type = f.value;
                    if (this.type == "web" || this.type == "blog" || this.type == "images" || this.type == "videos") {
                        this.options.perpage = 4;
                        if (this.type == "web") {
                            this.google = new google.search.WebSearch();
                        } else {
                            if (this.type == "blog") {
                                this.google = new google.search.BlogSearch();
                            } else {
                                if (this.type == "images") {
                                    this.options.perpage = 3;
                                    this.google = new google.search.ImageSearch();
                                    this.google.setRestriction(google.search.ImageSearch.RESTRICT_IMAGESIZE, google.search.ImageSearch["IMAGESIZE_" + this.options.imagesize]);
                                } else {
                                    if (this.type == "videos") {
                                        this.options.perpage = 3;
                                        this.google = new google.search.VideoSearch();
                                    }
                                }
                            }
                        }
                        if (this.type != "blog" && this.type != "videos") {
                            this.google.setRestriction(google.search.Search.RESTRICT_SAFESEARCH, google.search.Search["SAFESEARCH_" + this.options.safesearch]);
                        }
                        this.google.setResultSetSize(google.search.Search.SMALL_RESULTSET);
                        this.google.setNoHtmlGeneration();
                        this.google.setSearchCompleteCallback(this, this.googleComplete);
                    } else {
                        this.options.perpage = c;
                    }
                }.bind(this));
            }, this);
        }
        this.addEvents();
        this.keyEvents();
    },
    getLeft: function(b) {
        var e = (b ? b : this.inputBox).getCoordinates(),
            a = document.id("roksearch_results").getSize().x;
        var d = document.id(window).getSize(),
            c;
        if (d.x / 2 < e.left + e.width) {
            c = e.left + e.width - a;
        } else {
            c = e.left;
        }
        if (c < 0) {
            c = e.left;
        }
        return c;
    },
    googleStart: function() {
        if (!this.inputBox.hasClass("loading")) {
            this.inputBox.addClass("loading");
        }
        this.google.execute(this.inputBox.value);
    },
    googleComplete: function() {
        var d = this.google.results;
        var c = document.id("rokajaxsearch_tmp");
        var b = new Element("ol", {
            "class": "list"
        }).inject(c);
        if (this.type == "web") {
            d.each(function(h) {
                var f = new Element("li");
                var g = new Element("a", {
                    href: h.unescapedUrl
                }).set("target", "_blank").set("html", h.title);
                var n = new Element("h4").inject(f).adopt(g);
                var k = new Element("p").set("html", '<small><a href="' + h.url + '" target="_blank">' + h.visibleUrl + "</a></small>").inject(f);
                var i = h.content;
                i = i.replace("<b>", '<span class="highlight">').replace("</b>", "</span>");
                var m = new Element("div", {
                    "class": "description"
                }).set("html", i).inject(f);
                f.inject(b);
            });
        } else {
            if (this.type == "blog") {
                d.each(function(h) {
                    var f = new Element("li");
                    var g = new Element("a", {
                        href: h.postUrl
                    }).set("target", "_blank").set("html", h.title);
                    var n = new Element("h4").inject(f).adopt(g);
                    var k = new Element("p").set("html", "<small>by " + h.author + ' - <a href="' + h.blogUrl + '" target="_blank">' + h.blogUrl + "</a></small>").inject(f);
                    var i = h.content;
                    i = i.replace("<b>", '<span class="highlight">').replace("</b>", "</span>");
                    var m = new Element("div", {
                        "class": "description"
                    }).set("html", i).inject(f);
                    f.inject(b);
                });
            } else {
                if (this.type == "images") {
                    d.each(function(n) {
                        var q = new Element("li");
                        var h = new Element("a", {
                            href: n.url
                        }).set("target", "_blank").set("html", n.title);
                        var p = new Element("h4").inject(q).adopt(h);
                        var f = new Element("p").set("html", '<small><a href="' + n.originalContextUrl + '" target="_blank">' + n.visibleUrl + "</a></small>").inject(q);
                        var m = n.content;
                        m = m.replace("<b>", '<span class="highlight">').replace("</b>", "</span>");
                        var k = new Element("div", {
                            "class": "description"
                        }).set("html", m).inject(q);
                        var g = new Element("div", {
                            "class": "google-thumb-image loading"
                        }).inject(k);
                        g.setStyles({
                            width: n.tbWidth.toInt(),
                            height: n.tbHeight.toInt()
                        });
                        var o = new Element("a", {
                            href: n.url,
                            target: "_blank"
                        }).inject(g);
                        var i = new Element("image", {
                            width: n.tbWidth.toInt(),
                            height: n.tbHeight.toInt(),
                            src: n.tbUrl
                        }).inject(o);
                        q.inject(b);
                    });
                } else {
                    if (this.type == "videos") {
                        d.each(function(r) {
                            var w = new Element("li");
                            var n = new Element("a", {
                                href: r.playUrl
                            }).set("target", "_blank").set("html", r.title);
                            var u = new Element("h4").inject(w).adopt(n);
                            var v = r.duration.toInt();
                            var k = "00:" + ((v < 10) ? "0" + v : v);
                            if (v >= 60) {
                                var i = v / 60;
                                var x = v - (i * 60);
                                i = i.toInt();
                                x = x.toInt();
                                if (i < 10) {
                                    i = "0" + i;
                                }
                                if (x < 10) {
                                    x = "0" + x;
                                }
                                k = i + ":" + x;
                                if (i >= 60) {
                                    var p = i / 60;
                                    p = p.toInt();
                                    if (p < 10) {
                                        p = "0" + p;
                                    }
                                    k = p + k;
                                }
                            }
                            var f = new Element("p").set("html", '<span class="' + r.videoType.toLowerCase() + '">Rating: ' + (parseFloat(r.rating)).toFixed(2) + " | Duration: " + k + " <small>" + r.videoType + "</small></span>").inject(w);
                            var q = new Element("div", {
                                "class": "description"
                            }).set("html", "").inject(w);
                            var g = new Element("div", {
                                "class": "google-thumb-image loading"
                            }).inject(q);
                            g.setStyles({
                                width: r.tbWidth.toInt(),
                                height: r.tbHeight.toInt(),
                                "text-align": "center"
                            });
                            var t = new Element("a", {
                                href: r.url,
                                target: "_blank"
                            }).inject(g);
                            var o = new Element("image", {
                                src: r.tbUrl,
                                width: r.tbWidth.toInt(),
                                height: r.tbHeight.toInt()
                            }).inject(t);
                            w.inject(b);
                        });
                    }
                }
            }
        }
        this.results.empty().removeClass("roksearch_results").setStyle("visibility", "visible");
        this.arrowleft = null;
        this.arrowright = null;
        this.selectedEl = -1;
        this.els = [];
        this.outputTableless();
        c.empty().setStyle("visibility", "visible");
        this.inputBox.removeClass("loading");
        var e = this.inputBox.getCoordinates(),
            a = this;
        this.results.setStyles({
            top: e.top + e.height,
            left: a.getLeft()
        });
        this.fx.start("opacity", 1);
        this.fireEvent("loaded");
    },
    addEvents: function() {
        var a = this;
        this.inputBox.addEvents({
            keydown: function(b) {
                clearTimeout(this.timer);
                if (b.key == "enter") {
                    b.stop();
                }
            },
            paste: function(e) {
                var self = this;
                setTimeout(function(e) {
                    clearTimeout(a.timer);
                    var i = a.options.searchlink.split("?")[0];
                    i = i.replace(a.options.uribase, "");
                    i = (i) ? i : "index.php";
                    var f = a.options.uribase + i,
                        b = self;
                    if (a.options.wordpress) {
                        f = a.options.uribase + a.options.searchlink;
                    }
                    if (self.value == "") {
                        var h = a.options.hidedivs.split(" ");
                        a.results.empty().removeClass("roksearch_results").setStyle("visibility", "hidden");
                        if (h.length > 0 && h != "") {
                            h.each(function(e) {
                                document.id(e).setStyle("visibility", "visible");
                            });
                        }
                    } else {
                        if (a.type == "local") {
                            var c = self.value.split('"');
                            if (c.length >= 3) {
                                a.options.phrase = "exact";
                            } else {
                                a.options.phrase = a.searchphrase;
                            }
                            var d = new Request({
                                url: f,
                                method: "get",
                                delay: 200,
                                onRequest: function() {
                                    b.addClass("loading");
                                }.bind(self),
                                onSuccess: function(r, s, p) {
                                    var n = new Element("div", {
                                        styles: {
                                            display: "none"
                                        }
                                    }).set("html", r);
									this.categorys = n.getElement("div[id=joomshopping_categorys_search]");
                                    var o = document.id("rokajaxsearch_tmp");
                                    var e = n.getElement(".contentpaneopen");
                                    if (e) {
                                        n.getChildren().each(function(t) {
                                            if (t.get("class") == "contentpaneopen" && t.id != "page") {
                                                o.set("html", t.innerHTML);
                                            }
                                        });
                                    } else {
                                        n.inject(document.body);
                                        n.setStyles({
                                            display: "block",
                                            position: "absolute",
                                            top: -10000
                                        });
                                        e = n.getElement("div.search-results") || n.getElement("div.search") || n.getElement("div[id=page]") || n.getElement("div.items");
                                        if (!e) {
                                            e = n.getElement("div.search");
                                        }
                                        n.dispose();
                                        if (e) {
                                            var m = e.getElement(".search-results") || e.getElement(".search") || e.getElement(".results") || e;
                                            o.adopt(m);
                                        }
                                    }
                                    this.results.empty().removeClass("roksearch_results").setStyle("visibility", "visible");
                                    this.arrowleft = null;
                                    this.arrowright = null;
                                    this.selectedEl = -1;
                                    this.els = [];
                                    if (n.getElement(".contentpaneopen")) {
                                        this.outputTable();
                                    } else {
                                        this.outputTableless();
                                    }
                                    o.empty().setStyle("visibility", "visible");
                                    b.removeClass("loading");
                                    var q = b.getCoordinates(),
                                        k = this;
                                    k.results.setStyles({
                                        top: q.top + q.height,
                                        left: k.getLeft(b)
                                    });
                                    k.fx.start("opacity", 1);
                                    k.fireEvent("loaded");
                                }.bind(a)
                            });
                            if (a.options.wordpress) {
                                a.timer = d.get.delay(500, d, [{
                                    s: self.value.replace(/\"/g, ""),
                                    task: "search",
                                    action: "rokajaxsearch",
                                    r: Date.now()
                                }]);
                            } else {
                                a.timer = d.get.delay(500, d, [{
                                    type: "raw",
                                    option: "com_search",
                                    view: "search",
                                    category_id: document.id("category_id").value,
                                    searchphrase: a.options.phrase,
                                    ordering: a.options.ordering,
                                    limit: a.options.limit,
                                    searchword: self.value.replace(/\"/g, ""),
                                    tmpl: "component",
                                    r: Date.now()
                                }]);
                            }
                        } else {
                            if (a.type != "local") {
                                a.timer = a.googleStart.delay(500, a);
                            }
                        }
                    }
                    return true;
                }, 0);
            },
            keyup: function(g) {
                if (g.code == 17 || g.code == 18 || g.code == 224 || g.alt || g.control || g.meta) {
                    return false;
                }
                if (g.alt || g.control || g.meta || g.key == "esc" || g.key == "up" || g.key == "down" || g.key == "left" || g.key == "right") {
                    return true;
                }
                if (g.key == "enter") {
                    g.stop();
                }
                if (g.key == "enter" && a.selectedEl != -1) {
                    if (a.selectedEl || a.selectedEl == 0) {
                        location.href = a.els[a.selectedEl].getFirst("a");
                    }
                    return false;
                }
                clearTimeout(a.timer);
                var i = a.options.searchlink.split("?")[0];
                i = i.replace(a.options.uribase, "");
                i = (i) ? i : "index.php";
                var f = a.options.uribase + i,
                    b = this;
                if (a.options.wordpress) {
                    f = a.options.uribase + a.options.searchlink;
                }
                if (this.value == "") {
                    var h = a.options.hidedivs.split(" ");
                    a.results.empty().removeClass("roksearch_results").setStyle("visibility", "hidden");
                    if (h.length > 0 && h != "") {
                        h.each(function(e) {
                            document.id(e).setStyle("visibility", "visible");
                        });
                    }
                } else {
                    if (a.type == "local") {
                        var c = this.value.split('"');
                        if (c.length >= 3) {
                            a.options.phrase = "exact";
                        } else {
                            a.options.phrase = a.searchphrase;
                        }
                        var d = new Request({
                            url: f,
                            method: "get",
                            delay: 200,
                            onRequest: function() {
                                b.addClass("loading");
                            }.bind(this),
                            onSuccess: function(r, s, p) {
                                var n = new Element("div", {
                                    styles: {
                                        display: "none"
                                    }
                                }).set("html", r);
								this.categorys = n.getElement("div[id=joomshopping_categorys_search]");
                                var o = document.id("rokajaxsearch_tmp");
                                var e = n.getElement(".contentpaneopen");
                                if (e) {
                                    n.getChildren().each(function(t) {
                                        if (t.get("class") == "contentpaneopen" && t.id != "page") {
                                            o.set("html", t.innerHTML);
                                        }
                                    });
                                } else {
                                    n.inject(document.body);
                                    n.setStyles({
                                        display: "block",
                                        position: "absolute",
                                        top: -10000
                                    });
                                    e = n.getElement("div.search-results") || n.getElement("div.search") || n.getElement("div[id=page]") || n.getElement("div.items");
                                    if (!e) {
                                        e = n.getElement("div.search");
                                    }
                                    n.dispose();
                                    if (e) {
                                        var m = e.getElement(".search-results") || e.getElement(".search") || e.getElement(".results") || e;
                                        o.adopt(m);
                                    }
                                }
                                this.results.empty().removeClass("roksearch_results").setStyle("visibility", "visible");
								// if (categ) {
								// }
                                this.arrowleft = null;
                                this.arrowright = null;
                                this.selectedEl = -1;
                                this.els = [];
                                if (n.getElement(".contentpaneopen")) {
                                    this.outputTable();
                                } else {
                                    this.outputTableless();
                                }
                                o.empty().setStyle("visibility", "visible");
                                b.removeClass("loading");
                                var q = b.getCoordinates(),
                                    k = this;
                                k.results.setStyles({
                                    top: q.top + q.height,
                                    left: k.getLeft(b)
                                });
                                k.fx.start("opacity", 1);
                                k.fireEvent("loaded");
                            }.bind(a)
                        });
                        if (a.options.wordpress) {
                            a.timer = d.get.delay(500, d, [{
                                s: this.value.replace(/\"/g, ""),
                                task: "search",
                                action: "rokajaxsearch",
                                r: Date.now()
                            }]);
                        } else {
                            a.timer = d.get.delay(500, d, [{
                                type: "raw",
                                option: "com_search",
                                view: "search",
                                category_id: document.id("category_id").value,
                                searchphrase: a.options.phrase,
                                ordering: a.options.ordering,
                                limit: a.options.limit,
                                searchword: this.value.replace(/\"/g, ""),
                                tmpl: "component",
                                r: Date.now()
                            }]);
                        }
                    } else {
                        if (a.type != "local") {
                            a.timer = a.googleStart.delay(500, a);
                        }
                    }
                }
                return true;
            }
        });
        return this;
    },
    keyEvents: function() {
        var a = {
            keyup: function(c) {
                if (c.key == "left" || c.key == "right" || c.key == "up" || c.key == "down" || c.key == "enter" || c.key == "esc") {
                    c.stop();
                    var b = false;
                    if (c.key == "left" && this.arrowleft) {
                        this.arrowleft.fireEvent("click");
                    } else {
                        if (c.key == "right" && this.arrowright) {
                            this.arrowright.fireEvent("click");
                        } else {
                            if (c.key == "esc" && this.close) {
                                this.close.fireEvent("click", c);
                            } else {
                                if (c.key == "down") {
                                    b = this.selectedEl;
                                    if (this.selectedEl == -1) {
                                        this.selectedEl = (this.options.perpage) * this.current;
                                    } else {
                                        if (this.selectedEl + 1 < this.els.length) {
                                            this.selectedEl++;
                                        } else {
                                            return;
                                        }
                                    }
                                    if (b != -1) {
                                        this.els[b].fireEvent("mouseleave");
                                    }
                                    if ((this.selectedEl / this.options.perpage).toInt() > this.current) {
                                        this.arrowright.fireEvent("click", true);
                                    }
                                    if (this.selectedEl || this.selectedEl == 0) {
                                        this.els[this.selectedEl].fireEvent("mouseenter");
                                    }
                                } else {
                                    if (c.key == "up") {
                                        b = this.selectedEl;
                                        if (this.selectedEl == -1) {
                                            this.selectedEl = (this.options.perpage) * this.current;
                                        } else {
                                            if (this.selectedEl - 1 >= 0) {
                                                this.selectedEl--;
                                            } else {
                                                return;
                                            }
                                        }
                                        if (b != -1) {
                                            this.els[b].fireEvent("mouseleave");
                                        }
                                        if ((this.selectedEl / this.options.perpage).toInt() < this.current) {
                                            this.arrowleft.fireEvent("click", true);
                                        }
                                        if (this.selectedEl || this.selectedEl == 0) {
                                            this.els[this.selectedEl].fireEvent("mouseenter");
                                        }
                                    } else {
                                        if (c.key == "enter") {
                                            if (this.selectedEl || this.selectedEl == 0) {
                                                window.location = this.els[this.selectedEl].getElement("a");
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }.bind(this)
        };
        if (this.options.keyevents) {
            this.addEvent("loaded", function() {
                document.addEvent("keyup", a.keyup);
            });
            this.addEvent("unloaded", function() {
                document.removeEvent("keyup", a.keyup);
            });
        }
    },
    outputTable: function() {
        var e = this;
        var q = new Element("div", {
            "class": "roksearch_wrapper1"
        }).inject(this.results);
        var p = new Element("div", {
            "class": "roksearch_wrapper2"
        }).inject(q);
        var n = new Element("div", {
            "class": "roksearch_wrapper3"
        }).inject(p);
        var k = new Element("div", {
            "class": "roksearch_wrapper4"
        }).inject(n);
        var o = new Element("div", {
            "class": "roksearch_header png"
        }).set("html", this.options.results).inject(k);
        this.close = new Element("a", {
            id: "roksearch_link",
            "class": "png"
        }).set("href", "#").set("html", this.options.close).inject(o, "before");
        var f = this.options.hidedivs.split(" ");
        this.close.addEvent("click", function(w) {
            this.fireEvent("unloaded");
            if (w) {
                w.stop();
            }
            this.inputBox.value = "";
            var v = this;
            this.fx.start("opacity", 0).chain(function() {
                v.results.empty().removeClass("roksearch_results");
            });
            if (f.length > 0 && f != "") {
                f.each(function(x) {
                    document.id(x).setStyle("visibility", "visible");
                });
            }
        }.bind(this));
        if (f.length > 0 && f != "") {
            f.each(function(v) {
                document.id(v).setStyle("visibility", "hidden");
            });
        }
        this.results.addClass("roksearch_results");
        var g = document.getElements("#rokajaxsearch_tmp fieldset"),
            c, d;
        if (g.length > 0) {
            d = new Element("div", {
                "class": "container-wrapper"
            }).inject(k);
            var r = new Element("div", {
                "class": "container-scroller"
            }).inject(d);
            g.each(function(w, v) {
                var x = "";
                x = w.getChildren();
                if (x.length > 0) {
                    x.each(function(A, G) {
                        if (A.get("tag") == "div") {
                            if (A.getChildren().length > 2 && !A.getPrevious()) {
                                var F = A.getFirst().getNext().getProperty("href");
                                var E = new Element("div", {
                                    "class": this.rows[v % 2] + " png"
                                });
                                var H = new Element("a").set("href", F).inject(E);
                                var B = new Element("h3").set("html", A.getFirst().getNext().get("text")).inject(H);
                                this.els.push(E);
                                E.addEvents({
                                    mouseenter: function() {
                                        this.addClass(e.rows[v % 2] + "-hover");
                                        e.selectedEl = v;
                                    },
                                    mouseleave: function() {
                                        this.removeClass(e.rows[v % 2] + "-hover");
                                        if (e.selectedEl == v) {
                                            e.selectedEl = -1;
                                        }
                                    }
                                });
                                var K = "";
                                if (this.options.showdescription) {
                                    K = A.getNext().innerHTML;
                                }
                                var I = new Element("span").set("html", K).inject(H, "after");
                                var L;
                                if (this.options.showcategory) {
                                    var J = new Element("span", {
                                        "class": "small"
                                    }).set("html", A.getChildren().getLast().get("text")).inject(H, "after");
                                    L = new Element("br").inject(J, "after");
                                }
                                if (this.options.showreadmore) {
                                    H = new Element("a", {
                                        "class": "clr"
                                    }).set("href", F).set("html", this.options.readmore).inject(I, "after");
                                    if (this.options.showdescription) {
                                        L = new Element("br").inject(I, "after");
                                    }
                                }
                                var D = new Element("div", {
                                    "class": "roksearch_result_wrapper1 png"
                                }).inject(r);
                                var C = new Element("div", {
                                    "class": "roksearch_result_wrapper2 png"
                                }).inject(D);
                                var z = new Element("div", {
                                    "class": "roksearch_result_wrapper3 png"
                                }).inject(C);
                                var y = new Element("div", {
                                    "class": "roksearch_result_wrapper4 png"
                                }).inject(z);
                                E.inject(y);
                            }
                        }
                    }, this);
                }
            }, this);
            c = r.getChildren();
            var m = Math.max(this.options.perpage, c.length);
            var h = Math.min(this.options.perpage, c.length);
            var i = this.options.perpage;
            this.page = [];
            (Math.abs(m / h)).times(function(v) {
                if (c[v]) {
                    this.page.push(new Element("div", {
                        "class": "page page-" + v
                    }).inject(r).setStyle("width", r.getStyle("width")));
                }
                for (j = 0, l = i; j < l; j++) {
                    if (c[v * i + j]) {
                        c[v * i + j].inject(this.page[v]);
                    }
                }
            }.bind(this));
            r.setStyle("width", d.getStyle("width").toInt() * Math.round(m / h) + 1000);
        }
        var u;
        if (!g.length) {
            var a = new Element("div", {
                "class": this.rows[0]
            });
            u = new Element("h3").set("html", this.options.noresults).inject(a);
            var t = new Element("a").set("href", this.options.advsearchlink).inject(u, "after");
            u = new Element("span", {
                "class": "advanced-search"
            }).set("html", this.options.advsearch).inject(t);
            a.inject(k);
        } else {
            if (this.options.includelink) {
                var s = document.getElements("#rokajaxsearch input[name=limit]")[0];
                this.bottombar = new Element("div", {
                    "class": "roksearch_row_btm png"
                });
                var b = new Element("a").set("href", "#").inject(this.bottombar);
                u = new Element("span").set("html", this.options.viewall).inject(b);
                b.addEvent("click", function(v) {
                    if (v) {
                        v.stop();
                    }
                    document.id("rokajaxsearch").submit();
                });
                this.bottombar.inject(k);
                if (c.length > this.options.perpage) {
                    this.arrowDiv = new Element("div", {
                        "class": "container-arrows"
                    }).inject(this.bottombar, "top");
                    this.arrowleft = new Element("div", {
                        "class": "arrow-left-disabled"
                    }).inject(this.arrowDiv);
                    this.arrowright = new Element("div", {
                        "class": "arrow-right"
                    }).inject(this.arrowDiv);
                    this.arrowsInit(d);
                }
            }
        }
    },
    outputTableless: function() {
        var i = this;
        var v = new Element("div", {
            "class": "roksearch_wrapper1"
        }).inject(this.results);
        var u = new Element("div", {
            "class": "roksearch_wrapper2"
        }).inject(v);
        var s = new Element("div", {
            "class": "roksearch_wrapper3"
        }).inject(u);
        var q = new Element("div", {
            "class": "roksearch_wrapper4"
        }).inject(s);
        var t = new Element("div", {
            "class": "roksearch_header png"
        }).set("html", this.options.results).inject(q);
        if (this.type != "local") {
            q.addClass("google-search").addClass("google-search-" + this.type);
            var d = '<span class="powered-by-google">(powered by <a href="http://google.com" target="_blank">Google</a>)</span>';
            t.set("html", this.options.results + d);
        }
        this.close = new Element("a", {
            id: "roksearch_link",
            "class": "png"
        }).set("href", "#").set("html", this.options.close).inject(t, "before");
        var k = this.options.hidedivs.split(" ");
        this.close.addEvent("click", function(B) {
            this.fireEvent("unloaded");
            if (B) {
                B.stop();
            }
            this.inputBox.value = "";
            var A = this;
            this.fx.start("opacity", 0).chain(function() {
                A.results.empty().removeClass("roksearch_results");
            });
            if (k.length > 0 && k != "") {
                k.each(function(C) {
                    document.id(C).setStyle("visibility", "visible");
                });
            }
        }.bind(this));
        if (k.length > 0 && k != "") {
            k.each(function(A) {
                document.id(A).setStyle("visibility", "hidden");
            });
        }
        this.results.addClass("roksearch_results");
        var n = document.getElements("#rokajaxsearch_tmp ol.list li"),
            c, g, e;
        if (!n.length) {
            n = document.getElements("#rokajaxsearch_tmp dl dt");
        }
        if (!n.length) {
            n = document.getElements("#rokajaxsearch_tmp .item");
        }
        if (n.length > 0) {
            g = new Element("div", {
                "class": "container-wrapper"
            }).inject(q);
            var w = new Element("div", {
                "class": "container-scroller"
            }).inject(g);
			if (this.categorys) {
				new Element("div", {
					"class": "joomshopping_categorys_search"
				}).set("html", this.categorys.innerHTML).inject(w);
			}
            n.each(function(M, I) {
                var H = "";
                H = M.getChildren();
                if (H.length > 0) {
                    var G = M.getElement("a").get("href");
                    var F = new Element("div", {
                        "class": this.rows[I % 2] + " png"
                    });
                    var K = new Element("a").set("href", G).inject(F);
                    if (this.type != "local") {
                        K.set("target", "_blank");
                    }
                    var C = new Element("h3").set("html", (H[0].get("tag") == "header" ? M.getElement(".title") : H[0]).get("text")).inject(K);
                    this.els.push(F);
                    F.addEvents({
                        mouseenter: function() {
                            this.addClass(i.rows[I % 2] + "-hover");
                            i.selectedEl = I;
                        },
                        mouseleave: function() {
                            this.removeClass(i.rows[I % 2] + "-hover");
                            if (i.selectedEl == I) {
                                i.selectedEl = -1;
                            }
                        }
                    });
                    var P = "";
                    if (this.options.showdescription) {
                        var O = M.getNext(".result-text") || H[2] || H[1];
                        P = O.innerHTML;
                    }
                    var J = new Element("span").set("html", P).inject(K, "after"),
                        Q;
                    if (this.options.showcategory) {
                        var L = M.getNext(".result-category") || M.getElement("p.meta") || H[1];
                        if (L) {
                            var N = new Element("span", {
                                "class": "small"
                            }).set("html", L.innerHTML).inject(K, "after");
                            Q = new Element("br").inject(N, "after");
                        }
                    }
                    if (this.options.showreadmore) {
                        K = new Element("a", {
                            "class": "clr"
                        }).set("href", G).set("html", this.options.readmore).inject(J, "after");
                        if (this.type != "local") {
                            K.set("target", "_blank");
                        }
                        if (this.options.showdescription) {
                            Q = new Element("br").inject(J, "after");
                        }
                    }
                    var E = new Element("div", {
                        "class": "roksearch_result_wrapper1 png"
                    }).inject(w);
                    var D = new Element("div", {
                        "class": "roksearch_result_wrapper2 png"
                    }).inject(E);
                    var B = new Element("div", {
                        "class": "roksearch_result_wrapper3 png"
                    }).inject(D);
                    var A = new Element("div", {
                        "class": "roksearch_result_wrapper4 png"
                    }).inject(B);
                    F.inject(A);
                }
            }, this);
            c = w.getChildren();
            var r = Math.max(this.options.perpage, c.length);
            var o = Math.min(this.options.perpage, c.length);
            var p = this.options.perpage;
            this.page = [];
            (Math.abs(r / o)).times(function(A) {
                if (c[A]) {
                    this.page.push(new Element("div", {
                        "class": "page page-" + A
                    }).inject(w).setStyle("width", w.getStyle("width")));
                }
                for (j = 0, l = p; j < l; j++) {
                    if (c[A * p + j]) {
                        c[A * p + j].inject(this.page[A]);
                    }
                }
            }.bind(this));
            if (this.type != "local") {
                var h = this.page[0].getSize();
                this.page[0].setStyle("position", "relative");
                this.layer = new Element("div", {
                    "class": "rokajaxsearch-overlay",
                    styles: {
                        width: h.x,
                        height: h.y,
                        position: "absolute",
                        left: 0,
                        top: 0,
                        display: "block",
                        "z-index": 5
                    }
                }).inject(this.page[0], "top");
                e = new Fx.Tween(this.layer, {
                    duration: 300
                }).set("opacity", 0.9);
            }
            w.setStyle("width", g.getStyle("width").toInt() * Math.round(r / o) + 1000);
        }
        var z, f;
        if (!n.length) {
            var a = new Element("div", {
                "class": this.rows[0]
            });
            z = new Element("h3").set("html", this.options.noresults).inject(a);
            var y = new Element("a").set("href", this.options.advsearchlink).inject(z, "after");
            z = new Element("span", {
                "class": "advanced-search"
            }).set("html", this.options.advsearch).inject(y);
            a.inject(q);
        } else {
            if (this.options.includelink) {
                var x = document.getElements("#rokajaxsearch input[name=limit]")[0];
                this.bottombar = new Element("div", {
                    "class": "roksearch_row_btm png"
                });
                var b = new Element("a", {
                    "class": "viewall"
                }).set("href", "#").inject(this.bottombar);
                z = new Element("span").set("html", this.options.viewall).inject(b);
                if (this.type != "local") {
                    b.setProperties({
                        href: this.google.cursor.moreResultsUrl,
                        target: "_blank"
                    });
                    if (this.options.showestimated) {
                        f = new Element("span", {
                            "class": "estimated_res"
                        }).set("text", "(" + this.google.cursor.estimatedResultCount + " " + this.options.estimated + ")").inject(b, "after");
                    }
                    if (this.options.showpagination) {
                        this.pagination = new Element("div", {
                            "class": "pagination_res"
                        }).inject(f || b, "after");
                        this.pagination.set("html", this.options.page + ' <span class="highlight">' + (this.google.cursor.currentPageIndex + 1) + "</span> " + this.options.page_of + ' <span class="highlight">' + this.google.cursor.pages.length + "</span>");
                    }
                } else {
                    b.addEvent("click", function(A) {
                        if (A) {
                            A.stop();
                        }
                        document.id("rokajaxsearch").submit();
                    });
                }
                this.bottombar.inject(q);
                if (c.length > this.options.perpage || ((this.type != "local") && this.google.cursor.pages.length > 1)) {
                    this.arrowDiv = new Element("div", {
                        "class": "container-arrows"
                    }).inject(this.bottombar, "top");
                    this.arrowleft = new Element("div", {
                        "class": "arrow-left-disabled"
                    }).inject(this.arrowDiv);
                    this.arrowright = new Element("div", {
                        "class": "arrow-right"
                    }).inject(this.arrowDiv);
                    if (this.type != "local") {
                        if (this.google.cursor) {
                            var m = this.google.cursor.currentPageIndex;
                            if (m > 0) {
                                this.arrowleft.removeClass("arrow-left-disabled").addClass("arrow-left");
                            }
                            if (m == 7) {
                                this.arrowright.removeClass("arrow-right").addClass("arrow-right-disabled");
                            }
                        }
                        this.arrowsGoogleInit(g);
                        e.start("opacity", 0).chain(function() {
                            e.element.setStyle("visibility", "hidden");
                        });
                    } else {
                        this.arrowsInit(g);
                    }
                }
            }
        }
    },
    arrowsGoogleInit: function(a) {
        this.arrowleft.addEvent("click", function(b) {
            if (!b && this.selectedEl >= 0) {
                this.els[this.selectedEl].fireEvent("mouseleave");
            }
            if (!b) {
                this.selectedEl = -1;
            }
            var c = (this.google.cursor) ? this.google.cursor.currentPageIndex : null;
            if (c - 1 <= 0) {
                this.arrowleft.removeClass("arrow-left").addClass("arrow-left-disabled");
                this.arrowright.removeClass("arrow-right-disabled").addClass("arrow-right");
            } else {
                this.arrowleft.removeClass("arrow-left-disabled").addClass("arrow-left");
                this.arrowright.removeClass("arrow-right-disabled").addClass("arrow-right");
            }
            if (!c) {
                return;
            } else {
                if (!this.inputBox.hasClass("loading")) {
                    this.inputBox.addClass("loading");
                }
                this.layer.setStyle("opacity", 0.9);
                this.google.gotoPage(c - 1);
            }
        }.bind(this));
        this.arrowright.addEvent("click", function(b) {
            if (!b && this.selectedEl >= 0) {
                this.els[this.selectedEl].fireEvent("mouseleave");
            }
            if (!b) {
                this.selectedEl = -1;
            }
            var c = (this.google.cursor) ? this.google.cursor.currentPageIndex : null;
            if (c + 1 >= this.google.cursor.pages.length) {
                this.arrowleft.removeClass("arrow-left-disabled").addClass("arrow-left");
                this.arrowright.removeClass("arrow-right").addClass("arrow-right-disabled");
            } else {
                this.arrowleft.removeClass("arrow-left").addClass("arrow-left-disabled");
                this.arrowright.removeClass("arrow-right-disabled").addClass("arrow-right");
            }
            if (c >= this.google.cursor.pages.length - 1) {
                return;
            } else {
                if (this.arrowleft.hasClass("arrow-left-disabled")) {
                    this.arrowleft.removeClass("arrow-left-disabled").addClass("arrow-left");
                }
                if (!this.inputBox.hasClass("loading")) {
                    this.inputBox.addClass("loading");
                }
                this.layer.setStyle("opacity", 0.9);
                this.google.gotoPage(c + 1);
            }
        }.bind(this));
    },
    arrowsInit: function(a) {
        this.scroller = new Fx.Scroll(a, {
            wait: false
        });
        this.arrowleft.addEvent("click", function(b) {
            if (!b && this.selectedEl >= 0) {
                this.els[this.selectedEl].fireEvent("mouseleave");
            }
            if (!b) {
                this.selectedEl = -1;
            }
            if (this.current - 1 <= 0) {
                this.arrowleft.removeClass("arrow-left").addClass("arrow-left-disabled");
                this.arrowright.removeClass("arrow-right-disabled").addClass("arrow-right");
            } else {
                this.arrowleft.removeClass("arrow-left-disabled").addClass("arrow-left");
                this.arrowright.removeClass("arrow-right-disabled").addClass("arrow-right");
            }
            if (!this.current) {
                return;
            } else {
                if (this.current < 0) {
                    this.current = 0;
                } else {
                    this.current -= 1;
                }
                this.scroller.toElement(this.page[this.current]);
            }
        }.bind(this));
        this.arrowright.addEvent("click", function(b) {
            if (!b && this.selectedEl >= 0) {
                this.els[this.selectedEl].fireEvent("mouseleave");
            }
            if (!b) {
                this.selectedEl = -1;
            }
            if (this.current + 1 >= this.page.length - 1) {
                this.arrowleft.removeClass("arrow-left-disabled").addClass("arrow-left");
                this.arrowright.removeClass("arrow-right").addClass("arrow-right-disabled");
            } else {
                this.arrowleft.removeClass("arrow-left").addClass("arrow-left-disabled");
                this.arrowright.removeClass("arrow-right-disabled").addClass("arrow-right");
            }
            if (this.current >= this.page.length) {
                return;
            } else {
                if (this.arrowleft.hasClass("arrow-left-disabled")) {
                    this.arrowleft.removeClass("arrow-left-disabled").addClass("arrow-left");
                }
                if (this.current >= this.page.length - 1) {
                    this.current = this.page.length - 1;
                } else {
                    this.current += 1;
                }
                this.scroller.toElement(this.page[this.current]);
            }
        }.bind(this));
    }
});

jQuery(function($) {
    $('.rok_search_category_link').click(function() {
        if ($('.rok_search_category_list').hasClass('hidden')) {
            $('.rok_search_category_list').removeClass('hidden');
        } else {
            $('.rok_search_category_list').addClass('hidden');
        }
    });

    $('.rok_search_category_list_item').click(function() {
        $('.rok_search_category_list_item').removeClass('active');
        $(this).addClass('active');
        $('.rok_search_category_list').addClass('hidden');
        $('.rok_search_category_link span').text($('a', this).text());
        $('#category_id').val($(this).data('category-id'));
    });
});