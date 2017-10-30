var fs;
var db;
var requestedFiles = {};
var entries = {};
var rows = {};

onmessage = function(e) {
	postMessage('Message received.');
	getFileSystem();
	getDB();
	postMessage('Fundamentals set.');
	var dataArray = [];
	var parts = e.data.split(':!!:');
	var command = parts[0];
	var uri;
	if (command === 'store') {
		var prefix = parts[1];
		uri = parts[2];
		writeFile(prefix, uri);
	} else if (command === 'delete') {
		uri = parts[1];
		deleteFile(uri);
	}
};

function writeFile(prefix, uri) {
	postMessage("Writing file.");
	var imageData = makeRequest(prefix+uri);
	var shortName = uri.replace(/\W+/g, "-");
	var fileEntry = fs.root.getFile(shortName, {create: true});
	var writer = fileEntry.createWriter();
	var bb = new WebKitBlobBuilder();
	bb.append(imageData);
	try {
		writer.write(bb.getBlob('image/jpeg'));
		entries[uri] = fileEntry;
		db.transaction(function(tx) {
			var sql = "UPDATE articleimages SET stored='1' WHERE imageurl=?";
			tx.executeSql(sql,[uri],function(tx, r) { rows[uri] = r.rows.item(0) }, function(tx, e) {postMessage("ERROR writing stored status.", e)})
		});
		postMessage("result_handle:||:"+uri);
	} catch (e) {
		postMessage("WORKER ERROR "+e.toString());
	}
}

function deleteFile(fileName) {
	try {
		var fileEntry = fs.root.getFile(fileName, {});
		fileEntry.remove();
		db.transaction(function(tx) {
			tx.executeSql("delete from articleimages where fileName=?",[fileName], function(tx, r) {
				postMessage("Eliminated",r,tx);
			}, dbError);
		});
	} catch (e) {
		postMessage("DELETE ERROR "+e.toString());
	}

}

function dbError(e) {
	postMessage("DB DELETE ERROR "+e.toString());
}

function getFileSystem() {
	if (!fs) {
		requestFileSystem = self.requestFileSystemSync || self.webkitRequestFileSystemSync || self.requestFileSystem || self.requestFileSystemSync;
		fs = requestFileSystem(
			PERSISTENT,
			60 *1024 *1024
		);
	}
}

function getDB() {
	if (!db) {
		db = openDatabaseSync('imageData', '1.0', 'Keeps track of images.', 1024 * 1024);
		db.transaction(function(tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS articleimages(ID INTEGER PRIMARY KEY ASC, timestamp DATETIME, imageurl TEXT UNIQUE, articleurl TEXT, filename TEXT, stored INTEGER, imagetype TEXT)',[], function() {}, dbError);
		});
	}

}

function initSuccess(tx, response) {
	for (var i=0, len=response.rows.length; i<len; i++) {
		var row = response.rows.item(i);
		//cachedURLs[row.imageurl] = 1;
		if (row.stored) {
			//cachedURLs[row.imageurl] = 2;
		}
	}
}

function writeSuccess(tx, response) {
	//console.log("Successfully wrote some data.");
}

function dbError(tx, e) {
	if (e.code !== 1) {
		console.error('There was a database: ', e);
	}
}

function makeRequest(url) {
	try {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, false);
		xhr.responseType = 'arraybuffer';
		xhr.send();
		return xhr.response;
	} catch(e) {
		return 'AJAX ERROR ' + e.toString();
	}
}


self.nytPageCookie = null;

onmessage = function(e) {
	var dataArray = [];
	var parts = e.data.split(":!!:");
	var prefix = parts[0];
	var uri = parts[1];
	var jsonText = makeRequest(prefix+uri);
	postMessage(uri+":!!:"+jsonText);
}

function makeRequest(url) {
	try {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, false);
		xhr.send();
		return xhr.responseText;
	} catch(e) {
		return "ERROR";
	}
}

onmessage = function(e) {
	var parts = e.data.split('::');
	var prefix = parts[0];
	var uri = parts[1];
	var data = makeRequest(prefix+uri);
	postMessage(uri + '::' + JSON.stringify(data));
}

function makeRequest(url) {
	var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
	var data = xhr.responseText;
    return data;
}

if(!this.JSON){JSON=function(){function f(n){return n<10?'0'+n:n;}
Date.prototype.toJSON=function(key){return this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z';};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapeable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapeable.lastIndex=0;return escapeable.test(string)?'"'+string.replace(escapeable,function(a){var c=meta[a];if(typeof c==='string'){return c;}
return'\\u'+('0000'+
(+(a.charCodeAt(0))).toString(16)).slice(-4);})+'"':'"'+string+'"';}
function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
if(typeof rep==='function'){value=rep.call(holder,key,value);}
switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
gap+=indent;partial=[];if(typeof value.length==='number'&&!(value.propertyIsEnumerable('length'))){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
v=partial.length===0?'[]':gap?'[\n'+gap+
partial.join(',\n'+gap)+'\n'+
mind+']':'['+partial.join(',')+']';gap=mind;return v;}
if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==='string'){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+
mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
return{stringify:function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
return str('',{'':value});},parse:function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
return reviver.call(holder,key,value);}
cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+('0000'+
(+(a.charCodeAt(0))).toString(16)).slice(-4);});}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
throw new SyntaxError('JSON.parse');}};}();}

SlideshowView = function() {
	this.data = null;
	this.loaded = false;
	this.currentSlide = 0;
	var uiVisible = true;
	this.slideshow = jQuery(".slideshow");
	this.slides = jQuery(".slideshowSlides");
	this.indicators = jQuery(".slideshowIndicators");
	this.meta = jQuery(".slideshowMeta");
	this.close = jQuery(".slideshowClose");
	this.closeButton = jQuery(".slideshowCloseButton");
	this.title = this.meta.find(".title");
	this.caption = this.meta.find(".caption");
	this.credit = this.meta.find(".credit");

	var slideTemplate = '<div class="slideContainer">\
		<div class="photo"></div>\
	 </div>';

	this.load = function(data) {
		if (!this.loaded) {
			this.loaded = true;
			this.slideshow.show();
			this.showUI();
			jQuery(".imageSlide").remove();
			this.indicators.empty();
			this.indicators.fadeIn("fast");
			this.close.fadeIn("fast");
			this.slideshow.css('margin-top',0);
			this.slides.css("margin-left",0).css("WebkitTransform","translate3D(0,0,0)");
			this.data = data;
			notifyLater("render slides", 800);
		}
	};

	this.render = function() {
		this.indicators.empty();
		this.slides.css("width", pixels(jQuery(".slideshow").width() * this.data.length));

		for (var i=0, len=this.data.length; i<len; i++) {
			var item = this.data[i];
			var desiredCrop = selectCrop(item);
			if (!desiredCrop) continue;

			var markup = renderSlide(item);

			var containerWidth = this.slideshow.width();
			var containerHeight = this.slideshow.height();

			markup.css({"width": pixels(containerWidth), "height": pixels(containerHeight) });
			this.slides.append(markup);
			jQuery("<span class='thumb' imageid='"+i+"'>&bull;</li>").appendTo(this.indicators);

			var imageWidthMax = containerWidth;
			var imageHeightMax = containerHeight;

			var resizer = new DisplayedImage();
			var constraints = resizer.shrinkToFit({
				from: {x: desiredCrop.width, y: desiredCrop.height },
				toWithin: {x: imageWidthMax, y: imageHeightMax}
			});
			var image = getImage(desiredCrop.url, constraints);
			markup.find(".photo").append(image);
			markup.find(".slideContainer").css("width", pixels(constraints.x));
		}

		this.updatePosition(this.currentSlide || 0);
		this.updateNavigation();
	};

	this.updatePosition = function(number) {
		this.currentSlide = number;
		this.slides.find(".imageSlide").eq(number).show();
		var distance = this.slideshow.width() * number;
		this.slides.addClass("transition").css("margin-left", pixels(-distance));
	};

	this.updateNavigation = function() {
		var articleLink = jQuery("<a></a>").attr("href", skimmer("article").url).html(skimmer("article").title);
		this.title.html(articleLink);
		this.caption.html(this.data[this.currentSlide].caption);
		this.credit.html(this.data[this.currentSlide].credit);
		jQuery(".slideshowPreviousButton").hide();
		jQuery(".slideshowNextButton").hide();
		this.indicators.find(".thumb").removeClass("selected").eq(this.currentSlide).addClass("selected");
		
		if (this.currentSlide !== 0 && !skimmer().touchEnabled()) {
			jQuery(".slideshowPreviousButton").show();
		}

		if (this.currentSlide !== this.data.length - 1 && !skimmer().touchEnabled()) {
			jQuery(".slideshowNextButton").show();
		}
	};

	this.toggleUI = function() {
		uiVisible = !uiVisible;
		if (uiVisible) {
			this.showUI();
		} else {
			this.hideUI();
		}
	};

	this.showUI = function() {
		this.meta.css("height","");
		this.meta.css("bottom", "0");
		this.closeButton.fadeIn("fast");
		this.slideshow.find(".arrow").fadeIn("fast");
	};

	this.hideUI = function() {
		this.meta.css("height", pixels(80));
		this.meta.css("bottom", pixels(-63));
		this.closeButton.fadeOut("fast");
		this.slideshow.find(".arrow").fadeOut("fast");
	};

	this.deflate = function() {
		this.loaded = false;
		jQuery(".slideshow").css("margin-top","100%");
		notifyLater("clean up image browser", 800);
	};

	function renderSlide(item) {
		var slide = jQuery("<li class='imageSlide'></li>");
		var markup = tmpl(slideTemplate, {"item": item});
		slide.html(markup);
		return slide;
	}

	function selectCrop(item) {
		var order = ["jumbo", "slide", "articleLarge", "popup"];
		var desiredCrop = null;
		for (var j=0, len2=order.length; j<len2; j++) {
			var cropName = order[j];
			if (item.crops && item.crops[cropName]) {
				desiredCrop = item.crops[cropName];
				break;
			}
		}
		return desiredCrop;
	}

	function getImage(url, constraints) {
		return jQuery("<img src='"+url+"' width='"+constraints.x+"'>");
	}
}

defineReceiver("SlideshowController", "slideshow");


function SlideshowController() {
	var loaded = false;
	var currentImage = 0;
	var totalImages = 0;
	var self = this;

	this.init = function() {
		this.view = new SlideshowView();
		configureSwipes();
	};

	this.requiredMarkup = function() {
		return "<div class='slideshow sequenceMask' style='display:none; margin-top: 100%'>\
				<div class='slideshowClose'><div class='slideshowCloseButton'><img src='/webapps/skimmer/2.4/images/slideshow-close.png'></div></div>\
				<ul class='slideshowSlides sequenceUnits' style='margin-left: 0'></ul>\
				<div class='slideshowNextButton'><div class='arrow'></div></div>\
				<div class='slideshowPreviousButton'><div class='arrow'></div></div>\
				<div class='slideshowMeta'>\
					<div class='title'>Slideshow</div>\
					<div class='caption'></div>\
					<div class='credit'></div>\
				<div class='slideshowNav'>\
					<div class='slideshowIndicators'></div>\
				</div>\
				</div>\
			</div>";
	};

	this.listen = function(event, data) {
		switch (event) {
			case "load slideshow":
				currentImage = 0;
				this.display();
				break;

			case "render slides":
				this.view.render();
				break;

			case "grid updated":
				if (loaded) {
					this.display();
				}
				break;

			case "hide image browser":
				this.deflate();
				break;

			case "image preview thumb":
				this.navigateImage(parseInt(data, 10));
				break;

			case "next slideshow image":
			case "right arrow":
				this.navigateImage("next");
				break;

			case "toggle image preview ui":
				this.view.toggleUI();
				break;

			case "previous slideshow image":
			case "left arrow":
				this.navigateImage("previous");
				break;

			case "clean up image browser":
				jQuery(".slideshow").hide();
				jQuery(".imageSlide").remove();
				break;

		}
	};


	this.display = function() {
		skimmer("state").activate("slideshowVisible");
		skimmer("swipe").activate("slideshow");
		var data = skimmer("article").data.getAllImages();
		totalImages = data.length;

		this.view.load(data);
		this.view.updatePosition(currentImage);
		this.view.updateNavigation();
		loaded = true;
		notify("article loaded");
	};

	this.navigateImage = function(direction) {
		if (skimmer("state").query("slideshowVisible")) {
			if (direction == "next") {
				if (currentImage == totalImages - 1) {
					return;
				}
				currentImage++;
			} else if (direction == "previous") {
				if (currentImage == 0) {
					return;
				}
				currentImage--;
			} else {
				currentImage = direction;
			}
			this.view.updatePosition(currentImage);
			this.view.updateNavigation();
		}
	};

	this.deflate = function() {
		if (!skimmer("state").query("articleSwitcherVisible")) {
			skimmer("state").deactivate("slideshowVisible");
			skimmer("swipe").deactivate("slideshow");
			if (!skimmer("state").query("articleVisible")) {
				skimmer("locationManager").clearArticle();
			}
			loaded = false;
			this.view.deflate();
		}
	};

	this.currentSequenceNumber = function() {
		return currentImage;
	};

	this.sequenceComplete = function(newNum) {
		currentImage = newNum;
		this.view.currentSlide = currentImage;
		this.view.updateNavigation();
	};

	function configureSwipes() {
		var swipeDescription = new SwipeDescription();
		swipeDescription.configure({
			"source": self,
			"maskNode": jQuery(".slideshow"),
			"horizontalSwipeEnabled": true
		});
		skimmer("swipe").register("slideshow", swipeDescription);
	}

};


defineReceiver("Sidebar");

Sidebar = function() {
	var navigationItems;

	this.requiredMarkup = function() {
		return "<div id='sidebar'><dl class='sectionFeeds'></dl><dl class='helpers'><dt class='customize'>Layout</dt><dt class='account'>My Account</dt><dt class='shortcuts'>Shortcuts</dt></div>";
	};

	this.listen = function(event, data) {
		switch (event) {
			case "source loaded":
				skimmer("sidebar").mark();
				break;

		}
	}

	this.render = function(sourceOrder) {
		navigationItems = [];
		jQuery("#sidebar .content").remove();
		var categoryOrder = Solo.config.get("categoryOrder");
		var freeSections = Solo.config.get("freeSections");
		for (var i=0, len= categoryOrder.length; i<len; i++) {
			var categoryName = categoryOrder[i];
			var idBase = categoryName.replace(" ","");
			jQuery("<dt id='"+idBase+"Header' class='content'><div class='refresh'>&#8634;</div><div class='label'>"+categoryName+"</div></dt><dd id='"+idBase+"Content' class='content'><ol></ol></dd>").appendTo("#sidebar dl.sectionFeeds");
		}
		var nav = jQuery("#sidebar");
		for (var i in sourceOrder) {
			if (sourceOrder.hasOwnProperty(i)) {
				var source = skimmer("sections").getSource(i);
				var payClass = (jQuery.inArray(sourceOrder[i], freeSections)) ? "paySection" : "freeSection";
				var sourceName = jQuery("<li ordinal='"+i+"' class='"+payClass+"'></li>")
					.html("<span class='lockStatus'>&nbsp;</span><span class='feedStatus'>&#9675;</span><span url='"+source.url+"' class='label'>"+sourceOrder[i]+"</span>");
				jQuery("#"+source.sectionType+"Content ol").append(sourceName);
				navigationItems.push(sourceName);
			}
		}
		nav.find("dd").hide().eq(0).show();
		notify("sidebar loaded");
	};

	this.mark = function() {
		var currentSource = skimmer("sections").currentSource();
		for (var i=0, len=navigationItems.length; i<len; i++) {
			var item = jQuery(navigationItems[i]);
			var url = item.find(".label").attr("url");
			var indicator = item.find(".feedStatus");
			(i == currentSource)
				? item.addClass("selected")
				: item.removeClass("selected");
			skimmer("sectionCache").isCached(SkimmerUrl(url))
				? indicator.html("&#9679;")
				: indicator.html("&#9675;");
		}
		var headingHeights = 0;
		jQuery("#sidebar dt").each(function() {
			headingHeights = headingHeights + this.offsetHeight;
		});
		var totalHeight = jQuery("#sidebar").height();

		jQuery("#sidebar dd").css("height", pixels(totalHeight - headingHeights ));
	};

	this.fullSync = function() {
		jQuery("#sidebar").addClass("syncing");
	};

	this.completeSync = function() {
		jQuery("#sidebar").removeClass("syncing");
	};

	function currentSourceNavContainerIsHidden(item) {
		return item.parents("dd").get(0).style.display == "none";
	}


	this.toggle = function() {
		(skimmer("state").query("sidebarVisible"))
			? this.hide()
			: this.show();
		notify("window resize");
	}

	this.show = function() {
		jQuery("body").removeClass("noSidebar");
		skimmer("state").activate("sidebarVisible");
		if (skimmer("state").query("articleVisible")) {
			window.setTimeout("skimmer('article').redraw();", 500);
		}
		notify("window resize");
	};

	this.hide = function() {
		jQuery("body").addClass("noSidebar");
		skimmer("state").deactivate("sidebarVisible");
		if (skimmer("state").query("articleVisible")) {
			window.setTimeout("skimmer('article').redraw();", 500);
		}
		notify("window resize");
	};
};

defineReceiver("TwitterController", "twitter");

TwitterController = function() {
	this.expandLink = function() {
		jQuery(".twitter a").attr("href", getUrl());
	};

	this.showWindow = function() {
		window.open(getUrl(), "Twitter", "width=550,height=340,status");
		window.dcsMultiTrack && dcsMultiTrack('DCS.dcssip','www.nytimes.com','DCS.dcsuri','/Article-Tool-Share-Twitter.html','WT.ti','Article-Tool-Share-Twitter','WT.z_dcsm','1');
	};

	function getUrl() {
		var data = skimmer("article").data;
		var url = "https://www.twitter.com/intent/tweet?text="+data.title().replace(/\s/g,"+")+":+"+data.rawData.tinyUrl;
		return url;
	}
};

defineReceiver("FacebookController", "facebook");

FacebookController = function() {
	this.expandLink = function() {
		jQuery(".facebook a").attr("href", getUrl());
	};

	this.showWindow = function() {
		window.open(getUrl(), "Facebook", "width=550,height=340,status");
		dcsMultiTrack && dcsMultiTrack('DCS.dcssip','www.nytimes.com','DCS.dcsuri','/Article-Tool-Share-facebook.html','WT.ti','Article-Tool-Share-facebook','WT.z_dcsm','1');
	};

	function getUrl() {
		var data = skimmer("article").data;
		var url = "https://www.facebook.com/sharer.php?u="+data.url()+"&t="+data.title().replace(/\s/g,"+");
		return url;
	}
};

defineReceiver("EmailController", "email");


EmailController = function() {
	this.init = function() {

	};

	this.listen = function(event, data) {
		switch (event) {
			case "article loaded":
				jQuery(".email").html("<a href='mailto:?subject="+escape("NYTimes: "+skimmer("article").data.title())+"&body="+escape("From The New York Times: \n\n"+skimmer("article").data.title()+"\n\n"+skimmer("article").data.summary()+"\n\n"+skimmer("article").data.url())+"'>Email</a>");
				break;
		}
	};

	this.requiredMarkup = function() {

	};


}

defineReceiver("ShortcutsPanel");

ShortcutsPanel = function() {
	this.init = function() {

	};

	this.listen = function(event, data) {
		switch (event) {
			case "escape key":
				this.hide();
				break;
		}
	};

	this.requiredMarkup = function() {
		return "<div class='darkPanel shortcutsPanel' style='display:none'>\
			<div class='darkHeader shortcutsHeader'>\
				Shortcuts\
				<div class='darkPanelClose button shortcutsClose'>Close</div>\
			</div>\
			<div class='generalHints'>\
				<img src='http://graphics8.nytimes.com/webapps/skimmer/2.0/images/shortcuts_arrows.png'> \
				<img src='http://graphics8.nytimes.com/webapps/skimmer/2.0/images/shortcuts_shift.png'> \
				<img src='http://graphics8.nytimes.com/webapps/skimmer/2.0/images/shortcuts_swipe.png'> \
			</div>\
			<div class='keyboardHints'>\
				<table cellspacing='0'> \
					<tr><th width='50%'>Action</th><th width='50'>Key(s)</th></tr> \
					<tr valign='top'><td>Show Next Section</td><td><img src='http://graphics8.nytimes.com/webapps/skimmer/2.0/images/arrow_down.png'> or Space</td></tr> \
					<tr valign='top'><td>Show Previous Section</td><td><img src='http://graphics8.nytimes.com/webapps/skimmer/2.0/images/arrow_up.png'> or Shift+Space</td></tr> \
					<tr valign='top'><td>Next Page of Section</td><td><img src='http://graphics8.nytimes.com/webapps/skimmer/2.0/images/arrow_right.png'></td></tr> \
					<tr valign='top'><td>Previous Page of Section</td><td><img src='http://graphics8.nytimes.com/webapps/skimmer/2.0/images/arrow_left.png'></td></tr> \
					<tr valign='top'><td>Back to the Top</td><td>T</td></tr> \
					<tr align='top'><td>Navigate Articles</td><td>/ enables the selector. <img src='http://graphics8.nytimes.com/webapps/skimmer/2.0/images/arrow_down.png'>&nbsp;<img src='http://graphics8.nytimes.com/webapps/skimmer/2.0/images/arrow_up.png'>&nbsp;<img src='http://graphics8.nytimes.com/webapps/skimmer/2.0/images/arrow_left.png'>&nbsp;<img src='http://graphics8.nytimes.com/webapps/skimmer/2.0/images/arrow_right.png'> to move around, Esc cancels.</td></tr> \
					<tr valign='top'><td>Refresh Current Section</td><td>r</td></tr> \
				</table>\
				</div>\
			</div>";
	};

	this.show = function() {
		jQuery(".shortcutsPanel").fadeIn("fast");
		skimmer("state").activate("showingShortcuts");
	};

	this.hide = function() {
		jQuery(".shortcutsPanel").fadeOut("fast");
		skimmer("state").deactivate("showingShortcuts");
	};
};

defineReceiver("SchemeSwitcher");

SchemeSwitcher = function() {
	this.init = function() {
		this.load();
	};

	this.requiredMarkup = function() {
		return '<div id="schemeSwitcher" style="display:none">\
			<div class="header">\
				<div class=" button schemePreviewCloser">Done</div>\
				<strong>Layout</strong> \
			</div>\
			<div class="scrollContainer">\
				<div class="schemeList"></div>\
			</div>\
		</div>';
	};

	this.listen = function(event, data) {
		switch(event) {
			case "escape key":
				skimmer("schemeSwitcher").hide();
				break;

			case "swipe started":
				this.observeDragging = jQuery(data.target).parents(".schemeList").length > 0;
				this.dragYPosition = numeric(jQuery(".schemeList").css("margin-top"));
				break;

			case "vertical swipe":
				if (this.observeDragging) {
					var newTop = this.dragYPosition + data.yDiff;
					jQuery(".schemeList").css("margin-top", pixels(newTop));
				}
				break;

			case "hide scheme ui":
				jQuery("#schemeSwitcher").hide();
				break;

		}
	};

	this.load = function() {
		jQuery("#schemeSwitcher").appendTo("body");
		jQuery(".schemeList").empty();
		var data = Solo.config.get("schemes");
		for (var schemeName in data) {
			var conf = data[schemeName];
			if (!skimmer("touch").supported || parseInt(conf.touchsafe, 10)) {
				jQuery(".schemeList").append("<div class='schemePreview' id='scheme-"+schemeName+"' realvalue='"+schemeName+"'><img src='http://graphics8.nytimes.com/webapps/skimmer/2.0/images/schemes/"+schemeName+".png'><div class='schemeName'>"+conf.name+"</div></div>");
			}
		}
		jQuery("#scheme-"+skimmer("settings").read("scheme")).addClass("selectedOption");
	};

	this.show = function() {
		jQuery("#schemeSwitcher").show();
		skimmer("state").activate("switchingSchemes");
		jQuery("body").addClass("switchingSchemes");
		notifyLater("window resize" ,1000);
	};

	this.hide = function() {
		if (skimmer("state").query("switchingSchemes")) {
			skimmer("state").deactivate("switchingSchemes");
			jQuery("body").removeClass("switchingSchemes");
			notifyLater("hide scheme ui", 1000);
			notifyLater("window resize" ,1000);
		}
	};
};


defineReceiver("SchemeManager");

