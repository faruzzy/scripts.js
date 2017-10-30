Solo.config.importGeneral({schemes: {
        contrasty: {
            type: "tmpl",
            name: "Contrasty",
            skin: "light",
            description: "A little of this, a little of that.",
            containerClass: "expanded",
            touchsafe: "1",
            cellWidth: "175",
            cellHeight: "175",
            "css": "body {\
	background-color: #555 !important;\
	\
}\
\
.mainView {\
	background-color: #444 !important;\
}\
\
.mainView #sidebar {\
	margin-top: 0;\
	margin-right: 0;\
	margin-bottom: 0;\
	width: 128px;\
}\
\
.mainView #sidebar .refresh {\
	background: transparent url(/webapps/skimmer/2.0/images/reload-light.png) no-repeat center center\
}\
\
.mainView #sidebar .content li,\
.mainView #sidebar .content li.selected,\
.mainView #sidebar dt,\
.mainView #sidebar .account,\
.mainView #sidebar .shortcuts,\
.mainView #sidebar .customize{\
	text-shadow: 0 1px 0px #333;\
	font-size: 11px;\
	color: #eee;\
	text-transform: none;\
	padding: 3px 10px;\
}\
\
.mainView #sidebar .content li.selected {\
	background: #777;\
	padding: 3px 10px;\
	border-radius: 0;\
	-webkit-border-radius: 0;\
	-moz-border-radius: 0;\
	border: 1px solid transparent; \
	color: #eee;\
}\
\
.mainView #sidebar dt {\
	-moz-box-shadow: none;\
	-webkit-box-shadow: none;\
	box-shadow: none;\
	background-color: #444;\
	background-image: -webkit-gradient(linear, left top, left bottom, from(#555), to(#222), color-stop(0.05, #444), color-stop(0.95, #333));\
	background-image: -moz-linear-gradient(top, #555, #444 5%, #333 95%, #222);\
	border-bottom: 1px solid #444;\
	text-shadow: 0 -1px 0 #333;\
	padding: 8px 10px;\
}\
\
.mainView #sidebar .account,\
.mainView #sidebar .shortcuts,\
.mainView #sidebar .customize {\
	border-bottom: none;\
	background: #444 !important;\
	background-image: -webkit-gradient(linear, left top, left bottom, from(#555), to(#222), color-stop(0.05, #444), color-stop(0.95, #333)) !important;\
	background-image: -moz-linear-gradient(top, #555, #444 5%, #333 95%, #222) !important;\
	padding: 8px 10px !important;\
	text-shadow: 0 -1px 0 #333;\
	-webkit-box-shadow: 0 1px 0 #777;\
}\
\
.mainView #sidebar .customize {\
}\
\
.mainView #sidebar dd {\
	-moz-box-shadow: none;\
	-webkit-box-shadow: none;\
	border-bottom: none;\
}\
\
#contentPane {\
	background-color: white;\
	border-right: 1px solid #333;\
	-webkit-box-shadow: 0 0 5px #111;\
	box-shadow: 0 0 5px #111;\
	right: 128px;\
}\
\
.mainView .shrinkWrap {\
	-webkit-box-shadow: none;\
	-moz-box-shadow: none;\
	left: 0;\
	right: 0;\
	margin-top: 0;\
}\
\
.thumbWrapper {height: 73px; width: 73px; overflow:hidden;}\
.thumbWrapper img {margin-right: -1px; margin-left: -1px; margin-top: -1px;}\
.story.gridStory {\
	height: auto !important;\
}\
.story.gridStory .fill {\
	position: static;\
}\
.contrasty .story .container { border-bottom: 1px solid #777;}\
.contrasty .story .content { border-right: 1px solid #555; }\
\
.mids .container .content {\
	border-bottom: 1px solid #ddd;\
	border-right: none !important;\
	margin: 0 10px;\
	padding: 0;\
}\
\
.mids .story:last-child .container .content {\
	border-bottom: none;\
}\
\
#articleFooter {\
	border-top: 1px solid #ccc;\
}\
\
.pageIndicators {\
	display: none;\
}\
\
.pageScroller {\
	overflow: hidden;\
}\
\
.grid {\
	visibility: visible;\
}\
\
.mids .grid .story .container {\
	padding-top: 8px;\
}\
\
.shrinkWrap { \
	background-color: #fbfaf9;\
}\
\
.pages {\
	display: none;\
}\
\
.pageScroller {\
	background: transparent;\
}\
\
.blocks .story {\
	background-color: transparent; clear:\
}\
\
.ledes .blocks .story {\
	margin: 10px 10px 0 0;\
}\
\
/*\
.headline.slideshowTitle {\
	font-family: 'nyt-franklin-1', 'nyt-franklin-2', 'arial','helvetica', sans-serif;\
}\
\
.headline.slideshowTitle a {\
}\
*/\
\
.ends .blocks .story { margin: 0; }\
\
.ledes li a { font-size: 26px; line-height: 29px; } \
\
.mids, .ledes { border-right: 1px solid #e2e2e2; } \
\
.ends ul {margin-left: 10px; margin-top: 5px; margin-right: 0;}\
\
.ends .story a {font-size: 13px; line-height: 15px; color: #333 }\
\
.ledes .grid .story .container,\
.ledes .blocks .story {\
	border-bottom: none !important;\
}\
\
\
.ledes .byline {\
	margin-top: 5px;\
}\
\
.ends:hover ul {\
	overflow: auto;\
}\
\
/*\
.ends ul {\
	overflow: hidden;\
	padding-right: 22px;\
}\
\
.ends ul:hover {\
	overflow: auto;\
	padding-right: 0;\
}\
*/\
\
.ends .clearfix {\
	height: 1px;\
}\
\
.ends ul .line {\
	background: #e2e2e2;\
	height: 1px;\
	width: 150px;\
	margin: 15px auto;\
}\
\
.ends .headline {\
	font-size: 20px;\
}\
\
#skimmerArticleViewer { \
	background: #fbfaf9; \
	top: 0px;\
	bottom: 0px;\
	left: 0px;\
	right: 140px;\
\
}\
\
#articleCloser {\
	padding: 0 16px 16px 0;\
}\
\
#articleCloser img {\
	margin: 8px;\
}\
\
#articleBar .logo {\
	margin-left: 20px;\
}\
\
.body p {\
	text-indent: 20px;\
	text-align: justify;\
}\
\
.body p:first-child {\
	text-indent: 0;\
}\
\
.light-skin .mainView #sidebar .customize {\
	color: #eee !important;\
	background: none;\
}\
\
.light-skin .mainView #sidebar .shortcuts {\
	color: #eee !important;\
	background: none;\
}\
\
.light-skin .mainView #sidebar .account {\
	color: #eee !important;\
	background: none;\
}\
\
.syncStatus {\
	top: 0;\
	right: 0;\
	width: 140px;\
	height: 13px;\
}\
\
.light-skin .syncStatus .header {\
	background-color: #444;\
	background-image: -webkit-gradient(linear, left top, left bottom, from(#555), to(#222), color-stop(0.05, #444), color-stop(0.95, #333));\
	background-image: -moz-linear-gradient(top, #555, #444 5%, #333 95%, #222);\
	border-bottom: 1px solid #444;\
	text-shadow: 0 -1px 0 #333;\
	padding: 8px 10px;\
}\
\
.syncStatus .header .label {\
	text-transform: none;\
	color: #eee;\
}\
",
            template: "<% var cols = grid.numColumns(); %>\
<% var isSlideshow = (items && items[0] && items[0].rawData.type == \"slideshow\"); %>\
<% var useGrid = isSlideshow || sectionName == \"Saved\"; %>\
<% var rows = grid.numRows(); %>\
<% var wholeHeight = grid.numRows() * grid.cellHeight(); %>\
<% var cursor = 0; %>\
<% var hadLede = false; %>\
<% var ledeCols = (grid.numColumns() >= 4) ? 2 : 1; %>\
<% if (useGrid) { ledeCols = 0; } %>\
<% var ledeWidthClass = ledeCols == 2 ? \"doubleCellWidth\" : \"cellWidth\"; %>\
<% var midCols = (grid.numColumns() - 1 - ledeCols); %>\
<% var imageClass = \"\"; %>\
<% var orientation = \"horizontal\"; %>\
<div class=\"pageScroller\">\
<% if (useGrid) { %>\
	<table class=\"slideshowLayout\" cellspacing=\"0\" cellpadding=\"0\">\
<% } else { %>\
	<table cellspacing=\"0\" cellpadding=\"0\">\
<% } %>\
	<tr valign=\"top\">\
		<% if (!useGrid) { %>\
		<td class=\"ledes <%= ledeWidthClass %>\">\
		<% } else { %>\
		<td style=\"display: none\">\
		<% } %>\
			<ul class=\"blocks ledeSet\">\
				<% jQuery(items.slice(0,1)).each( function(i) { %> \
					<% var orientation = (this.imageWidth() > this.imageHeight()) ? \"horizontal\" : \"vertical\"; %>\
					<% var maxHeight = grid.cellHeight() * Math.floor(rows / 2);  %>\
					<% var maxWidth = (orientation == \"horizontal\") ? grid.cellWidth() * ledeCols : grid.cellWidth(); %>\
					<% var spanResized = new DisplayedImage(); %>\
					<% var shrunkenDimensions = spanResized.shrinkToFit({from: {x: this.imageWidth(), y: this.imageHeight()}, toWithin: {x: maxWidth, y: maxHeight}}); %>\
					<li class=\"story <%= ledeWidthClass %>\" style=\"height:<%= pixels(wholeHeight) %>\"> \
						<div class=\"container\" style=\"height:100%\">\
						<% if (this.rawData.type == \"slideshow\") { %>\
							<div class=\"headline\"><a href=\"<%= this.link() %>\"><%= this.title() %></a></div>\
						<% } %>\
						<% if (orientation == \"vertical\") { %>\
							<% if (this.kicker()) { %>\
								<div class=\"kicker\"><%= this.kicker() %></div>\
							<% } %>\
							<div class=\"headline\"><a href=\"<%= this.link() %>\"><%= this.title() %></a></div>\
							<div class=\"byline\"><%= this.byline() %> </div>\
						<% } %>\
						<% if (this.spanImage()) { %>\
							<% if (orientation == \"vertical\") { imageClass = \"tallSpan\"; } %>\
							<div class=\"spanImage <%= imageClass %>\" style=\"margin: 0 auto; width:<%= pixels(shrunkenDimensions.x)  %>\">\
								<img src=\"<%= this.jumboImage() %>\" width=\"<%= shrunkenDimensions.x %>\">\
							</div>\
						<% } %>\
						<% if (orientation == \"horizontal\") { %>\
							<% if (this.kicker()) { %>\
								<div class=\"kicker\"><%= this.kicker() %></div>\
							<% } %>\
							<% if (this.rawData.type !== \"slideshow\") { %>\
								<div class=\"headline\"><a href=\"<%= this.link() %>\"><%= this.title() %></a></div>\
								<div class=\"byline\"><%= this.byline() %> </div>\
							<% } %>\
						<% } %>\
						<% if (this.rawData.type == \"slideshow\") { %>\
							<% var photos = this.getAllImages(); %>\
							<% for (var i=1, len = 9; i<len; i++) { %>\
								<% var photo = photos[i]; %> \
								<% if (photo)  { %>\
									<% var miniWidth = maxWidth / 2 - 5; %>\
									<div style=\"width:<%= pixels(miniWidth) %>; float: <%= i % 2 === 0 ? \"left\" : \"right\" %>; margin-top: 10px; height:<%= pixels(miniWidth * 0.60) %>; overflow: hidden\">\
										<img src=\"<%= photo.crops[\"slide\"].url %>\" width=\"<%= miniWidth %>\">\
									</div>\
									<% if (i === 2) { %>\
										<div style=\"clear:left margin-bottom: 10px;\"></div>\
									<% } %>\
								<% } %>\
							<% } %>\
						<% } else { %>\
							<div class=\"body\"><p><%= this.shortBody() %></p></div>\
						<% } %>\
						</div>\
					</li> \
				<% }); %>\
			</ul>\
		</td>\
		<% var startAsset = (ledeCols == 0) ? 0 : 1; %>\
		<% for (var i=0, len=midCols; i < len; i++) { %>\
		<td class=\"mids cellWidth\">\
			<ul class=\"blocks midSet cellWidth grid\" style=\"float: left;\">\
				<% jQuery(items.slice((startAsset + i * rows), (startAsset + (i * rows) + rows))).each( function() { %> \
					<% if (this.rawData.type == \"slideshow\") { %>\
					<li class=\"cellWidth gridStory\"> \
					<% } else { %>\
					<li class=\"cellWidth cellHeight\"> \
					<% } %>\
						<div class=\"container fill\">\
							<div class=\"content\">\
							<% if (this.rawData.type == \"slideshow\") { %>\
								<% var maxHeight = grid.cellHeight();  %>\
								<% var maxWidth = grid.cellWidth() - 20; %>\
								<% var spanResized = new DisplayedImage(); %>\
								<% var shrunkenDimensions = spanResized.shrinkToFit({from: {x: this.imageWidth(), y: this.imageHeight()}, toWithin: {x: maxWidth, y: maxHeight}}); %>\
								<div class=\"spanImage\" style=\"margin: 0 auto; width:<%= pixels(shrunkenDimensions.x) %> \">\
									<img src=\"<%= this.spanImage() %>\" width=\"<%= shrunkenDimensions.x %>\">\
								<div class=\"headline slideshowTitle\"><a href=\"<%= this.link() %>\"><%= this.title() %></a></div>\
								</div>\
							<% } else { %>\
								<% if (this.kicker()) { %>\
									<div class=\"kicker\"><%= this.kicker() %></div>\
								<% } %>\
							<% if (!this.title) { console.log(\"non title 5!\", this.rawData);} %>\
								<div class=\"headline\"><a href=\"<%= this.link() %>\"><%= this.title() %></a></div>\
								<div class=\"byline\"><%= this.byline() %></div>\
								<% if (this.thumbnail()) { %>\
									<div class=\"thumbnail\">\
										<img height=\"60\" width=\"60\" src=\"<%= this.thumbnail() %>\">\
									</div>\
								<% } %>\
								<div class=\"summary\"><p><%= this.description() %></p></div>\
							<% } %>\
							</div>\
						</div>\
					</li> \
				<% }); %>\
			</ul>\
		</td>\
		<% } %>\
		<td class=\"ends cellWidth\">\
			<ul class=\"blocks endSet\" style=\"height: <%= pixels(skimmer(\"grid\").pageHeight()) %>;\">\
				<% jQuery(items.slice(rows * midCols + 1)).each( function(i) { %> \
					<li> \
						<div class=\"container\">\
							<% if (this.rawData.type == \"slideshow\") { %>\
								<div class=\"thumbnail\">\
									<img height=\"60\" width=\"60\" src=\"<%= this.thumbnail() %>\">\
								</div>\
							<% } %>\
							<div class=\"headline\"><a href=\"<%= this.link() %>\"><%= this.kicker() ? this.kicker()+\" : \" : \"\" %><%= this.title() %></a></div>\
							<div class=\"clearfix\" style=\"clear: left\">&nbsp;</div>\
						</div>\
						<div class=\"line\" style=\"clear:both\"></div>\
					</li> \
				<% }); %>\
			</ul>\
		</td>\
	</tr>\
</table>\
</div>\
\
\
"},
        
        serendipity: {
            type: "tmpl",
            name: "Serendipity",
            skin: "light",
            description: "The classic theme.",
            touchsafe: "1",
            "css": ".grid .story .container {\
	border-bottom: 1px solid #ccc;\
}\
\
.grid .container .content {\
	border-right: 1px solid #ddd;\
}\
",
            template: "<div class=\"pageScrollContainer\">\
	<ul class=\"blocks grid\">\
		<% jQuery(items).each( function() { %> \
			<li> \
				<div class=\"container fill\">\
					<div class=\"content\">\
					<% if (this.kicker()) { %>\
						<div class=\"kicker\"><%= this.kicker() %></div>\
					<% } %>\
					<div class=\"headline\"><a href=\"<%= this.link() %>\"><%= this.title() %></a></div>\
					<% if (this.byline()) { %>\
						<div class=\"byline\"><%= this.byline() %></div>\
					<% } %>\
					<% if (this.thumbnail()) { %>\
						<div class=\"thumbnail\"><img src=\"<%= this.thumbnail() %>\" height=\"60\" width=\"60\" /></div>\
					<% } %>\
						<div class=\"summary\"> <p><%= this.description() %></p></div>\
					</div>\
				</div>\
			</li> \
		<% }); %>\
	</ul>\
	<div class=\"pageContent pages\"></div>\
</div>\
",
            scripts: "StandardGrid"
        },
        
        overview: {
            type: "tmpl",
            skin: "light",
            name: "Overview",
            description: "Top Stories Only",
            touchsafe: "1",
            "css": ".mids .container .content {\
	border-bottom: 1px solid #ddd;\
	border-right: none !important;\
	margin: 0 10px;\
	padding: 0;\
}\
\
.mids .story:last-child .container .content {\
	border-bottom: none;\
}\
\
#articleFooter {\
	border-top: 1px solid #ccc;\
}\
\
.pageIndicators {\
	display: none;\
}\
\
.pageScroller {\
	overflow: hidden;\
}\
\
.grid {\
	visibility: visible;\
}\
\
.mids .grid .story .container {\
	padding-top: 8px;\
}\
\
.shrinkWrap { \
	background-color: #fbfaf9;\
}\
\
.pages {\
	display: none;\
}\
\
.pageScroller {\
	background: transparent;\
}\
\
.blocks .story {\
	background-color: transparent; clear:\
}\
\
.ledes .blocks .story {\
	margin: 10px;\
}\
\
.ends .blocks .story { margin: 0 10px 10px 10px; padding-bottom: 10px; }\
\
.blocks .story .container { background-color: transparent; }\
\
.ledes li a { font-size: 26px; line-height: 29px; } \
\
.mids, .ledes { border-right: 1px solid #e2e2e2; } \
\
.ends ul {margin-left: 10px; margin-top: 5px; padding: 5px 0;}\
\
.ends .story a {font-size: 13px; line-height: 15px; color: #333 }\
\
.ledes .grid .story .container,\
.ledes .blocks .story {\
	border-bottom: none !important;\
}\
\
.ledes .byline {\
	margin-top: 5px;\
}\
\
.ends ul {\
	background: #f5f5f5;\
}\
.ends .headline {\
	font-size: 20px;\
}\
\
#skimmerArticleViewer { background: #fbfaf9; }\
\
.body p {\
	text-indent: 20px;\
	text-align: justify;\
}\
\
.body p:first-child {\
	text-indent: 0;\
}\
\
",
            template: "<div class=\"pageScroller\">\
<table cellspacing=\"0\" cellpadding=\"0\">\
	<% var cols = grid.numColumns(); %>\
	<% var rows = grid.numRows(); %>\
	<% var cursor = 0; %>\
	<% var hadLede = false; %>\
	<% var ledeCols = (grid.numColumns() >= 4) ? 2 : 1; %>\
	<% var ledeWidthClass = ledeCols == 2 ? \"doubleCellWidth\" : \"cellWidth\"; %>\
	<% var midCols = (grid.numColumns() - 1 - ledeCols); %>\
	<% var imageClass = \"\"; %>\
	<% var orientation = \"horizontal\"; %>\
	<tr valign=\"top\">\
		<td class=\"ledes <%= ledeWidthClass %>\">\
			<ul class=\"blocks ledeSet\">\
				<% jQuery(items.slice(0,1)).each( function(i) { %> \
					<% var orientation = (this.imageWidth() > this.imageHeight()) ? \"horizontal\" : \"vertical\"; %>\
					<% var maxHeight = grid.cellHeight() * Math.floor(rows / 2);  %>\
					<% var maxWidth = (orientation == \"horizontal\") ? grid.cellWidth() * ledeCols : grid.cellWidth(); %>\
					<% var spanResized = new DisplayedImage(); %>\
					<% var shrunkenDimensions = spanResized.shrinkToFit({from: {x: this.imageWidth(), y: this.imageHeight()}, toWithin: {x: maxWidth, y: maxHeight}}); %>\
					<li class=\"story <%= ledeWidthClass %>\"> \
						<div class=\"container\">\
						<% if (orientation == \"vertical\") { %>\
							<% if (this.kicker()) { %>\
								<div class=\"kicker\"><%= this.kicker() %></div>\
							<% } %>\
							<div class=\"headline\"><a href=\"<%= this.link() %>\"><%= this.title() %></a></div>\
							<div class=\"byline\"><%= this.byline() %> </div>\
						<% } %>\
						<% if (this.spanImage()) { %>\
							<% if (orientation == \"vertical\") { imageClass = \"tallSpan\"; } %>\
							<div class=\"spanImage <%= imageClass %>\" style=\"margin: 0 auto; width:<%= pixels(shrunkenDimensions.x)  %>\">\
								<img src=\"<%= this.spanImage() %>\" width=\"<%= shrunkenDimensions.x %>\">\
								<div class=\"credit\"><%= this.credit() %></div>\
							</div>\
						<% } %>\
						<% if (orientation == \"horizontal\") { %>\
							<% if (this.kicker()) { %>\
								<div class=\"kicker\"><%= this.kicker() %></div>\
							<% } %>\
							<div class=\"headline\"><a href=\"<%= this.link() %>\"><%= this.title() %></a></div>\
							<div class=\"byline\"><%= this.byline() %> </div>\
						<% } %>\
						<div class=\"body\"><p><%= this.shortBody() %></p></div>\
						</div>\
					</li> \
				<% }); %>\
			</ul>\
		</td>\
		<% for (var i=0, len=midCols; i < len; i++) { %>\
		<td class=\"mids cellWidth\">\
			<ul class=\"blocks midSet cellWidth grid\" style=\"float: left;\">\
				<% jQuery(items.slice((1 + i * rows), (1 + (i * rows) + rows))).each( function() { %> \
					<li class=\"cellWidth cellHeight\"> \
						<div class=\"container fill\">\
							<div class=\"content\">\
							<% if (this.kicker()) { %>\
								<div class=\"kicker\"><%= this.kicker() %></div>\
							<% } %>\
							<div class=\"headline\"><a href=\"<%= this.link() %>\"><%= this.title() %></a></div>\
							<div class=\"byline\"><%= this.byline() %></div>\
							<% if (this.thumbnail()) { %>\
								<div class=\"thumbnail\">\
									<img height=\"60\" width=\"60\" src=\"<%= this.thumbnail() %>\">\
								</div>\
							<% } %>\
							<div class=\"summary\"><p><%= this.description() %></p></div>\
							</div>\
						</div>\
					</li> \
				<% }); %>\
			</ul>\
		</td>\
		<% } %>\
		<td class=\"ends\">\
			<ul class=\"blocks endSet\">\
				<% jQuery(items.slice(rows * midCols + 1)).each( function() { %> \
					<li> \
						<div class=\"container\">\
							<div class=\"headline\"><a href=\"<%= this.link() %>\"><%= this.kicker() ? this.kicker()+\" : \" : \"\" %><%= this.title() %></a></div>\
						</div>\
					</li> \
				<% }); %>\
			</ul>\
		</td>\
	</tr>\
</table>\
</div>\
\
"},
        
        doric: {
            type: "tmpl",
            name: "Doric",
            skin: "light",
            description: "Get vertical.",
            touchsafe: "1",
            "css": "\
.pages {\
	display: none;\
}\
\
.sectionPageScroller {\
	overflow: hidden;\
}\
\
.doric ul {\
	margin: 0;\
	padding: 0;\
	list-style: none;\
	-webkit-transition: margin-left 1s;\
}\
\
.doric .blocks .story {\
	padding: 0;\
	float: left;\
	cursor: pointer;\
}\
\
.doric .story .container {\
	margin: 10px;\
}\
\
.doric .kicker {\
	text-align: center;\
}\
\
.doric .headline {\
	text-align: center;\
	padding-bottom: 10px;\
	margin-bottom: 10px;\
	border-bottom: 1px solid #ccc;\
}\
\
.doric a {\
	text-decoration: none;\
}\
\
.doric .byline {\
	text-align: center;\
	color: black;\
}\
\
.doric .story .image {\
	margin-bottom: 20px;\
}\
\
\
.doric .body p {\
	text-indent: 20px;\
}\
\
.doric .body p:first-child {\
	text-indent: 0;\
}\
\
\
\
",
            template: "<div class=\"pageScrollContainer doric\">\
	<div class=\"pageContent\">\
	<ul class=\"blocks\" style=\"width:<%= (skimmer(\"grid\").cellWidth() + 30) * items.length %>px\">\
	<% jQuery(items).each( function() { %> \
		<li style=\"width:<%= skimmer(\"grid\").cellWidth() %>px\"> \
			<div class=\"container\">\
				<% if (this.kicker()) { %>\
					<div class=\"kicker\"><%= this.kicker() %></div>\
				<% } %>\
				<div class=\"headline\">\
					<a href=\"<%= this.link() %>\"><%= this.title() %></a>\
				</div>\
				<% if (this.byline()) { %>\
					<div class=\"byline\"><%= this.byline() %></div>\
				<% } %>\
				<% if (this.previewImage()) { %>\
					<div class=\"image\">\
						<img src=\"<%= this.previewImage() %>\" width=\"<%= skimmer(\"grid\").cellWidth() -20 %>\" />\
						<div class=\"credit\"><%= this.credit() %></div>\
					</div>\
				<% } else if (this.videoStill()) { %>\
					<div class=\"image\">\
						<img src=\"<%= this.videoStill() %>\" width=\"<%= skimmer(\"grid\").cellWidth() - 20 %>\">\
					</div>\
				<% } %>\
				<div class=\"body\"><%= this.shortBody() %></div>\
			</div>\
		</li> \
	<% }); %>\
	</ul>\
	</div>\
</div>\
\
",
            scripts: function() {
                this.listen = function(message, data) {
                    switch (message) {
                        case "source loaded":
                        case "scheme loaded":
                        case "section updated":
                            var section = skimmer("currentSection");
                            if (!section || !section.data.dataArray)
                                return;
                            var total = section.data.dataArray.length;
                            var width = section.layout.container.find(".pageScroller").width();
                            var pages = total / skimmer("grid").numColumns();
                            notify("page total updated", pages);
                            break;
                        
                        case "left arrow":
                            skimmer("pagination").previousPage();
                            break;
                        
                        case "right arrow":
                            skimmer("pagination").nextPage();
                            break;
                        
                        case "section page changed":
                            var scroller = skimmer("currentSection").layout.container.find(".pageScrollContainer");
                            var pages = scroller.find(".pageContent");
                            var width = skimmer('grid').cellWidth() * skimmer('grid').numColumns();
                            var newOffset = data * width;
                            notify("page offset set", -newOffset);
                            break;
                    }
                };
            }
        },
        
        spread: {
            type: "tmpl",
            name: "Spread",
            skin: "light",
            description: "Contrasty + Overview",
            containerClass: "expanded",
            touchsafe: "1",
            "css": "body {\
	\
}\
\
.mainView {\
}\
\
.mainView #sidebar {\
	margin-top: 10px;\
	margin-right: 10px;\
	margin-bottom: 0;\
}\
\
.mainView #sidebar .content li,\
.mainView #sidebar .content li.selected,\
.mainView #sidebar dt,\
.mainView #sidebar .account,\
.mainView #sidebar .shortcuts,\
.mainView #sidebar .customize{\
	font-size: 12px;\
	font-weight: normal;\
	text-transform: none;\
	font-family: 'helvetica', 'arial', sans-serif;\
}\
\
.mainView #sidebar .content li.selected {\
}\
\
.mainView #sidebar dt {\
}\
\
.mainView #sidebar dd {\
}\
\
#contentPane {\
	background-color: white;\
	-webkit-box-shadow: 0 0 20px #999;\
	box-shadow: 0 0 20px #999;\
}\
\
.mainView .shrinkWrap {\
	-webkit-box-shadow: none;\
	box-shadow: none;\
	left: 0;\
	right: 0;\
	margin-top: 0;\
}\
\
.thumbWrapper {height: 73px; width: 73px; overflow:hidden;}\
.thumbWrapper img {margin-right: -1px; margin-left: -1px; margin-top: -1px;}\
.contrasty .story .container { border-bottom: 1px solid #777;}\
.contrasty .story .content { border-right: 1px solid #555; }\
\
.mids .container .content {\
	border-bottom: 1px solid #ddd;\
	border-right: none !important;\
	margin: 0 10px;\
	padding: 0;\
}\
\
.mids .story:last-child .container .content {\
	border-bottom: none;\
}\
\
#articleFooter {\
	border-top: 1px solid #ccc;\
}\
\
.pageIndicators {\
	display: none;\
}\
\
.pageScroller {\
	overflow: hidden;\
}\
\
.grid {\
	visibility: visible;\
}\
\
.mids .grid .story .container {\
	padding-top: 8px;\
}\
\
.shrinkWrap { \
	background-color: #fbfaf9;\
}\
\
.pages {\
	display: none;\
}\
\
.pageScroller {\
	background: transparent;\
}\
\
.blocks .story {\
	background-color: transparent; clear:\
}\
\
.ledes .blocks .story {\
	margin: 10px;\
}\
\
.ends .blocks .story { margin: 0 10px 10px 10px; padding-bottom: 10px; }\
\
.blocks .story .container { background-color: transparent; }\
\
.ledes li a { font-size: 26px; line-height: 29px; } \
\
.mids, .ledes { border-right: 1px solid #e2e2e2; } \
\
.ends ul {margin-left: 10px; margin-top: 5px; padding: 5px 0;}\
\
.ends .story a {font-size: 13px; line-height: 15px; color: #333 }\
\
.ledes .grid .story .container,\
.ledes .blocks .story {\
	border-bottom: none !important;\
}\
\
.ledes .byline {\
	margin-top: 5px;\
}\
\
.ends ul {\
	background: #f5f5f5;\
}\
.ends .headline {\
	font-size: 20px;\
}\
\
#skimmerArticleViewer { \
	background: #fbfaf9; \
	top: 0px;\
	bottom: 0px;\
	left: 0px;\
	right: 140px;\
\
}\
\
#articleCloser {\
	padding: 0 16px 16px 0;\
}\
\
#articleCloser img {\
	margin: 8px;\
}\
\
#articleBar .logo {\
	margin-left: 20px;\
}\
\
#articleTitle {\
	margin-left: 18px;\
}\
\
.body p {\
	text-indent: 20px;\
	text-align: justify;\
}\
\
.body p:first-child {\
	text-indent: 0;\
}\
\
.light-skin .mainView #sidebar .customize {\
	background: none;\
}\
\
.light-skin .mainView #sidebar .shortcuts {\
	border-bottom: none;\
	background: none;\
}\
\
.light-skin .mainView #sidebar .account {\
	background: none;\
}\
\
.syncStatus {\
	top: 9px;\
	right: 9px;\
}\
\
.syncStatus .header .label {\
	font-weight: normal;\
	text-transform: none;\
}\
",
            template: "<div class=\"pageScroller\">\
<table cellspacing=\"0\" cellpadding=\"0\">\
	<% var cols = grid.numColumns(); %>\
	<% var rows = grid.numRows(); %>\
	<% var cursor = 0; %>\
	<% var hadLede = false; %>\
	<% var ledeCols = (grid.numColumns() >= 4) ? 2 : 1; %>\
	<% var ledeWidthClass = ledeCols == 2 ? \"doubleCellWidth\" : \"cellWidth\"; %>\
	<% var midCols = (grid.numColumns() - 1 - ledeCols); %>\
	<% var imageClass = \"\"; %>\
	<% var orientation = \"horizontal\"; %>\
	<tr valign=\"top\">\
		<td class=\"ledes <%= ledeWidthClass %>\">\
			<ul class=\"blocks ledeSet\">\
				<% jQuery(items.slice(0,1)).each( function(i) { %> \
					<% var orientation = (this.imageWidth() > this.imageHeight()) ? \"horizontal\" : \"vertical\"; %>\
					<% var maxHeight = grid.cellHeight() * Math.floor(rows / 2);  %>\
					<% var maxWidth = (orientation == \"horizontal\") ? grid.cellWidth() * ledeCols : grid.cellWidth(); %>\
					<% var spanResized = new DisplayedImage(); %>\
					<% var shrunkenDimensions = spanResized.shrinkToFit({from: {x: this.imageWidth(), y: this.imageHeight()}, toWithin: {x: maxWidth, y: maxHeight}}); %>\
					<li class=\"story <%= ledeWidthClass %>\"> \
						<div class=\"container\">\
						<% if (orientation == \"vertical\") { %>\
							<% if (this.kicker()) { %>\
								<div class=\"kicker\"><%= this.kicker() %></div>\
							<% } %>\
							<div class=\"headline\"><a href=\"<%= this.link() %>\"><%= this.title() %></a></div>\
							<div class=\"byline\"><%= this.byline() %> </div>\
						<% } %>\
						<% if (this.spanImage()) { %>\
							<% if (orientation == \"vertical\") { imageClass = \"tallSpan\"; } %>\
							<div class=\"spanImage <%= imageClass %>\" style=\"margin: 0 auto; width:<%= pixels(shrunkenDimensions.x)  %>\">\
								<img src=\"<%= this.spanImage() %>\" width=\"<%= shrunkenDimensions.x %>\">\
								<div class=\"credit\"><%= this.credit() %></div>\
							</div>\
						<% } %>\
						<% if (orientation == \"horizontal\") { %>\
							<% if (this.kicker()) { %>\
								<div class=\"kicker\"><%= this.kicker() %></div>\
							<% } %>\
							<div class=\"headline\"><a href=\"<%= this.link() %>\"><%= this.title() %></a></div>\
							<div class=\"byline\"><%= this.byline() %> </div>\
						<% } %>\
						<div class=\"body\"><p><%= this.shortBody() %></p></div>\
						</div>\
					</li> \
				<% }); %>\
			</ul>\
		</td>\
		<% for (var i=0, len=midCols; i < len; i++) { %>\
		<td class=\"mids cellWidth\">\
			<ul class=\"blocks midSet cellWidth grid\" style=\"float: left;\">\
				<% jQuery(items.slice((1 + i * rows), (1 + (i * rows) + rows))).each( function() { %> \
					<li class=\"cellWidth cellHeight\"> \
						<div class=\"container fill\">\
							<div class=\"content\">\
							<% if (this.kicker()) { %>\
								<div class=\"kicker\"><%= this.kicker() %></div>\
							<% } %>\
							<div class=\"headline\"><a href=\"<%= this.link() %>\"><%= this.title() %></a></div>\
							<div class=\"byline\"><%= this.byline() %></div>\
							<% if (this.thumbnail()) { %>\
								<div class=\"thumbnail\">\
									<img height=\"60\" width=\"60\" src=\"<%= this.thumbnail() %>\">\
								</div>\
							<% } %>\
							<div class=\"summary\"><p><%= this.description() %></p></div>\
							</div>\
						</div>\
					</li> \
				<% }); %>\
			</ul>\
		</td>\
		<% } %>\
		<td class=\"ends\">\
			<ul class=\"blocks endSet\">\
				<% jQuery(items.slice(rows * midCols + 1)).each( function() { %> \
					<li> \
						<div class=\"container\">\
							<div class=\"headline\"><a href=\"<%= this.link() %>\"><%= this.kicker() ? this.kicker()+\" : \" : \"\" %><%= this.title() %></a></div>\
						</div>\
					</li> \
				<% }); %>\
			</ul>\
		</td>\
	</tr>\
</table>\
</div>\
\
\
"},
        
        blackout: {
            type: "tmpl",
            name: "Blackout",
            skin: "dark",
            description: "For the night owls.",
            touchsafe: "1",
            "css": ".thumbWrapper {height: 73px; width: 73px; overflow:hidden;}\
.thumbWrapper img {margin-right: -1px; margin-left: -1px; margin-top: -1px;}\
.blackout .story .container { border-bottom: 1px solid #777;}\
.blackout .story .content { border-right: 1px solid #555; }\
",
            template: "<div class=\"pageScrollContainer\">\
	<ul class=\"blocks grid blackout\">\
		<% $(items).each( function() { %> \
			<li> \
				<div class=\"container fill\">\
					<div class=\"content\">\
						<% if (this.kicker()) { %>\
							<div class=\"kicker\"><%= this.kicker() %></div>\
						<% } %>\
						<div class=\"headline\"><a href=\"<%= this.link() %>\"><%= this.title() %></a></div>\
						<div class=\"byline\"><%= this.byline() %></div>\
						<% if (this.thumbnail()) { %>\
							<div class=\"thumbWrapper\"><img src=\"<%= this.thumbnail() %>\" height=\"75\" width=\"75\" /></div>\
						<% } %>\
						<div class=\"summary\"><p><%= this.description() %></p></div>\
					</div>\
				</div>\
			</li> \
		<% }); %>\
	</ul>\
	<div class=\"pageContent pages\"></div>\
</div>\
",
            scripts: "StandardGrid"
        },
        
        stack: {
            type: "tmpl",
            name: "Stack",
            skin: "light",
            description: "Vertical Overdrive",
            touchsafe: "0",
            "css": ".pages {\
	display: none;\
}\
\
.stack .overlay {\
	position: absolute;\
	top: 0;\
	right: 0;\
	left: 0;\
	bottom: 0;\
	background: rgba(30, 30, 30, 0.7);\
	-webkit-transition: opacity .5s;\
	opacity: 0;\
	visibility: hidden;\
}\
\
.stories {\
	float: left;\
}\
\
.story {\
	margin-top: 20px;\
	padding-bottom: 20px;\
	border-bottom: 1px solid #999;\
}\
\
.story:first-child {\
	margin-top: 10px;\
}\
\
.overlay a,\
.headline a,\
.headline a:link {\
	display: block;\
	font-size: 24px;\
	line-height: 27px; \
	margin-bottom: 10px;\
}\
\
.body {\
	-webkit-column-width: 300px;\
	-moz-column-width: 300px;\
}\
\
.body p {\
	text-indent: 20px;\
	text-align: justify;\
}\
\
.body p:first-child {\
	text-indent: 0;\
}\
\
.container {\
	position: relative;\
}\
\
.container {\
	margin: 0;\
	width: 100%;\
	height: 100%;\
}\
\
.stack .container:hover .overlay {\
	visibility: visible;\
	opacity: 1;\
}\
\
.pageIndicators {\
	display: none;\
}\
\
\
.stack .spanImage { \
	text-align: center;\
}\
\
.stack .spanImage img {\
	-webkit-box-shadow: #222 0 0 8px;\
	float: none;\
}\
\
.readMore {\
	font-family: 'nyt-franklin-1', 'nyt-franklin-2', helvetica, arial, sans-serif;\
	text-align: right;\
	font-size: 12px;\
	color: #555;\
	cursor: pointer;\
}\
",
            template: "<div class=\"pageScroller\">\
<ul>\
	<% rowCounter = 1; %>\
	<% jQuery(items).each( function(index) { %> \
		<li class=\"story\">\
			<% var availableWidth = skimmer('grid').cellWidth() * skimmer('grid').numColumns() - 20; %>\
			<% var defaultWidth = this.imageWidth(); %>\
			<% var displayWidth = (defaultWidth > availableWidth) ? availableWidth : defaultWidth; %>\
			<div class=\"container\">\
				<% if (this.kicker()) { %>\
					<div class=\"kicker\"><%= this.kicker() %></div>\
				<% } %>\
				<div class=\"headline\"><a href=\"<%= this.link() %>\"><%= this.title() %></a></div>\
				<% if (this.spanImage()) { %>\
					<div class=\"spanImage\" style=\"width: <%= displayWidth %>px\">\
						<img src=\"<%= this.spanImage() %>\"  width=\"<%= displayWidth %>\">\
						<div class=\"credit\"><%= this.credit() %></div>\
					</div>\
				<% } %>\
				<div class=\"byline\"><%= this.byline() %></div>\
				<div class=\"body\"><%= this.shortBody() %></div>\
				<div class=\"readMore\">Read More &raquo;</div>\
			</div>\
		</li> \
	<% }); %>\
</ul>\
</div>\
"},
        
        slideshow: {
            type: "tmpl",
            name: "Slideshow",
            skin: "medium",
            description: "Get the big picture.",
            touchsafe: "1",
            "css": ".storyContent {\
	width: 200px;\
	margin: 0 auto;\
}\
\
.pages {\
	display: none;\
}\
\
.gallery .overlay {\
	position: absolute;\
	top: 0;\
	right: 0;\
	left: 0;\
	bottom: 0;\
	background: rgba(30, 30, 30, 0.7);\
	-webkit-transition: opacity .5s;\
	opacity: 0;\
	visibility: hidden;\
}\
\
.stories {\
	float: left;\
}\
\
.header {\
	margin-bottom: 20px;\
}\
\
.headline a,\
.headline a:link {\
	text-decoration: none; \
	font-size: 24px;\
	line-height: 27px; \
}\
\
.container {\
	position: relative;\
}\
\
.container {\
	margin: 0;\
	width: 100%;\
	height: 100%;\
}\
\
.gallery .container:hover .overlay {\
	visibility: visible;\
	opacity: 1;\
}\
\
.pages {\
	display: none;\
}\
\
.sectionPageScroller {\
	overflow: hidden;\
}\
\
.slideshow ul {\
	margin: 0;\
	padding: 0;\
	list-style: none;\
	-webkit-transition: margin-left 1s;\
}\
\
.slideshow .blocks .story {\
	padding: 0;\
	float: left;\
	cursor: pointer;\
}\
\
.story .container {\
	margin: 10px;\
}\
\
.headline {\
	padding-bottom: 10px;\
	margin-bottom: 0px;\
	margin-top: 20px;\
}\
\
.story .image {\
	margin: 0 auto;\
	position: relative;\
	overflow: hidden;\
}\
\
.image .credit {\
	margin: 3px 5px;\
}\
\
.image .caption {\
	margin: 5px 10px;\
}\
\
.story .header {\
	text-align: center;\
}\
\
.imageFooter {\
	position: absolute;\
	bottom: 0;\
	right: 0;\
	left: 0;\
	background-color: rgba(51, 51, 51, 0.8);\
	color: #eee;\
}\
\
.sectionHeader {\
	border-bottom: none;\
}\
",
            template: "<div class=\"pageScrollContainer slideshow\">\
	<div class=\"pageContent\">\
	<ul class=\"blocks\" style=\"width:<%= (skimmer(\"grid\").scrollerWidth() + 30) * items.length %>px\">\
	<% jQuery(items).each( function() { %> \
		<% if (this.jumboImage()) { %>\
		<% var cellWidth = skimmer(\"grid\").cellWidth() * skimmer(\"grid\").numColumns(); %>\
		<% var cellHeight = skimmer(\"grid\").cellHeight() * skimmer(\"grid\").numRows(); %>\
		<% var imageHeight = (this.imageHeight() > cellHeight) ? cellHeight - 100: this.jumboHeight(); %>\
		<% var imageWidth = (this.imageWidth() > cellWidth) ? cellWidth : this.jumboWidth(); %>\
		<li style=\"width:<%= cellWidth %>px\"> \
			<div class=\"container\">\
				<div class=\"header\">\
					<% if (this.kicker()) { %>\
						<span class=\"kicker\"><%= this.kicker() %>&nbsp;&bull;&nbsp;</span> \
					<% } %>\
					<span class=\"headline\">\
						<a href=\"<%= this.link() %>\"><%= this.title() %></a>\
					</span>\
					<% if (this.byline()) { %>\
						<span class=\"byline\">&nbsp;&bull;&nbsp;<%= this.byline() %></span>\
					<% } %>\
				</div>\
				<div class=\"image\" style=\"width:<%= imageWidth %>px; height:<%= imageHeight %>px\">\
					<img src=\"<%= this.spanImage() %>\" />\
					<div class=\"imageFooter\">\
						<div class=\"credit\"><%= this.credit() %></div>\
						<div class=\"caption\"><%= this.caption() %></div>\
					</div>\
				</div>\
			</div>\
		</li> \
		<% } %>\
	<% }); %>\
	</ul>\
	</div>\
</div>\
\
",
            scripts: function() {
                this.listen = function(message, data) {
                    switch (message) {
                        case "source loaded":
                        case "scheme loaded":
                        case "section updated":
                            var section = skimmer("currentSection");
                            if (!section || !section.data.dataArray)
                                return;
                            var total = section.layout.container.find(".slideshow li").length;
                            notify("page total updated", total);
                            break;
                        
                        case "left arrow":
                            skimmer("pagination").previousPage();
                            break;
                        
                        case "right arrow":
                            skimmer("pagination").nextPage();
                            break;
                        
                        case "section page changed":
                            var scroller = skimmer("currentSection").layout.container.find(".pageScrollContainer");
                            var pages = scroller.find(".pageContent");
                            var width = skimmer('grid').cellWidth() * skimmer('grid').numColumns();
                            var newOffset = data * width;
                            notify("page offset set", -newOffset);
                            break;
                    }
                };
            }
        },
        
        gallery: {
            type: "tmpl",
            name: "Gallery",
            skin: "medium",
            description: "For the night owls.",
            touchsafe: "0",
            "css": ".pages {\
	display: none;\
}\
\
.gallery .overlay {\
	position: absolute;\
	top: 0;\
	right: 0;\
	left: 0;\
	bottom: 0;\
	background: rgba(30, 30, 30, 0.7);\
	-webkit-transition: opacity .5s;\
	opacity: 0;\
	visibility: hidden;\
}\
\
.stories {\
	float: left;\
}\
\
.overlay a,\
.headline a,\
.headline a:link {\
	display: block;\
	margin: 10px;\
	text-decoration: none; \
	color: #eee;\
	font-weight: normal;\
	font-size: 24px;\
	line-height: 27px; \
}\
\
.container {\
	position: relative;\
}\
\
.container {\
	margin: 0;\
	width: 100%;\
	height: 100%;\
}\
\
.gallery .container:hover .overlay {\
	visibility: visible;\
	opacity: 1;\
}\
\
.pageIndicators {\
	display: none;\
}\
\
\
.gallery .spanImage { \
	text-align: center;\
}\
\
.gallery .spanImage img {\
	-webkit-box-shadow: #222 0 0 8px;\
	float: none;\
}\
",
            template: "<div class=\"pageScroller\">\
<table class=\"gallery blocks\">\
	<tr>\
	<% rowCounter = 1; %>\
	<% jQuery(items).each( function(index) { %> \
		<% if (this.spanImage()) { %>\
			<!--li class=\"story\" style=\"width:<%= skimmer('grid').cellWidth() %>px; height:<%= skimmer('grid').cellHeight() %>px\"--> \
			<td> \
				<div class=\"container\">\
					<div class=\"spanImage\">\
						<% if (this.spanIsTall()) { %>\
							<img src=\"<%= this.spanImage() %>\" style=\"margin: 0 auto;\"  height=\"<%= skimmer('grid').cellHeight() - 50 %>\">\
						<% } else { %>\
							<img src=\"<%= this.spanImage() %>\"  width=\"<%= ( skimmer('grid').cellWidth() - 20 ) %>\">\
						<% } %>\
						<div class=\"credit\"><%= this.credit() %></div>\
					</div>\
					<div class=\"overlay\">\
						<div class=\"headline\"><a href=\"<%= this.link() %>\"><%= this.title() %></a></div>\
					</div>\
				</div>\
			</td> \
			<% if (rowCounter == skimmer('grid').numColumns() ) { %>\
				</tr><tr>\
				<% rowCounter = 1; %>\
			<% } else { %>\
				<% rowCounter++; %>\
			<% } %>\
		<% } %>\
	<% }); %>\
	</tr>\
</table>\
</div>\
"},
        
        flow: {
            type: "tpml",
            name: "Flow",
            skin: "light",
            description: "Go with the flow",
            touchsafe: "0",
            "css": ".flow { font-size: 26px; font-family: Georgia, serif; background-color: white; padding: 10px; line-height: 2em; }\
.flow a:link { font-size: 26px; padding: 10px; color: #004276; text-decoration: none; font-weight: bold; }\
.flow span { color: #999; font-size: 18px; padding: 10px; border-right: 1px solid #ccc;}\
.flow img { float: none; }\
.pageIndicators {\
	display: none;\
}\
",
            template: "<div class=\"pageScroller flow blocks\">\
	<% $(items).each( function() { %> \
		<% if (this.thumbnail()) { %>\
			<img src=\"<%= this.thumbnail() %>\" height=\"30\" width=\"30\" />\
		<% } %>\
		<a href=\"<%= this.link() %>\" class=\"nyt-cheltenham-condensed-bold\"><%= this.title() %></a>\
		<span class=\"tk-nyt-cheltenham\"><%= this.description() %></span>\
	<% }); %>\
</div>\
"},
        
        priority: {
            type: "tmpl",
            skin: "light",
            name: "Priority",
            description: "Size matters",
            touchsafe: "0",
            "css": ".grid .story .container {\
	border-bottom: 1px solid #ccc;\
}\
\
.grid .container .content {\
	border-right: 1px solid #ddd;\
}\
\
#articleFooter {\
	border-top: 1px solid #ccc;\
}\
\
.pageIndicators {\
	display: none;\
}\
\
.shrinkWrap { background-color: #fbfaf9 }\
.pages {display: none;}\
.pageScroller { background: transparent }\
.blocks .story { background-color: transparent; border-bottom: 1px solid #ccc; clear: both; }\
.blocks .story .container { background-color: transparent; margin: 10px; }\
.thumbnail { float: right; }\
.story a { text-decoration: none; font-family: 'nyt-cheltenham-1', 'nyt-cheltenham-2', georgia, serif; clear:left;}\
.ledes { width: 40%; border-right: 1px solid #e2e2e2; } \
.ledes li a { font-size: 24px; } \
.mids { width: 35%; border-right: 1px solid #e2e2e2; } \
.ends { width: 25%; }\
.ends .story a {font-size: 12px; line-height: 15px; }\
#skimmerArticleViewer { background: #fbfaf9; }\
",
            template: "<div class=\"pageScroller\">\
<table cellspacing=\"0\" cellpadding=\"5\">\
	<tr valign=\"top\">\
		<td class=\"ledes\">\
			<ul class=\"blocks ledeSet\">\
				<% $(items.slice(0,5)).each( function(i) { %> \
					<li> \
						<div class=\"container\">\
							<% if (i == 0 && this.spanImage()) { %>\
								<% if (this.kicker()) { %>\
									<div class=\"kicker\"><%= this.kicker() %></div>\
								<% } %>\
								<div class=\"spanImage\">\
									<img src=\"<%= this.spanImage() %>\" width=\"400\">\
									<div class=\"credit\"><%= this.credit() %></div>\
								</div>\
								<div class=\"headline\"><a href=\"<%= this.link() %>\"><%= this.title() %></a></div>\
								<div class=\"byline\"><%= this.byline() %> </div>\
								<div class=\"summary\"><p><%= this.description() %></p></div>\
							<% } else { %> \
								<% if (this.kicker()) { %>\
									<div class=\"kicker\"><%= this.kicker() %></div>\
								<% } %>\
								<div class=\"headline\"><a href=\"<%= this.link() %>\"><%= this.title() %></a></div>\
								<% if (this.thumbnail()) { %>\
									<div class=\"thumbnail\"><img src=\"<%= this.thumbnail() %>\" height=\"60\" width=\"60\" /></div>\
								<% } %>\
								<div class=\"byline\"><%= this.byline() %> </div>\
								<div class=\"summary\"><p><%= this.description() %></p></div>\
								<div style=\"float: none; clear:both\"> </div>\
							<% } %>\
						</div>\
					</li> \
				<% }); %>\
			</ul>\
		</td>\
		<td class=\"mids\">\
			<ul class=\"blocks midSet\">\
				<% $(items.slice(5, 15)).each( function() { %> \
					<li> \
						<div class=\"container\">\
							<% if (this.kicker()) { %>\
								<div class=\"kicker\"><%= this.kicker() %></div>\
							<% } %>\
							<div class=\"headline\"><a href=\"<%= this.link() %>\"><%= this.title() %></a></div>\
							<div class=\"byline\"><%= this.byline() %></div>\
							<div class=\"summary\"><p><%= this.description() %></p></div>\
						</div>\
					</li> \
				<% }); %>\
			</ul>\
		</td>\
		<td class=\"ends\">\
			<ul class=\"blocks endSet\">\
				<% $(items.slice(15, 25)).each( function() { %> \
					<li> \
						<div class=\"container\">\
							<div class=\"headline\"><a href=\"<%= this.link() %>\"><%= this.title() %></a></div>\
						</div>\
					</li> \
				<% }); %>\
			</ul>\
		</td>\
	</tr>\
</table>\
</div>\
\
"},
        
        swiss: {
            type: "tmpl",
            name: "Swiss",
            skin: "light",
            description: "The Times. Period. Helvetica. Period.",
            touchsafe: "1",
            "css": ".grid .story .container {\
	border-bottom: 1px solid #ccc;\
}\
\
.grid .container .content {\
	border-right: 1px solid #ddd;\
}\
\
.swiss .headline,\
.swiss .summary p,\
.swiss .byline,\
.swiss .kicker {\
	font-family: 'helvetica', sans-serif !important;\
}\
",
            template: "<div class=\"pageScrollContainer\">\
	<ul class=\"blocks grid swiss\">\
		<% $(items).each( function() { %> \
			<li class=\"story\"> \
				<div class=\"container fill\">\
					<div class=\"content\">\
						<% if (this.kicker()) { %>\
							<div class=\"kicker\"><%= this.kicker() %></div>\
						<% } %>\
						<div class=\"headline\"><a href=\"<%= this.link() %>\"><%= this.title() %></a></div>\
						<% if (this.thumbnail()) { %>\
							<div class=\"thumbnail\">\
								<img src=\"<%= this.thumbnail() %>\" height=\"60\" width=\"60\" />\
							</div>\
						<% } %>\
						<% if (this.byline()) { %>\
							<div class=\"byline\"><%= this.byline() %></div>\
						<% } %>\
						<div class=\"summary\"><p><%= this.description() %></p></div>\
					</div>\
				</div>\
			</li> \
		<% }); %>\
	</ul>\
	<div class=\"pageContent pages\"></div>\
</div>\
",
            scripts: "StandardGrid"
        },
        
        lines: {
            type: "tmpl",
            name: "Lines",
            skin: "light",
            description: "Pack them in vertically",
            touchsafe: "0",
            "css": ".nytlogo {\
	background: url(/skimmer/images/nytlogo-white.png) no-repeat !important;\
}\
\
.customize {\
	background-image: url(/skimmer/images/customize-light.png) !important;\
}\
\
.shrinkWrap {\
	background-color: #777 !important;\
	-moz-box-shadow: 0px 0px 6px #999;\
	-webkit-box-shadow: 0px 0px 6px #999;\
	-webkit-border-radius: 10px;\
	-moz-border-radius: 10px;\
	-o-border-radius: 10px;\
	border-radius: 10px;\
	border: 1px solid transparent;\
}\
\
.sectionHeader {\
	border-bottom: none !important;\
}\
\
.sectionName {\
	color: #eee !important;\
}\
\
.grid .story .container {\
	border-bottom: 1px solid #ccc;\
}\
\
.grid .container .content {\
	border-right: 1px solid #ddd;\
}\
\
#articleFooter {\
	display: none;\
}\
\
#skimmerArticleViewer {\
	background: #fff;\
}\
\
#frameContainer {\
	border-top: 1px solid #ccc;\
}\
\
#sidebar dd { background-color: #edecec}\
\
.pages {\
	display: none;\
}\
\
.sectionFooter {\
	border-top: none !important;\
}\
\
.pageScroller { \
	background: transparent;\
	left: 0;\
	right: 0;\
	bottom: 10px;\
	margin-top: 1px solid #999;\
	background: #fbfaf9;\
}\
\
.pageIndicators {\
	display: none;\
}\
\
.lines .story { \
	display: block;\
	clear: both; \
	float: none; \
	position: relative; \
	height: 32px;\
	overflow: hidden; \
	font-family: helvetica, arial, sans-serif;\
}\
\
.story a {\
	font-size: 15px;\
	color: #555;\
}\
\
.byline,\
.summary {\
	font-size: 13px;\
}\
\
.lines .story .container { \
	border-bottom: 1px solid #ddd;\
	padding: 6px 12px 12px;\
	overflow: hidden;\
	height: 13px;\
	line-height: 20px; \
} \
\
.lines .story .container span { color: #bbb; }\
\
.lines .story a { \
	text-decoration: none; color: #444;\
}\
",
            template: "<div class=\"pageScroller\">\
<ul class=\"blocks lines\">\
	<% $(items).each( function() { %> \
		<li> \
			<div class=\"container fill\">\
				<a href=\"<%= this.link() %>\"><%= this.title() %></a>\
				<span class=\"byline\"> &nbsp;&bull;&nbsp; <%= this.byline() %> &nbsp;&bull;&nbsp; </span>\
				<span class=\"summary\"><%= this.summary() %></span>\
			</div>\
		</li> \
	<% }); %>\
</ul>\
</div>\
\
"}
    }});
