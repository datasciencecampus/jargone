/*
 * Jargone
 * 
 * Highlight jargon on the page. Jargon, begone.
 * Roo Reynolds | rooreynolds.com | @rooreynolds
 * 
 * [NB: jargone.js is built using build.sh. Expect changes here to be overwritten]
 */

javascript:(function () { 

    // list of words to avoid based on https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style and https://style.ons.gov.uk/category/house-style/language-and-spelling/#words-not-to-use
    var words = [
            ['agenda', "unless it’s for a meeting (GDS 2019)"],
            ['advancing', "(GDS 2019)"],
            ['collaborate' "use 'working with' instead (GDS 2019)"],
            ['combating', "(GDS 2019)"],
            ['commit', "(GDS 2019)"],
            ['countering', "(ONS 2019)"],
            ['pledge' "be more specific - we’re either doing something or we’re not (GDS 2019)"],
            ['countering', "(GDS 2019)"],
            ['deliver', "pizzas, post and services are delivered - not abstract concepts like improvements or priorities (GDS 2019)"],
            ['deploy', "unless it’s military or software (GDS 2019)"],
            ['dialogue', "use 'we speak to people' instead (GDS 2019)"],
            ['disincentivise', "(GDS 2019)"],
            ['incentivise', "(GDS 2019)"],
            ['empower', "(GDS 2019)"],
            ['facilitate', "instead, say something specific about how you’re helping (GDS 2019)"],
            ['focusing', "(GDS 2019)"],
            ['foster', "unless it’s children (GDS 2019)"],
            ['impact', "do not use this as a synonym for have an effect on, or influence (GDS 2019)"],
            ['initiate', "(GDS 2019)"],
            ['key', "unless it unlocks something. A subject/thing is not key - it’s probably important (GDS 2019)"],
            ['land', "as a verb only use if you’re talking about aircraft (GDS 2019)"],
            ['leverage', "unless in the financial sense (GDS 2019)"],
            ['liaise', "(GDS 2019)"],
            ['overarching', "(GDS 2019)"],
            ['progress', "as a verb - what are you actually doing? (GDS 2019)"],
            ['promote', "unless you’re talking about an ad campaign or some other marketing promotion (GDS 2019)"],
            ['robust', "(GDS 2019)"],
            ['slimming down', "processes do not diet (GDS 2019)"],
            ['streamline', "(GDS 2019)"],
            ['strengthening', "unless it’s strengthening bridges or other structures (GDS 2019)"],
            ['tackling', "unless it’s rugby, football or some other sport (GDS 2019)"],
            ['transforming', "what are you actually doing to change it? (GDS 2019)"],
            ['utilise', "this means to use as something other than its intended purpose (GDS 2019)"],
            ['drive', "you can drive vehicles; not schemes or people (GDS 2019)"],
            ['drive out', "unless it’s cattle (GDS 2019)"],
            ['going forward', "it’s unlikely we are giving travel directions (GDS 2019)"],
            ['in order to', "superfluous - do not use it (GDS 2019)"],
            ['one-stop shop', "we are government, not a retail outlet (GDS 2019)"],
            ['ring fencing', "(GDS 2019)"],
            ['eg', "Exempli gratia means “for example”. Use this expression only in tables, where space is limited, and in internal correspondence (ONS 2019)"],
            ['etc', "A contraction of et cetera which means 'and other things' (ONS 2019)"],
            ['ie', "This means 'that is'. Only use this in tables, where space is limited, and in internal correspondence (ONS 2019)"],
            ['NB', "Don’t use this, write 'Note:' instead (ONS 2019)"],
            ['persons', "people not persons in text ('persons' can be used in tables) (ONS 2019)"],
            ['adults', "men and women (ONS 2019)"],
            ['children', "children up to 16 years old: boys and girls, or young people or under 16s (ONS 2019)"],
            ['adults and children', "a mixture of adults and children: males and females (ONS 2019)"],
            ['the disabled', "disabled people or people with disabilities (ONS 2019)"],
            ['the handicapped', "disabled people or people with disabilities (ONS 2019)"],
            ['the homeless', "homeless people (ONS 2019)"]
	],
	wordsLen = words.length,
	idx;

    function addEvent(elem, eventType, handler) {
        if (elem.addEventListener) {
            elem.addEventListener (eventType, handler, false);
        } else if (elem.attachEvent) {
            handler = function (e) {
                var target = (typeof e.target === 'undefined') ? e.srcElement : e.target;

                handler.call(target, { 'target' : target });
            };
            elem.attachEvent ('on' + eventType, handler);
        } else {
            return false;
        }
    };	

	var popup = {
		add : function (element, notes, idx) {
			var popup;

			popup = document.createElement("div");
			popup.id = "jargonepopup-" + (idx + 1);
			popup.className = "jargonepopup";
			document.body.appendChild(popup);
			popup.innerHTML = notes;
			popup.style.left = element.getBoundingClientRect().left + 'px';
			popup.style.top = element.getBoundingClientRect().top + 20 + 'px';
			popup.style.visibility = 'visible';
			element.setAttribute('aria-describedby', popup.id);
			this.current.idx = (idx + 1);
			this.current.element = element;
		},
		remove : function () {
			var popup = document.getElementById("jargonepopup-" + this.current.idx);

			if (popup) {
				document.body.removeChild(popup);
				this.current.element.removeAttribute('aria-describedby');
				this.current.idx = null;
				this.current.element = null;
			}
		},
		current : {
			idx : null,
			element : null
		}
	};

	var popupEvt = (function () {
		var openIdx = null,
			focusedWord = null;

		return (function (e) {
			var element = e.target,
				term;

			if (!element.className || !element.className.match(/jargonehighlight/)) { return; }

			if ((openIdx !== null) || (e.type === 'focusout')) {
				popup.remove();
				focusedElement = null;
			} else {
				term = element.firstChild.nodeValue.toLowerCase();
				for (idx = 0; idx < wordsLen; idx++) {
						if (term.match(new RegExp(words[idx][0])) && words[idx][1]) {
						// clicks give focus so use it for capturing both events
						// focus is retained by elements when scrolling clears their popup so use clicks as backup
						if (e.type === 'click') {
							if ((focusedWord === element) && (popup.current.element === null)) {
								popup.add(element, words[idx][1], idx);
							}
						} else { // focusin
							focusedWord = element;
							popup.add(element, words[idx][1], idx);
						}
					}
				}
			}

			if (event.stopPropagation) {
				event.stopPropagation();
			} else {
				event.cancelBubble = true;
			}
		});
	}());

    // From http://james.padolsey.com/javascript/find-and-replace-text-with-javascript/
    function findAndReplace(searchText, replacement, searchNode) {
        if (!searchText || typeof replacement === 'undefined') {
            // Throw error here if you want...
            return;
        }
        var regex = typeof searchText === 'string' ?
                    new RegExp(searchText, 'g') : searchText,
            childNodes = (searchNode || document.body).childNodes,
            cnLength = childNodes.length,
            excludes = 'html,head,style,title,link,meta,script,object,iframe';
        while (cnLength--) {
            var currentNode = childNodes[cnLength];
            if (currentNode.nodeType === 1 &&
                (excludes + ',').indexOf(currentNode.nodeName.toLowerCase() + ',') === -1) {
                arguments.callee(searchText, replacement, currentNode);
            }
            if (currentNode.nodeType !== 3 || !regex.test(currentNode.data) ) {
                continue;
            }
            var parent = currentNode.parentNode,
                frag = (function(){
                    var html = currentNode.data.replace(regex, replacement),
                        wrap = document.createElement('div'),
                        frag = document.createDocumentFragment();
                    wrap.innerHTML = html;
                    while (wrap.firstChild) {
                        frag.appendChild(wrap.firstChild);
                    }
                    return frag;
                })();
            parent.insertBefore(frag, currentNode);
            parent.removeChild(currentNode);
        }
    }

    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".jargonehighlight { background-color: #FFFF88 !important; color: black; } .jargonehasnotes { cursor: help; border-bottom:1px dashed !important; } .jargonepopup { position: fixed; z-index: 1000 !important; visibility: hidden; background-color: #FFFFCC; color: black; border: solid silver 1px; margin: 5px; padding: 6px;} ";
    document.getElementsByTagName("head")[0].appendChild(css);

	for (idx = 0; idx < wordsLen; idx++) { // for each word
		words[idx][0] = words[idx][0].replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
		var pattern = '\\b' + words[idx][0];
		if (pattern.slice(-6) == '\\.\\.\\.') { // don't include end word boundary check if word ended with '...'
			pattern = pattern.slice(0, -6);
		    words[idx][0] = words[idx][0].slice(0, -6);
		} else {
        	if (pattern.slice(-1) != '.') {
            	pattern = pattern + '\\b';
        	}
        }
        var regex = new RegExp('(' + pattern + ')', 'ig');
    
		if (words[idx].length > 0 && words[idx][1] != undefined) {
          findAndReplace( regex, '<span class="jargonehighlight jargonehasnotes" tabindex="0">$1<\/span>');
        } else { // only use jargonehasnotes class if the entry has associated notes
          findAndReplace( regex, '<span class="jargonehighlight" tabindex="0">$1<\/span>');
        }
	}
	addEvent(document, 'focusin', popupEvt);
	addEvent(document, 'focusout', popupEvt);
	addEvent(document, 'click', popupEvt);
	addEvent(document, 'scroll', function () { popup.remove(); });
})();