SchemeManager = function() {
	this.schemeObjects = {};
	this.defaultScheme = "contrasty";

	this.init = function() {
		this.applyScheme();
	};


	this.listen = function(message, data) {
		var currentScheme = skimmer("settings").read("scheme");
		this.schemeObjects[currentScheme] && this.schemeObjects[currentScheme].listen(message, data);
	};

	this.currentSchemeConfig = function() {
		var currentScheme = skimmer("settings").read("scheme");
		var availableSchemes = Solo.config.get('schemes') || {};
		return availableSchemes[currentScheme] || {};
	};

	this.getSchemeConfig = function(name) {
		return Solo.config.get("schemes")[name] || Solo.config.get("schemes")[this.defaultScheme];
	};

	this.activateSchemeScripts = function(name) {
		var conf = this.getSchemeConfig(name);
		jQuery("body").removeClass("medium-skin").removeClass("dark-skin").removeClass("light-skin");
		if (conf.scripts) {
			if (typeof conf.scripts == "string") {
				this.schemeObjects[name] = new window[conf.scripts]();
			} else {
				this.schemeObjects[name] = new conf.scripts();
			}
		}
		conf.skin && jQuery("body").addClass(conf.skin+"-skin");
	};

	this.applyScheme = function() {
		var name = skimmer("settings").read("scheme");
		if (Solo.config.get("schemes")) {
			var config = this.getSchemeConfig(name);
			var styles = config.css;
			var stylesheet = document.getElementById("schemeStyles");
			if (stylesheet.styleSheet) {
				stylesheet.styleSheet.cssText = styles;
			} else {
				jQuery(stylesheet).html(styles);
			}
			this.activateSchemeScripts(name);
		} else {
			console.log("No schemes found.");
		}
		notify("scheme loaded");
	};

	this.setScheme = function(name) {
		skimmer("settings").set("scheme", name);
		this.applyScheme();
	};
};

defineReceiver("StoryZoom", "zoomer");

StoryZoom = function() {

	this.requiredMarkup = function() {
		return "<div id='zoom' style='height:0; display: none'></div>";
	};

	this.init = function() {
		this.container = jQuery("#zoom");
		if (document.addEventListener) {
			this.container.get(0).addEventListener( 'webkitTransitionEnd', function( event ) {
				jQuery(event.target).removeClass("animate");
			}, false );
		}
		this.height = 0;
	};

	this.listen = function(event, data) {
		switch (event) {
			case "hide zoomer":
				this.container.removeClass("animate").hide().css("height",pixels(this.height));
				break;
		}
	};

	this.show = function(node) {
		var data = node.itemData;
		node = jQuery(node);

		while (node.get(0).nodeName !== "LI") {
			node = node.parent();
		}
		//node = node.parent("li");
		var width = node.width();
		this.height = node.height();
		var offset = node.offset();
		var top = offset.top - document.documentElement.scrollTop;
		var left = offset.left;


		this.container.css({
			"width": width+"px",
			"top":top+"px",
			"left":left+"px",
			"height":this.height+"px"
		}).show().html(node.html());
		this.container.find(".fill").removeClass("fill");
		this.container.addClass("animate").css("height",pixels(this.height + 100));
		//notifyLater("resize zoomer", null, 500);

		offset = this.container.offset();
		height = this.container.height();
		width = this.container.width();
		var viewportOverflow = (offset.top - document.documentElement.scrollTop + height + 5) - window.innerHeight;
		var horizontalOverflow = (offset.left - document.documentElement.scrollLeft + width + 5) - window.innerWidth;
		if (viewportOverflow > 0) {
			this.container.css("top", top - viewportOverflow - 10);
		}
		if (horizontalOverflow > 0) {
			this.container.css("left", left - horizontalOverflow);
		}
		skimmer("mouse").move(this.container, function() {
			skimmer("zoomer").hide();
		});


	};

	this.hide = function() {
		jQuery("#zoom").addClass("animate").css("height",this.height);
		notifyLater("hide zoomer",null,500);
	};
};

StandardGrid = function() {
	this.listen = function(message, data) {
		switch(message) {
			case "left arrow":
				skimmer("pagination").previousPage();
				break;

			case "right arrow":
				skimmer("pagination").nextPage();
				break;

			case "section page changed":
				var grid = skimmer("grid");
				var scroller = skimmer("currentSection").layout.container.find(".pageScrollContainer");
				var pages = scroller.find(".pageContent");
				var width = scroller.width();
				var newOffset = data * width;
				notify("page offset set", -newOffset);
				break;
		}
	};
};

SectionLayout = function(id, name) {
	this.sectionId = id;
	this.displayName = name;
	this.container = null;
	this.stories = null;
	this.pageIndicator = new Solo.PageIndicator();
	this.currentPage = 0;
	this.totalPages = 0;
};

SectionLayout.prototype = {
	init: function(config) {
		if (!this.container) {
			this.container = jQuery("<div class='shrinkWrap' style='display: none' id='section-"+this.sectionId+"'>"+this.headerMarkup()+"<div class='sectionBody'></div>"+this.footerMarkup()+"</div>");
		}
	},

	deflate: function() {
		if (this.container) {
			this.container.find(".sectionBody").empty();
			this.container.remove();
		}
		if (this.images) {
			for (var i = 0, len=this.images.length; i<len; ++i) {
				var img = this.images[i];
				img.src = "/webapps/skimmer/2.0/images/blank.gif";
			}
			this.images = null;
		}
		this.stories = null;
		this.pageContainer().empty();
	},

	list: function() {
		return this.container.find("ul");
	},

	reset: function() {
		this.list().empty();
		this.pageContainer().empty();
	},

	initCurrentScreen: function(){
		this.container.show();
	},

	prepareLayout: function() {
		if (this.container) {
			this.container.appendTo("#contentPane");
		}
	},

	markup: function(data) {
		var viewPortHeight = skimmer("grid").screenHeight();
		var schemeName = skimmer("settings").read("scheme");
		var containerClass = skimmer("schemeManager").getSchemeConfig(schemeName).containerClass;
		if (containerClass) {
			this.container.addClass(containerClass);
		}
		//var viewPortHeight = parseInt(document.getElementById("contentPane").offsetHeight, 10);
		var top = {top:"-"+viewPortHeight+"px"};
		var middle = {top:"0"};
		var bottom ={top:viewPortHeight+"px"};
		if (this.sectionId == skimmer("currentSectionNumber") + 1) {
			this.container.css(bottom).show();//this.container.addClass("nextSection");
		} else if (this.sectionId == skimmer("currentSectionNumber") - 1) {
			this.container.css(top).show();//this.container.addClass("previousSection");
		}
		this.container.find(".sectionBody").html(this.bodyMarkup(data));
		this.stories = this.container.find(".blocks li").addClass("story");
		this.stories.each(function() { skimmer('readinglist').insertStar(jQuery(this)); } );
		this.images = this.container.find("img");
		this.pageIndicator.init(this.container.find(".pageIndicators"));
		skimmer("adManager").getSectionTile(this.displayName);
		//this.container.appendTo("#contentPane");
	},

	hotInsert: function(data) {
		var schemeName = skimmer("settings").read("scheme");
		this.container.find(".sectionBody").html(this.bodyMarkup(data));
		this.stories = this.container.find(".blocks li").addClass("story");
		this.stories.each(function() { skimmer('readinglist').insertStar(jQuery(this)); } );
		this.images = this.container.find("img");
		this.pageIndicator.init(this.container.find(".pageIndicators"));
		skimmer("adManager").getSectionTile(this.displayName);
	},

	listNode: function() {
		return this.list().get(0);
	 },

	pageContainer: function() {
		return ( this.container && this.container.find(".pages") || jQuery(".null"));
	},

	pageNodes: function() {
		return this.container.find(".page");
	},

	resetPages: function() {
		if (this.pageContainer().length) {
			this.pageContainer().empty();
		}
	},

	loginMessage: function() {
		return "<a href='http://www.nytimes.com/auth/login?URI="+ skimmer("appUrl") +"'>Login</a> or <a href='http://www.nytimes.com/gst/regi.html?UIR="+ skimmer("appUrl") +"'>Register</a>";
	},

	headerMarkup: function() {
		return "<div class='sectionHeader'><table><tr><td class='nytlogo'></td><td class='line'><div class='verticalLine'></div></td><td class='sectionName'>"+this.displayName+"</td></tr></table><div class='rightHeader'></div>";
	},

	scrollContainer: function() {
		return "<div class='pageScrollContainer'></div>";
	},

	footerMarkup: function() {
		return "<div class='sectionFooter'><table width='100%'><tr><td align='center'><div class='pageIndicators'></div></td></tr></table></div>";
	},

	bodyMarkup: function(data) {
		var schemeName = skimmer("settings").read("scheme");
		var templateData = {items:data, grid: skimmer("grid"), sectionName:this.displayName.replace(/\W+/g, "")};
		var templateText = skimmer("schemeManager").getSchemeConfig(schemeName).template;
		return tmpl(templateText, templateData);
	},

	requestSchemeData: function() {
		jQuery.get("/schemes/"+schemeName+"/template.html", function(template) {

		});
	},

	currentVisiblePage: function() {
		return jQuery("#page-"+this.sectionId+"-"+this.currentPage);
	},

	renderPages: function() {
		if (!this.stories) return;
		var cellsPerPage = skimmer("grid").cellsPerPage();
		var positions = {};
		this.totalPages = Math.ceil(this.stories.length / cellsPerPage);
		var totalCells = this.stories.length + (Solo.config.get("numberOfAdPositions") * this.totalPages);
		var adLimit = (cellsPerPage > totalCells) ? totalCells : cellsPerPage;
		var adMultiplier = Math.random();
		var adPosition = Math.floor(adMultiplier * (adLimit - 2)) + 1;
		var positions = {};
		var appliedPositions = 0;
		var numRows = skimmer("grid").numRows();
		var numColumns = skimmer("grid").numColumns();

		for (var i=0; i < this.totalPages; i++) {
			var pos = adPosition + (i * cellsPerPage);
			if (i > 0) {
				pos -= i;
			}
			positions[pos] = true;
		}

		if (this.stories.length % cellsPerPage === 0) {
			this.totalPages += 1;
		}

		var blockPool = [];

		this.stories.each(function(j) {
			if (positions[j]) {
				blockPool.push(AdTile());
				appliedPositions++;
			}
			blockPool.push(this);
		});

		if (appliedPositions < this.totalPages) {
			blockPool.push(AdTile());
		}

		items = jQuery(blockPool);
		var start = 0;
		var end = 0 + cellsPerPage - 1;

		this.pageIndicator.setTotal(this.totalPages);

		for (var i=0, len=this.totalPages; i<len; i++) {
			var page = jQuery("<ul class='"+this.listNode().className+" page' id='page-"+this.sectionId+"-"+i+"'></ul>").appendTo(this.pageContainer());
			//page.css({"zIndex":"200"+(this.totalPages - i)});
			var scrollerWidth = parseInt(document.getElementById("contentPane").offsetWidth, 10);
			var notInLastRow = ((numRows - 1) * numColumns );

			if (i === 0) {
				page.addClass("first");
				page.css("left", 0);
				notInLastRow -= 1;
			} else {
				page.css("left", scrollerWidth);
			}

			items.each(function(j) {
				if (j === 0) {
					jQuery(this).addClass("first");
				}
				if ((j +2) % numColumns === 0) {
					jQuery(this).addClass("lastInRow");
				} else {
					jQuery(this).removeClass("lastInRow");
				}
			});
			items.slice(start, end).appendTo(page).removeClass("inLastRow");
			items.slice((start + notInLastRow), end).addClass("inLastRow");
			start = end;
			end += cellsPerPage;
		}
	}
};

SectionPanelController = function(num, conf, type) {
	this.built = false;
	this.sectionId = num;
	this.url = conf.url;
	this.displayName = conf.name;
	this.currentPage = 0;
	this.totalPages = 0;
	this.sectionType = type;
	this.data = new FullFeedList();
	this.layout = new SectionLayout(this.sectionId, this.displayName);
	this.data.initWithCache(skimmer("sectionCache"));
	var self = this;
	this.dataCallback = function(data) {
		if (!window.APP_BLOCK_RENDER) {
			self.layout.markup(data);
			self.applyPagination();
			notify('source loaded', self.sectionId);
			(self.sectionId == skimmer("currentSectionNumber")) && skimmer("sections").flipToCurrentSection();
			if (skimmer("locationManager").articlePresent()) {
				skimmer("article").load(skimmer("locationManager").currentArticle(), "Supplied Article");
			}
		}
	};

	this.silentCallback = function(data) {
		notify('source loaded', self.sectionId);
	};

	this.hotCallback = function(data) {
		self.layout.hotInsert(data);
	};

};

SectionPanelController.prototype = {

	init: function(num, conf, type) {

	},

	initScreen: function() {
		this.layout.initCurrentScreen();
	},

	prepareView: function() {
		this.layout.prepareLayout();
	},

	hotReplace: function() {
		this.layout.hotInsert(this.data.dataArray);
		this.applyPagination();
	},

	deleteItem: function(url) {
		this.data.deleteItem(url);
	},

	fetchData: function() {
		if (!this.built) {
			this.layout.init();
			var expandedUrl = SkimmerUrl(this.url);
			if (!this.hasFullFeed(expandedUrl)) {
				expandedUrl = CONVERTER_URL_OVERIDE + expandedUrl;
			}
			this.layout.prepareLayout();
			this.data.fetch(expandedUrl, this.dataCallback);
			skimmer("pagination").initPage(this.sectionId);
			this.built = true;
		} else if (this.sectionId == skimmer("currentSectionNumber")){
			//skimmer("pagination").initPage(this.sectionId);
			skimmer("sections").flipToCurrentSection();
			notify('source loaded', this.sectionId);
		} else {
			notify('source loaded', this.sectionId);
		}
	},

	fetchDataSilently: function() {
		if (!this.built) {
			var expandedUrl = SkimmerUrl(this.url);
			if (!this.hasFullFeed(expandedUrl)) {
				expandedUrl = CONVERTER_URL_OVERIDE + expandedUrl;
			}
			this.data.fetch(expandedUrl, this.silentCallback);
		}
	},

	listen: function(event, data) {
		switch(event) {
			case "grid updated":
				this.applyPagination();
				break;
			case "page total updated":
				if (this.sectionId == skimmer("currentSectionNumber")) {
					this.layout.pageIndicator.setTotal(data);
				}
				break;
		}
	},

	deflate: function() {
		this.built = false;
		this.layout.deflate();
	},

	hasFullFeed: function(url) {
		return true;//url.match(/platforms\.nytimes\.com/);
	},

	numberOfPages: function() {
		var total = this.data.count() + SkimmerConfig.numberOfAdPositions;
		return Math.ceil(total / skimmer("pagination").itemsPerPage());
	},

	setPage: function(num) {
		this.currentPage = num;
		this.layout.currentPage = num;
	},

	expire: function() {
		this.built = false;
	},

	refresh: function() {
		this.built = false;
		this.layout.deflate();
		this.fetchData();
	},

	applyPagination: function() {
		if (!skimmer("sections").containsGrids()) return;
		this.layout.pageIndicator.setCurrentItem(this.currentPage);
		this.layout.resetPages();
		this.layout.renderPages();
	},

	dataByUrl: function(soughtUrl) {
		for (var i=0, len=this.data.dataArray.length; i<len; i++) {
			var story = this.data.dataArray[i];
			if (soughtUrl == story.link()) {
				return story;
			}
		}
		return null;
	}

};

defineReceiver("SectionPagination", "pagination");

SectionPagination = function() {
	this.pageSettings = {};

	this.init = function() {
	};

	this.listen = function(event, data) {
		switch(event) {
			case "swipe started":
				var container = jQuery(data.target).parents(".shrinkWrap")
				this.observeTouches = container.length > 0 && container.find(".pageContent").length > 0;
				this.objectToMove = container.find(".pageContent");
				this.touchXPosition = numeric(this.objectToMove.css("margin-left"));
				break;

			case "horizontal swipe":
				skimmer("state").activate("performingSwipe");
				if (this.observeTouches) {
					var newLeft = this.touchXPosition + data.xDiff;
					this.objectToMove.css({"WebkitTransform": "translate3D("+ pixels(data.xDiff) +", 0, 0)"});
				}
				break;

			case "end right swipe":
				this.swipeIntent = "right";
				notifyLater("end swipe blockade", 500);
				this.observeTouches && skimmer("pagination").previousPage("fast");
				break;

			case "end left swipe":
				this.swipeIntent = "left";
				notifyLater("end swipe blockade", 500);
				this.observeTouches && skimmer("pagination").nextPage("fast");
				break;


			case "page offset set":
				if (this.observeTouches) {
					var currentPage = skimmer("pagination").getPage(skimmer("currentSectionNumber"));
					var totalPages = skimmer("pagination").getPage(skimmer("currentSectionNumber"));
					if (currentPage == 0) {
						if (numeric(this.objectToMove.css("margin-left")) < 0) {
							var finalTranslate = -(skimmer("grid").cellWidth() * skimmer("grid").numColumns())
						} else {
							var finalTranslate = 0;
						}
					} else if (currentPage == skimmer("currentSection").layout.totalPages - 1) {
						if (numeric(this.objectToMove.css("margin-left")) > data) {
							var finalTranslate = -(skimmer("grid").cellWidth() * skimmer("grid").numColumns())
						} else {
							var finalTranslate = 0;
						}
					} else {
						var finalTranslate = data / currentPage;
					}
					if (this.swipeIntent == "right") {
						finalTranslate = -finalTranslate;
					}
					var horizontal = {"WebkitTransition": "-webkit-transform 0.4s linear", "WebkitTransform":"translate3D("+pixels(finalTranslate)+", 0, 0)"};
					this.objectToMove.css(horizontal);
					var self = this;
					setTimeout(function() {
						var clean = {"WebkitTransition": "margin-left 0s", "WebkitTransform":"translate3D(0, 0, 0)", "margin-left": pixels(data)};
						self.objectToMove.css(clean);
					}, 600);
				} else {
					var scroller = skimmer("currentSection").layout.container.find(".pageScrollContainer");
					var pages = scroller.find(".pageContent");
					pages.css("WebkitTransition", "");
					pages.moveNode({"margin-left": pixels(data)}, 1000);
				}
				skimmer("tracking").recordInnerPageview();
				break;
		}
	};

	this.initPage = function(sectionId) {
		this.pageSettings[parseInt(sectionId, 10)] = 0;
		skimmer("sections").getSource(sectionId).layout.pageIndicator.setCurrentItem(0);
		//notify("section page changed", 0);
	};

	this.getPage = function(sectionId) {
		return this.pageSettings[parseInt(sectionId, 10)];
	};

	this.setPage = function(sectionId, page) {
		this.pageSettings[sectionId] = page;
	};

	this.nextPage = function() {
		if (skimmer("state").query("listeningForStoryCue") || skimmer("state").query("articleVisible")) {
			return;
		}
		var animationClass = (arguments[0] && arguments[0] == "fast") ? "fastanimate" : "animate";
		jQuery("body").addClass(animationClass);
		setTimeout(function() {jQuery("body").removeClass(animationClass);}, 1000);
		var section = skimmer("currentSectionNumber");
		var next = this.getPage(section) + 1;
		if (next < skimmer("currentSection").layout.totalPages) {
			this.setPage(section, next);
			skimmer("currentSection").layout.pageIndicator.setCurrentItem(next);
			notify("section page changed", next);
		} else {
			notify("section page changed", skimmer("currentSection").layout.totalPages - 1);
		}

	};

	this.previousPage = function() {
		if (skimmer("state").query("listeningForStoryCue") || skimmer("state").query("articleVisible")) {
			return;
		}
		jQuery("body").addClass("animate");
		setTimeout(function() {jQuery("body").removeClass("animate");}, 1000);
		var section = skimmer("currentSectionNumber");
		var prev = this.getPage(section) - 1;
		if (prev >= 0) {
			this.setPage(section, prev);
			skimmer("currentSection").layout.pageIndicator.setCurrentItem(prev);
			notify("section page changed", prev);
		} else {
			notify("section page changed", 0);
		}
	};

	this.changePage = function () {

	};
};

defineReceiver("SectionManager", "sections");

