"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var MailListItemIconBar_1 = require("./MailListItemIconBar");
var MailListItemRichPreviewWell_1 = require("./MailListItemRichPreviewWell");
var MailListItemTwistyButton_1 = require("./MailListItemTwistyButton");
var mobx_1 = require("mobx");
var mobx_react_1 = require("mobx-react");
var Check_1 = require("office-ui-fabric-react/lib/components/Check");
var Persona_1 = require("office-ui-fabric-react/lib/Persona");
var Tooltip_1 = require("office-ui-fabric-react/lib/Tooltip");
var Draggable_1 = require("owa-dnd/lib/components/Draggable");
var DraggableItemTypes_1 = require("owa-dnd/lib/utils/DraggableItemTypes");
var owa_highlight_1 = require("owa-highlight");
var owa_mail_category_view_1 = require("owa-mail-category-view");
var owa_mail_feature_flags_1 = require("owa-mail-feature-flags");
var owa_mail_focus_manager_1 = require("owa-mail-focus-manager");
var itemContextMenuActions_1 = require("owa-mail-list-actions/lib/actions/itemContextMenuActions");
var onMailListItemClickHandler_1 = require("../utils/onMailListItemClickHandler");
var Store_1 = require("owa-mail-list-store/lib/store/Store");
var getInstrumentationContextsFromTableView_1 = require("owa-mail-list-store/lib/utils/getInstrumentationContextsFromTableView");
var owa_mail_list_view_1 = require("owa-mail-list-view");
var MailListItemSelectionSource_1 = require("owa-mail-store/lib/store/schema/MailListItemSelectionSource");
var owa_mail_store_actions_1 = require("owa-mail-store-actions");
var PersonaControl_1 = require("owa-persona/lib/components/PersonaControl");
var owa_positioning_1 = require("owa-positioning");
var owa_mail_strings_1 = require("owa-strings/owa-mail-strings");
var React = require("react");
var mailListDragUtil_1 = require("../utils/mailListDragUtil");
var styles = require('./MailListItem.scss');
var classNames = require('classnames/bind').bind(styles);
// Mobx does not support as of 8/29/2016 @computed in React components,
// because it needs to be part of a view model class. This is our
// workaround in order to use computed properties.
//
// Remark: A note about when to use computed states. We should be using computed states when we need to check a table
// property that could change based on the state of some other row in the table changing. For example, if we need to access
// tableView.selectedRowKeys, which changes when selecting any row in the table. We then don't want every row in the table to re-render
// as a result, which is why access to these types of properties must go through computed state. For normal table properties,
// just add them to MailListTableProps to be passed in.
var MailListItemComputedState = /** @class */ (function () {
    function MailListItemComputedState(mailListItemDataProps, mailListTableProps) {
        this.mailListItemDataProps = mailListItemDataProps;
        this.mailListTableProps = mailListTableProps;
    }
    Object.defineProperty(MailListItemComputedState.prototype, "isChecked", {
        get: function () {
            var tableView = Store_1.default.tableViews.get(this.mailListTableProps.tableViewId);
            if (!tableView) {
                return false;
            }
            if (tableView.isInVirtualSelectAllMode) {
                if (tableView.virutalSelectAllExclusionList.indexOf(this.mailListItemDataProps.rowKey) >
                    -1) {
                    return false;
                }
                if (tableView.selectAllModeTimeStamp) {
                    return (new Date(this.mailListItemDataProps.lastDeliveryTimestamp).getTime() <
                        tableView.selectAllModeTimeStamp.getTime());
                }
                return true;
            }
            return (tableView.isInCheckedMode &&
                tableView.selectedRowKeys.has(this.mailListItemDataProps.rowKey));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MailListItemComputedState.prototype, "showHoverActions", {
        get: function () {
            var tableView = Store_1.default.tableViews.get(this.mailListTableProps.tableViewId);
            if (!tableView) {
                return false;
            }
            return ((tableView.selectedRowKeys.size == 1 && tableView.isInCheckedMode) ||
                (tableView.selectedRowKeys.size <= 1 && !tableView.isInVirtualSelectAllMode));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MailListItemComputedState.prototype, "isSingleItemSelected", {
        get: function () {
            var tableView = Store_1.default.tableViews.get(this.mailListTableProps.tableViewId);
            if (!tableView) {
                return false;
            }
            return tableView.selectedRowKeys.size == 1;
        },
        enumerable: true,
        configurable: true
    });
    tslib_1.__decorate([
        mobx_1.computed
    ], MailListItemComputedState.prototype, "isChecked", null);
    tslib_1.__decorate([
        mobx_1.computed
    ], MailListItemComputedState.prototype, "showHoverActions", null);
    tslib_1.__decorate([
        mobx_1.computed
    ], MailListItemComputedState.prototype, "isSingleItemSelected", null);
    return MailListItemComputedState;
}());
var MailListItem = /** @class */ (function (_super) {
    tslib_1.__extends(MailListItem, _super);
    function MailListItem(props) {
        var _this = _super.call(this, props) || this;
        _this.trySetFocus = function () {
            if (_this.listViewItem &&
                _this.props.mailListItemDataProps.isSelected &&
                _this.computedState.isSingleItemSelected) {
                // Focus on self if ref exists and the item is selected and focus is in mail list already
                // We need state checks here because this is being called async on requestAnimationFrame,
                // but we should not check if focus is in listview because the selected row may have been deleted at this point
                _this.listViewItem.focus();
                _this.listViewItem.setAttribute('tabindex', owa_mail_focus_manager_1.tabIndex.sequentialIndex);
                // Reset listview content tabindex such that listview is
                // not in a sequential keyboard navigation anymore once an item selected
                _this.props.resetListViewContentTabIndex();
            }
        };
        _this.resetTabIndex = function () {
            if (_this.listViewItem && !_this.props.mailListItemDataProps.isSelected) {
                // Clear tab index on item when it's no longer selected
                // We need state checks here because this is being called async on requestAnimationFrame
                _this.listViewItem.setAttribute('tabindex', owa_mail_focus_manager_1.tabIndex.nonSequentialIndex.toString());
            }
        };
        /**
         * The onContextMenu event handler which opens the context menu
         * @param evt the mouse event
         */
        _this.onItemContextMenu = function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var tableView = Store_1.default.tableViews.get(_this.props.mailListTableProps.tableViewId);
            var selectedRows = tableView.selectedRowKeys;
            // Select the row upon right click if
            // - user is not in selectAll mode
            // - and the row that clicked on is not selected yet
            if (!tableView.isInVirtualSelectAllMode &&
                (!selectedRows || !selectedRows.has(_this.props.mailListItemDataProps.rowKey))) {
                onMailListItemClickHandler_1.default(evt, MailListItemSelectionSource_1.default.MailListItemContextMenu, _this.props.mailListItemDataProps.rowKey, _this.props.mailListTableProps.tableViewId);
            }
            itemContextMenuActions_1.showMailItemContextMenu(owa_positioning_1.getAnchorForContextMenu(evt));
        };
        _this.highLightTerms = function (element) {
            owa_highlight_1.highlightTermsInHtmlElement(element, _this.props.mailListTableProps.highlightTerms);
        };
        _this.renderTimestamp = function (isUnread) {
            return (React.createElement("span", { className: !_this.props.mailListTableProps.isSingleLine && isUnread
                    ? styles.timestampUnread
                    : styles.timestamp }, owa_mail_store_actions_1.getFormattedDate(_this.props.mailListItemDataProps.lastDeliveryTimestamp)));
        };
        _this.renderCategories = function (categories, categoryWellContainerClass) {
            return (React.createElement(owa_mail_category_view_1.CategoryWell, { categoryWellContainerClass: categoryWellContainerClass, categoryContainerClass: styles.categoryContainer, categories: categories }));
        };
        _this.updateFocusOnSelectionChange = function (isSelected) {
            if (_this.lastIsSelected != isSelected &&
                _this.computedState.isSingleItemSelected &&
                _this.props.isFocusInMailList()) {
                if (isSelected) {
                    window.requestAnimationFrame(_this.trySetFocus);
                }
                else if (_this.lastIsSelected != undefined) {
                    // Only need to clear tab index if an item goes from selected to unselected
                    window.requestAnimationFrame(_this.resetTabIndex);
                }
            }
            _this.lastIsSelected = isSelected;
        };
        _this.setListViewItemRef = function (ref) {
            _this.listViewItem = ref;
        };
        // In checked mode we have the parent container be draggable
        _this.canDrag = function () {
            var tableView = Store_1.default.tableViews.get(_this.props.mailListTableProps.tableViewId);
            return (!tableView.selectedRowKeys.has(_this.props.mailListItemDataProps.rowKey) &&
                !tableView.isInVirtualSelectAllMode);
        };
        _this.getDragData = function () {
            var itemProps = _this.props.mailListItemDataProps;
            var tableView = Store_1.default.tableViews.get(_this.props.mailListTableProps.tableViewId);
            return {
                itemType: DraggableItemTypes_1.DraggableItemTypes.MailListRow,
                rowKeys: [_this.props.mailListItemDataProps.rowKey],
                tableViewId: _this.props.mailListTableProps.tableViewId,
                tableListViewType: tableView.tableQuery.listViewType,
                subjects: [itemProps.subject ? itemProps.subject : owa_mail_strings_1.default.noSubject],
                latestItemIds: [itemProps.latestItemId],
            };
        };
        _this.initializeMailListComputedState(props);
        return _this;
    }
    MailListItem.prototype.renderUnreadCount = function (unreadCount) {
        var unreadCountClasses = classNames(styles.unreadCount, styles.flex00Auto);
        return unreadCount > 1 && React.createElement("span", { className: unreadCountClasses },
            "(",
            unreadCount,
            ")");
    };
    MailListItem.prototype.componentWillReceiveProps = function (nextProps) {
        //** In case if the same row appears in differnet folder, react might reuse the component (DOM)
        // as the key that we are giving to the MailListItem component during creation is the row id.
        // When this happens the computed state may not get re-initialized an, if the computed state was only initialized in the constructor.
        // Hence we re-initialize the computed state in componentWillReceiveProps as well so that everytime the props change computed state is updated */
        if (this.props.mailListItemDataProps.rowKey != nextProps.mailListItemDataProps.rowKey ||
            this.props.mailListTableProps.tableViewId != nextProps.mailListTableProps.tableViewId) {
            this.initializeMailListComputedState(nextProps);
        }
    };
    MailListItem.prototype.initializeMailListComputedState = function (props) {
        this.computedState = new MailListItemComputedState(props.mailListItemDataProps, props.mailListTableProps);
    };
    MailListItem.prototype.renderFirstLineText = function (firstLineText, firstLineTooltipText, shouldShowDraftsIndicator, isUnread) {
        // For drafts we always prepend the placeholder [Drafts]{space}
        var draftsPlaceHolderText = owa_mail_strings_1.default.draftSenderPersonaPlaceholder + ' ';
        var firstLineTextClasses = classNames(isUnread ? styles.firstLineTextUnread : styles.firstLineTextRead);
        return (React.createElement("div", { className: firstLineTextClasses },
            shouldShowDraftsIndicator && (React.createElement("span", { className: styles.draftText }, draftsPlaceHolderText)),
            this.renderLineText(firstLineText, firstLineTooltipText)));
    };
    MailListItem.prototype.renderSecondLineText = function (secondLineText, secondLineTooltipText) {
        return this.renderLineText(secondLineText, secondLineTooltipText);
    };
    MailListItem.prototype.renderLineText = function (text, tooltipText) {
        return tooltipText ? (React.createElement(Tooltip_1.TooltipHost, { content: tooltipText, calloutProps: { gapSpace: 0 }, directionalHint: 0 /* topLeftEdge */ },
            React.createElement("span", { ref: this.highLightTerms }, text))) : (React.createElement("span", { ref: this.highLightTerms }, text));
    };
    MailListItem.prototype.renderPreviewDisplay = function (previewDisplay) {
        return React.createElement("span", { ref: this.highLightTerms }, previewDisplay);
    };
    MailListItem.prototype.renderRichPreviewsWell = function () {
        var itemProps = this.props.mailListItemDataProps;
        var tableProps = this.props.mailListTableProps;
        var tableView = Store_1.default.tableViews.get(tableProps.tableViewId);
        var instrumentationContexts = getInstrumentationContextsFromTableView_1.default([itemProps.rowKey], tableView);
        return (React.createElement(MailListItemRichPreviewWell_1.default, { isWideView: tableProps.isSingleLine, conversationId: itemProps.rowId, isSelected: itemProps.isSelected, instrumentationContext: instrumentationContexts[0], onPreviewClick: function (evt) {
                return onMailListItemClickHandler_1.default(evt, MailListItemSelectionSource_1.default.MailListItemRichPreview, itemProps.rowKey, tableProps.tableViewId);
            } }));
    };
    MailListItem.prototype.renderPersonaCheckbox = function (isSelected, lastSender) {
        var _this = this;
        var personaCheckboxContainerClasses = classNames(styles.personaCheckboxContainer, !this.props.mailListTableProps.isSingleLine && 'personaMarginThreeColumn');
        var personaCheckboxClasses = classNames(styles.personaCheckbox, (isSelected || this.props.mailListTableProps.isAnyChecked) && styles.showCheckbox // Otherwise show persona
        );
        var checkboxClasses = classNames(styles.checkbox, this.computedState.isChecked && styles.checkboxChecked);
        // lastSender is undefined in rowModified notification payload, if the message is directly POSTed
        var lastSenderMailbox = lastSender ? lastSender.Mailbox : null;
        return (React.createElement("div", { className: personaCheckboxContainerClasses },
            React.createElement("div", { className: personaCheckboxClasses },
                React.createElement("div", { className: styles.persona }, this.props.mailListTableProps.showCirclePersonas &&
                    lastSenderMailbox !== null && (React.createElement(PersonaControl_1.default, { name: lastSenderMailbox.Name, emailAddress: lastSenderMailbox.EmailAddress, size: Persona_1.PersonaSize.size28 }))),
                React.createElement("div", { className: checkboxClasses, onClick: function (evt) {
                        onMailListItemClickHandler_1.default(evt, MailListItemSelectionSource_1.default.MailListItemCheckbox, _this.props.mailListItemDataProps.rowKey, _this.props.mailListTableProps.tableViewId);
                    } },
                    React.createElement(Check_1.Check, { checked: this.computedState.isChecked })))));
    };
    MailListItem.prototype.renderTwisty = function (isExpanded, itemCount) {
        var _this = this;
        var hideTwisty = itemCount === 1;
        var isSingleLine = this.props.mailListTableProps.isSingleLine;
        var twistyClasses = classNames(isSingleLine ? styles.twistySingleLine : styles.twistyThreeColumn, hideTwisty && isSingleLine && 'visibilityHidden', hideTwisty && !isSingleLine && 'displayNone');
        return (React.createElement(MailListItemTwistyButton_1.default, { className: twistyClasses, isExpanded: isExpanded, onClick: function (evt) {
                onMailListItemClickHandler_1.default(evt, MailListItemSelectionSource_1.default.MailListItemTwisty, _this.props.mailListItemDataProps.rowKey, _this.props.mailListTableProps.tableViewId);
            } }));
    };
    MailListItem.prototype.renderIconBar = function () {
        return (React.createElement(MailListItemIconBar_1.default, { mailListItemDataProps: this.props.mailListItemDataProps, mailListTableProps: this.props.mailListTableProps, backgroundColorClassName: this.backgroundColorClass }));
    };
    // Single line view mail list item structure. Everything is done via flexbox.
    //  Outer Container
    // ---------------------------------------------------------------------------------------------------
    // |  Single Line View Container                                                                     |
    // |  ---------------------------------------------------------------------------------------------  |
    // |  | First Row                                                                                 |  |
    // |  | ------------------------------------------   -------------------------------------------  |  |
    // |  | | First Column                           |   | Second Column                           |  |  |
    // |  | |                                        |   |                                         |  |  |
    // |  | |                                        |   |                                         |  |  |
    // |  | |                                        |   |                                         |  |  |
    // |  | ------------------------------------------   -------------------------------------------  |  |
    // |  ---------------------------------------------------------------------------------------------  |
    // |                                                 ----------------------------------------------  |
    // |                                                 | Attachment Previews Row                    |  |
    // |                                                 |                                            |  |
    // |                                                 ----------------------------------------------  |
    // ---------------------------------------------------------------------------------------------------
    MailListItem.prototype.renderSingleLineViewMailListItem = function () {
        var itemProps = this.props.mailListItemDataProps;
        var isUnread = itemProps.unreadCount > 0;
        var subjectClasses = classNames(isUnread ? styles.subjectUnread : styles.subject);
        return (React.createElement("div", { className: styles.singleLineViewContainer },
            React.createElement("div", { className: styles.firstRow },
                React.createElement("div", { className: styles.firstColumn },
                    this.renderTwisty(itemProps.isExpanded, itemProps.itemCount),
                    this.renderPersonaCheckbox(itemProps.isSelected, itemProps.lastSender),
                    this.renderFirstLineText(itemProps.firstLineText, itemProps.firstLineTooltipText, itemProps.showDraftsIndicator, isUnread),
                    this.props.mailListTableProps.supportsHoverIcons && this.renderIconBar()),
                React.createElement("div", { className: styles.secondColumn },
                    React.createElement("div", { className: styles.content },
                        React.createElement("div", { className: subjectClasses },
                            this.renderSecondLineText(itemProps.secondLineText, itemProps.secondLineTooltipText),
                            this.renderUnreadCount(itemProps.unreadCount)),
                        this.props.mailListTableProps.showPreviewText && (React.createElement("div", { className: styles.previewDisplaySingleLine }, this.renderPreviewDisplay(itemProps.thirdLineText)))),
                    this.props.mailListTableProps.showCategories &&
                        itemProps.categories &&
                        this.renderCategories(itemProps.categories, styles.categoryWellSingleLine),
                    this.renderTimestamp(isUnread))),
            itemProps.showAttachmentPreview && this.renderRichPreviewsWell()));
    };
    // Three column structure. Everything is done via flexbox.
    //  Outer Container
    // -------------------------------------------------------------------------
    // |  Three Column View Container                                          |
    // |  ----------------  -------------------------------------------------  |
    // |  | First Column |  |  Second Column                                |  |
    // |  |              |  |  -------------------------------------------  |  |
    // |  |              |  |  | First Row                               |  |  |
    // |  |              |  |  |                                         |  |  |
    // |  |              |  |  -------------------------------------------  |  |
    // |  |              |  |                                               |  |
    // |  |              |  |  -------------------------------------------  |  |
    // |  |              |  |  | Second Row                              |  |  |
    // |  |              |  |  |                                         |  |  |
    // |  |              |  |  -------------------------------------------  |  |
    // |  |              |  |                                               |  |
    // |  |              |  |  -------------------------------------------  |  |
    // |  |              |  |  | Third Row (if not disabled)             |  |  |
    // |  |              |  |  |                                         |  |  |
    // |  |              |  |  -------------------------------------------  |  |
    // |  |              |  |                                               |  |
    // |  |              |  |  -------------------------------------------  |  |
    // |  |              |  |  | Inline Previews                         |  |  |
    // |  |              |  |  |                                         |  |  |
    // |  |              |  |  -------------------------------------------  |  |
    // |  ----------------  -------------------------------------------------  |
    // -------------------------------------------------------------------------
    MailListItem.prototype.renderThreeColumnViewMailListItem = function () {
        var itemProps = this.props.mailListItemDataProps;
        var tableProps = this.props.mailListTableProps;
        var isUnread = itemProps.unreadCount > 0;
        return (React.createElement("div", { className: styles.threeColumnViewContainer },
            React.createElement("div", { className: styles.firstColumnThreeColumn }, this.renderPersonaCheckbox(itemProps.isSelected, itemProps.lastSender)),
            React.createElement("div", { className: styles.column },
                React.createElement("div", { className: isUnread ? styles.firstRowThreeColumnUnread : styles.firstRowThreeColumn },
                    this.renderFirstLineText(itemProps.firstLineText, itemProps.firstLineTooltipText, itemProps.showDraftsIndicator, isUnread),
                    tableProps.supportsHoverIcons && this.renderIconBar()),
                React.createElement("div", { className: isUnread
                        ? styles.secondRowThreeColumnUnread
                        : styles.secondRowThreeColumn },
                    this.renderTwisty(itemProps.isExpanded, itemProps.itemCount),
                    React.createElement("div", { className: styles.secondLineTextThreeColumn }, this.renderSecondLineText(itemProps.secondLineText, itemProps.secondLineTooltipText)),
                    this.renderUnreadCount(itemProps.unreadCount),
                    this.renderTimestamp(isUnread)),
                tableProps.showPreviewText && (React.createElement("div", { className: styles.previewDisplayThreeColumn }, this.renderPreviewDisplay(itemProps.thirdLineText))),
                this.props.mailListTableProps.showCategories &&
                    itemProps.categories &&
                    this.renderCategories(itemProps.categories, styles.categoryWellThreeColumn),
                itemProps.showAttachmentPreview && this.renderRichPreviewsWell())));
    };
    MailListItem.prototype.render = function () {
        // Run focus related logic if selection changes
        var _a = this.props, mailListItemDataProps = _a.mailListItemDataProps, mailListTableProps = _a.mailListTableProps;
        this.updateFocusOnSelectionChange(mailListItemDataProps.isSelected);
        this.backgroundColorClass = this.calculateBackgroundColorClass();
        var shouldBackgroundChangeOnHover = !mailListItemDataProps.isSelected && !this.computedState.isChecked;
        // Outer container CSS classes that are shared between 3 column and single line views
        var mailListItemOuterContainerClasses = classNames(styles.mailListItem, this.backgroundColorClass, shouldBackgroundChangeOnHover && styles.backgroundChangeOnHover, this.computedState.showHoverActions && styles.showHoverActionsOnHover, mailListItemDataProps.unreadCount > 0 && styles.unreadMailListItem);
        var mailListItem = (React.createElement("div", { className: mailListItemOuterContainerClasses, onClick: function (evt) {
                onMailListItemClickHandler_1.default(evt, MailListItemSelectionSource_1.default.MailListItemBody, mailListItemDataProps.rowKey, mailListTableProps.tableViewId);
            }, onDoubleClick: function (evt) {
                owa_mail_feature_flags_1.isMailFeatureEnabled('rp-tabView') &&
                    onMailListItemClickHandler_1.default(evt, MailListItemSelectionSource_1.default.MailListItemBodyDoubleClick, mailListItemDataProps.rowKey, mailListTableProps.tableViewId);
            }, onContextMenu: this.onItemContextMenu, tabIndex: -1 }, mailListTableProps.isSingleLine
            ? this.renderSingleLineViewMailListItem()
            : this.renderThreeColumnViewMailListItem()));
        return (React.createElement("div", { ref: this.setListViewItemRef, tabIndex: -1, className: styles.mailListItemContainer, role: "option" },
            React.createElement(Draggable_1.default, { canDrag: this.canDrag, getDragData: this.getDragData, getDragPreview: mailListDragUtil_1.getDragPreview, xOffset: mailListDragUtil_1.MAIL_ITEM_DRAG_XOFFSET, yOffset: mailListDragUtil_1.MAIL_ITEM_DRAG_YOFFSET }, mailListItem),
            mailListItemDataProps.isExpanded && (React.createElement(owa_mail_list_view_1.MailListItemExpansion, { conversationId: mailListItemDataProps.rowId, isSingleLine: mailListTableProps.isSingleLine, tableViewId: mailListTableProps.tableViewId }))));
    };
    /**
     * Calculates and returns the background color css for this mail list item
     */
    MailListItem.prototype.calculateBackgroundColorClass = function () {
        var itemProps = this.props.mailListItemDataProps;
        var tableProps = this.props.mailListTableProps;
        if (itemProps.isSelected || this.computedState.isChecked) {
            return styles.selectedMailListItemColor;
        }
        else if (tableProps.supportsFlagging && itemProps.isFlagged) {
            return styles.flaggedMailListItemColor;
        }
        else if (tableProps.supportsPinning && itemProps.isPinned) {
            return styles.pinnedMailListItemColor;
        }
        else {
            return styles.regularMailListItemColor;
        }
    };
    MailListItem = tslib_1.__decorate([
        mobx_react_1.observer
    ], MailListItem);
    return MailListItem;
}(React.Component));
exports.default = MailListItem;
//# sourceMappingURL=MailListItem.js.map


//////////////////
// WEBPACK FOOTER
// ./obj/mail/view/owa-mail-list-view/lib/components/MailListItem.js
// module id = 2410
// module chunks = 112