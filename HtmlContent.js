"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var markElements_1 = require("../utils/markElements");
var mobx_react_1 = require("mobx-react");
var React = require("react");
var HtmlContent = /** @class */ (function (_super) {
    tslib_1.__extends(HtmlContent, _super);
    function HtmlContent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.executedContentHandlers = [];
        _this.onMouseUp = function (ev) {
            for (var _i = 0, _a = _this.props.mouseUpHandlerList; _i < _a.length; _i++) {
                var mouseUpHandler = _a[_i];
                mouseUpHandler.handler(ev, _this.htmlContentRef, _this.props.item);
            }
        };
        return _this;
    }
    HtmlContent.prototype.execute = function () {
        var _this = this;
        this.updateRemovedHandlersIfNecessary();
        this.props.contentHandlerKeys.forEach(function (key) {
            var contentHandler = _this.props.contentHandlerDictionary[key];
            if (!contentHandler) {
                // If handler doesn't exist in contentHandlerDictionary, simply return.
                return;
            }
            var isUndoMode = !!(_this.props.isUndoModeDictionary && _this.props.isUndoModeDictionary[key]);
            var contentHandlerIndex = _this.getExecutedContentHandlerIndex(key);
            if (contentHandlerIndex < 0) {
                // This is the case for new handlers.
                var matchedElements = null;
                if (!isUndoMode) {
                    // Do not call handleContent if handler is undo mode.
                    matchedElements = _this.handleContent(contentHandler);
                    if (!contentHandler.undoHandler) {
                        // Only cache matched elements when undoHandler exists,
                        // since we only cache for undo operation.
                        matchedElements = null;
                    }
                }
                var newlyExecutedContentHandler = {
                    key: key,
                    isUndoMode: isUndoMode,
                    matchedElements: matchedElements,
                    undoHandler: contentHandler.undoHandler,
                };
                _this.executedContentHandlers.push(newlyExecutedContentHandler);
            }
            else {
                // This is the case for existing handlers.
                var executedContentHandler = _this.executedContentHandlers[contentHandlerIndex];
                if (executedContentHandler.isUndoMode != isUndoMode) {
                    // This is the case where executed handlers now need to undo/redo
                    if (isUndoMode) {
                        // Handler needs to undo
                        _this.undoHandleContent(executedContentHandler);
                        // Clear matched elements for this contentHandler
                        executedContentHandler.matchedElements = null;
                    }
                    else {
                        // Handler has been undone before, now re-apply
                        var matchedElements = _this.handleContent(contentHandler);
                        // Update matched elements for this contentHandler
                        executedContentHandler.matchedElements = matchedElements;
                    }
                    executedContentHandler.isUndoMode = isUndoMode;
                }
            }
        });
    };
    HtmlContent.prototype.getExecutedContentHandlerIndex = function (key) {
        for (var index = 0; index < this.executedContentHandlers.length; index++) {
            if (this.executedContentHandlers[index].key == key) {
                return index;
            }
        }
        return -1;
    };
    HtmlContent.prototype.handleContent = function (contentHandler) {
        var _this = this;
        var matchedElements = [];
        if (contentHandler.cssSelector) {
            var matchedCssElements = this.htmlContentRef.querySelectorAll(contentHandler.cssSelector);
            for (var i = 0; i < matchedCssElements.length; i++) {
                var matchedElement = matchedCssElements.item(i);
                if (contentHandler.handler) {
                    contentHandler.handler({
                        element: matchedElement,
                        item: this.props.item,
                        keyword: contentHandler.cssSelector,
                        mailboxInfo: this.props.mailboxInfo,
                    });
                }
                matchedElements.push(matchedElement);
            }
        }
        if (contentHandler.keywords) {
            markElements_1.default(this.htmlContentRef, contentHandler.keywords, function (keyword) { return function (matchedElement) {
                contentHandler.handler({
                    element: matchedElement,
                    item: _this.props.item,
                    keyword: keyword,
                    mailboxInfo: _this.props.mailboxInfo,
                });
                matchedElements.push(matchedElement);
            }; }, contentHandler.useRegExp);
        }
        if (!contentHandler.keywords && !contentHandler.cssSelector) {
            contentHandler.handler({
                element: this.htmlContentRef,
                item: this.props.item,
                keyword: '',
                mailboxInfo: this.props.mailboxInfo,
            });
        }
        if (contentHandler.doneHandlingMatchedElements) {
            contentHandler.doneHandlingMatchedElements(matchedElements);
        }
        return matchedElements;
    };
    HtmlContent.prototype.undoHandleContent = function (executedContentHandler) {
        if (!executedContentHandler.undoHandler ||
            !executedContentHandler.matchedElements ||
            executedContentHandler.matchedElements.length == 0) {
            // If no undo handler exists or no matched elements from previous handleContent, return.
            return;
        }
        executedContentHandler.undoHandler(executedContentHandler.matchedElements);
    };
    HtmlContent.prototype.updateRemovedHandlersIfNecessary = function () {
        for (var i = this.executedContentHandlers.length - 1; i >= 0; i--) {
            var executedContentHandler = this.executedContentHandlers[i];
            if (this.props.contentHandlerKeys.indexOf(executedContentHandler.key) < 0) {
                // This is the case where an existing contentHandler has been removed
                // Remove it from executedContentHandlers as well
                this.undoHandleContent(executedContentHandler);
                this.executedContentHandlers.splice(i, 1);
            }
        }
    };
    HtmlContent.prototype.updateWidth = function (setHtmlContentWidth) {
        if (this.htmlContentRef) {
            setHtmlContentWidth(this.htmlContentRef.clientWidth);
        }
        else {
            setHtmlContentWidth(0);
        }
    };
    HtmlContent.prototype.componentDidMount = function () {
        if (this.props.setHtmlContentWidth) {
            this.updateWidth(this.props.setHtmlContentWidth);
        }
        this.execute();
        this.htmlContentRef.addEventListener('mouseup', this.onMouseUp);
    };
    HtmlContent.prototype.componentDidUpdate = function () {
        this.execute();
    };
    HtmlContent.prototype.componentWillUnmount = function () {
        var _this = this;
        this.htmlContentRef.removeEventListener('mouseup', this.onMouseUp);
        this.executedContentHandlers.forEach(function (executedContentHandler) {
            _this.undoHandleContent(executedContentHandler);
        });
    };
    HtmlContent.prototype.componentWillReceiveProps = function (nextProps) {
        var _this = this;
        if (this.props.html != nextProps.html) {
            // Clear executedContentHandlers and re-execute from scratch if html changes.
            this.executedContentHandlers.forEach(function (executedContentHandler) {
                _this.undoHandleContent(executedContentHandler);
            });
            this.executedContentHandlers = [];
        }
    };
    HtmlContent.prototype.render = function () {
        var _this = this;
        /* tslint:disable:react-no-dangerous-html */
        return (React.createElement("div", { ref: function (ref) { return (_this.htmlContentRef = ref); }, dangerouslySetInnerHTML: { __html: this.props.html } }));
        /* tslint:enable:react-no-dangerous-html */
    };
    HtmlContent = tslib_1.__decorate([
        mobx_react_1.observer
    ], HtmlContent);
    return HtmlContent;
}(React.Component));
exports.default = HtmlContent;
//# sourceMappingURL=HtmlContent.js.map


//////////////////
// WEBPACK FOOTER
// ./obj/controls/owa-content-handler/lib/components/HtmlContent.js
// module id = 6387
// module chunks = 4