SectionManager = function() {
	var	sources = {},
		sourceOrder = [],
		feedOrder = [],
		direction,
		previousSectionId = null,
		comitted = false,
		currentSourceNumber = null;

	this.init = function() {
		notify("preferences loaded");
		notify("grid startup");
	};

	this.listen = function(event, data) {
		if (this.sectionActive()) {
			switch(event) {
				case "key K":
					notify("up arrow");
					break;
				case "key J":
					notify("down arrow");
					break;
				case "key L":
					notify("right arrow");
					break;
				case "key H":
					notify("left arrow");
					break;
				case "up arrow":
					skimmer("sections").previousSection();
					break;
				case "down arrow":
					skimmer("sections").nextSection();
					break;
				case "tab key":
					break;
				case "space bar":
					data.shiftKey ? skimmer("sections").previousSection() : skimmer("sections").nextSection();
					break;
				case "key R":
				case "hard refresh":
					skimmer("sections").hardRefresh();
					break;
				case "key T":
					skimmer("sections").goToTop();
					break;

				case "swipe started":
					this.observeTouches = jQuery(data.target).parents("#contentPane").length > 0;
					this.touchYPosition = numeric(skimmer("currentSection").layout.container.css("top"));
					break;

				case "vertical swipe":
					if (this.observeTouches) {
						skimmer("state").activate("performingSwipe");
						this.liveUpdatePositions(data.yDiff);
					}
					break;

				case "end up swipe":
					if (this.observeTouches) {
						this.finishUpSwipe();
						notifyLater("end swipe blockade", 500);
						jQuery("body").removeClass("swiping");
						setTimeout(function() {skimmer("sections").nextSection("silent");}, 500);

					}
					break;

				case "end swipe blockade":
					skimmer("state").deactivate("performingSwipe");
					break;

				case "end down swipe":
					if (this.observeTouches) {
						this.finishDownSwipe();
						notifyLater("end swipe blockade", 500);
						jQuery("body").removeClass("swiping");
						setTimeout(function() {skimmer("sections").previousSection("silent");}, 500);
					}
					break;

			}
		}

		switch (event) {
			case "preferences loaded":
				skimmer("sections").load();
				skimmer("sidebar").render(sourceOrder);
				setTimeout(function() {
					jQuery(".splash").css("opacity","0");
					setTimeout(function() { jQuery(".splash").hide()}, 1000);
				}, 1000);
				if (window.Worker) {
					skimmer("sections").loadAllSources();
					setInterval(function() {
						skimmer("sections").loadAllSources();
					}, 10 * 60 * 1000);
				}
				break;
			case "source loaded":
				if (parseInt(data, 10) == skimmer("currentSectionNumber")) {
					this.initSurrounders();
					setTimeout(function() {skimmer("sections").requestSurrounders() }, 1300);
				}
				if (skimmer("sectionCache").allCached(feedOrder) && !comitted) {
					comitted = true;
					notify("all sections cached");
					skimmer("sidebar").completeSync();
					setTimeout(function() {skimmer("sectionCache").commit();}, 3000);
				}
				break;
			case "page total updated":
				skimmer("currentSection").totalPages = data;
				skimmer("currentSection").layout.totalPages = data;
				break;

			case "key F":
				skimmer("sidebar").toggle();
				break;

			case "pinch started":
				this.sidebarInit = jQuery("body").hasClass("noSidebar") ? 125 : 0;
				this.contentInit = jQuery("body").hasClass("noSidebar") ? 0 : 120;
				jQuery("#sidebar").css("right", null);
				jQuery("#contentPane").css("right", null);
				jQuery("body").addClass("noShadows");
				break;

			case "pinching out":
				var sidebarMove = this.sidebarInit + data.xyDiff;
				var contentMove = this.contentInit - data.xyDiff;

				if (contentMove > 0 && contentMove < 120) {
					jQuery("#contentPane").css("right", pixels(contentMove));
				}
				break;

			case "pinching in":
				var sidebarMove = this.sidebarInit + data.xyDiff;
				var contentMove = this.contentInit - data.xyDiff;

				if (contentMove > 0 && contentMove < 120) {
					jQuery("#contentPane").css("right", pixels(contentMove));
				}
				break;

			case "end pinch":
				jQuery("#contentPane").css("right", null);
				jQuery("body").removeClass("noShadows");
				jQuery("body").addClass("animate");
				setTimeout(function() {jQuery("body").removeClass("animate");}, 500);
				break;

			case "end pinch out":
				skimmer("sidebar").hide();
				break;

			case "end pinch in":
				skimmer("sidebar").show();
				break;

			case "app offline":
				if (!window.chrome || !window.chrome.app || !window.chrome.app.isInstalled) {
					jQuery("body").addClass("offline");
				}
				break;

			case "app online":
				jQuery("body").removeClass("offline");
				break;

		}
	};

	this.load = function() {
		sourceOrder = [];
		sources = {};
		var sourceData = Solo.config.get("sources");
		var categoryOrder = Solo.config.get("categoryOrder");
		var sectionOrder = Solo.config.get("sectionOrder");
		for (var i=0, len=categoryOrder.length; i<len; i++) {
			var categoryName = categoryOrder[i];
			var idBase = categoryName.replace(" ", "");
			var sourceList = sectionOrder[categoryName];
			for (var j=0, len2=sourceList.length; j<len2; j++) {
				var sourceNumber = sourceList[j];
				var sourceConfig = sourceData[sourceNumber];
				var sourceObject = new SectionPanelController(j, sourceConfig, idBase);
				skimmer("notifier").register(sourceObject);
				sources[sourceConfig.name] = sourceObject;
				sourceOrder.push(sourceConfig.name);
			}
		}
		notify("sources imported");
	};

	this.loadAllSources = function() {
		// If a browser supports Web Workers, spawn a worker to download all content.
		skimmer("sidebar").fullSync();
		skimmer("imageManager").startSync();
		feedOrder = [];
		comitted = false;
		var sourceData = Solo.config.get("sources");
		for (var name in sources) {
			sources[name].fetchDataSilently();
		}
	};

	this.hardRefresh = function() {
		skimmer("sectionCache").reset();
		skimmer("sidebar").mark();
		skimmer("sections").resetSources();
		skimmer("sections").loadAllSources();
		skimmer("sections").displaySection();
	};

	this.visibleSlides = function() {
		var sourceNumber = skimmer("currentSectionNumber");
		var pageNumber = skimmer("pagination").getPage(sourceNumber);
		return jQuery("#page-"+sourceNumber+"-"+pageNumber+" li");
	};

	this.currentSource = function() {
		return parseInt(currentSourceNumber, 10);
	};

	this.setCurrentSource = function(num) {
		if (skimmer("state").query("listeningForStoryCue")) {
			return;
		}
		if (num < 0 || num > (skimmer("sections").totalSources() - 1)) {
			return;
		}
		var current = skimmer("currentSectionNumber");
		previousSectionId = current;
		currentSourceNumber = parseInt(num, 10);
		if ("standalone" in window.navigator && window.navigator.standalone && window.localStorage) {
			localStorage.currentSection = currentSourceNumber;
		}
		notify("current source updated", parseInt(num, 10));
	};

	this.previousSectionId = function() {
		return previousSectionId;
	};

	this.currentSourceData = function() {
		return skimmer("currentSection").data;
	};

	this.totalSources = function() {
		return sourceOrder.length;
	};

	this.goToTop = function() {
		skimmer("sections").setCurrentSource(0);
		skimmer("sections").displaySection();
	};

	this.nextSection = function(silent) {
		if (this.sectionVisible()) {
			if (typeof silent == "undefined") {
				jQuery("body").addClass("animate");
			}
			skimmer("sections").setCurrentSource(this.currentSource() + 1);
			this.displaySection();
		}
	};

	this.previousSection = function(silent) {
		if (this.sectionVisible()) {
			if (typeof silent == "undefined") {
				jQuery("body").addClass("animate");
			}
			skimmer("sections").setCurrentSource(this.currentSource() - 1);
			this.displaySection();
		}
	};

	this.getSource = function() {
		var num = typeof arguments[0] !== "undefined" ? arguments[0] : skimmer("currentSectionNumber");
		if (num < 0) {
			num = 0;
		}

		if (num >= sourceOrder.length) {
			num = sourceOrder.length - 1;
		}
		return sources[sourceOrder[num]];
	};

	this.getSourceByName = function(name) {
		return sources[name];
	};

	this.displaySection = function() {
		if (skimmer("sectionCache").initialized()) {
			if (skimmer("state").query("listeningForStoryCue")) {
				return;
			}
			var sourceToShow = skimmer("currentSection");
			sourceToShow.prepareView();
			sourceToShow.fetchData();
			if (arguments[0] !== "notrack" && window.APP_BLOCK_RENDER) {
				skimmer("tracking").recordPageview();
			}
			skimmer("adManager").getSectionTile(sourceToShow.displayName);
			setTimeout(sourceToShow.expire, 5 * 60 * 1000);
			skimmer("sidebar").mark();
		} else {
			setTimeout(function() {skimmer("sections").displaySection()}, 100);
		}
	};

	this.flipToCurrentSection = function() {
		var viewPortHeight = skimmer("grid").screenHeight();
		var top = {top:"-"+viewPortHeight+"px"};
		var middle = {top:"0"};
		var bottom ={top:viewPortHeight+"px"};

		var current = skimmer("currentSectionNumber");
		var previous = skimmer("sections").previousSectionId();

		var newContainer = skimmer("currentSection").layout.container;

		if (!isNaN(previous)) {
			var oldContainer = skimmer("sections").getSource(previous).layout.container;
			if (current > previous) {
				newContainer.css(bottom).show();
				var discard = top;
				var prepare = bottom;
			} else if (current < previous) {
				newContainer.css(top).show();
				var discard = bottom;
				var prepare = top;
			}
			oldContainer.moveNode(discard, 1000);
			newContainer.moveNode(middle, 1000);
			setTimeout(function(){jQuery("body").removeClass("animate");}, 1000);
		} else if (newContainer){
			newContainer.show().css(middle);
		}
	};

	this.initPositonsForDragging = function() {
		var viewPortHeight = skimmer("grid").screenHeight();

		var current = skimmer("currentSection").layout.container;
		var above = skimmer("currentSectionNumber") > 0 && skimmer("sections").getSource(skimmer("currentSectionNumber") - 1).layout.container;
		var below = skimmer("sections").getSource(skimmer("currentSectionNumber") + 1).layout.container;


		var top = {top:"-"+viewPortHeight+"px"};
		var middle = {top:"0"};
		var bottom ={top:viewPortHeight+"px"};

		above && above.css(top).show();
		below && below.css(bottom).show();
	};

	this.liveUpdatePositions = function(yDiff) {
		var viewPortHeight = skimmer("grid").screenHeight();

		var current = skimmer("currentSection").layout.container;
		var above = skimmer("sections").getSource(skimmer("currentSectionNumber") - 1).layout.container;
		var below = skimmer("sections").getSource(skimmer("currentSectionNumber") + 1).layout.container;

		var transform = {"WebkitTransform": "translate3D(0, "+pixels(yDiff)+", 0)"};

		above && above.css(transform);
		current.css(transform);
		below && below.css(transform);
	};

	this.finishUpSwipe = function() {
		var viewPortHeight = skimmer("grid").screenHeight();

		var current = skimmer("currentSection").layout.container;
		var above = skimmer("sections").getSource(skimmer("currentSectionNumber") - 1).layout.container;
		var below = skimmer("sections").getSource(skimmer("currentSectionNumber") + 1).layout.container;

		var up = {"WebkitTransition": "-webkit-transform 0.4s linear", "WebkitTransform":"translate3D(0, -"+pixels(viewPortHeight)+", 0)"};
		var reset = {"WebkitTransition": "-webkit-transform 0.4s linear", "WebkitTransform":"translate3D(0, 0, 0)"};

		if (skimmer("currentSectionNumber") < skimmer("sections").totalSources() - 1) {
			current.css(up);
			below && below.css(up);
			above && above.css(up);
		} else {
			current.css(reset);
			below && below.css(reset);
			above && above.css(reset);
		}

		setTimeout(function() {
			var viewPortHeight = skimmer("grid").screenHeight();

			var current = skimmer("currentSection").layout.container;
			var above = skimmer("sections").getSource(skimmer("currentSectionNumber") - 1).layout.container;
			var below = skimmer("sections").getSource(skimmer("currentSectionNumber") + 1).layout.container;

			var clean = {"WebkitTransition": "", "WebkitTransform":"none" };
			var top = {"WebkitTransition": "", "WebkitTransform":"none", top:pixels(-viewPortHeight)};
			var middle = {"WebkitTransition": "", "WebkitTransform":"none",top:"0"};
			var bottom ={"WebkitTransition": "", "WebkitTransform":"none",top:pixels(viewPortHeight)};

			if (below) {
				current.css(top);
				below && below.css(middle);
				above && above.css(clean);
			} else {
				current.css(middle);
				above && above.css(top);
			}

		}, 500);
	};

	this.finishDownSwipe = function() {
		var viewPortHeight = skimmer("grid").screenHeight();

		var current = skimmer("currentSection").layout.container;
		var above = skimmer("sections").getSource(skimmer("currentSectionNumber") - 1).layout.container;
		var below = skimmer("sections").getSource(skimmer("currentSectionNumber") + 1).layout.container;

		var down = {"WebkitTransition": "-webkit-transform 0.4s linear", "WebkitTransform":"translate3D(0, "+pixels(viewPortHeight)+", 0)"};
		var reset = {"WebkitTransition": "-webkit-transform 0.4s linear", "WebkitTransform":"translate3D(0, 0, 0)"};
		if (skimmer("currentSectionNumber") > 0) {
			current.css(down);
			below && below.css(down);
			above && above.css(down);
		} else {
			current.css(reset);
			below && below.css(reset);
			above && above.css(reset);
		}

		setTimeout(function() {
			var viewPortHeight = skimmer("grid").screenHeight();

			var current = skimmer("currentSection").layout.container;
			var above = skimmer("sections").getSource(skimmer("currentSectionNumber") - 1).layout.container;
			var below = skimmer("sections").getSource(skimmer("currentSectionNumber") + 1).layout.container;

			var clean = {"WebkitTransition": "", "WebkitTransform":"translate3D(0, 0, 0)" };
			var top = {top:"-"+viewPortHeight+"px"};
			var middle = {top:"0"};
			var bottom ={top:viewPortHeight+"px"};

			if (above) {
				current.css(clean).css(bottom);
				above && above.css(clean).css(middle);
				below && below.css(clean);
			} else {
				current.css(clean).css(middle);
				above && above.css(clean).css(top);
				below && below.css(clean).css(bottom);
			}

		}, 500);
	};

	this.resetSources = function() {
		jQuery(sourceOrder).each(function(index) {
			skimmer("sections").getSource(index).expire();
			skimmer("sections").getSource(index).deflate();
		});
	};

	this.initSurrounders = function() {
		return;
		var currentSource = skimmer("currentSectionNumber");
		var sourceConfig = Solo.config.get("sources");
		for (var i=0, len=sourceOrder.length; i<len; i++) {
			if (i == currentSource - 1 || i == currentSource + 1) {
				//if (!this.isMobileWebkit()) {
					skimmer("sections").getSource(i).prepareView();
				//}
			}
		}
	};

	this.requestSurrounders = function() {
		var currentSource = skimmer("currentSectionNumber");
		var sourceConfig = Solo.config.get("sources");
		for (var i=0, len=sourceOrder.length; i<len; i++) {
			if (i == currentSource - 1 || i == currentSource + 1) {
				//if (!this.isMobileWebkit()) {
					skimmer("sections").getSource(i).fetchData();
				//}
			} else if (i == currentSource - 2 || i == currentSource + 2) {
				skimmer("sections").getSource(i).deflate();
				var url = skimmer("sections").getSource(i).url;
				var uri = SkimmerUrl(url);
				skimmer("sectionCache").load(uri, (function(contentId) { return function() { notify("source loaded", i) } })(i) );
			} else if (i == currentSource) {
				// Do nothin'
			} else {
				skimmer("sections").getSource(i).deflate();
			}
		}
	};

	this.containsGrids = function() {
		return jQuery(".grid").length > 0;
	};

	this.sectionActive = function() {
		var state = skimmer("state");
		return !state.query("articleVisible");
	};

	this.isMobileWebkit = function(){
		return navigator.platform.match(/^iP(ad|hone|od)/);
	};

	this.sectionVisible = function() {
		return !skimmer("state").query("articleVisible")
			&& !skimmer("state").query("slideshowVisible")
			&& !skimmer("state").query("listeningForStoryCue");
	}

};

defineReceiver("GridState", "grid");

GridState = function() {
	var numRows,
		numColumns,
		scrollerHeight,
		scrollerWidth,
		cellHeightFloor = 190,
		cellWidthFloor = 210,
		verticlePagePadding = 90,
		cellWidth,
		cellHeight,
		viewPortHeight,
		viewPortWidth,
		sourceListCategoryHeight,
		screenHeight,
		resizeRequested = false,
		resizeCompleted = true;

	this.listen = function(event) {
		switch(event) {
			case "window resize":
			case "grid startup":
				this.updateData();
				break;
			case "app loaded":
				this.updateData();
				break;
			case "grid updated":
				this.updateGrid();
				break;
		};
	};

	this.scrollerHeight = function() {
		return scrollerHeight + 60;
	};

	this.screenHeight = function() {
		return screenHeight;
	};

	this.scrollerWidth = function() {
		return scrollerWidth;
	};

	this.pageHeight = function() {
		return scrollerHeight;
	};

	this.pageWidth = function() {
		return scrollerWidth;
	};

	this.firstStoryWidth = function() {
		return cellWidth * 2;
	};

	this.firstStoryHeight = function() {
		return cellHeight;// * 2;
	};

	this.viewPortHeight = function() {
		return viewPortHeight;
	};

	this.viewPortWidth = function() {
		return viewPortWidth;
	};

	this.cellHeight = function() {
		return cellHeight;
	};

	this.cellWidth = function() {
		return cellWidth;
	};

	this.numRows = function() {
		return numRows;
	};

	this.numColumns = function() {
		return numColumns;
	};

	this.cellsPerPage = function() {

	};

	this.categoryHeight = function() {
		return sourceListCategoryHeight;
	};

	this.cellsPerPage = function() {
		return numColumns * numRows;
	};

	function writeSizeStyles() {
		var grid = skimmer("grid");
		var sizeCSS =".shrinkWrap {height:"+pixels(grid.scrollerHeight() + 10)+"}"
			//+ ".shrinkWrap.expanded {height:"+pixels(grid.scrollerHeight() + 50)+"}"
			+ ".shrinkWrap.previousSection {top: -"+pixels(grid.screenHeight())+"}"
			+ ".shrinkWrap.nextSection {top: "+pixels(grid.screenHeight())+"}"
			+ ".shrinkWrap .stageRight {right: "+pixels(grid.scrollerWidth())+"}"
			+ ".shrinkWrap .page {height:"+pixels(grid.pageHeight())+"; width:"+grid.pageWidth()+"px}"
			+ ".shrinkWrap .page.first {left:10px}"
			+ ".grid .story {height:"+pixels(grid.cellHeight())+"; width:"+grid.cellWidth()+"px;}"
			+ ".grid .story.first {width:"+pixels(grid.firstStoryWidth())+"; height:"+pixels(grid.firstStoryHeight())+"}"
			+ ".cellHeight {height: "+pixels(grid.cellHeight())+"}"
			+ ".doubleCellHeight {height: "+pixels(grid.cellHeight() * 2)+"}"
			+ ".cellWidth {width: "+pixels(grid.cellWidth())+"}"
			+ ".doubleCellWidth {width: "+pixels(grid.cellWidth() * 2)+"}"
			+ ".screenWidth {width: "+pixels(grid.cellWidth() * grid.numColumns())+"}"
			+ ".screenHeight {height: "+pixels(grid.cellHeight() * grid.numRows())+"}"
			+ ".scrollerWidth {width: "+pixels(grid.scrollerWidth())+"}"
			+ ".scrollerHeight {width: "+pixels(grid.scrollerHeight())+"}"
			+ "#sidebar dd {height:"+(grid.categoryHeight() + 90) +"px; }";
		var stylesheet = document.getElementById("sizeStyles");
		if (stylesheet.styleSheet) {
			stylesheet.styleSheet.cssText = sizeCSS;
		} else {
			jQuery(stylesheet).html(sizeCSS);
		}

	}

	this.updateGrid = function() {
		resizeRequested = true;
		resizeCompleted = false;
		skimmer("grid").resizeSection();
		skimmer("grid").resizeArticle();
	};

	this.resizeSection = function() {
		writeSizeStyles();
		jQuery("body").removeClass("animate");
		skimmer("sections").resetSources();
		skimmer("sections").displaySection();
		//skimmer("currentSection").applyPagination();
	};

	this.resizeArticle = function() {
		if (resizeRequested && !resizeCompleted) {
			resizeRequested = false;
			setTimeout(function() { skimmer("grid").resizeArticle(); }, 1500);
		} else {
			if (skimmer("state").query("articleVisible") && !resizeCompleted) {
				resizeCompleted = true;
				notify("resize completed");
			}
		}
	};

	this.updateData = function() {
		var schemeConfig = skimmer("schemeManager").currentSchemeConfig();
		if (schemeConfig.containerClass && schemeConfig.containerClass == "expanded") {
			var verticalReduction = 60;
			var horizontalReduction = 42;
			var viewportVerticalReduction = 40;
		} else {
			var verticalReduction = 110;
			var horizontalReduction = 82;
			var viewportVerticalReduction = 90;
		}
		var cellHeightMin = schemeConfig.cellHeight || cellHeightFloor;
		var cellWidthMin = schemeConfig.cellWidth || cellWidthFloor;
		screenHeight = parseInt(document.getElementById("contentPane").offsetHeight);
		scrollerHeight = parseInt(document.getElementById("contentPane").offsetHeight, 10) - verticalReduction;
		scrollerWidth = parseInt(document.getElementById("contentPane").offsetWidth, 10) - horizontalReduction;
		numRows = Math.floor(scrollerHeight / cellHeightMin);
		numColumns = Math.floor(scrollerWidth / cellWidthMin);
		itemsPerPage = numRows * numColumns;
		cellHeight = Math.floor(scrollerHeight / numRows);
		cellWidth = Math.floor(scrollerWidth / numColumns);
		viewPortHeight = parseInt(document.getElementById("contentPane").offsetHeight, 10) - viewportVerticalReduction;
		viewPortWidth = parseInt(document.getElementById("contentPane").offsetWidth, 10);
		var sourceHeaders = jQuery("#sidebar dt");
		sourceListCategoryHeight = parseInt((viewPortHeight - (sourceHeaders.length * sourceHeaders.get(0).offsetHeight)), 10);
		notify("grid updated");
	};
};

defineReceiver("ArticleSelector");

ArticleSelector = function() {
	this.load = function() {
		skimmer("state").activate("listeningForStoryCue");
		skimmer("sections").visibleSlides().eq(0).addClass("selectionCursor");
	};

	this.listen = function(event, data) {
		switch(event) {
			case "tab key":
				skimmer("articleSelector").load();
				break;
			case "backslash key":
				skimmer("articleSelector").load();
				break;
			case "up arrow":
				skimmer("articleSelector").move("up");
				break;
			case "down arrow":
				skimmer("articleSelector").move("down");
				break;
			case "left arrow":
				skimmer("articleSelector").move("left");
				break;
			case "right arrow":
				skimmer("articleSelector").move("right");
				break;
			case "return key":
				skimmer("articleSelector").select();
				break;
			case "escape key":
				skimmer("articleSelector").cancel();
				break;
		}
	};

	this.move = function(direction) {
		if (skimmer("state").query("listeningForStoryCue")) {
			if      (direction == "left")  moveSelectorLeft();
			else if (direction == "right") moveSelectorRight();
			else if (direction == "up")    moveSelectorUp();
			else if (direction == "down")  moveSelectorDown();
		}

	};

	this.select = function() {
		if (skimmer("state").query("listeningForStoryCue")) {
			var slide = jQuery(".selectionCursor");
			var link = slide.addClass("current").find("a");
			var loc = link.attr("href");
			var title = link.html();
			this.cancel();
			skimmer("article").select(loc, title);
		}
	};

	this.cancel = function() {
		if (skimmer("state").query("listeningForStoryCue")) {
			skimmer("state").deactivate("listeningForStoryCue");
			jQuery(".selectionCursor").removeClass("selectionCursor");
		}
	};

	function moveSelectorLeft() {
		var current = jQuery(".selectionCursor");
		if (current.prev(":visible").length > 0) {
			current.removeClass("selectionCursor").prev().addClass("selectionCursor");
		}
	};

	function moveSelectorRight() {
		var current = jQuery('.selectionCursor');
		if (current.next(":visible").length > 0) {
			current.removeClass("selectionCursor").next().addClass("selectionCursor");
		}
	};

	function moveSelectorUp() {
		var targets = determinePosition();
		if (targets.up.length > 0) {
			jQuery(".selectionCursor").removeClass("selectionCursor");
			targets.up.addClass("selectionCursor");
		}
	};

	function moveSelectorDown() {
		var targets = determinePosition();
		if (targets.down.length > 0) {
			jQuery(".selectionCursor").removeClass("selectionCursor");
			targets.down.addClass("selectionCursor");
		}
	};

	function determinePosition() {
		var set = skimmer("sections").visibleSlides();
		var grid = skimmer("grid");
		var current = jQuery('.selectionCursor');
		var num = set.index(current);
		var total = set.length;
		var numColumns = grid.numColumns();
		var remainder = (total + 1) % numColumns;
		if (num <= 0) { // First Item
			if (skimmer("currentSection").currentPage == 0) {
				return {up:null, down: set.eq(numColumns - 1)};
			} else {
				return {up: null, down: set.eq(numColumns)};
			}
		} else if (num == numColumns - 1 || num == numColumns) {
			return {up: set.eq(0), down: set.eq(num + numColumns)}
		} else {
			return {up: set.eq(num - numColumns), down: set.eq(num + numColumns)};
		}
	}

};

defineReceiver("ReadingListController","readinglist");

function ReadingListController () {

	this.init = function() {
		this.indicators = {};
		this.samples = [];
	};

	this.listen = function(message, data) {
		switch(message) {

			case "sources imported":
				skimmer("sections").getSourceByName("Most Emailed").fetchDataSilently();
				break;

			case "add to reading list":
				break;

			case "archive frome reading list":
				break;

			case "reading list click":
				this.toggleStatus(data);
				break;

			case "sample reading list click":
				var url = jQuery(data).parents(".container").find("a").attr("href");
				this.addAsset(url);
				break;

			case "add to reading list":
				this.addAsset(data);
				break;

			case "archive from reading list":
				this.archiveAsset(data);
				break;

			case "source loaded":
				if (skimmer("sections").getSource(data).displayName == "Saved") {
					this.cleanup();
				} else if (skimmer("sections").getSource(data).displayName == "Most Emailed") {
					this.generateSampleArticles();
					this.cleanup();
				}
				break;
		}
	};

	this.requiredMarkup = function() {
		var url = skimmer("appUrl");
		var markup = '<div style="display:none" class="emptySavedListPrompt">' +
			'<h1>This page looks a little empty.</h1>'+
			'<p>Fill this page up by saving articles that you want to read later.</p>'+
			'<p>To save, click or tap anywhere you see the "+" icon.'+
			'<div style="display:none" class="regiLinks">'+
			'<p><a href="http://www.nytimes.com/auth/login?URI='+url+'">Log In</a> or <a href="http://www.nytimes.com/gst/regi.html?URI='+url+'">Register</a></p>'+
			'</div>'+
			'<div style="display:none" class="loggedInPrompt">'+
				'<h1>Give it a try with these popular articles:</h1>'+
				'<div class="sampleArticles"></div>'+
			'</div>'+
			'</div>';
		return markup;
	};

	this.toggleStatus = function(node) {
		node = jQuery(node).parents(".container");

		this.requestStatus(node, modifyState);

		section = skimmer("currentSection").displayName.replace(/\ /g, "+").replace("/","\\");
		appurl = "http://www.nytimes.com/skimmer/" + section;

		function modifyState(data) {
			var currentSectionName = skimmer("sections").getSource().displayName;
			var service = Solo.config.getService("readinglist");
			var asset = data.assets && data.assets[0];
			if (currentSectionName == "Saved") {
				node.css("opacity","0");
				notify("archive from reading list", asset.url);
				jQuery(".saveArticle").html("Save");
			} else if (asset) {
				skimmer("readinglist").addAsset(asset.url);
			} else {
				if (data.error.code === 401) {
					notify("show passive message", "To save this article,<p> <a href='http://www.nytimes.com/auth/login?URI="+ appurl +"'>Log In</a> or <a href='http://www.nytimes.com/gst/regi.html?URI="+ appurl +"'>Register</a>.</p>");
				}
			}
		}
	};

	this.getExpirationDate = function (url) {
		var article = skimmer("sections").getSource().data.matchUrl(url);
		if (article) {
			return article.expirationDate();
		} else {
			return null;
		}
	};

	this.toggleArticleStatus = function() {
		var url = skimmer("article").url;
		this.requestStatus(url, modifyState);

		function modifyState(data) {
			var service = Solo.config.getService("readinglist");
			var asset = data.assets && data.assets[0];
			//console.log("Asset",asset);
			if (asset && asset.state == "active") {
				//console.log("ARCHIVE "+asset.url);
				notify("archive from reading list", asset.url);
				skimmer("readinglist").markArticleUnsaved();
			} else if (asset) {
				//console.log("ADD "+asset.url);
				skimmer("readinglist").addAsset(asset.url);
				skimmer("readinglist").markArticleSaved();
			} else {
				console.error("ERROR toggling status");
				if (data.error.code === 401) {
					notify("show passive message", "To save this article,<p> <a href='http://www.nytimes.com/auth/login?URI='"+ skimmer("appUrl") +">Log In</a> or <a href='http://www.nytimes.com/gst/regi.html?URI="+ skimmer("appUrl") +"'>Register</a>.</p>");
				}
			}
		}
	};

	this.addAsset = function(url) {
		jQuery.ajax({
			"method":"get",
			"url": Solo.config.getService("readinglist") + "?TASK=ADD&URL="+url,
			"dataType": "json",
			"success": function(data) {
				if (data.assets) {
					var url = data.assets[0].url;
					var expirationDate = skimmer("readinglist").getExpirationDate(url);
					if (expirationDate) {
						notify("show passive message", "Saved! <div class='warning'>This article will expire in "+skimmer("readinglist").getExpirationWarning(expirationDate * 1000)+"</div>");
					} else {
						notify("show passive message", "Saved!");
					}
				}
				var savedSection = skimmer("sections").getSourceByName("Saved");
				savedSection.expire();
				skimmer("sections").displaySection();
				skimmer("readinglist").cleanup();
			},
			"error": function(xhr, status, error) {
				notify("show passive message", "We cannot save this article at this time. Please try again later.");
				console.error("Error adding", error);
			}
		});
	};

	this.getExpirationWarning = function(expirationTimestamp) {
		var date = new Date();
		date.setTime(expirationTimestamp);
		var now = new Date();
		var daysAway = Math.floor((date - now) / 1000 / 60 / 60 / 24);
		if (daysAway === 0) {
			return "Today";
		} else if (daysAway == 1) {
			return "Tomorrow";
		} else {
			return "in "+daysAway+" days";
		}
	};

	this.archiveAsset = function(url) {
		jQuery.ajax({
			"method":"get",
			"url": Solo.config.getService("readinglist") + "?TASK=ARCHIVE&URL="+url,
			"dataType": "json",
			"success": function(data) {
				var savedSection = skimmer("sections").getSourceByName("Saved");
				savedSection.deleteItem(url);//.hotReplace();
				savedSection.hotReplace();
				skimmer("readinglist").cleanup();
				notify("show passive message", "Removed");
			},
			"error": function(xhr, status, error) {
				alert("Not archived!");
				notify("show passive message", "We cannot archive this article at this time. Please try again later.");
				console.error("Error archiving", error);
			}
		});

	};

	this.requestStatus = function(url, callback) {
		if (typeof url !== "string") {
			url = url.find("a").attr("href");
		}
		jQuery.ajax({
			"method": "get",
			"url": Solo.config.getService("readinglist") + "?TASK=STATUS&URL="+url,
			"dataType": "json",
			"success": callback,
			"error": statusError
		});

		function statusError(xhr, status, error) {
			console.error("Error occurred", error);
		}
	};

	this.activateStar = function(node) {
		node = jQuery(node);
		this.insertStar(node);
		jQuery(node).find(".readingListIndicator").addClass("hover");
	};

	this.deactivateStar = function(node) {
		jQuery(node).find(".readingListIndicator").removeClass("hover");
	};

	this.displayStatus = function(node) {
		this.requestStatus(node, statusReceived);
		function statusReceived(data) {
			if (data.assets && data.assets[0] && data.assets[0].state === "active") {
				node.find(".readingListIndicator").addClass("active");
			} else {
				node.find(".readingListIndicator").removeClass("active");
			}
		}
	};

	this.displayArticleStatus = function() {
		var url = skimmer("article").url;
		this.requestStatus(url, statusReceived);

		function statusReceived(data) {
			if (data.assets && data.assets[0] && data.assets[0].state == "active") {
				skimmer("readinglist").markArticleSaved();
			} else {
				skimmer("readinglist").markArticleUnsaved();
			}
		}
	};

	this.markArticleSaved = function() {
		jQuery(".saveArticle").html("Saved").addClass("saved");

	};

	this.markArticleUnsaved = function() {
		jQuery(".saveArticle").html("Save").removeClass("saved");
	};

	this.insertStar = function(node) {
		var markup = jQuery("<div class='readingListIndicator'><div class='button'></div></div>");
		if (node.find(".readingListIndicator").length < 1) {
			var target = node.find(".content");
			if (target.length === 0) {
				target = node.find(".container");
			}
			var currentSectionName = target.parents(".shrinkWrap").find(".sectionName").text();
			if (currentSectionName == "Photos") {
				return;
			}
			if (target.find(".kicker").length > 0) {
				markup.insertBefore(target.find(".kicker"));
			} else {
				markup.insertBefore(target.find(".headline"));
			}
			if (currentSectionName === "Saved") {
				markup.find(".button").html("x");
				var url = target.find("a").attr("href");
				var article = skimmer("sections").getSourceByName("Saved").data.matchUrl(url);
				if (article && article.expirationDate()) {
					target.append("<p class='expirationWarning'>This content will expire "+this.getExpirationWarning(article.expirationDate())+"</p>");
				}
			} else {
				markup.find(".button").html("+");
			}
		}
	};

	this.clearEmptyPrompt = function() {
		var savedSection = skimmer("sections").getSourceByName("Saved").layout.container;
		savedSection && savedSection.find(".activeSavedListPrompt").remove();
	};

	this.showEmptyPrompt = function() {
		var savedSection = skimmer("sections").getSourceByName("Saved").layout.container;
		jQuery(".emptySavedListPrompt").clone()
			.addClass("activeSavedListPrompt")
			.removeClass("emptySavedListPrompt")
			.appendTo(savedSection)
			.fadeIn("fast");
		if (skimmer().loggedIn()) {
			jQuery(".activeSavedListPrompt .loggedInPrompt").show();
			jQuery(".activeSavedListPrompt .sampleArticles").html(this.samples.join(""));
			jQuery(".activeSavedListPrompt .regiLinks").hide();
		} else {
			jQuery(".activeSavedListPrompt .loggedInPrompt").hide();
			jQuery(".activeSavedListPrompt .regiLinks").show();
		}

	};

	this.generateSampleArticles = function() {
		var data = skimmer("sections").getSourceByName("Most Emailed").data.dataArray.slice(0,2);
		this.samples = [];
		var template = "<div class=\"sample\"><div class=\"container\"><% if (item.thumbnail()){ %><div class=\"thumbnail\"><img height=\"60\" width=\"60\" src=\"<%= item.thumbnail() %>\"></div><% } %><div class=\"readingListIndicator\"><div class=\"button\">+</div></div><h2><a href=\"<%= item.url() %>\"><%= item.title() %></a></h2></div></div>";
		for (var i=0,len=data.length; i<len; i++) {
			var article = data[i];
			var markup = tmpl(template, {item: article});
			this.samples.push(markup);
		}
	};

	this.cleanup = function() {
		this.clearEmptyPrompt();
		var savedSection = skimmer("sections").getSourceByName("Saved");
		var numSaved = savedSection.data.dataArray.length;
		if (numSaved === 0) {
			this.showEmptyPrompt();
		}
	};
};

defineReceiver("FileSyncStatus", "syncStatus");

FileSyncStatus = function() {

	this.fs = null;
	this.visible = false;
	this.count = 0;
	this.spansSeen = 0;
	this.thumbsSeen = 0;
	this.fsCount = 0;
	this.dbTotal = 0;
	this.dbStored = 0;
	this.seenImages = {};
	this.imageSizes = {};

	this.init = function() {
		this.node = jQuery(".syncStatus");
		getFS();

	};

	this.requiredMarkup = function() {
		return "<div class='syncStatus'>\
			<div class='header'>\
			<div class='label'>Syncing</div>\
				<ul class='widgets'>\
					<div class='imageProgress'><progress></progress></div>\
				</ul>\
			</div>\
			<div class='body'>\
				<div class='count'></div>\
			</div>\
			</div>";
	};

	this.listen = function(message, data) {
		switch(message) {
			case "show filesystem":
				this.show();
				break;

			case "hide filesystem":
				this.hide();
				break;

			case "update file listing":
				this.updateFiles();
				break;

			case "image stored":
				var shortName = data.replace(/\W+/g, "-");
				this.prepend(shortName);
				break;

			case "reset local files":
				this.count = 0;
				this.updateFiles();
				this.updateCount();
				break;

			case "hard refresh":
				this.resetCounts();
				this.startMonitor();
				this.updateCount();
				break;

			case "encountered thumb":
				if (!this.seenImages[data]) {
					this.seenImages[data] = 1;
					this.thumbsSeen += 1;
					this.updateCount();
				} else {
					this.seenImages[data] += 1;
				}
				break;

			case "encountered span":
				if (!this.seenImages[data]) {
					this.seenImages[data] = 1;
					this.spansSeen += 1;
					this.updateCount();
				} else {
					this.seenImages[data] += 1;
				}
				break;
		}
	};

	this.toggleDetails = function() {
		jQuery(".syncStatus .body").toggleClass("visible");
	};

	this.show = function() {
		return;
		if (window.chrome && window.chrome.app && window.chrome.app.isInstalled) {
			this.node.addClass("visible");
		}
	};

	this.hide = function() {
		this.node.find(".body").removeClass("visible");
		this.node.removeClass("visible");
	};

	this.prepend = function(filePath) {
		this.count += 1;
		this.updateCount();
	};

	this.updateBaseStats = function() {
		this.reportTotalSize();
		var reader = skimmer("syncStatus").fs.root.createReader();
		reader.readEntries(function(entryArray) {
			skimmer("syncStatus").fsCount = entryArray.length;
			skimmer("syncStatus").updateCount();
		});

		skimmer("imageManager").report("select count(*) as count from articleimages", [], function(tx, r) {

			skimmer("syncStatus").dbTotal = r.rows.item(0).count;
			skimmer("syncStatus").updateCount();
		});

		skimmer("imageManager").report("select count(*) as count from articleimages where stored=1", [], function(tx, r) {
			skimmer("syncStatus").dbStored = r.rows.item(0).count;
			skimmer("syncStatus").updateCount();
		});
	};

	this.updateCount = function() {
		skimmer("syncStatus").node.find(".count").html("<ul><li>Images: " + (this.thumbsSeen + this.spansSeen) + "</li><li>On Filesystem: "+ this.fsCount + "</li><li>Total Size: "+ this.totalSize() +" MB</li><li>In Database: "+this.dbTotal+"</li><li>Marked Stored: "+this.dbStored+"</li></ul>");
		this.updateProgressBar();
	};

	this.updateProgressBar = function() {
		var expected = this.thumbsSeen + this.spansSeen;
		jQuery(".imageProgress progress").attr({"max":expected, "value": this.dbStored});
	}

	this.reportTotalSize = function() {
		if (canWriteToFileSystem()) {
			if (this.fs) {
				var reader = this.fs.root.createReader();
				reader.readEntries(function(entryArray) {
					for (var i=0, len=entryArray.length; i<len; i++) {
						var entry = entryArray.item(i);
						entry.file(function(f) {
							skimmer("syncStatus").addSizeEntry(f.name, f.size);
						});
					}
				});
			}
		}
	};

	this.totalSize = function() {
		var totalBytes = 0;
		for (var name in this.imageSizes) {
			totalBytes += this.imageSizes[name];
		}
		var kBytes = Math.round(totalBytes / 1024);
		var mBytes = Math.round(kBytes / 1024);
		return mBytes;
	};

	this.addSizeEntry = function(name, byteSize) {
		this.imageSizes[name] = byteSize;
	};

	this.syncComplete = function() {
		var expected = this.thumbsSeen + this.spansSeen;
		return (expected > 0 && this.dbStored >= expected);
	};

	this.startMonitor = function() {
		skimmer("syncStatus").show();
		setTimeout(function pingStatus() {
			//console.log("Updating base stats.", new Date());
			skimmer("syncStatus").updateBaseStats();
			if (!skimmer("syncStatus").syncComplete()) {
				//console.log("Still syncing", new Date());
				setTimeout(pingStatus, 3000);
			} else {
				console.log("Sync is complete", new Date());
				skimmer("syncStatus").hide();
				skimmer("imageManager").refreshImageAssets();
			}
		}, 3000);
	};

	this.stopMonitor = function() {
		console.warn("Stopped the monitor");
		clearInterval(skimmer("syncStatus").monitorInterval);
	};

	this.resetCounts = function() {
		this.count = 0;
		this.fsCount = 0;
		this.dbTotal = 0;
		this.dbStored = 0;
		this.thumbsSeen = 0;
		this.spansSeen = 0;
		this.seenImages = {};
		this.imageSizes = {};
	};

	function getFS() {
		requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
		if (requestFileSystem) {
			requestFileSystem(PERSISTENT, 10 * 1024 * 1024, fileSystemSuccess, fileSystemError);
		}
	}

	function fileSystemSuccess(fs) {
		skimmer("syncStatus").fs = fs;
		var reader = fs.root.createReader();
		reader.readEntries(function(entryArray) {
			skimmer("syncStatus").fsCount = entryArray.length;
			skimmer("syncStatus").updateCount();
		});
		skimmer("syncStatus").startMonitor();
	}

	function fileSystemError(e) {
		console.error(e)
	}

	function canWriteToFileSystem() {
		return window.Worker && (window.requestFileSystem || window.webkitRequestFileSystem);
	}

}

defineReceiver("ImageManager");

ImageManager = function() {
	var metaDB;
	var cachedURLs = {};
	var objectURLs = {};
	var sizeAggregate = [];
	var requestedImages = [];
	var imagesToSync = 0;
	var imagesSynced = 0;

	this.init = function() {
		if (window.Worker) {
			this.worker = new Worker(Solo.config.getService("imageWorker"));
			this.worker.onmessage = workerResponse;
			this.worker.onerror = function(e) {
				//console.error("WORKER ERROR", e);
			}
		}

		if (window.openDatabase) {
			metaDB = openDatabase('imageData', '1.0', 'Keeps track of images.', 1024 * 1024);
			metaDB.transaction(function(tx) {
				tx.executeSql('CREATE TABLE IF NOT EXISTS articleimages(ID INTEGER PRIMARY KEY ASC, timestamp DATETIME, imageurl TEXT UNIQUE, filename TEXT, articleurl TEXT, stored INTEGER, imagetype TEXT)',[], function() {}, dbError);
			});

			metaDB.transaction(function(tx) {
				tx.executeSql('SELECT * FROM articleimages', [], initSuccess, dbError );
			});
		}

		if (canWriteToFileSystem()) {
			getFS();
		}
	};

	function workerResponse(e) {
		if (e.data.match(":||:")) {
			var parts = e.data.split(":||:");
			if (parts[0] == "result_handle") {
				var url = parts[1];
				//console.log("Completed ", url);
				imagesSynced += 1;
				notify("image stored", url);
				skimmer("imageManager").updateProgress();
				cachedURLs[url] = 2;
			}
		} else {
			console.log("WORKER SAYS", e.data);
		}
	}

	function initSuccess(tx, response) {
		for (var i=0, len=response.rows.length; i<len; i++) {
			var row = response.rows.item(i);
			cachedURLs[row.imageurl] = 1;
			if (row.stored) {
				cachedURLs[row.imageurl] = 2;
			}
		}
	}

	function writeSuccess(tx, response) {
		//console.log("Successfully wrote some data.");
	}

	function dbError(tx, e) {
		if (e.code !== 1) {
			console.error("There was a database: ", e);
		}
	}


	this.listen = function(event, data) {
		switch(event) {
			case "hard refresh":
				this.startSync();
				this.reset();
				break;

			case "reset local files":
				this.reset();
				break;

			case "hash created":
				console.log("Filesystem hash", data);
				this.createdHash = data;
				break;
		};
	};

	this.startSync = function() {
		imagesToSync = 0;
		imagesSynced = 0;
		cachedURLs = {};
		//notify("show filesystem");
	};

	this.updateProgress = function() {
		//console.log("Sync Progress", imagesSynced, "/", imagesToSync);
		if (imagesSynced >= imagesToSync) {
			imagesToSync = 0;
			imagesSynced = 0;
			this.cleanUp();
		} else {
			//skimmer("syncStatus").show();
		}
	};

	this.store = function(imageUrl, articleUrl, type) {
		return;
		//skimmer("fs").add(imageUrl, type);
		if (imageUrl.match("filesystem:")) {
			//console.warn("Trying to save a filesystem url.", imageUrl, articleUrl);
			return;
		}
		if (canWriteToFileSystem()) {
			if (cachedURLs[imageUrl] == 2) {
				//console.warn("Already stored ", imageUrl);
				this.reinstateArticle(articleUrl);
				return;
			}
			//requestedImages.push(imageUrl);
			imagesToSync += 1;
			this.updateProgress();
			var shortName = imageUrl.replace(/\W+/g, "-");
			var prefix = Solo.config.getService("image");
			metaDB.transaction(function(tx) {
				tx.executeSql('INSERT INTO articleimages (imageurl, filename, articleurl, imagetype, stored) VALUES(?, ?, ?, ?, 0)', [imageUrl, shortName, articleUrl, type], writeSuccess, dbError);

			});
			this.worker.postMessage("store:!!:"+prefix + ":!!:" + imageUrl);
			cachedURLs[imageUrl] = 1;
			//var data = requestImageData(url);
			//console.log(data);
		} else {
			console.log("can't write to file system");
		}
	};

	this.getObject = function(url) {
		return null;
		var shortName = url.replace(/\W+/g, "-");
		var fsLocation = "filesystem:http://"+window.location.host+"/persistent/"+shortName;
		if (cachedURLs[url] == 2) {
			return fsLocation;
		}
	};

	this.reinstateArticle = function(articleUrl) {
		metaDB.transaction(function(tx) {
			tx.executeSql('INSERT INTO articleimages (articleurl) VALUES(?)', [articleUrl], writeSuccess, dbError);
		});
	};

	this.cleanUp = function() {
		//console.log("Now it's time to remove orphaned images.");
		var reader = this.fs.root.createReader();
		var shortNames = [];
		var urls = {};
		var totalSeen = 0;
		for (var url in skimmer("syncStatus").seenImages) {
			var shortName = url.replace(/\W+/g, "-");
			shortNames.push(shortName);
		}
		reader.readEntries(function(entryArray) {
			var suspectedStale = {};
			var matchedItems = 0;
			var unmatchedItems = 0;
			for (var i=0, len=entryArray.length; i<len; i++) {
				var entry = entryArray[i];
				if (jQuery.inArray(entry.name, shortNames) == -1) {
					skimmer("imageManager").eliminate(entry.name);
					suspectedStale[entry.name] = true;
					unmatchedItems += 1;
				} else {
					matchedItems += 1;
				}
			}
			//console.log("Matched", matchedItems, "Unmatched Items", unmatchedItems, "Suspected to be stale:",suspectedStale);
		});
	};

	this.report = function(query, params, callback) {
		metaDB.transaction(function(tx) {
			tx.executeSql(query, params, callback, dbError);
		});
	};

	this.refreshImageAssets = function() {
		jQuery(".story img").each(function(i) {
			var parts = this.src.split("?");
			var src = parts[0];
			this.src = src + "?" + new Date().getTime();
		})
	};

	this.eliminate = function(imageurl) {
		this.worker.postMessage("delete:!!:"+imageurl);
		return;
		var shortName = imageurl.replace(/\W+/g, "-");
		//console.log("Asked to elimante row.");
		metaDB.transaction((function(url) {
			return function(tx) {
				tx.executeSql("delete from articleimages where imageurl=?",[url], function(tx, r) {
					console.log("Elimineted",r,tx);
				}, dbError);
			};
		}
		)(imageurl));
		//console.log("About to delete file:",shortName);
		this.fs.root.getFile(shortName, {}, function(fileEntry) {
			console.log("Asked to remove file", shortName, fileEntry);
			fileEntry.remove();
			console.log("File entry removed?");
		},
		function(e) {
			//console.error("Error removing", imageurl, shortName, e);
		});
	};

	this.debug = function(url) {
		var shortName = url.replace(/\W+/g, "-");
		if (canWriteToFileSystem()) {
			if (this.fs) {
				this.fs.root.getFile(shortName, {},
					function(fileEntry) {
						console.log(fileEntry.toURI());

							var img = jQuery("<img>").css({
								"position": "fixed",
								"top": "0",
								"left": "0",
								"z-index":"100000000"
							}).appendTo("body");
							console.log(url);
							img.get(0).src = fileEntry.toURI ? fileEntry.toURI() : fileEntry.toURL();
							console.log(img);
					},
					function(e) {
						//console.error("error!");
					});
			} else {
				getFS();
				window.setTimeout(function() {
					skimmer("imageManager").debug(url);
				}, 100);
			}
		}
	};

	this.listFiles = function() {
		if (canWriteToFileSystem()) {
			if (this.fs) {
				var reader = this.fs.root.createReader();
				reader.readEntries(function(entryArray) {
					//console.log("Files:", entryArray);
				});
			}
		}
	};

	this.fileHash = function() {
		if (this.fs) {
			var hash = {};
			var reader = this.fs.root.createReader();
			reader.readEntries(function(entryArray) {
				console.log(entryArray);
				for (var i=0, len=entryArray.length; i<len; i++) {
					var entry = entryArray[i];
					hash[entry.name] = entry;
				}
				notify("hash created", hash);
			});
		}
	};


	this.reset = function() {
		if (this.fs) {
			var reader = this.fs.root.createReader();
			reader.readEntries(function(entryArray) {
				console.log("Reset: ", entryArray.length, entryArray);
				for (var i=0, len=entryArray.length; i<len; i++) {
					var entry = entryArray[i];
					try {
						entry.remove();
					} catch(e) {
						//console.error("Reset error:",e);
					}
				}
			});
			metaDB.transaction(function(tx) {
				tx.executeSql("delete from articleimages",{}, writeSuccess, dbError);
			});
		} else {
			getFS();
			setTimeout(function() {
				skimmer("imageManager").reset();
			}, 100)
		}
	};

	function getFS() {
		requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
		requestFileSystem(PERSISTENT, 60 * 1024 * 1024, fileSystemSuccess, fileSystemError);
	}

	function fileSystemSuccess(fs) {
		//console.log("File system", fs.name);
		skimmer("imageManager").fs = fs;
	}

	function fileSystemError(e) {
		//console.error(e)
	}

	function canWriteToFileSystem() {
		return window.Worker && (window.requestFileSystem || window.webkitRequestFileSystem);
	}

	function requestImageData(url) {
		var fullUrl = Solo.config.getService("image")+"?URI="+url;
		//console.log(fullUrl);
		var req = new XMLHttpRequest();
		req.open('GET', fullUrl, false);
		//XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com]
		req.overrideMimeType('text/plain; charset=x-user-defined');
		req.send(null);
		if (req.status != 200) return '';
		return req.responseText;
	}
};

defineReceiver("NotificationController","notifications");

function NotificationController() {

	this.init = function() {
		this.messageNode = jQuery(".passiveMessageDisplay");

	};

	this.requiredMarkup = function() {
		return "<div style='display:none' class='passiveMessageDisplay'>Default Message!</div>";
	};

	this.listen = function(message, data) {
		switch(message) {
			case "show passive message":
				this.showPassiveMessage(data);
				break;

			case "hide passive message":
				this.hidePassiveMessage();
				break;

			case "cleanup notification":
				this.messageNode.hide();
				break;
		}
	};

	this.showPassiveMessage = function(message) {
		this.messageNode.html(message).show().addClass("active");
		notifyLater("hide passive message", 3000);
	};

	this.hidePassiveMessage = function() {
		if (this.messageNode.hasClass("lock")) {
			notifyLater("hide passive message", 1000);
		} else {
			this.messageNode.removeClass("active");
			notifyLater("cleanup notification", 1000);
		}
	}
}

defineReceiver("PayManager", "pay");

function PayManager() {
	var tabletBundle = "mtd";
	var smartPhoneBundle = "mm";
	var firstClickArticle = false;
	this.payStatus = true;
	var hdLinkUrl = "https://myaccount.nytimes.com/link/homedelivery";
	var loginUrl = "http://www.nytimes.com/auth/login?URI="+ skimmer("appUrl");


	var markup = "<div class='articleGateway'>\
			<div class='gatewaySection first'>\
				<img class='gatewayLogo' src='/webapps/skimmer/2.0/images/gateway-logo.png'>\
			</div>\
			<div class='gatewaySection pitchArea'>\
				<p>NO PITCH YET</p>\
			</div>\
			<div class='gatewaySection last'>\
				<p>Print subscriber? <a href='"+hdLinkUrl+"'>Get free access &raquo;</a></p>\
				<p>NYTimes.com subscriber? <a href='"+loginUrl+"'>Log In &raquo;</a></p>\
			</div>\
		</div>\
	";

	var chromeBackupMarkup = " <div class=\"subscribeCallout\">\
		<p>Want unlimited access to the NYTimes app for Chrome Web Store?</p>\
		<p>Sign up for a NYTimes.com+Tablet or All Digital Access subscription.</p>\
		<a href=\"http://www.nytimes.com/adx/bin/adx_click.html?type=goto&amp;opzn&amp;page=www.nytimes.com/chrome/gateway.html&amp;pos=Gateway&amp;sn2=7771b4be/b3c64959&amp;sn1=ecc3d5ab/e1ec2794&amp;camp=gateway_chrome_37XX9&amp;ad=gateway_chrome_37XX9&amp;goto=http%3A%2F%2Fwww%2Enytimes%2Ecom%2Fsubscriptions%2FMultiproduct%2Flp5558%2Ehtml%3Fadxc%3D158084%26adxa%3D261278%26page%3Dwww.nytimes.com/chrome/gateway.html%26pos%3DGateway%26campaignId%3D37XX9\" alt=\"\"><img alt=\"\" border=\"0\" src=\"/webapps/skimmer/2.0/images/subscribe-button.png\"></a>\
		</div>";

	var skimmerBackupMarkup = " <div class=\"subscribeCallout\">\
		<p>Want unlimited access to Times Skimmer?</p>\
		<p>Sign up for any digital subscription package to get unlimited access to NYTimes.com, which includes Times Skimmer.</p>\
		<a href=\"http://www.nytimes.com/adx/bin/adx_click.html?type=goto&opzn&page=www.nytimes.com/skimmer/gateway.html&pos=Gateway&sn2=6463f537/4ec0e641&sn1=ba8cb9d5/b11b3a61&camp=gateway_times_skimmer_37XXF&ad=gateway_skimmer_37XXF&goto=http%3A%2F%2Fwww%2Enytimes%2Ecom%2Fsubscriptions%2FMultiproduct%2Flp5558%2Ehtml%3Fadxc%3D158078%26adxa%3D261276%26page%3Dwww.nytimes.com/skimmer/gateway.html%26pos%3DGateway%26campaignId%3D37XXF\" alt=\"\"><img alt=\"\" border=\"0\" src=\"/webapps/skimmer/2.0/images/subscribe-button.png\"></a>\
		</div>";

	this.init = function() {
		if (inChromeApp() && Solo.config.getService("entitlements")) {
			var bundle = inChromeApp() ? "mtd" : "mm";
			var url = Solo.config.getService("entitlements")+"?bundle=" + bundle;
			jQuery.ajax({
				"url": url,
				"success": function(data) {
					var expiry, parts, now, then;
					var entitlements = JSON.parse(data);
					// Test.
					if (entitlements.data && entitlements.data.entitlements && entitlements.data.entitlements.expires) {
						this.payStatus = true;
					} else {
						this.payStatus = false;
					}
					if (this.payStatus) {
						notify("customer acknowledged");
					} else {
						notify("customer denied");
					}
				},
				"error": function(xhr, status, e) {
					console.error("error making request");
					console.log(arguments);
				}
			});
		}
	};

	this.requiresGateway = function() {
		return !(skimmer("pay").payStatus || firstClickArticle || jQuery.inArray(skimmer("currentSection").displayName, Solo.config.get("freeSections")) !== -1);
	};

	this.requiredMarkup = function() {
	};

	this.listen = function(event, data) {
		switch(event) {
			case "customer acknowledged":
				this.payStatus = true;
				if (inChromeApp()) {
					jQuery("body").addClass("premiumContent").removeClass("liteContent");
				}
				break;

			case "customer denied":
				this.payStatus = false;
				if (inChromeApp()) {
					jQuery("body").addClass("liteContent").removeClass("premiumContent");
				}
				break;
		}
	};

	this.insertPitch = function(markup) {
		jQuery(".pitchArea").html(markup);
	};

	this.insertChromeBackup = function() {
		jQuery(".pitchArea").html(chromeBackupMarkup);
	};

	this.insertSkimmerBackup = function() {
		jQuery(".pitchArea").html(skimmerBackupMarkup);
	};

	this.enableFirstClickFree = function() {
		firstClickArticle = true;
	};

	this.disableFirstClickFree = function() {
		firstClickArticle = false;
	};

	this.showingFirstClick = function() {
		return firstClickArticle;
	};

	this.gatewayMarkup = function() {
		return markup;
	};

	function inChromeApp() {
		return window.chrome && window.chrome.app && window.chrome.app.isInstalled;
	}

};

function PayGateway() {

	var markup = "\
		<div class='articleGateway'>\
			<div class='gatewaySection'>\
				<h2>Subscribe now for unlimited access to NYTimes.com</h2>\
				<img src='/webapps/skimmer/2.0/images/subscribe-button.png'>\
			</div>\
			<div class='gatewaySection'>\
				<p>Print subscriber? <a>Get free access &raquo;</a></p>\
			</div>\
			<div class='gatewaySection'>\
				<p>Call to subscribe: (800) 591-9233</p>\
				<p class='subdata'>Mon.-Fri.: 8 a.m.-8 p.m. E.T.</p>\
				<p class='subdata'>Sat.-Sun.: 10 a.m.-5 p.m. E.T.</p>\
				<p class='subdata'>U.S. residents only)</p>\
			</div>\
		</div>\
	";

	this.generate = function() {

	};

}

defineReceiver("AuthorizationController", "auth");

AuthorizationController = function() {
	var loggedIn = false;
	var userName = "?";

	this.init = function() {

	};

	this.listen = function(event, data) {
		switch(event) {
			case "sidebar loaded":
				this.requestStatus();
				break;
			case "status received":
				loggedIn = (data == "logged in");
				this.displayRegiStatus();
				break;
		}
	};

	this.loggedIn = function() {
		return loggedIn;
	};

	this.displayRegiStatus = function() {
	};

	this.setDisplayName = function(uname) {
		userName = uname;
	};

	this.requestStatus = function() {
		var checkUrl = Solo.config.getService("auth");
		if (checkUrl) {
			jQuery.ajax( {
				method: "get",
				dataType: "json",
				url: checkUrl,
				success: statusCallback,
				error: errorHandler
			});
		}
	};

	function statusCallback(data) {
		skimmer("auth").user = data;
		if (data.error_id && data.error_message && (data.user && !data.user.id) ) {
			notify("status received", "logged out");
		} else if (data.user && data.user.id) {
			notify("status received", "logged in");
		}
	}

	function errorHandler(xhr, status, errorText) {
		console.error("Auth Error: ", errorText);
	}


};

defineReceiver("AccountPanel","account");

AccountPanel = function() {
	this.init = function() {

	};

	this.listen = function(event, data) {
		switch(event) {

		}
	};

	this.requiredMarkup = function() {
		return "<div class='darkPanel accountPanel' style='display:none'>\
			<div class='darkHeader'>\
			<span class='accountLabel'>My Account</span>\
			<div class='darkPanelClose button accountClose'>Close</div>\
			</div>\
			<div class='darkPanelContent accountContent'>\
			</div>\
			</div>";
	};

	function loggedOutContent() {
		return "<p><strong>Already an NYTimes.com member?</strong> <a href='http://www.nytimes.com/auth/login?URI="+ skimmer("appUrl") +"'>Log in now &raquo;</a></p>\
		<p><a href='http://www.nytimes.com/gst/regi.html?URI="+ skimmer("appUrl") +"'>Register for a new NYTimes.com account &raquo;</a></p>";
	}

	function loggedInContent() {
		if (skimmer("auth").user.profile) {
			return "<p><strong>Welcome, "+skimmer("auth").user.profile.displayname+".</strong></p>\
				<p><a href='http://www.nytimes.com/logout?URI="+ skimmer("appUrl") +"'>Log Out</a></p>";
		} else {
			return "<p><strong>Welcome.</strong></p>\
				<p><a href='http://www.nytimes.com/logout?URI="+ skimmer("appUrl") +"'>Log Out</a></p>";
		}
	}

	this.show = function() {
		if (skimmer("auth").loggedIn()) {
			jQuery(".accountContent").html(loggedInContent());
		} else {
			jQuery(".accountContent").html(loggedOutContent());
		}
		jQuery(".accountPanel").fadeIn("fast");
	};

	this.hide = function() {
		jQuery(".accountPanel").fadeOut("hide");
	};
};

ArticleView = function() {
	var developerMode = "off";
	var maxColumnHeight = 0;
	var columnSpacing = 20;
	var viewPortWidth = 0;
	var columnTextWidth = 0;
	var columnWidth = 0;
	var columnsPerView = 4;
	var columnCount = 0;
	var assetColumns = 2;
	var defaultImageWidth = 0;
	var defaultImageHeight = 0;
	var virtualPosition = 0;
	var renderedPages = 0;
	var renderingColumns = false;
	var resizing = false;
	var columnizer = null;

	this.data = null;
	this.horizontalTemplate = "horizontalArticleTemplate";
	this.verticalTemplate = "verticalArticleTemplate";

	Solo.templates.load("horizontalTemplate", "\
		<div class=\"horizontal animate\">\
			<% if (article.spanImage()) { %>\
				<div class=\"mediaAssets\" style=\"visibility: hidden\">\
					<div class=\"image mediaUnit\">\
						<img src=\"<%= article.jumboImage() %>\" width=\"<%= article.imageWidth() %>\" height=\"<%= article.imageHeight() %>\" >\
						<% if (article.credit()) { %>\
							<div class=\"credit\"> <%= article.credit() %></div>\
						<% } %>\
						<% if (article.caption()) { %>\
							<div class=\"caption\"><%= article.caption() %></div>\
						<% } %>\
						<div id=\"uptrackerContainer\"></div>\
					</div>\
				</div>\
			<% } %>\
		</div>\
	");

	this.applyTemplate = function() {
		this.data = skimmer("article").data;
		this.activateArticleUI();
		var template;
		var template = Solo.templates.get("horizontalTemplate");
		var markup = template.render({ article: this.data });
		jQuery("#articleLayout").removeClass("animate").css("margin-left","").html(markup);
		skimmer("state").activate("articleVisible");

		if (skimmer("settings").read("article") == "h") {
			defaultImageWidth = this.data.imageWidth();
			defaultImageHeight = this.data.imageHeight();
			notify("render columns");
		}
	};

	this.activateArticleUI = function() {
		jQuery("body").addClass("articleActive");
		jQuery("#articleContent").html("");
		jQuery("#skimmerArticleViewer").removeClass("belowScreen");
		jQuery(".contentNavigationControl").hide();
		jQuery("#sources").css("opacity", "0.7");
		var headlineLink = jQuery("<a></a>").attr("href",skimmer("article").url).html(skimmer("article").title);
		var title = this.data.title();
		headlineLink.html(title);
		jQuery("#articleCloser").show();
		jQuery("#articleTitle").removeClass("animate").css("margin-left", "").html(headlineLink);
	};

	this.deflate = function() {
		jQuery(".horizontal").addClass("animate");
		jQuery("body").removeClass("articleActive").removeClass('fullscreen').addClass('normal');
		jQuery("#skimmerArticleViewer").addClass("belowScreen");
		jQuery("#skimmerMessage").html("");
		jQuery("#columnatedContent").html("");
		jQuery("#articleTitle").html("");
		jQuery("#rawContent, #columnatedContent").html("");
		jQuery("#columnatedContent").css("marginLeft", "0");
		jQuery(".contentNavigationControl").show();
		jQuery("#articleCloser").hide();
		jQuery("#sources").css("opacity", "1.0");
		this.disableContentDisplay();
	};

	this.mergedText = function() {
		return "<div class='byline'>"+this.data.byline()+"</div><div class='dateline'>"+this.data.dateline()+"</div>"+this.data.body();
	};

	this.renderColumns = function() {
		if (!skimmer("state").query("articleVisible") || skimmer("article").columnsRendered) {
			return;
		}
		renderingColumns = true;
		var container = jQuery("#frameContainer");


		Columns.devmode = developerMode;
		Columns.sizerDiv = document.getElementById("columnSizer");
		Columns.text = this.mergedText();

		maxColumnHeight = jQuery(".horizontal").height() - 30;
		viewPortWidth = skimmer("currentSection").layout.container.width() - 18;
		columnTextWidth = (viewPortWidth - columnSpacing * columnsPerView) / columnsPerView;

		while (true) {
			if (columnTextWidth > 600) {
				columnsPerView += 1;
			} else if (columnTextWidth < 315 && columnsPerView > 2) {
				columnsPerView -= 1;
			} else {
				break;
			}
			columnTextWidth = (viewPortWidth - columnSpacing * columnsPerView) / columnsPerView;
		}

		columnWidth = columnTextWidth + columnSpacing;
		assetColumns = (columnsPerView == 2) ? 1 : 2;

		/*
		columnizer = new Solo.Columnizer({
			"max_height":  maxColumnHeight,
			"column_width": columnTextWidth,
			"column_gap": columnSpacing
		});
		*/

		if (this.data.spanImage()) {
			this.adjustImage();
		}

		jQuery("#skimmerArticleViewer .image").each(function() {
			var container = jQuery(this);
			var img = container.find("img");
			if (container.width() > img.width()) {
				container.css("width", pixels(img.width()));
			}
		});
		this.enableContentDisplay();
		//columnizer.init(jQuery("#frameContainer .articleColumnContainer"));
		//console.log(columnizer);
		skimmer("article").view.addColumns(0);
		//columnizer.redraw();
	};

	this.rendering = function() {
		return renderingColumns;
	};

	this.slideAway = function(direction) {
		var distance = jQuery("#skimmerArticleViewer").width();
		if (direction == "right") {
			jQuery("#articleLayout").add("#articleTitle").addClass("animate").css("margin-left", pixels(distance));
		} else if (direction == "left") {
			jQuery("#articleLayout").add("#articleTitle").addClass("animate").css("margin-left",pixels(-distance));
		}
	};

	this.enableContentDisplay = function() {
		jQuery(".mediaAssets").css("visibility", "visible");
		jQuery("#articleLayout").css("visibility", "visible");
	};

	this.disableContentDisplay = function() {
		jQuery("#articleLayout").css("visibility", "hidden");
	};

	this.adjustImage = function() {
		var visibleImage = jQuery("#skimmerArticleViewer .image").eq(0);
		var mediaWidth = columnWidth * assetColumns;
		var percentChange = defaultImageWidth / (mediaWidth - 10);
		var adjustedHeight = defaultImageHeight / percentChange;

		if (defaultImageWidth > (mediaWidth - 10)) {
			jQuery(".mediaAssets").css("width", pixels(mediaWidth));
		} else if (defaultImageWidth < columnWidth) {
			jQuery(".mediaAssets").css("width", pixels(columnWidth));
		} else if (defaultImageWidth < (mediaWidth - 10)) {
			jQuery(".mediaAssets").css("width", pixels(mediaWidth));
		}

		var imageResizer = new ResizedContainedElement(visibleImage.find("img"), visibleImage);
		imageResizer.addVerticalPadding(20);
		imageResizer.apply();
	};

	this.updateNavigation = function() {
		jQuery("#articlePageInfo").html("Page "+ skimmer("article").currentPage +" of "+skimmer("article").totalPages);
	};

	this.renderPagePosition = function() {
		skimmer("article").view.updateNavigation();
		notify("page position updated", navigationOffset());
	};

	this.setLeftOffset = function(value) {
		//alert("Set left offset"+skimmer("article").currentPage);
		jQuery(".horizontal").moveNode({"marginLeft": pixels(navigationOffset())}, 1000);
	};

	this.markAsResize = function() {
		resizing = true;
	};

	this.redraw = function() {
		if (renderingColumns) return;
		jQuery(".horizontal").removeClass("animate");
		jQuery("#articlePageControls").hide();
		developerMode = "off";
		maxColumnHeight = 0;
		columnSpacing = 20;
		viewPortWidth = 0;
		columnTextWidth = 0;
		columnWidth = 0;
		columnsPerView = 4;
		columnCount = 0;
		assetColumns = 2;
		virtualPosition = 0;
		renderedPages = 0;
		skimmer("article").totalPages = 1;
		this.renderPagePosition();
		jQuery(".articleColumn").remove();
		this.applyTemplate();
	};

	this.navigationOffset = function() {
		return navigationOffset();
	};

	function navigationOffset() {
		return -(((skimmer("article").currentPage - 1) * viewPortWidth));
	}

	this.addColumns = function(index) {
		if (!index) {
			index = 0;
		}
		var columnWasAdded = false;
		var nextColumn;
		renderedPages += 1;
		for (var i = 0; i < columnsPerView; i++) {
			if (index == 0 && this.data.spanImage()) {
				i += assetColumns;
			}
			if ((i ==  columnsPerView - 1) && ( renderedPages % 2 == 0)) {
				addHalfPage();
				columnCount++;
				continue;
			}

			var columnSizeSpec = columnSizeAtIndex(index);
			nextColumn = Columns.getColumn(columnSizeSpec);

			if (nextColumn) {
				columnWasAdded = true;
				nextColumn.index = index;
				addColumn(nextColumn);
				columnCount++;
				index++;
			} else {
				if (this.data.spanImage()) {
					columnCount += assetColumns;
				}
				if (window.chrome && window.chrome.app && window.chrome.app.isInstalled) {
					if (skimmer("pay").requiresGateway(skimmer("article").url, document.referrer)) {
						jQuery(".articleColumn").first().append(skimmer("pay").gatewayMarkup());
						skimmer("pay").insertChromeBackup();
						skimmer("adManager").getGateway();
					}

				} else {
					if (skimmer('pay').showingFirstClick()) {
						var refer = document.referrer;
					} else {
						var refer = "http://www.nytimes.com/skimmer/";
					}
					skimmer("pay").insertSkimmerBackup();
					jQuery("body").append("<script src='"+Solo.config.getService("meter")+"?url="+skimmer("article").url+"&referer="+refer+"&callback=metercallback'></script>");
				}
				columnRendering = false;
				resizing = false;
				skimmer("article").forceColumns = false;
				jQuery(".horizontal").css("width", columnCount * columnWidth + (20 * columnCount));
				skimmer("article").totalPages = Math.ceil(columnCount / columnsPerView) || 1;
				skimmer("article").columnsRendered = true;
				skimmer("article").view.updateNavigation();
				skimmer("adManager").requestHalfPage(skimmer("currentSection").displayName);
				break;
			}
		}

		if (columnWasAdded && nextColumn) {
			skimmer('article').view.addColumns(index);
		} else {
			jQuery("#articlePageControls").show();
			renderingColumns = false;
			notify("article loaded");
			jQuery(".horizontal").addClass("animate");
		}
	}

	if (!(window.chrome && window.chrome.app && window.chrome.app.isInstalled)) {
		window.metercallback = function(data) {
			//console.log(JSON.stringify(data));
			if (data.hitPaywall) {
				jQuery(".articleColumn")
					.filter(function(index) {
						if (index == 0) {
							jQuery(this).find("p")
								.filter(function(i) {
									if (i == 0) {
										jQuery(this).html(skimmer("article").data.summary());
									} else {
										jQuery(this).remove();
									}
								})
								.end()
						} else {
							jQuery(this).find("p").remove();
						}
					});
				if (jQuery(".articleGateway").length < 1) {
					jQuery(".articleColumn").first()
						.append(skimmer("pay").gatewayMarkup());
					skimmer("adManager").getGateway();
				}
				jQuery("#articlePageControls").hide();
			}
		};
	}

	function addColumn (columnInfo) {
		var xOffset = columnSpacing / columnsPerView;

		if (columnInfo.index) {
			xOffset += columnWidth * columnInfo.index;
		}

		if (skimmer("article").data.spanImage()) {
			xOffset += 600;
		}

		jQuery("<div class='articleColumn' style=\"display: none\"></div>")
			.appendTo(".horizontal")
			.hide()
			.css({
				"width": pixels(columnInfo.width),
				"height": pixels(jQuery(".horizontal").height() - 30),
				"margin": pixels(10)+" "+pixels(columnSpacing / 2)
			})
			.html(columnInfo.text)
			.fadeIn("slow");
	}

	function addHalfPage (index,width) {
		var xOffset = columnSpacing / columnsPerView;

		if (index) {
			xOffset += columnWidth * index;
		}

		if (skimmer("article").data.spanImage()) {
			xOffset += 600;
		}

		jQuery("<div class='articleColumn articleAd'></div>")
			.appendTo(".horizontal")
			.hide()
			.css({
				"width": pixels(columnWidth - columnSpacing ),
				"height": pixels(jQuery(".horizontal").height() - 20),
				"margin": pixels(10)+" "+pixels(columnSpacing / 2)
			})
			.show();
	}

	function columnSizeAtIndex (columnIndex) {
		var height = maxColumnHeight;
		return [columnTextWidth, height];
	}


};

defineReceiver("ArticleController", "article");

ArticleController = function() {
	var articleUrl = "";

	this.data = null;
	this.view = null;
	this.articlesLoaded = 0;
	this.articleUrls = {};
	this.currentPage = 1;
	this.totalPages = 1;
	this.articleReceived = false;
	this.supportsTransitions = false;
	this.columnsRendered = false;
	this.forceColumns = false;

	this.init = function() {
		this.currentPage = (window.localStorage && localStorage.articlePage) ? parseInt(localStorage.articlePage, 10) : 1;
	}

	this.requiredMarkup = function() {
		return '\
		<div id="articleCloser" style="display:none"><img src="http://graphics8.nytimes.com/webapps/skimmer/2.0/images/close.png"></div>\
		<div id="columnSizer" style="visibility:hidden"></div>\
		<div id="skimmerArticleViewer" class="belowScreen">\
			<div id="articleBar">\
				<div class="logo"></div>\
				<div id="articleTitle"></div>\
				<div class="articleButtons"></div>\
			</div>\
			<div id="frameContainer" style="height: auto;">\
				<div id="articleFrame">\
					<div id="articleLayout" style="visibility:hidden"></div>\
					<div id="rawContent" style="display:none"></div>\
					<div id="columnatedContent" style="display:none"></div>\
					<div id="articleFooter">\
						<div id="articleTools">\
							<div class="item shareToolsMenu">Share</div>\
							<ul class="shareToolsContent" style="display:none">\
								<li class="email"><div class="formHolder"></div>Email</li>\
								<li class="twitter"><a>Twitter</a></li>\
								<li class="facebook"><a>Facebook</a></li>\
							</ul>\
							<div class="item saveArticle">Save</div>\
							<div class="item textResize articleButton">Text Resize</div>\
						</div>\
						<table id="articlePageControls" style="display:none">\
							<tr>\
							<td id="pageLeftButton"></td>\
							<td id="articlePageInfo"></td>\
							<td id="pageRightButton"></td>\
							</tr>\
						</table>\
					</div>\
				</div>\
			</div>\
		</div>';
	};

	this.listen = function(event, data) {
		switch(event) {
			case "escape key":
				skimmer("article").close();
				break;
			case "right arrow":
				skimmer("article").navigatePage("right");
				break;
			case "left arrow":
				skimmer("article").navigatePage("left");
				break;
			case "down arrow":
				skimmer("article").nextArticle();
				break;
			case "up arrow":
				skimmer("article").previousArticle();
				break;

			case "swipe started":
				if (!skimmer("state").query("articleSwitcherVisible")) {
					this.observeTouches = jQuery(data.target).parents("#articleFrame").length > 0;
					this.objectToMove = jQuery(".horizontal");
				}
				break;

			case "horizontal swipe":
				if (this.observeTouches && !skimmer("state").query("articleSwitcherVisible")) {
					jQuery(".horizontal").css({"WebkitTransform": "translate3D("+ pixels(data.xDiff) +", 0, 0)"});
				}
				break;

			case "render columns":
				if (this.view) {
					this.view.renderColumns();
				}
				break;

			case "resize completed":
				this.view.markAsResize();
				this.redraw();
				break;

			case "article loaded":
				if (this.currentPage > 1) {
					this.view.renderPagePosition();
				}
				skimmer("readinglist").displayArticleStatus();
				break;

			case "page position updated":
				if (this.observeTouches) {
					var finalTranslate = data / (this.currentPage - 1);
					if (this.swipeIntent == "right") {
						finalTranslate = -finalTranslate;
					}
					var horizontal = {"WebkitTransition": "-webkit-transform 0.4s linear", "WebkitTransform":"translate3D("+pixels(finalTranslate)+", 0, 0)"};
					this.objectToMove.css(horizontal);
					var self = this;
					setTimeout(function() {
						var clean = {"WebkitTransition": "margin-left 0s", "WebkitTransform":"translate3D(0, 0, 0)", "margin-left": pixels(data)};
						self.objectToMove.css(clean);
					}, 600);
				} else {
					this.view.setLeftOffset(pixels(data));
				}
				break;

			case "close switcher":
				skimmer("articleSwitcher").close();
				break;

			case "vertical swipe":
				if (skimmer("state").query("articleVisible") && !skimmer("state").query("articleSwitcherVisible")) {
					loadArticleSwitcher();
				}
				break;

			case "end left swipe":
				if (!skimmer("state").query("articleSwitcherVisible")) {
					this.swipeIntent = "left";
					skimmer("article").navigatePage("right");
					notifyLater("end swipe blockade", 500);
				}
				break;

			case "end right swipe":
				if (!skimmer("state").query("articleSwitcherVisible")) {
					this.swipeIntent = "right";
					skimmer("article").navigatePage("left");
					notifyLater("end swipe blockade", 500);
				}
				break;

			case "swap article":
				this.swap(data.url, data.title);
				break;

			case "end swipe blockade":
				skimmer("state").deactivate("performingSwipe");
				break;

			case "preferences loaded":
				var enlargedText = skimmer("settings").read("enlargeText");
				enlargedText ? jQuery("body").addClass("bigText") : jQuery("body").removeClass("bigText");
				var container = jQuery("#skimmerArticleViewer").get(0);
				if (typeof document.body.style.webkitTransition !== "undefined" || typeof document.body.style.MozTransition !== "undefined") {
					this.supportsTransitions = true;
					//console.log("transitions!");
					try {
						container.addEventListener("webkitTransitionEnd", function() {
							//notify("render columns");
						}, true);
					} catch (e) {alert("error webkit!")}
					try {
						container.addEventListener("transitionend", function() {
							//notify("render columns");
						}, true);
					} catch (e) {alert("error firefox!")}
				} else {
					//console.log("no transitions!");
				}
				break;

			case "enlarge article text":
				jQuery("body").addClass("bigText");
				skimmer("settings").set("enlargeText", 1);
				this.view.markAsResize();
				this.redraw();
				break;

			case "shrink article text":
				jQuery("body").removeClass("bigText");
				skimmer("settings").set("enlargeText", 0);
				this.view.markAsResize();
				this.redraw();
				break;
		}
	}

	this.select = function(url, title) {
		this.currentPage = 1;
		this.url = url;
		this.title = title;
		var data = skimmer("currentSection").dataByUrl(url);
		if (data.body && data.body()) {
			this.load(data);
		} else {
			this.load(url, title);
		}
	};

	this.load = function() {
		if (skimmer("state").query("articleVisible")) return;
		if (arguments.length == 1) {
			this.loadData(arguments[0]);
		} else if (arguments.length == 2) {
			this.loadUrl(arguments[0], arguments[1]);
		}
	};

	this.loadData = function(articleData) {
		this.data = articleData;
		this.title = articleData.title();
		if (articleData.rawData.slides) {
			notify("load slideshow");
			this.universalPixelTrack();
			skimmer("tracking").recordArticleView(this.url, this.title);
			return;
		}
		this.view = new ArticleView();
		this.view.applyTemplate();
		skimmer("tracking").recordArticleView(this.url, this.title);
		if (!this.articleUrls[this.url]) {
			var now = new Date().getTime();
			var diff = now - skimmer("settings").read("interstitial");
			if (this.articlesLoaded == 1 && diff > (6 *  60 * 60 * 1000)) {
				skimmer("interstitialPanel").show();
				skimmer("settings").set("interstitial", now);
			}
			this.articleUrls[this.url] = 1;
			this.articlesLoaded++;
		}
		this.universalPixelTrack();
	};

	this.universalPixelTrack = function() {
		var uptUrl = "http://up.nytimes.com/?d=0&m=3&u="+escape(this.url)+"&r="+escape("http://www.nytimes.com/skimmer/");
		jQuery("#uptrackerContainer")
			.html('<img src="'+uptUrl+'" width="1" height="1">')
			.css({height:'1px', width:'1px'});
	};

	this.loadUrl = function(url, title) {
		this.url = url;
		this.title = title;

		articleUrl = escape(url+"?pagewanted=all");

		var suppliedData = skimmer("currentSection").data.matchUrl(url);

		if (suppliedData) {
			this.load(suppliedData);
			return;
		}

		jQuery.ajax({
			method:"GET",
			url: Solo.config.getService("article")+articleUrl,
			success: function(articleHTML) {
				var parser = new ArticleScraper();
				var article = new ArticleData();

				var parsedData = parser.parse(articleHTML);
				parsedData.url = skimmer("article").url;

				article.init(parsedData);
				skimmer("article").load(article);
			},
			falure: function() {
				console.error("Failed to request article data.");
			}
		});
	};

	this.swap = function(url, title) {
		skimmer("state").deactivate("articleVisible");
		jQuery("#articlePageControls").hide();
		skimmer("pay").disableFirstClickFree();
		this.currentPage = 1;
		this.url = url;
		this.title = title;
		columnCount = 0;
		this.columnsRendered = false;
		this.totalPages = 0;
		this.select(url, title);
	};

	this.redraw = function() {
		this.columnsRendered = false;
		this.view.redraw();
	};

	this.close = function() {
		if (skimmer("state").query("articleVisible") || skimmer("state").query("slideshowVisible")) {
			if (skimmer("state").query("articleSwitcherVisible")) {
				skimmer("articleSwitcher").close();
			} else if (skimmer("state").query("slideshowVisible")) {
				skimmer("slideshow").deflate();
			} else {
				this.columnsRendered = false;
				skimmer("locationManager").clearArticle();
				this.view.deflate();
				columnCount = 0;
				this.url = "";
				skimmer("pay").disableFirstClickFree();
				skimmer("state").deactivate("articleVisible");
				jQuery("#articlePageControls").hide();
			}
		}

	};


	this.nextArticle = function() {
		if (skimmer("state").query("articleVisible") || skimmer("state").query("slideshowVisible")) {
			if (skimmer("state").query("articleSwitcherVisible")) {
				skimmer("articleSwitcher").moveDown();
			} else {
				loadArticleSwitcher();
			}
		}
	};

	this.previousArticle = function() {
		if ( skimmer("state").query("articleVisible") || skimmer("state").query("slideshowVisible")) {
			if ( skimmer("state").query("articleSwitcherVisible")) {
				skimmer("articleSwitcher").moveUp();
			} else {
				loadArticleSwitcher();
			}
		}
	};

	function loadArticleSwitcher() {
		skimmer("articleSwitcher").load(skimmer("article").url);
	}

	this.navigatePage = function(direction) {
		if (skimmer("state").query("articleVisible") && !skimmer("state").query("slideshowVisible")) {
			if (skimmer("article").view.rendering()) {
				return;
			}
			if (this.atAnEdge(direction)) {
				var dataArray = skimmer("sections").currentSourceData().dataArray;
				for (var i=0, len=dataArray.length; i<len; i++) {
					entry = dataArray[i];
					if (entry.link() == skimmer("article").url) {
						var selectedArticle = i;
						break;
					}
				}

			}
			if (direction == "right") {
				if (this.currentPage == this.totalPages) {
					var next = dataArray[selectedArticle + 1];
					if (next) {
						this.forceColumns = true;
						this.view.slideAway("left");
						notifyLater("swap article", {"url": next.link(), "title": next.title()}, 700);
						//this.swap(next.link(), next.title());
					}
				} else {
					this.currentPage += 1;
					if ("standalone" in window.navigator && window.navigator.standalone && window.localStorage) {
						localStorage.articlePage = this.currentPage;
					}
					skimmer("tracking").recordArticleView(this.url, this.title);
					this.view.renderPagePosition();
				}
			} else {
				if (this.currentPage == 1) {
					var previous = dataArray[selectedArticle - 1];
					if (previous) {
						this.forceColumns = true;
						this.view.slideAway("right");
						notifyLater("swap article", {"url": previous.link(), "title": previous.title()}, 700);
						//this.swap(previous.link(), previous.title());
					}
				} else {
					skimmer("tracking").recordArticleView(this.url, this.title);
					this.currentPage -= 1;
					if ("standalone" in window.navigator && window.navigator.standalone && window.localStorage) {
						localStorage.articlePage = this.currentPage;
					}
					this.view.renderPagePosition();
				}
			}
			if (this.currentPage % 2 == 0) {
				skimmer("adManager").drawHalfPageCreative(skimmer("currentSection").displayName);
				skimmer("adManager").recordHalfPageImpression(skimmer("currentSection").displayName);
			}

		}
	};

	this.atAnEdge = function(direction) {
		var atAnEdge = (this.currentPage == 1 && direction == "left") || (this.currentPage == this.totalPages && direction == "right");
		return atAnEdge;
	}

};

/***
 * This is some article compatibility layering.
 *
 */

function NYT_VideoPlayerStart() {}
function writeNYTFlash() {}
function pop_me_up2(url) {
	window.open(url);
}

defineReceiver("ArticleSwitcher");

ArticleSwitcher  = function() {
	var dataArray,
		selectedArticle = 0,
		slideHeight = 150,
		itemTemplate = '<div class="switcherSummaryContainer"><h1><%= item.title() %></h1>\
			<% if (item.thumbnail()) { %>\
				<img src="<%= item.thumbnail() %>" height="60" width="60">\
			<% } %>\
			<div class="byline"><%= item.byline() %></div>\
			<p class="summary"><%= item.description() %></p>\
			<div style="clear: both"></div></div>';

	this.swipingActive = false;
	this.yOffset = 0;

	this.init = function() {
		jQuery("#switcherList").css("webkitTransform", "translate3D(0,0,0)");
	};

	this.requiredMarkup = function() {
		return ' <div id="switcherShade" style="display: none;"></div>\
		<div id="articleSwitcher" style="display:none"> <ul id="switcherList"></ul> </div>\
		<div id="switcherIndicator" style="display: none;"></div>';
	};

	this.listen = function(event, data) {
		switch(event) {
			case "return key":
				skimmer("articleSwitcher").selectArticle();
				break;

			case "swipe started":
				this.swipingActive = (data.target.id == "switcherList"
						|| data.target.parents("#switcherList").length > 0);
				break;

			case "vertical swipe":
				if (this.swipingActive) {
					jQuery("#switcherList").css("webkitTransform", "translate3D(0,"+pixels(this.yOffset + data.yDiff)+",0)");
				} else {
				}
				break;

			case "touch stopped":
				if (skimmer("state").query("articleSwitcherVisible")) {
					if (this.swipingActive) {
						if (Math.abs(data.yDiff) < 10) {
							var container = jQuery(data.target).parents("#switcherList li");
							selectedArticle = container.index();
							jQuery("#switcherList li").removeClass("selected").eq(selectedArticle).addClass("selected");
							this.selectArticle();

							jQuery("#switcherList").css("webkitTransform", "translate3D(0,0,0)");
							this.yOffset = 0;
							return;
						} else {
							this.yOffset = this.yOffset + data.yDiff;
						}
					} else if (Math.abs(data.yDiff) < 10) {
						this.yOffset = 0;
						notify("close switcher");
					}
				}

				break;

		}
	};

	this.load = function() {
		dataArray = skimmer("currentSection").data.dataArray;
		populateList();
		jQuery("#switcherShade").fadeIn("slow");
		jQuery("#articleSwitcher").fadeIn("slow").addClass("active");
		moveSelector();
		skimmer("state").activate("articleSwitcherVisible");
	};

	function moveSelector() {
		jQuery("#switcherList li").removeClass("selected").eq(selectedArticle).addClass("selected");
		jQuery("#switcherList").css("marginTop", topOffset());
	}

	this.moveUp = function() {
		if (selectedArticle > 0) {
			selectedArticle -= 1;
		}
		moveSelector();
	};

	this.moveDown = function() {
		if (selectedArticle < dataArray.length) {
			selectedArticle += 1;
		}
		moveSelector();
	};

	this.selectArticle = function() {
		if (skimmer("state").query("articleSwitcherVisible")) {
			skimmer("article").forceColumns = true;
			skimmer("article").swap(dataArray[selectedArticle].link(), dataArray[selectedArticle].title());
			this.close();
			if (skimmer("state").query("slideshowVisible")) {
				skimmer("slideshow").deflate();
			}
		}
	};

	this.close = function() {
		jQuery("#switcherList").empty();
		jQuery("#switcherShade").fadeOut("slow");
		jQuery("#articleSwitcher").fadeOut("slow").removeClass("active");
		jQuery("#switcherList").css("webkitTransform", "translate3D(0,0,0)");
		skimmer("state").deactivate("articleSwitcherVisible");
	};

	function populateList() {
		for (var i=0, len=dataArray.length; i<len; i++) {
			entry = dataArray[i];
			if (entry.link() == skimmer("article").url) {
				selectedArticle = i;
			}
			try {
				var content = tmpl(itemTemplate, {"item": entry});
			} catch (e) {
				console.error(e);
			}
			jQuery("<li></li>").appendTo("#switcherList").html(content);
		}

	}

	function topOffset() {
		return - (selectedArticle * slideHeight - 120 + (selectedArticle * 21));
	}
};

defineReceiver("SwipeProxy","swipe");

function SwipeProxy() {

	this.registeredInteractions = {};
	this.availability = {};
	this.interactionState = {};

	this.init = function() {

	};

	this.listen = function(event, data) {
		switch(event) {
			case "swipe started":
				for (var name in this.registeredInteractions) {
					var interactionSet = this.registeredInteractions[name];
					if (this.active(name)) {
						this.interactionState[name] = jQuery(data.target).parents(interactionSet.maskNode).length > 0;
						if (this.interactionState[name]) {
							interactionSet.startSwipe();
							var hardOffset = numeric(interactionSet.sequenceContainer.css("marginLeft"));
							interactionSet.startingOffset = hardOffset;
							//interactionSet.sequenceContainer.css({"marginLeft":0,"WebkitTransform":"translate3D("+pixels(hardOffset)+")"});
						}
					}
				}
				break;

			case "horizontal swipe":
				for (var name in this.registeredInteractions) {
					if (this.monitoringSwipe(name)) {
						var set = this.registeredInteractions[name];
						if (set.sequenceContainer) {
							var hardOffset = set.startingOffset;
							var pauseOffset = (data.xDiff > 0) ? -20 : 20;

							set.sequenceContainer.css({"marginLeft": 0, "WebkitTransform": "translate3D("+ pixels(hardOffset + data.xDiff + pauseOffset) +", 0, 0)"});
						}
					} else {
					}
				}
				break;


			case "end left swipe":
				for (var name in this.registeredInteractions) {
					if (this.monitoringSwipe(name)) {
						var set = this.registeredInteractions[name];
						if (set.sequenceContainer) {
							var currentItemNum = set.source.currentSequenceNumber();
							if (currentItemNum !== set.sequenceLength - 1) {
								currentItemNum += 1;
							}
							var newOffset = - (currentItemNum * set.maskWidth);
							set.sequenceContainer.addClass("transition").css({"WebkitTransform": "translate3D("+ pixels(newOffset) +", 0, 0)"});
							set.sequenceContainer.get(0).addEventListener("webkitTransitionEnd", function transitionEnd(e) {
								var container = jQuery(e.target);
								container.removeClass("transition");
								container.css({"marginLeft": pixels(newOffset),"WebkitTransform": "translate3D(0, 0, 0)"});
								e.target.removeEventListener("webkitTransitionEnd", transitionEnd, false);
							},false);
							set.source.sequenceComplete(currentItemNum);
							set.currentSequenceItem = currentItemNum;
						}
					}
				}
				break;

			case "end right swipe":
				for (var name in this.registeredInteractions) {
					if (this.monitoringSwipe(name)) {
						var set = this.registeredInteractions[name];
						if (set.sequenceContainer) {
							var currentItemNum = set.source.currentSequenceNumber();
							if (currentItemNum !== 0) {
								currentItemNum -= 1;
							}
							var newOffset = - (currentItemNum * set.maskWidth);
							set.sequenceContainer.addClass("transition").css({"WebkitTransform": "translate3D("+ pixels(newOffset) +", 0, 0)"});
							set.sequenceContainer.get(0).addEventListener("webkitTransitionEnd", function transitionEnd(e) {
								var container = jQuery(e.target);
								container.removeClass("transition");
								container.css({"marginLeft": pixels(newOffset),"WebkitTransform": "translate3D(0, 0, 0)"});
								e.target.removeEventListener("webkitTransitionEnd", transitionEnd, false);
							},false);
							set.source.sequenceComplete(currentItemNum);
							set.currentSequenceItem = currentItemNum;
						}
					}
				}
				break;

			case "vertical swipe":

				break;
		}
	};

	this.monitoringSwipe = function(name) {
		return this.interactionState[name];
	};

	this.active = function(name) {
		return this.availability[name];
	};

	this.register = function(name, object) {
		this.registeredInteractions[name] = object;
	};

	this.activate = function(name) {
		this.availability[name] = true;
	};

	this.deactivate = function(name) {
		this.availability[name] = false;
	};
}


function SwipeDescription() {

	this.source = null;
	this.maskNode = null;
	this.maskHeight = 0;
	this.maskWidth = 0;
	this.sequenceContainer = null;
	this.startingOffset = 0;
	this.sequenceLength = 0;
	this.horizontalSwipeEnabled = false;
	this.verticalSwipeEnabled = false;
	this.currentSequenceItem = 0;
	this.leftCallback = function() {};
	this.rightCallback = function() {};
	this.upCallback = function() {};
	this.downCallback = function() {};
	this.navigateCallback = function() {};


	this.configure = function(configObject) {
		for(var name in configObject) {
			this[name] = configObject[name];
		}
	};

	this.startSwipe = function() {
		if (this.maskNode) {
			var node = jQuery(this.maskNode);
			this.maskHeight = node.height();
			this.maskWidth = node.width();
			this.sequenceContainer = node.find(".sequenceUnits");
			this.sequenceLength = this.sequenceContainer.children().length;
		}
	};

	this.onLeft = function(fn) {
		this.leftCallback = fn;
	};

	this.onRight = function(fn) {
		this.rightCallback = fn;
	};

	this.onUp = function(fn) {
		this.upCallback = fn;
	};

	this.onDown = function(fn) {
		this.downCallback = fn;
	};

	this.onNavigate = function(fn) {
		this.navigateCallback = fn;
	};

};

defineReceiver("LocationManager");

LocationManager = function() {
	var section,
		article;

	this.listen = function(event, data) {
		switch(event) {
			case "preferences loaded":
				parse();
				apply();
				break;

			case "current source updated":
				updateSection();
				apply();
				break;

			case "article loaded":
				updateArticle();
				apply();
				break;

			case "sources imported":
				parse();
				if (section) {
					var source = skimmer("sections").getSourceByName(section.replace(/\+/g," "));
					if (source) {
						if ("standalone" in window.navigator && window.navigator.standalone && window.localStorage) {
							skimmer("sections").setCurrentSource(localStorage.currentSection || 0);
						} else {
							skimmer("sections").setCurrentSource(source.sectionId);
						}
					} else {
						skimmer("sections").setCurrentSource(0);
					}
				} else {
					skimmer("sections").setCurrentSource(0);
				}
				break;


		}
	};

	this.loadSection = function(sectionName) {
	};

	this.loadArticle = function(articleUrl) {
	};

	this.clearArticle = function() {
		article = null;
		if ("standalone" in window.navigator && window.navigator.standalone && window.localStorage) {
			delete localStorage.currentArticle;
			delete localStorage.articlePage;
		}
		apply();
	};

	this.sectionPresent = function() {
		return section;
	};

	this.currentSection = function() {
		return section.replace("+", " ");
	}

	this.articlePresent = function() {
		return !!article;
	};

	this.currentArticle = function() {
		return "http://"+article;
	};

	function parse() {
		if ("standalone" in window.navigator && window.navigator.standalone && window.localStorage) {
			var sectionNum = localStorage.currentSection || 0;
			var source = skimmer("sections").getSource(sectionNum);
			if (source) {
				section = source.displayName.replace(/\ /g, "+").replace("/","\\");
				article = localStorage.currentArticle;
			} else {
				return;
			}
		} else if (anchor()) {
			var anchorParts = anchor().split("//");
			if (anchorParts[0].match("/a/http")) {
				article = anchor().replace("/a/http://","");
				return;
			}

			if (anchorParts && anchorParts.length > 0) {
				section = anchorParts[0].replace("/","").replace("\\","/");
				if (anchorParts[1]) {
					article = anchorParts[1];
					skimmer("pay").enableFirstClickFree();
				}
			}
		}
	}

	function updateSection() {
		section = skimmer("currentSection").displayName.replace(/\ /g, "+").replace("/","\\");
	}

	function updateArticle() {
		article = skimmer("article").url.replace("http://","");
		localStorage.currentArticle = article;
	}

	function apply() {
		var newAnchor = "#";
		if (section) {
			newAnchor += "/"+section;
		}
		if (article) {
			newAnchor += "//"+article;
		}
		location.href = baseUrl() + newAnchor;
	}

	function baseUrl() {
		var parts = location.href.split("#");
		return parts[0];
	}

	function anchor() {
		var parts = location.href.split("#");
		if (parts.length > 1) {
			return parts[1];
		}
	}
};

defineReceiver("AppCopyright");

AppCopyright = function() {
	this.requiredMarkup = function() {
		return '<div id="copyright">&copy; <span style="display:none" class="fullCopyright">Copyright 2009 The New York Times Company | <a href="http://www.nytimes.com/ref/membercenter/help/privacysummary.html">Privacy Policy</a></span></div>';
	};
};

defineReceiver("BreakingNews");

BreakingNews = function() {
	var notificationImageUrl = "http://graphics8.nytimes.com/webapps/skimmer/2.0/images/skmr_256.png";
	var shownNotifications = {};

	this.init = function() {
		this.notificationsAllowed = false;
		if (window.localStorage) {
			try {
				var storedData = JSON.parse(localStorage.shownNotifications);
				if (typeof storedData == "object") {
					shownNotifications = storedData;
				}
			} catch(e) {}
		}
		this.checkForBreakingNews();
	};

	this.listen = function(message, data) {
		switch(message) {

		}
	};

	this.alreadySeen = function(time) {
		return shownNotifications[time];
	};

	this.markSeen = function(time) {
		shownNotifications[time] = true;
		if (window.localStorage) {
			localStorage.shownNotifications = JSON.stringify(shownNotifications);
		}
	};

	this.checkForBreakingNews = function() {
		var breakingUrl = Solo.config.getService("breaking");
		jQuery.get(breakingUrl, function(data) {
			try {
				var cleaned = jQuery(data);
				if (cleaned.length > 0) {
					var time = cleaned.find(".timestamp").html();
					var text = cleaned.find("h2").text();
					var message = "BREAKING: "+time+" '"+text+"'";
					if (skimmer("breakingNews").alreadySeen(time)) {
						//console.warn('already shown '+text);
					} else if (time && text) {
						var notification = webkitNotifications.createNotification(
							notificationImageUrl,
							'BREAKING NEWS from the New York Times',
							message);
						skimmer("breakingNews").markSeen(time);
						notification.show();
					}
				}
			} catch (e) {
				//console.error("Error reading breaking news.");
				//console.error(e);
			}
		});

		setTimeout(function() {skimmer("breakingNews").checkForBreakingNews(); }, ( 30 * 1000));
	};

};

ApplicationController = function() {
	this.bg = null;

	this.init = function() {
		this.testNetwork();
		this.touchEnabled();
		this.refreshCookie();
		setInterval(function() {skimmer().testNetwork(); }, 60 * 1000);
		if (window.chrome && window.chrome.app && window.chrome.app.isInstalled) {
			var CHROME_VERSION = parseFloat(navigator.userAgent.split('Chrome')[1].split(' ')[0].substring(1));
			var MIN_CHROME_VER = 10;
			var BG_LOCATION = Solo.config.getService("background");
			var BG_WIN_NAME = 'nytBG';
			if (CHROME_VERSION >= MIN_CHROME_VER && BG_LOCATION) {
				//this.bg = window.open(BG_LOCATION, BG_WIN_NAME, "background");
			}
		}
		window.applicationCache.addEventListener('updateready', function(e) {
		  if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
			window.location.reload();
		  }
		}, false);

	};

	this.loggedIn = function() {
		return skimmer("auth").loggedIn();
	};

	this.handleAppQuery = function(request) {
		if (request == "currentSection") {
			return soloQuery("sections").getSource();
		}
		if (request == "currentSectionNumber") {
			return soloQuery("sections").currentSource();
		}
		if (request == "canAccessFullFeeds") {
			return true;
		}
		if (request == "appUrl") {
			var section = soloQuery("sections").getSource();
			var name = typeof section !== "undefined" ? section.displayName.replace(/\ /g, "+").replace("/","\\") : "";
			return "http://www.nytimes.com/skimmer/#/" + name;
		}
		if (typeof request == "undefined") {
			return this;
		}
		return null;
	};

	this.touchEnabled = function() {
		try {
			document.createEvent("TouchEvent");
			return true;
		} catch (e) {
			return false;
		}
	};

	this.refreshCookie = function() {
		jQuery.ajax({
			"method": "get",
			"url": Solo.config.getService("cookie"),
			"dataType": "json",
			"success": function(data) {},
			"error": function(xhr, textStatus, errorThrown) {
				console.error("Error requesting cookie", errorThrown);
			}
		});
	};

	this.testNetwork = function() {
		jQuery.ajax( {
			url:Solo.config.getService("image")+"http://i1.nyt.com/images/misc/nytlogo379x64.gif",
			success:function(data) {
				if (data) {
					notify("app online");
				} else {
					notify("app offline");
				}
			},
			error: function(e) {
				notify("app offline");
			}

		});
	};
}

defineReceiver("InterstitialPanel");

InterstitialPanel = function() {

	this.init = function() {

	};

	this.listen = function(event, data) {
		switch(event) {
			case "auto hide interstitial":
				this.hide()
				break;

		}
	};

	this.requiredMarkup = function() {
		return '<div class="interstitialContainer" style="display:none">\
			<div class="interstitialContent"></div>\
			<div class="button interstitialButton">Skip this Advertisement &raquo;</div>\
			</div>';
	};

	this.show = function() {
		skimmer("adManager").getInterstitial();
		notifyLater("auto hide interstitial", 15000);
	};

	this.hide = function() {
		jQuery(".interstitialContainer").fadeOut("fast");
	};

};

defineReceiver("AdManager");

AdManager = function() {

	var results = {};
	var adDrawInterval;

	this.init = function() {
		skimmer("adManager").getSponsor();
	};

	this.requiredMarkup = function() {
		return '<div id="BroadsheetSpon"> </div>\
			<div id="impressionHolder"></div>';
	};

	this.listen = function(event) {
		switch(event) {
			case "page changed":
				this.recordTileImpression(skimmer("currentSection").displayName);
				break;
		};
	};

	this.getSponsor = function() {
		var req = new AdxData();
		req.makeRequest({
			label: "spon",
			url: "nytimes.com/pages/broadsheet",
			position: "BroadsheetSpon",
			callback: sponsorCallback
		});
	};

	function sponsorCallback(label, adcreative, adimpression) {
		results[label] = {
			creative: adcreative,
			impression: adimpression
		};
		//console.warn(adcreative);
		jQuery("#BroadsheetSpon").html(adcreative);
		jQuery("#impressionHolder").html(adimpression);
	}

	this.getSectionTile = function(sectionName) {
		var req = new AdxData();
		req.makeRequest({
			label: "tile-"+adName(sectionName),
			url: "nytimes.com/pages/broadsheet/"+adName(sectionName)+".html",
			position: "BroadsheetTile",
			callback: tileCallback
		});
	};

	function adName(sectionName) {
		if (sectionName == "Sunday Magazine") {
			sectionName = "Magazine";
		}
		return sectionName.replace(/[^a-zA-Z]*/g, "").toLowerCase();
	}

	function sectionName(adName) {

	}

	function tileCallback(label, adcreative, adimpression) {
		//alert("Callback received. Looping");
		results[label] = {
			creative: adcreative,
			impression: adimpression
		};

		window.setTimeout("skimmer('adManager').drawTileCreatives('"+label+"');", 1000);
	}

	this.drawTileCreatives = function(label) {
		var page = skimmer("currentSection").layout.currentVisiblePage();
		if (page.length > 0) {
			var wrapperNode = skimmer("currentSection").layout.container;
			var adCreative = results[label].creative;
			var adSlots = wrapperNode.find(".TimesSkimmerTile").html(adCreative);
			jQuery("#impressionHolder").html(results[label].impression);
		} else {
			if (skimmer("currentSection").built && !skimmer("sections").containsGrids()) return;
			setTimeout("skimmer('adManager').drawTileCreatives('"+label+"');", 1000);
		}
	};

	this.getTileCreative = function(sectionName) {
		return results["tile-"+adName(sectionName)].creative;
	};

	this.recordTileImpression = function(sectionName) {
		//alert("Impression recorded for:"+sectionName);
		var adInfo = results["tile-"+adName(sectionName)];
		if (adInfo) {
			jQuery("#impressionHolder").html(adInfo.impression);
		} else {
			setTimeout('skimmer("adManager").recordTileImpression("'+sectionName+'");', 500);
		}
	};

	this.getInterstitial = function() {
		return;
		var req = new AdxData();
		req.makeRequest({
			label: "interstitial",
			url: "nytimes.com/pages/broadsheet/interstitial.html",
			position: "Broadsheet_Interstitial",
			callback: interstitialCallback
		});
	};

	function interstitialCallback(label, adcreative, adimpression) {
		results[label] = {
			creative: adcreative,
			impression: adimpression
		};
		jQuery(".interstitialContainer").show();
		var iframe = document.createElement("iframe");
		iframe.height = "480";
		iframe.width = "640";
		iframe.frameBorder = "0";
		iframe.scrolling = "no";
		jQuery(".interstitialContent").append(iframe);
		ifr = (iframe.contentWindow) ? iframe.contentWindow : (iframe.contentDocument.document) ? iframe.contentDocument.document : iframe.contentDocument;
		ifr.document.open();
		ifr.document.write(adcreative);
		ifr.document.close();
		jQuery("#impressionHolder").html(adimpression);
	};

	this.requestHalfPage = function(sectionName) {
		var req = new AdxData();
		req.makeRequest({
			label: "halfpage-"+adName(sectionName),
			url: "nytimes.com/pages/broadsheet/"+adName(sectionName)+".html",
			position: "BroadsheetHalfpage",
			callback: halfPageCallback
		});
	};

	function halfPageCallback(label, adcreative, adimpression) {
		results[label] = {
			creative: adcreative,
			impression: adimpression
		};

	};

	function getHalfPage(sectionName) {
		return results["halfpage-"+adName(sectionName)];
	}

	this.drawHalfPageCreative = function(sectionName) {
		var adCreative = getHalfPage(sectionName).creative;
		jQuery(".articleAd").each(function() {
			jQuery(this).html("");
			var iframe = document.createElement("iframe");
			iframe.height = "600";
			iframe.width = "315";
			iframe.frameBorder = "0";
			iframe.scrolling = "no";
			this.appendChild(iframe);
			ifr = (iframe.contentWindow) ? iframe.contentWindow : (iframe.contentDocument.document) ? iframe.contentDocument.document : iframe.contentDocument;
			ifr.document.open();
			ifr.document.write(adCreative);
			ifr.document.close();
		});
	};

	this.recordHalfPageImpression = function(sectionName) {
		jQuery("#impressionHolder").html(results["halfpage-"+adName(sectionName)]["impression"]);
	};

	this.getGateway = function() {
		var product = "skimmer";
		if(window.chrome && window.chrome.app && window.chrome.app.isInstalled) {
			product = "chrome";
		}

		var adxPage = (product == "skimmer")
			? "www.nytimes.com/skimmer/gateway.html"
			: "www.nytimes.com/chrome/gateway.html";

		var req = new AdxData();
		req.makeRequest({
			label: "gateway",
			url: adxPage,
			position: "Gateway",
			callback: gatewayCallback
		})
	};

	function gatewayCallback(label, adcreative, adimpression) {
		results[label] = {
			creative: adcreative,
			impression: adimpression
		}
		skimmer("tracking").recordGatewayView();
		skimmer("pay").insertPitch(adcreative);
	}

};

AdTile = function() {
	var adNode = document.createElement("LI");
	adNode.className = "ad story";
	adNode.innerHTML = "<div class='container fill'><div class='content'><div class='TimesSkimmerTile'></div></div></div>";
	return adNode;
};

TwitterPost = function(options){
	iframeRequest("/svc/timespeople/toolbar/1.0/activity/post", options);

	function iframeRequest(url, options) {
	 var iframe = document.createElement("iframe");
      jQuery(iframe).css({"position":"absolute", "top": "-1000px"}).appendTo("body");
      iframe.onload = processResponse;
	  options.onComplete = processOverallResponse;

      var onComplete = processOverallResponse;

      iframe.src = "/packages/html/timespeople/xmlhttprequest.html" +
        '?url=' + encodeURIComponent(url) +
        '&method=' + options.method +
        '&params=' + options.params+
        '&bell=' +  window.location.protocol + '//' + window.location.host + "/svc/timespeople/bell.html";
      function processResponse(){
        // app.console.log('iframe loaded...', iframe.contentWindow.name)
        try {
          if (iframe.contentWindow.location && iframe.contentWindow.location.pathname == "/svc/timespeople/bell.html"){
            //console.log('gained access to iframe: ' + iframe.contentWindow.location.pathname);
            // app.console.log(iframe.contentWindow.name)
            var responseText = iframe.contentWindow.name;
            if (responseText) {
              var response = JSON.parse(responseText);
              if (response.status && response.status == 200 && typeof options.onSuccess === 'function') {
                options.onSuccess(response);
              }
              if (typeof options.onComplete === 'function') {
                options.onComplete(response);
              }
              window.setTimeout(function(){ jQuery(iframe).remove(); }, 500);
              notify('http request completed');
            }

          }

        } catch(e) {
          console.log(e);
        }
      }

    }


    function processOverallResponse(tx, status) {
      switch(tx.status) {
        case 200:
          notify('tweet posted');
          break;
        case 401:
        case 403:
		case 404:
        case 500:
          notify('error posting tweet');
          break;
      }
    }
};



Summary = function() {

	this.kicker =  function() {
		var parts = this.rawData.title.split(": ");
		return parts.length > 1
			? parts[0]
			: "";
	},

	this.title = function() {
		var parts = this.rawData.title.split(": ");
		var titleParts = parts.length > 1
			? parts.slice(1)
			: parts;
		return titleParts.join(": ");
	},

	this.byline = function() {
		return this.rawData.byline;
	},

	this.description = function() {
		return this.rawData.description;
	},

	this.thumbnail = function() {
		if (this.rawData.thumbnailUrl) {
			return this.rawData.thumbnailUrl;
		} else if (this.rawData.media) {
			return this.rawData.media[0]['media-metadata'][0].url;
		} else {
			return null;
		}
	}
};

Summary.prototype = clone(Solo.BasicModel.prototype);

function LocalFile(url, type) {
	var fileName;
	var onFileSystem = false;
	var inDatabase = false;
	var dbEntry = null;
	var fileEntry = null;

	function fileName() {
		return url.replace(/\W+/g, "-");
	}

	this.fileName = function() {
		return fileName || fileName();
	};

	this.url = function() {
		return url;
	};

	this.setFileEntry = function(entry) {
		fileEntry = entry;
	};

	this.setDBEntry = function(entry) {
		dbEntry = entry;
	};

	this.storedLocally = function() {
		return onFileSystem;
	};

	this.inDatabase = function() {
		return inDatabase;
	};

	this.fsPath = function() {

	};
}

FullFeedList = function() {

	this.afterFetch = function(data) {
		var data = data.assets;
		var collection = [];
		for(var i=0, len=data.length; i<len; i++) {
			if (data[i].glass_status && data[i].glass_status == "not found") continue;
			var article = new ArticleData();
			article.init(data[i]);
			if (window.chrome && window.chrome.app && window.chrome.app.isInstalled) {
				var articleUrl = article.url();
				var thumb = article.thumbnailUrl();
				var span = article.spanUrl();
				if (thumb) {
					notify("encountered thumb", thumb);
					skimmer("imageManager").store(thumb, articleUrl, "thumb");
				}
				if (span) {
					notify("encountered span", span)
					skimmer("imageManager").store(span, articleUrl, "span");
				}
			}
			collection.push(article);
		}
		return collection;
	};

	this.matchUrl = function(articleUrl) {
		for(var i=0, len=this.dataArray.length; i<len; i++) {
			var article = this.dataArray[i];
			if (article.url() == articleUrl) {
				return article;
			}
		}
		return false;

	};

	this.deleteItem = function(articleUrl) {
		var newArray = [];

		for(var i=0, len=this.dataArray.length; i<len; i++) {
			var article = this.dataArray[i];
			if (article.url() !== articleUrl) {
				newArray.push(article);
			} else {
				console.log("removed an item from the article.", article.url());
			}
		}

		this.dataArray = newArray;
	}
};


FullFeedList.prototype = clone(Solo.JSONData.prototype);

FeedList = function() {


	this.afterFetch = function(data) {
		var data = data.items;
		var collection = [];
		for(var i=0, len=data.length; i<len; i++) {
			var summary = new Summary();
			summary.init(data[i]);
			collection.push(summary);
		}
		return collection;
	};
};


FeedList.prototype = clone(Solo.JSONData.prototype);

ContentIndex = function() {
	var index =  new Able.JSONData();

	index.afterFetch = function(data) {

	};

	return index;
};


ArticleScraper = function() {
	this.articleHTML = null;
	this.parseTarget = null;
	this.model = null;
}

ArticleScraper.prototype = {
	parse: function(articleString) {
		this.articleHTML = articleString;
		this.model = {};
		this.insertParseTarget();
		this.parseTarget.html(this.articleHTML);
		this.extractKicker();
		this.extractHeadline();
		this.extractBody();
		this.extractByline();
		this.extractDateline();
		this.extractImages();
		this.cleanup();
		return this.model;
	},

	removeCruft: function() {
		this.parseTarget
			.find("#header_search, .relatedSearchesModule, .articleTools, #articleInline, .articleInline, h1, h2.entry-title")
			.remove();
	},

	insertParseTarget: function() {
		this.parseTarget = jQuery("<div></div>").appendTo("body");
	},

	extractBody: function() {
		var bodyText = "";
		this.parseTarget.find(".articleBody").each(function() {
			bodyText += jQuery(this).html();
		});
		this.model.summary = jQuery(bodyText).find(".articleBody p").first().text();
		this.model.body = bodyText;
	},

	extractKicker: function() {
		this.model.kicker = this.parseTarget.find(".kicker").html();
	},

	extractImages: function() {
		var images = [];
		var candidates = [];

		candidates.push(this.parseTarget.find(".articleSpanImage"));
		candidates.push(this.parseTarget.find(".image, .w480").eq(0).filter(".w480 img").attr("width", "480").end());
		candidates.push(this.parseTarget.find(".inlineImage"));

		for (var i=0, len=candidates.length; i<len; i++) {
			if (candidates[i].length > 0) {
				images.push(this.extractImageData(candidates[i]));
			}
		}

		if (images.length > 0) {
			this.model.relatedAssets = [];
			this.model.relatedAssets = images;
		}
	},

	extractImageData: function(imageNode) {
		var imageData = {};
		var crop = {};
		imageData.caption = imageNode.find(".caption").html() || "";
		imageData.credit = imageNode.find(".credit").html() || "";
		imageData.crops = {};
		crop.url = imageNode.find("img").attr("src");
		crop.height = imageNode.find("img").attr("height") || imageNode.find("img").get(0).offsetHeight;
		crop.width = imageNode.find("img").attr("width") || imageNode.find("img").get(0).offsetWidth;
		imageData.crops.articleLarge = crop;
		return imageData;
	},

	extractHeadline: function() {
		this.model.title = this.parseTarget.find("h1.articleHeadline nyt_headline").html();
	},

	extractByline: function() {
		this.model.byline = this.parseTarget.find(".byline").html()
	},

	extractDateline: function() {
		this.model.pubDate = this.parseTarget.find(".dateline, .timestamp").html();
	},

	cleanup: function() {
		this.parseTarget.remove();
	}
};

ArticleData = function() {

	this.body = function() {
		if (fullAccess()) {
			var body = this.rawData.body || this.rawData.summary;
			if (this.rawData.tagline) {
				body += "<p class='tagline'>" + this.rawData.tagline + "</p>";
			}
			return body;
		} else {
			return "<p>" + this.rawData.summary + "</p>";
		}
	};

	this.shortBody = function() {
		var paragraphs = jQuery(this.rawData.body).find("p").slice(0,8).each(function() {
			var markup = jQuery(this).html();
			markup = markup.replace(/<\/?a[^>]+>/g,"");
			jQuery(this).html(markup);
		});
		if (fullAccess()) {
			if (paragraphs.length > 0) {
				return jQuery("<div></div>").append(paragraphs).html();
			} else {
				return jQuery("<div></div>").append(this.rawData.summary).html();
			}
		} else {
			return "<p>" + this.rawData.summary + "</p>";
		}
	};

	this.byline = function() {
		return ( this.rawData.byline && this.rawData.byline.replace(/\<[^\>]+\>/g, "")) || "";
	};

	this.kicker = function() {
		return this.rawData.kicker || "";
	};

	this.link = function() {
		return this.rawData.url;
	};

	this.description = function() {
		return this.rawData.summary;
	};

	this.dateline = function() {
		var stamp = this.rawData.dateline || this.rawData.pubDate || null;
		if (stamp) {
			var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
			var d = new Date();
			d.setTime(stamp * 1000);
			return monthNames[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear();
		}
		return null;
	};

	this.expirationDate = function() {
		return this.rawData.expirationDate;
	};

	this.getAllImages = function() {
		var images = [];
		var assets = this.rawData.relatedAssets || this.rawData.slides;
		if (this.rawData.slides) {
			for (var i=0, len=assets.length; i<len; i++) {
				var asset = assets[i];
				if (asset.type == "image") {
					images.push(asset);
				}
			}
		} else {
			for (var i=0, len=assets.length; i<len; i++) {
				var asset = assets[i];
				if (asset.type == "image") {
					images.push(asset);
				}
			}
		}
		return images;
	};

	this.getRelatedAssets = function() {
		return this.rawData.relatedAssets || this.rawData.slides;
	};

	this.getImageAsset = function(shortcutLabel, preferenceOrder) {
		if (this.rawData.relatedAssets && this.rawData.relatedAssets.length > 0) {
			if (this.rawData[shortcutLabel]) {
				return this.rawData[shortcutLabel];
			}
			for (var i= 0, len=this.rawData.relatedAssets.length; i<len; i++) {
				var asset = this.rawData.relatedAssets[i];
				for (var j=0, len2=preferenceOrder.length; j<len2; j++) {
					var preferredSize = preferenceOrder[j];
					if (asset.type == "image" && asset.crops && asset.crops[preferredSize]) {
						this.rawData[shortcutLabel] = asset;
						asset.preferredCrop = asset.crops[preferredSize];
						return asset;
					}
				}
			}
		} else if (this.rawData.slides && this.rawData.slides.length > 0) {
			if (this.rawData[shortcutLabel]) {
				return this.rawData[shortcutLabel];
			}
			for (var i= 0, len=this.rawData.slides.length; i<len; i++) {
				var asset = this.rawData.slides[i];
				for (var j=0, len2=preferenceOrder.length; j<len2; j++) {
					var preferredSize = preferenceOrder[j];
					if (asset.crops && asset.crops[preferredSize]) {
						this.rawData[shortcutLabel] = asset;
						asset.preferredCrop = asset.crops[preferredSize];
						return asset;
					}
				}
			}
		}
		return {};
	};

	this.getVideoAsset = function() {
		if (this.rawData.relatedAssets && this.rawData.relatedAssets.length > 0) {
			for (var i=0, len=this.rawData.relatedAssets.length; i<len; i++) {
				var asset = this.rawData.relatedAssets[i];
				if (asset.type == "video") {
					this.rawData.videoAsset = asset;
					return asset;
				}
			}
		}
		return {};
	};

	this.getJumboAsset = function() {
		return this.getImageAsset("jumboAsset", ["jumbo", "articleLarge", "slide", "popup"]);
	};

	this.getBestAsset = function() {
		return this.getImageAsset("bigImage", ["articleLarge", "slide", "jumbo", "popup", "sfSpan", "hpMedium"]);
	};

	this.getSmallCrop = function() {
		return this.getImageAsset("previewImage", ["sfSpan", "hpMedium", "popup", "slide", "articleLarge", "jumbo"]);
	};


	this.getThumbAsset = function() {
		if (this.rawData.relatedAssets && this.rawData.relatedAssets.length > 0) {
			for (var i= 0, len=this.rawData.relatedAssets.length; i<len; i++) {
				var asset = this.rawData.relatedAssets[i];
				if (asset.crops && asset.crops.thumbStandard) {
					return asset.crops.thumbStandard;
				}
			}
		} else if (this.rawData.thumbnail) {
			return this.rawData.thumbnail;
		}
		return {};
	};

	this.spanUrl = function() {
		var asset = this.getBestAsset();
		if (asset.preferredCrop) {
			return asset.preferredCrop.url;
		}
	};

	this.spanImage = function() {
		var asset = this.getBestAsset();
		if (asset.preferredCrop && asset.preferredCrop.url) {
			var cached = skimmer("imageManager").getObject(asset.preferredCrop.url);
			return cached || asset.preferredCrop.url;
		}
	};

	this.previewImage = function() {
		var asset = this.getSmallCrop();
		if (asset.preferredCrop) {
			return asset.preferredCrop.url;
		}
	};

	this.jumboImage = function() {
		var asset = this.getJumboAsset();
		if (asset.preferredCrop) {
			return asset.preferredCrop.url;
		}
	};

	this.videoStill = function() {
		var asset = this.getVideoAsset();
		if (asset.stills && asset.stills.stillLarge) {
			return asset.stills.stillLarge.url;
		}
	};

	this.spanIsTall = function() {
		var asset = this.getBestAsset();
		if (asset.height) {
			return asset.height > asset.width;
		}
		return false;
	};

	this.imageHeight = function() {
		var asset = this.getBestAsset();
		if (asset.preferredCrop) {
			return asset.preferredCrop.height;
		}
	};

	this.imageWidth = function() {
		var asset = this.getBestAsset();
		if (asset.preferredCrop) {
			return asset.preferredCrop.width;
		}
	};

	this.jumboHeight = function() {
		var asset = this.getJumboAsset();
		if (asset.preferredCrop) {
			return asset.preferredCrop.height;
		}
	};

	this.jumboWidth = function() {
		var asset = this.getJumboAsset();
		if (asset.preferredCrop) {
			return asset.preferredCrop.width;
		}
	}

	this.caption = function() {
		var asset = this.getBestAsset();
		return asset.caption;
	};

	this.credit = function() {
		var asset = this.getBestAsset();
		return asset.credit;
	};

	this.thumbnailUrl = function() {
		var thumb = this.getThumbAsset();
		if (thumb.url) {
			return thumb.url;
		}
	}

	this.thumbnail = function() {
		var thumb = this.getThumbAsset();
		if (thumb.url) {
			var cached = skimmer("imageManager").getObject(thumb.url);
			return cached || thumb.url;
		}
	};

	function fullAccess() {
		var showFull = true;
		showFull = skimmer("pay").showingFirstClick() || skimmer("pay").payStatus || jQuery.inArray(skimmer("currentSection").displayName, Solo.config.get("freeSections")) !== -1;
		return showFull;
	}
}

ArticleData.prototype = clone(Solo.BasicModel.prototype);

AdxData = function() {
	var json, options;

	function dataCallback(result) {
		if (result.response && result.response[options.label]) {
			var creative = result.response[options.label].ads[options.position];
			var impression = result.response[options.label].ads["ADX_CLIENTSIDE"];
			options.callback(options.label, creative, impression);
		}
	}

	this.makeRequest = function(opts) {
		options = opts;
		if (Solo.config.getService("adx")) {
			var adurl = Solo.config.getService("adx")+"?label="+options.label+"&url="+options.url+"&positions="+options.position;
			jQuery.getJSON(adurl, dataCallback);

		}
	};
};

defineReceiver("SkimmerWebTrendsTracking", "tracking");

SkimmerWebTrendsTracking = function() {
	function trackingActive() {
		return Solo.config.get("trackingActive");
	}

	function recordEvent(options) {
		var domain = options.domain || 'www.nytimes.com';
		var page = options.page;
		var title = options.title || 'The New York Times for Chrome';
		var category = options.category || 'Skimmer';
		var dcsm = options.dcsm || '0';
		var a_nm = options.a_nm || 'NYT for Chrome';
		if (trackingActive() && window.dcsMultiTrack) {
			dcsMultiTrack(
				'DCS.dcssip', domain,
				'DCS.dcsuri', page,
				'WT.ti', title,
				'WT.cg_s', category,
				'WT.z_dcsm', dcsm,
				'WT.a_nm', a_nm
			);
		}
	}


	this.recordPageview = function() {
		recordEvent({
			"page": "/chrome/change-section.html",
			"title": "The New York Times for Chrome - Change Section"
		});
	};

	this.recordInnerPageview = function() {
		recordEvent({
			"page": "/chrome/more-in-section.html",
			"title": "The New York Times for Chrome - More In Section"
		})
	};

	this.recordArticleView = function(articleUrl, articleTitle) {
		var parts = articleUrl.split("/");
		var domain = parts[2];
		var path = "/" + parts.slice(3).join("/");
		recordEvent({
			"domain": domain,
			"page": path,
			"title":articleTitle
		})
	};

	this.recordGatewayView = function() {
		if (trackingActive() && window.dcsMultiTrack) {
			var oldId = NYTD.Analytics.WebTrends.dcsid;
			NYTD.Analytics.WebTrends.dcsid = NYTD.Analytics.Mappings.dcsidMap["Digital Subscription"];
			dcsMultiTrack(
				'WT.si_n', 'Digital Subscription',
				'WT.si_x', '1',
				'WT.cg_n','Digital Subscription',
				'WT.z_gpt','E-Commerce',
				'WT.z_gpst','Purchase',
				'WT.a_nm',(window.chrome && window.chrome.app && window.chrome.app.isInstalled) ? 'NYT for Chrome':'Times Skimmer'
				/*
				'DCS.dcssip', domain,
				'DCS.dcsuri', page,
				'WT.ti', title,
				'WT.cg_s', category,
				'WT.z_dcsm', dcsm,
				'WT.a_nm', a_nm
				*/
			);
			NYTD.Analytics.WebTrends.dcsid = oldId;
		}
	}
};

SkimmerUrl = function(shortUrl) {
	var parts = shortUrl.split("://");
	var protocol = parts[0];
	var location = parts[1];
	switch (protocol) {
		case "nyt":
			if (skimmer("canAccessFullFeeds")) {
				switch (location) {
					case "national":
						location = "us";
						break;
					case "politics":
						location = "us.politics";
						break;
					case "sundayreview":
						location = "feeds.sunday-review";
						break;
					case "style":
						location = "fashion";
						break;
				}
				return "http://platforms.nytimes.com/mobile/v1/json/skimmer/"+location+".json";
			} else {
				if (location == 'homepage') {
					return "http://json8.nytimes.com/pages/index.json";
				} else {
					return "http://json8.nytimes.com/pages/"+location+"/index.json";
				}
			}
			break;
		case "user":
			return Solo.config.getService("readinglist")+"?TASK=LIST";
			break;

		default:
			return shortUrl;
	}
};


DisplayedImage = function() {
	var imageSize, constraint,
		currentWidth, currentHeight,
		widthConstraint, heightConstraint,
		workingHeight, workingWidth;

	var adjustedSize = false;

	function tooWide() {
		return workingWidth > widthConstraint;
	}

	function tooTall() {
		return workingHeight > heightConstraint;
	}

	function shrinkWidth() {
		if (adjustedSize) {
			var percentChange = widthConstraint / workingWidth;
			workingWidth = widthConstraint;
			workingHeight = parseInt(workingHeight * percentChange, 10);
		} else {
			var percentChange = widthConstraint / currentWidth;
			workingWidth = widthConstraint;
			workingHeight = parseInt(currentHeight * percentChange, 10);
			adjustedSize = true;
		}
	}

	function shrinkHeight() {
		if (adjustedSize) {
			var percentChange = heightConstraint / workingHeight;
			workingHeight = heightConstraint;
			workingWidth = parseInt(workingWidth * percentChange, 10);
		} else {
			var percentChange = heightConstraint / currentHeight;
			workingHeight = heightConstraint;
			workingWidth = parseInt(currentWidth * percentChange, 10);
			adjustedSize = true;
		}
	}

	this.shrinkToFit = function(conf) {
		imageSize = conf.from;
		constraint = conf.toWithin;

		currentWidth = imageSize.x;
		currentHeight = imageSize.y;

		widthConstraint = constraint.x;
		heightConstraint = constraint.y;

		workingHeight = currentHeight;
		workingWidth = currentWidth;

		while (tooWide() || tooTall()) {
			if (tooWide()) {
				shrinkWidth();
				continue;
			}

			if (tooTall()) {
				shrinkHeight();
				continue;
			}
		}

		return {"x": workingWidth, "y": workingHeight};
	}
};

//=======================================================\\

//                    13thparallel.org                   \\

//                   Copyright (c) 2002                  \\

//   see (13thparallel.org/?title=about) for more info   \\

//=======================================================\\



// Columns object to split a load of innerHTML into columns.

// 08/04/02



var Columns = {

	singleTags : ["br", "img", "hr", "input", "!--"],

    sizerDiv : null,

    text : "",

	devmode : "off",		// "on" or "off", if set to "on" some info will be displayed in the statusbar.

    diagnostics : "",

	cols : new Array(),		// Stores the columns during calculations.

	onSplitStart : new Function(),

	onSplitEnd : new Function(),

	onSplit : new Function()

}





// The chop array holds strings that should be removed from the start of every column.

// Don't remove only one part of a tag pair, like </p>, always remove whole pairs, like <p></p>.



Columns.chop = [

                '<SPAN class=colbreak></SPAN>',

                '<span class="colbreak"></span>',

                '<BR>',

                '<br>',

                '<br/>',

                '<br />',

                '<p></p>',

                '<P></P>'

                ]



// Object constructor for an object to represent a column in the return value

function ColumnInfo () {

	this.text = "";

	this.width = 0;

	this.height = 0;

    this.index = 0;

	return this;

}



// Splits a load of text into fragments that will fit in the

// specified width and height and returns them in an array.

// It automatically closes unclosed tags and creates opening tags for the following columns.

Columns.splitText = function(text, columnSizeCallback) {

	if (!this.sizerDiv) return;



	this.onSplitStart(text, width, height);



	this.cols = new Array();

	this.innerHTMLHits = 0;

    this.timeInInnerHTMLLoop = 0;

	var startDate = new Date();

	var x = "";



	for (var i = 0; text != ""; i++) {



        var columnSize = columnSizeCallback(i);

        var width = columnSize[0], height = columnSize[1];



		// put a fitting fragment in cols array and slice it from the text

		var colinfo = new ColumnInfo();

		colinfo.text = this.getFragment(text, width, height);

		colinfo.height = height;

		colinfo.width = width;

        colinfo.index = i;

		this.cols[i] = colinfo;



		text = text.slice(colinfo.text.length);



		// remove chop strings from the start of the text

		for (var j = 0; j < this.chop.length; j++) {

			if (text.charAt(0) == "\n") text = text.slice(1);

			x = this.chop[j];

			while (text.indexOf(x) == 0) text = text.slice(x.length);

		}



		// add tags from opentags array

		for (var k = this.openTags.length - 1; k >= 0; k--) {

			colinfo.text += "</" + this.openTags[k].split(" ")[0] + ">";

			if (text != "") text = "<" + this.openTags[k] + ">" + text;

		}



		// remove chop strings from the start of the text again

		for (var m = 0; m < this.chop.length; m++) {

			if (text.charAt(0) == "\n") text = text.slice(1);

			x = this.chop[m];

			while (text.indexOf(x) == 0) text = text.slice(x.length);

		}



		// fire onSplit event

		this.onSplit(colinfo);

	}



	if (this.devmode == "on") {

		var endDate = new Date();

        var sizer_percentage = ((this.timeInInnerHTMLLoop / (endDate-startDate)) * 100).toFixed(2);

		var message = "Time taken for splitting text = " + (endDate-startDate)/1000 + " seconds";

        message += " Time spent in sizer loop = " + this.timeInInnerHTMLLoop/1000 + " seconds";

        message += " (percent time in sizer loop = " + sizer_percentage + "%";

		message += " Number of unclosed tags found = " + this.openTags.length;

		message += " innerHTMLHits = " + this.innerHTMLHits;

		this.diagnostics = message;

	}



	this.onSplitEnd(this.cols);

	return this.cols;

}





// This function constructs and returns a columnInfo object representing the next column

// or false if there are no more columns to make.

Columns.getColumn = function (size) {

	if (!this.sizerDiv || this.text == "") return;



	this.innerHTMLHits = 0;

    this.timeInInnerHTMLLoop = 0;

	var startDate = new Date();

    var width = size[0], height = size[1];

    var x = "";  // temporary loop variable



    // put a fitting fragment in cols array and slice it from the text

    var column = new ColumnInfo();

    column.text = this.getFragment(this.text, width, height);

    column.height = height;

    column.width = width;



    // slice off the newly created column from the remaining source string

    this.text = this.text.slice(column.text.length);



    // remove chop strings from the start of the text

    for (var j = 0; j < this.chop.length; j++) {

        if (this.text.charAt(0) == "\n") this.text = this.text.slice(1);

        x = this.chop[j];

        while (this.text.indexOf(x) == 0) this.text = this.text.slice(x.length);

    }



    // add tags from opentags array

    for (var k = this.openTags.length - 1; k >= 0; k--) {

        column.text += "</" + this.openTags[k].split(" ")[0] + ">";

        if (this.text != "") this.text = "<" + this.openTags[k] + ">" + this.text;

    }



    // remove chop strings from the start of the text again

    for (var m = 0; m < this.chop.length; m++) {

        if (this.text.charAt(0) == "\n") this.text = this.text.slice(1);

        x = this.chop[m];

        while (this.text.indexOf(x) == 0) this.text = this.text.slice(x.length);

    }



	if (this.devmode == "on") {

		var endDate = new Date();

        var sizer_percentage = ((this.timeInInnerHTMLLoop / (endDate-startDate)) * 100).toFixed(2);

		var message = "Time taken for splitting text = " + (endDate-startDate)/1000 + " seconds";

        message += " Time spent in sizer loop = " + this.timeInInnerHTMLLoop/1000 + " seconds";

        message += " (percent time in sizer loop = " + sizer_percentage + "%";

		message += " Number of unclosed tags found = " + this.openTags.length;

		message += " innerHTMLHits = " + this.innerHTMLHits;

		this.diagnostics = message;

	}

	return column;

}





Columns.getFragment = function(text, width, height) {

	var objSizer = this.sizerDiv;

    if (!objSizer) return "";

	objSizer.style.width = width + "px";



	var i = 0;

	var limit = 0;

	var add = 0;

	var doloop = false;

	this.openTags = new Array();



    // Skip the sizing loop if the provided text already fits

	objSizer.innerHTML = text;

	if (objSizer.offsetHeight <= height) i = text.length;

	else {

		doloop = true;

		limit = text.length;

	}





	// This loop determines the raw piece of text that fits in the specified width and height.

	// It is the most powerhungry part of the script because of the repeated innerHTML manipulation.

	// It uses a binary search between 0 and text.length.

    var loop_start_time = new Date();

	while (doloop) {

		add = Math.round((limit - i) / 2);

        i += add;



        if (add <= 1) doloop = false;



        // Try the lower half of string

		objSizer.innerHTML = text.substr(0, i);



        // If first half does not fit, forget about the upper half!

		if (objSizer.offsetHeight > height){

			limit = i;

			i -= add;

		}



		this.innerHTMLHits++; // stats tracking

	}

    var loop_end_time = new Date();

    this.timeInInnerHTMLLoop += loop_end_time - loop_start_time;





	// Making sure there are no broken words or tags like "<img" at the end of this fragment.

	// This also ensures there will be no broken words or tags at the start of the next fragment.

	if (text.substr(0, i) != text) {

		var lastSpace = text.substr(0, i).lastIndexOf(" ");

		var lastNewline = text.substr(0, i).lastIndexOf("\n")

		var lastGreater = text.substr(0, i).lastIndexOf(">");

		var lastLess = text.substr(0, i).lastIndexOf("<");

		if (lastLess <= lastGreater && lastNewline == i - 1) i = i;

		else if (lastSpace != -1 && lastSpace > lastGreater && (lastLess == -1 || (lastGreater > lastLess))) i = lastSpace + 1;

		else if (lastLess > lastGreater) i = lastLess;

		else if (lastGreater != -1)  i = lastGreater + 1;

	}





	// Doing the column breaks.

	text = text.substr(0, i).split('<SPAN class=colbreak></SPAN>')[0];

	text = text.substr(0, i).split('<span class="colbreak"></span>')[0];





	// Seeking unclosed tag pairs in this fragment and storing them in the openTags array.

	var doPush = true;

	var tags = text.split("<");

	tags.shift();



	for (var j=0; j<tags.length; j++) {

	 	// Splitting at ">" and taking the first item.

		// Now we have the whole tag with its attributes and without "<" and ">".

		tags[j] = tags[j].split(">")[0];



		// If it's a selfclosing xhtml or xml tag there's no need to do anything with it.

		if (tags[j].charAt(tags[j].length-1) == "/") continue;



		if (tags[j].charAt(0) != "/") {

			for (var k=0; k<this.singleTags.length; k++) {

				if (tags[j].split(" ")[0].toLowerCase() == this.singleTags[k]) doPush = false;

			}

			if (doPush) this.openTags.push(tags[j]);

			doPush = true;

		}

		else this.openTags.pop();

	}



	return text;

}




Solo.config.importGeneral({
	"sources": {
		"1":  {"name": "Top News",			"url": "nyt://homepage"},
		"3":  {"name": "World",				"url": "nyt://world"},
		"4":  {"name": "U.S.",				"url": "nyt://us"},
		"5":  {"name": "Politics",			"url": "nyt://us.politics"},
		"6":  {"name": "N.Y. / Region",		"url": "nyt://nyregion"},
		"7":  {"name": "Business",			"url": "nyt://business"},
		"8":  {"name": "Technology",		"url": "nyt://technology"},
		"9":  {"name": "Sports",			"url": "nyt://sports"},
		"10": {"name": "Science",			"url": "nyt://science"},
		"11": {"name": "Health",			"url": "nyt://health"},
		"12": {"name": "Opinion",			"url": "nyt://opinion"},
		"13": {"name": "Arts",				"url": "nyt://arts"},
		"14": {"name": "Fashion & Style",	"url": "nyt://fashion"},
		"15": {"name": "Dining & Wine",		"url": "nyt://dining"},
		"16": {"name": "Travel",			"url": "nyt://travel"},
		"17": {"name": "Sunday Magazine",	"url": "nyt://magazine"},
		"18": {"name": "Sunday Review",		"url": "nyt://sundayreview"},
		"19": {"name": "Most Emailed",		"url": "nyt://mostemailed"},
		"20": {"name": "Real Estate",		"url": "nyt://realestate"},
		"21": {"name": "Book Review",		"url": "nyt://books"},
		"22": {"name": "Weddings",			"url": "nyt://fashion.weddings"},
		"23": {"name": "Obituaries",		"url": "nyt://obituaries"},
		"24": {"name": "Photos",			"url": "nyt://feeds.slideshows"},
		"25": {"name": "Saved",				"url": "user://saved"}
	},
	"categoryOrder": ["Sections"],
	"sectionOrder": {
		"Sections": [1,12,24,25,3,4,5,6,7,8,9,10,11,13,21,14,22,15,17,18,16,23,20,19],
		 "Blogs": [20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49]
	},
	"freeSections":["Top News"]
});

Solo.config.importMouse({
	"click": {
		"#logo":function(event) {
			location.href = "http://nytimes.com";
		},
		"#fauxPrivacy":function(event) {
			location.href = "http://www.nytimes.com/ref/membercenter/help/privacysummary.html";
		},
		"#articleCloser":function(event) {
			jQuery("#controls img.active").removeClass("active");
			skimmer("article").close();
		},
		"#articlePopOut":function(event) {
			window.open(jQuery("#articleFrame").attr("src"),"articlewindow");
		},
		"#articlePageView":function(event) {
			location.href = jQuery("#articleFrame").attr("src");
		},
		"#articleSwitcher":function(event) {
			notify("close switcher");
		},
		".schemeList .schemePreview":function(event) {
			jQuery(".schemeList .selectedOption").removeClass("selectedOption");
			jQuery(this).addClass("selectedOption");
			skimmer("schemeManager").setScheme(jQuery(this).attr("realvalue"));
			skimmer("sections").resetSources();
			skimmer("sections").displaySection();
		},
		".schemePreviewCloser":function(event) {
			skimmer("schemeSwitcher").hide();
		},
		".customize": function(event) {
			skimmer("schemeSwitcher").show();
		},
		".shortcuts": function(event) {
			(skimmer("state").query("showingShortcuts"))
				? skimmer("shortcutsPanel").hide()
				: skimmer("shortcutsPanel").show();
		},
		".shortcutsClose": function(event) {
			skimmer("shortcutsPanel").hide();
		},
		".account": function(event) {
			(skimmer("state").query("showingShortcuts"))
				? skimmer("account").hide()
				: skimmer("account").show();
		},
		".accountClose": function(event) {
			skimmer("account").hide();
		},
		"#nextSection":function(event) {
			skimmer("sections").nextSection();
		},
		"#previousSection":function(event) {
			skimmer("sections").previousSection();
		},
		".sectionFooter .pageLeftIndicator":function(event) {
			skimmer("pagination").previousPage();
		},
		".sectionFooter .pageRightIndicator":function(event) {
			skimmer("pagination").nextPage();
		},
		"#pageRightButton, #pageRightClickTarget":function(event) {
			skimmer("article").navigatePage("right");
		},
		"#pageLeftButton, #pageLeftClickTarget":function(event) {
			skimmer("article").navigatePage("left");
		},
		".textResize":function(event) {
			if (jQuery("body").hasClass("bigText")) {
				notify("shrink article text");
			} else {
				notify("enlarge article text");
			}
		},
		".mediaUnit img": function(event) {
			notify("load slideshow");
		},
		".slideshowIndicators .thumb": function(event) {
			notify("image preview thumb", jQuery(this).attr("imageid"));
		},
		".slideshow .photo": function(event) {
			notify("toggle image preview ui");
		},
		".slideshow .slideshowMeta": function(event) {
			notify("toggle image preview ui");
		},
		".slideshowClose": function(event) {
			notify("hide image browser");
		},
		".slideshowNextButton":function(event) {
			notify("next slideshow image");
		},
		".slideshowPreviousButton":function(event) {
			notify("previous slideshow image");
		},
		"#sidebar ol li":function(event) {
			jQuery("body").addClass("animate");
			skimmer("article").close();
			skimmer("sections").setCurrentSource(this.getAttribute("ordinal"));
			skimmer("sections").displaySection();
		},
		"#sidebar #SectionsHeader": function(event) {
			notify("hard refresh");
		},
		".shrinkWrap .container .headline a":function(event) {
			if (!(event.metaKey || event.shiftKey || event.ctrlKey || event.button == 2)) {
				if (skimmer("state").query("performingSwipe")) {
					return;
				}
				var target = jQuery(event.target);
				event.preventDefault();
				skimmer("article").select(target.attr("href"), target.html());
			}
		},
		".shrinkWrap .container":function(event) {
			if (!(event.metaKey || event.shiftKey || event.ctrlKey || event.button == 2)) {
				var target = jQuery(event.target);
				if (skimmer("state").query("performingSwipe")) {
					return;
				}
				if (!target.hasClass("container")) {
					var target = target.parents(".container").eq(0);
				}
				var link = target.find("a").get(0).href;
				if (link) {
					skimmer("article").select(link, target.find("a").html());
				}
			}
		},
		".shareToolsMenu": function(event) {
			jQuery(".shareToolsContent").toggle();
		},
		".saveArticle": function(event) {
			skimmer("readinglist").toggleArticleStatus();
		},
		".twitter a": function(event) {
			if ("standalone" in window.navigator && window.navigator.standalone) {
				skimmer("twitter").expandLink();
			} else {
				skimmer("twitter").showWindow();
				event.preventDefault();
			}
		},
		".facebook a": function(event) {
			if ("standalone" in window.navigator && window.navigator.standalone) {
				skimmer("facebook").expandLink();
			} else {
				skimmer("facebook").showWindow();
				event.preventDefault();
			}
		},
		".interstitialButton": function(event) {
			skimmer("interstitialPanel").hide();
		},
		".syncStatus .header": function(event) {
			skimmer("syncStatus").toggleDetails();
		},
		".readingListIndicator": function(event) {
			if (jQuery(this).parents(".sample").length > 0) {
				notify("sample reading list click", this);
			} else {
				notify("reading list click", this);
			}
			event.preventDefault();
			event.stopPropagation();
		}
	},
	"mouseover": {
		".story": function(event) {
			if (!("ontouchstart" in document)) {
				skimmer("readinglist").activateStar(this);
			}
		},
		".passiveMessageDisplay": function(event) {
			jQuery(this).addClass("lock");
		}
	},
	"mouseout": {
		".story": function(event) {
			if (!("ontouchstart" in document)) {
				skimmer("readinglist").deactivateStar(this);
			}
		},
		".passiveMessageDisplay": function(event) {
			jQuery(this).removeClass("lock");
		}
	}
});

Solo.config.importGeneral({
	mouseMoveActions: {
		"#zoom":function(target) {
			skimmer("zoomer").hide();
		},
		".shrinkWrap":function(target) {
			skimmer("zoomer").hide();
		}
	}
});

Solo.config.importGeneral({
	"mousemoveShiftActions": {
		".shrinkWrap .grid .story":function(target) {
			skimmer("zoomer").show(target);
		}
	}
});

Solo.config.importGeneral({
	currentSchemeName : "contrasty",
	trackingActive : true,
	numberOfAdPositions : 1,
	settingsCookieName: "skimmer",
	settingsCookiePath: "/"+location.pathname.split("/")[1],
	queryShortcut: "skimmer",
	defaultSettings: {
		"source": 0,
		"scheme": "contrasty",
		"article": "h",
		"interstitial":0,
		"enlargeText":0
	},
	defaultState: {
		"listeningForStoryCue": false,
		"articleVisible": false,
		"articleSwitcherVisible": false,
		"slideshowVisible": false,
		"wideSidebar": false,
		"singleScreenMode": false,
		"sidebarVisible": true,
		"switchingSchemes": false,
		"showingShortcuts": false,
		"performingSwipe": false,
		"payModelActive": true
	}
});


defineReceiver("SectionCache");

SectionCache = function() {

	var override = skimmer("canAccessFullFeeds")
		? Solo.config.getService('mobile')
		: "";

	var cache = new RequestCache("nytSkimmerSections", "/webapps/skimmer/"+Solo.config.get("version")+"/src/workers/dataWorker.js", {
		prefix: override,
		expirationMinutes: 15
	});

	var dataRequestFallback = function(uri) {
		var converterUrl = Solo.config.getService("mobile");
		var requestUri = (uri.match("platforms.nytimes.com")) ? converterUrl+uri : uri
		jQuery.ajax({
			type: "GET",
			url: requestUri,
			dataType: "json",
			success: function(data) {
				skimmer("sectionCache").returnFromFallback(uri, data);
			},
			error: function (transport, textStatus, errorThrown) { console.error(textStatus)}
		});
	};

	cache.passThroughWorker = function(uri) {
		return uri.match("platforms.nytimes.com");
	};

	cache.useCache = function(uri) {
		return uri.match("platforms.nytimes.com");
	};

	cache.setFallback(dataRequestFallback);
	return cache;
};

