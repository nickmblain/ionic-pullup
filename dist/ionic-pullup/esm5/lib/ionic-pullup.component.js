/*
ionic-pullup v4 for Ionic 4 and Angular 8

Copyright 2020 Ariel Faur (https://github.com/arielfaur)
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import { ChangeDetectionStrategy, Component, EventEmitter, Renderer2, ViewChild, Output, Input, ContentChildren, QueryList, Inject } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import 'hammerjs';
import * as i0 from "@angular/core";
import * as i1 from "@ionic/angular";
import * as i2 from "@angular/platform-browser";
var _c0 = ["ionDragFooter"];
var _c1 = ["footer"];
var _c2 = ["*"];
export var IonPullUpFooterState;
(function (IonPullUpFooterState) {
    IonPullUpFooterState[IonPullUpFooterState["Collapsed"] = 0] = "Collapsed";
    IonPullUpFooterState[IonPullUpFooterState["Expanded"] = 1] = "Expanded";
    IonPullUpFooterState[IonPullUpFooterState["Minimized"] = 2] = "Minimized";
})(IonPullUpFooterState || (IonPullUpFooterState = {}));
export var IonPullUpFooterBehavior;
(function (IonPullUpFooterBehavior) {
    IonPullUpFooterBehavior[IonPullUpFooterBehavior["Hide"] = 0] = "Hide";
    IonPullUpFooterBehavior[IonPullUpFooterBehavior["Expand"] = 1] = "Expand";
})(IonPullUpFooterBehavior || (IonPullUpFooterBehavior = {}));
var IonicPullupComponent = /** @class */ (function () {
    function IonicPullupComponent(platform, renderer, hammerConfig) {
        this.platform = platform;
        this.renderer = renderer;
        this.hammerConfig = hammerConfig;
        this.stateChange = new EventEmitter();
        /**
         *  Maximum expanded position - useful if there are top headers
         *  If not provided by default computes available screen minus tabs and headers
         */
        this.toolbarTopMargin = 0;
        /**
         *  Minimum position - useful to keep a part of the footer always visible at the bottom
         */
        this.minBottomVisible = 0;
        this.expanded = new EventEmitter();
        this.collapsed = new EventEmitter();
        this.minimized = new EventEmitter();
        /**
         * Outputs the amount of pixels the user has dragged positive or negative
         */
        this.dragged = new EventEmitter();
        this.footerMeta = {
            height: 0,
            posY: 0,
            lastPosY: 0
        };
        this.currentViewMeta = { bottomSpace: screen.height - window.innerHeight };
        // sets initial state
        this.initialState = this.initialState || IonPullUpFooterState.Collapsed;
        this.defaultBehavior = this.defaultBehavior || IonPullUpFooterBehavior.Expand;
    }
    IonicPullupComponent.prototype.ngOnInit = function () {
        // console.debug('ionic-pullup => Initializing footer...');
        var _this = this;
        window.addEventListener('orientationchange', function () {
            // console.debug('ionic-pullup => Changed orientation => updating');
            _this.updateUI();
            _this.collapse();
        });
        this.platform.resume.subscribe(function () {
            // console.debug('ionic-pullup => Resumed from background => updating');
            _this.updateUI();
            _this.collapse();
        });
        // compute min boundary of toolbar depending on whether drawer is dockable
        this.footerMeta.toolbarLowerBoundary = this.dockable ? this.minBottomVisible : 0;
    };
    IonicPullupComponent.prototype.ngAfterContentInit = function () {
        this.computeDefaults();
        this.state = IonPullUpFooterState.Collapsed;
        this.updateUI();
    };
    Object.defineProperty(IonicPullupComponent.prototype, "expandedHeight", {
        get: function () {
            return window.innerHeight - this.currentViewMeta.toolbarHeight - this.currentViewMeta.tabsHeight;
        },
        enumerable: true,
        configurable: true
    });
    IonicPullupComponent.prototype.computeDefaults = function () {
        var _this = this;
        setTimeout(function () {
            _this.footerMeta.toolbarDefaultHeight = _this.childFooter.nativeElement.offsetHeight;
            _this.findIonicComponentsInPage();
            _this.dragElements.forEach(function (elem) {
                var hammer = _this.hammerConfig.buildHammer(elem.el);
                hammer.on('pan panstart panend', function (ev) {
                    _this.onPan(ev);
                });
            });
        }, 300);
    };
    IonicPullupComponent.prototype.computeHeights = function () {
        this.footerMeta.height = this.expandedHeight;
        this.footerMeta.toolbarDefaultExpandedPosition = -this.footerMeta.height + this.footerMeta.toolbarDefaultHeight + this.minBottomVisible;
        this.footerMeta.toolbarUpperBoundary = this.footerMeta.height - this.footerMeta.toolbarDefaultHeight - this.minBottomVisible;
        this.renderer.setStyle(this.childFooter.nativeElement, 'height', this.footerMeta.height + 'px');
        this.renderer.setStyle(this.childFooter.nativeElement, 'top', window.innerHeight - this.footerMeta.toolbarDefaultHeight - this.currentViewMeta.tabsHeight - this.minBottomVisible + "px");
        this.updateIonContentHeight();
        // TODO check if this is needed for native platform iOS/Android
        // this.renderer.setStyle(this.childFooter.nativeElement, 'bottom', this.currentViewMeta.tabsHeight + 'px');
    };
    IonicPullupComponent.prototype.updateUI = function (isInit) {
        var _this = this;
        if (isInit === void 0) { isInit = false; }
        if (!this.childFooter) {
            return;
        }
        setTimeout(function () {
            _this.computeHeights();
        }, 300);
        this.renderer.setStyle(this.childFooter.nativeElement, 'transition', 'none'); // avoids flickering when changing orientation
    };
    IonicPullupComponent.prototype.expand = function () {
        this.footerMeta.lastPosY = this.footerMeta.toolbarDefaultExpandedPosition;
        // reset ionContent scaling
        this.updateIonContentHeight(this.minBottomVisible - this.footerMeta.lastPosY);
        this.renderer.setStyle(this.childFooter.nativeElement, '-webkit-transform', "translate3d(0, " + this.footerMeta.lastPosY + "px, 0)");
        this.renderer.setStyle(this.childFooter.nativeElement, 'transform', "translate3d(0, " + this.footerMeta.lastPosY + "px, 0)");
        this.renderer.setStyle(this.childFooter.nativeElement, 'transition', '300ms ease-in-out');
        this.expanded.emit(null);
    };
    IonicPullupComponent.prototype.collapse = function (isInit) {
        var _this = this;
        if (isInit === void 0) { isInit = false; }
        if (!this.childFooter) {
            return;
        }
        this.footerMeta.lastPosY = 0;
        this.renderer.setStyle(this.childFooter.nativeElement, '-webkit-transform', "translate3d(0, " + this.footerMeta.lastPosY + "px, 0)");
        this.renderer.setStyle(this.childFooter.nativeElement, 'transform', "translate3d(0, " + this.footerMeta.lastPosY + "px, 0)");
        // reset ionContent scaling -> needs 300ms timeout to delay content resize
        setTimeout(function () { return _this.updateIonContentHeight(_this.minBottomVisible - _this.footerMeta.lastPosY); }, 300);
        if (!isInit) {
            this.collapsed.emit(null);
        }
    };
    /**
     * TODO
     */
    IonicPullupComponent.prototype.minimize = function () {
        this.footerMeta.lastPosY = this.footerMeta.height;
        this.renderer.setStyle(this.childFooter.nativeElement, '-webkit-transform', 'translate3d(0, ' + this.footerMeta.lastPosY + 'px, 0)');
        this.renderer.setStyle(this.childFooter.nativeElement, 'transform', 'translate3d(0, ' + this.footerMeta.lastPosY + 'px, 0)');
        this.minimized.emit(null);
    };
    IonicPullupComponent.prototype.onTap = function (e) {
        e.preventDefault();
        if (this.state === IonPullUpFooterState.Collapsed) {
            if (this.defaultBehavior === IonPullUpFooterBehavior.Hide) {
                this.state = IonPullUpFooterState.Minimized;
            }
            else {
                this.state = IonPullUpFooterState.Expanded;
            }
        }
        else {
            if (this.state === IonPullUpFooterState.Minimized) {
                if (this.defaultBehavior === IonPullUpFooterBehavior.Hide) {
                    this.state = IonPullUpFooterState.Collapsed;
                }
                else {
                    this.state = IonPullUpFooterState.Expanded;
                }
            }
            else {
                // footer is expanded
                this.state = this.initialState === IonPullUpFooterState.Minimized ? IonPullUpFooterState.Minimized : IonPullUpFooterState.Collapsed;
            }
        }
    };
    IonicPullupComponent.prototype.onPan = function (e) {
        this.renderer.setStyle(this.childFooter.nativeElement, 'transition', 'none');
        e.preventDefault();
        switch (e.type) {
            case 'pan':
                this.footerMeta.posY = e.deltaY + this.footerMeta.lastPosY;
                // check for min and max boundaries of draggable toolbar
                this.footerMeta.posY = this.footerMeta.posY > this.footerMeta.toolbarLowerBoundary ? this.footerMeta.toolbarLowerBoundary :
                    (Math.abs(this.footerMeta.posY) > this.footerMeta.toolbarUpperBoundary ?
                        this.footerMeta.toolbarDefaultExpandedPosition :
                        this.footerMeta.posY);
                // ionContent scaling - FIX scrolling bug
                this.updateIonContentHeight(this.minBottomVisible - this.footerMeta.posY);
                this.renderer.setStyle(this.childFooter.nativeElement, '-webkit-transform', 'translate3d(0, ' + this.footerMeta.posY + 'px, 0)');
                this.renderer.setStyle(this.childFooter.nativeElement, 'transform', 'translate3d(0, ' + this.footerMeta.posY + 'px, 0)');
                break;
            case 'panend':
                this.renderer.setStyle(this.childFooter.nativeElement, 'transition', '300ms ease-in-out');
                this.footerMeta.lastPosY = this.footerMeta.posY;
                // ionContent scaling - FIX scrolling bug
                this.updateIonContentHeight(this.minBottomVisible - this.footerMeta.lastPosY);
                // emit last footer position after dragging ends
                var handle = this.dragElements.first;
                this.dragged.emit({
                    delta: this.footerMeta.lastPosY,
                    toolbarAbsolutePosition: handle ? handle.el.getBoundingClientRect() : null
                });
                // TODO auto dock
                // if (this.footerMeta.lastPosY > this.footerMeta.height - this.footerMeta.defaultHeight) {
                //   this.state =  IonPullUpFooterState.Collapsed;
                // }
                break;
        }
    };
    IonicPullupComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (changes.state.isFirstChange() || changes.state.currentValue === changes.state.previousValue) {
            return;
        }
        switch (this.state) {
            case IonPullUpFooterState.Collapsed:
                this.collapse();
                break;
            case IonPullUpFooterState.Expanded:
                this.expand();
                break;
            case IonPullUpFooterState.Minimized:
                this.minimize();
                break;
        }
        // TODO: fix hack due to BUG (https://github.com/angular/angular/issues/6005)
        window.setTimeout(function () {
            _this.stateChange.emit(_this.state);
        });
    };
    /**
     * Detect ionic components in page
     */
    IonicPullupComponent.prototype.findIonicComponentsInPage = function () {
        this.footerMeta.ionContentRef = this.childFooter.nativeElement.querySelector('ion-content');
        this.currentViewMeta.tabsRef = document.querySelector('ion-tab-bar');
        this.currentViewMeta.tabsHeight = this.currentViewMeta.tabsRef ? this.currentViewMeta.tabsRef.offsetHeight : 0;
        // console.debug(this.currentViewMeta.tabsRef ? 'ionic-pullup => Tabs detected' : 'ionic.pullup => View has no tabs');
        if (!this.toolbarTopMargin) {
            var outletRef = document.querySelector('ion-router-outlet');
            if (outletRef) {
                var headerRef = outletRef.querySelector('ion-header');
                if (headerRef) {
                    this.currentViewMeta.toolbarRef = headerRef.querySelector('ion-toolbar');
                    this.currentViewMeta.toolbarHeight = this.currentViewMeta.toolbarRef.clientHeight;
                    // console.debug(this.currentViewMeta.toolbarRef ? `ionic-pullup => Toolbar detected` : 'ionic.pullup => View has no tabs');
                }
                else {
                    this.currentViewMeta.toolbarHeight = 0;
                }
            }
        }
        else {
            this.currentViewMeta.toolbarHeight = this.toolbarTopMargin;
        }
    };
    /**
     * Update inner ion-content component height when footer is expanded, collapsed or dragged
     * @param maxHeight maximum ionContent height to set
     */
    IonicPullupComponent.prototype.updateIonContentHeight = function (maxHeight) {
        if (!this.footerMeta.ionContentRef) {
            return;
        }
        var maxHeightUnits = maxHeight ? maxHeight + "px" : (this.minBottomVisible > 0 ? this.minBottomVisible + "px" : '100%');
        this.renderer.setStyle(this.footerMeta.ionContentRef, 'max-height', maxHeightUnits);
    };
    /** @nocollapse */ IonicPullupComponent.ɵfac = function IonicPullupComponent_Factory(t) { return new (t || IonicPullupComponent)(i0.ɵɵdirectiveInject(i1.Platform), i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(HAMMER_GESTURE_CONFIG)); };
    /** @nocollapse */ IonicPullupComponent.ɵcmp = i0.ɵɵdefineComponent({ type: IonicPullupComponent, selectors: [["lib-ionic-pullup"]], contentQueries: function IonicPullupComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
            i0.ɵɵcontentQuery(dirIndex, _c0, false);
        } if (rf & 2) {
            var _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.dragElements = _t);
        } }, viewQuery: function IonicPullupComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵstaticViewQuery(_c1, true);
        } if (rf & 2) {
            var _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.childFooter = _t.first);
        } }, inputs: { state: "state", initialState: "initialState", defaultBehavior: "defaultBehavior", toolbarTopMargin: "toolbarTopMargin", minBottomVisible: "minBottomVisible", dockable: "dockable" }, outputs: { stateChange: "stateChange", expanded: "expanded", collapsed: "collapsed", minimized: "minimized", dragged: "dragged" }, features: [i0.ɵɵNgOnChangesFeature], ngContentSelectors: _c2, decls: 3, vars: 0, consts: [[1, "footer"], ["footer", ""]], template: function IonicPullupComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵelementStart(0, "div", 0, 1);
            i0.ɵɵprojection(2);
            i0.ɵɵelementEnd();
        } }, styles: [".footer[_ngcontent-%COMP%]{left:0;right:0;position:fixed}"], changeDetection: 0 });
    return IonicPullupComponent;
}());
export { IonicPullupComponent };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(IonicPullupComponent, [{
        type: Component,
        args: [{
                selector: 'lib-ionic-pullup',
                templateUrl: './ionic-pullup.component.html',
                styleUrls: ['./ionic-pullup.component.scss'],
                changeDetection: ChangeDetectionStrategy.OnPush,
            }]
    }], function () { return [{ type: i1.Platform }, { type: i0.Renderer2 }, { type: i2.HammerGestureConfig, decorators: [{
                type: Inject,
                args: [HAMMER_GESTURE_CONFIG]
            }] }]; }, { state: [{
            type: Input
        }], stateChange: [{
            type: Output
        }], initialState: [{
            type: Input
        }], defaultBehavior: [{
            type: Input
        }], toolbarTopMargin: [{
            type: Input
        }], minBottomVisible: [{
            type: Input
        }], dockable: [{
            type: Input
        }], expanded: [{
            type: Output
        }], collapsed: [{
            type: Output
        }], minimized: [{
            type: Output
        }], dragged: [{
            type: Output
        }], childFooter: [{
            type: ViewChild,
            args: ['footer', { static: true }]
        }], dragElements: [{
            type: ContentChildren,
            args: ['ionDragFooter']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9uaWMtcHVsbHVwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2lvbmljLXB1bGx1cC8iLCJzb3VyY2VzIjpbImxpYi9pb25pYy1wdWxsdXAuY29tcG9uZW50LnRzIiwibGliL2lvbmljLXB1bGx1cC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7OztFQWFFO0FBQ0YsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFzRCxlQUFlLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5TSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDMUMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLG1CQUFtQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDdkYsT0FBTyxVQUFVLENBQUM7Ozs7Ozs7QUFnQ2xCLE1BQU0sQ0FBTixJQUFZLG9CQUlYO0FBSkQsV0FBWSxvQkFBb0I7SUFDOUIseUVBQWEsQ0FBQTtJQUNiLHVFQUFZLENBQUE7SUFDWix5RUFBYSxDQUFBO0FBQ2YsQ0FBQyxFQUpXLG9CQUFvQixLQUFwQixvQkFBb0IsUUFJL0I7QUFFRCxNQUFNLENBQU4sSUFBWSx1QkFHWDtBQUhELFdBQVksdUJBQXVCO0lBQ2pDLHFFQUFJLENBQUE7SUFDSix5RUFBTSxDQUFBO0FBQ1IsQ0FBQyxFQUhXLHVCQUF1QixLQUF2Qix1QkFBdUIsUUFHbEM7QUFPRDtJQStDRSw4QkFDVSxRQUFrQixFQUNsQixRQUFtQixFQUNZLFlBQWlDO1FBRmhFLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDbEIsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNZLGlCQUFZLEdBQVosWUFBWSxDQUFxQjtRQXpDaEUsZ0JBQVcsR0FBdUMsSUFBSSxZQUFZLEVBQXdCLENBQUM7UUFPckc7OztXQUdHO1FBQ00s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djQgZm9yIElvbmljIDQgYW5kIEFuZ3VsYXIgOFxuXG5Db3B5cmlnaHQgMjAyMCBBcmllbCBGYXVyIChodHRwczovL2dpdGh1Yi5jb20vYXJpZWxmYXVyKVxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbnlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbllvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG5TZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG5saW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiovXG5pbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIFJlbmRlcmVyMiwgVmlld0NoaWxkLCBPdXRwdXQsIElucHV0LCBPbkluaXQsIEFmdGVyQ29udGVudEluaXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgQ29udGVudENoaWxkcmVuLCBRdWVyeUxpc3QsIEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUGxhdGZvcm0gfSBmcm9tICdAaW9uaWMvYW5ndWxhcic7XG5pbXBvcnQgeyBIQU1NRVJfR0VTVFVSRV9DT05GSUcsIEhhbW1lckdlc3R1cmVDb25maWcgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCAnaGFtbWVyanMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEZvb3Rlck1ldGFkYXRhIHtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIHBvc1k6IG51bWJlcjtcbiAgbGFzdFBvc1k6IG51bWJlcjtcbiAgdG9vbGJhckRlZmF1bHRIZWlnaHQ/OiBudW1iZXI7XG4gIHRvb2xiYXJEZWZhdWx0RXhwYW5kZWRQb3NpdGlvbj86IG51bWJlcjtcbiAgdG9vbGJhclVwcGVyQm91bmRhcnk/OiBudW1iZXI7XG4gIHRvb2xiYXJMb3dlckJvdW5kYXJ5PzogbnVtYmVyO1xuICBpb25Db250ZW50UmVmPzogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFZpZXdNZXRhZGF0YSB7XG4gIHRhYnNSZWY/OiBFbGVtZW50O1xuICB0YWJzSGVpZ2h0PzogbnVtYmVyO1xuICBoYXNCb3R0b21UYWJzPzogYm9vbGVhbjtcbiAgdG9vbGJhclJlZj86IEVsZW1lbnQ7XG4gIHRvb2xiYXJIZWlnaHQ/OiBudW1iZXI7XG4gIGJvdHRvbVNwYWNlPzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZvb3RlclRhYiB7XG4gIHg/OiBudW1iZXI7XG4gIHk/OiBudW1iZXI7XG4gIHVwcGVyTGVmdFJhZGl1cz86IG51bWJlcjtcbiAgdXBwZXJSaWdodFJhZGl1cz86IG51bWJlcjtcbiAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xuICBjb2xvcj86IHN0cmluZztcbiAgY29udGVudD86IHN0cmluZztcbn1cblxuZXhwb3J0IGVudW0gSW9uUHVsbFVwRm9vdGVyU3RhdGUge1xuICBDb2xsYXBzZWQgPSAwLFxuICBFeHBhbmRlZCA9IDEsXG4gIE1pbmltaXplZCA9IDJcbn1cblxuZXhwb3J0IGVudW0gSW9uUHVsbFVwRm9vdGVyQmVoYXZpb3Ige1xuICBIaWRlLFxuICBFeHBhbmRcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEcmFnZ2VkT3V0cHV0RXZlbnQge1xuICBkZWx0YTogbnVtYmVyO1xuICB0b29sYmFyQWJzb2x1dGVQb3NpdGlvbjogRE9NUmVjdDtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbGliLWlvbmljLXB1bGx1cCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9pb25pYy1wdWxsdXAuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9pb25pYy1wdWxsdXAuY29tcG9uZW50LnNjc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIElvbmljUHVsbHVwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlckNvbnRlbnRJbml0LCBPbkNoYW5nZXMge1xuXG4gIEBJbnB1dCgpIHN0YXRlOiBJb25QdWxsVXBGb290ZXJTdGF0ZTtcbiAgQE91dHB1dCgpIHN0YXRlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8SW9uUHVsbFVwRm9vdGVyU3RhdGU+ID0gbmV3IEV2ZW50RW1pdHRlcjxJb25QdWxsVXBGb290ZXJTdGF0ZT4oKTtcblxuICBASW5wdXQoKSBpbml0aWFsU3RhdGU6IElvblB1bGxVcEZvb3RlclN0YXRlOyAgICAgICAgICAvLyBUT0RPIGltcGxlbW1lbnRcbiAgQElucHV0KCkgZGVmYXVsdEJlaGF2aW9yOiBJb25QdWxsVXBGb290ZXJCZWhhdmlvcjsgICAgLy8gVE9ETyBpbXBsZW1tZW50XG4gIFxuXG5cbiAgLyoqXG4gICAqICBNYXhpbXVtIGV4cGFuZGVkIHBvc2l0aW9uIC0gdXNlZnVsIGlmIHRoZXJlIGFyZSB0b3AgaGVhZGVyc1xuICAgKiAgSWYgbm90IHByb3ZpZGVkIGJ5IGRlZmF1bHQgY29tcHV0ZXMgYXZhaWxhYmxlIHNjcmVlbiBtaW51cyB0YWJzIGFuZCBoZWFkZXJzXG4gICAqL1xuICBASW5wdXQoKSB0b29sYmFyVG9wTWFyZ2luID0gMDtcblxuICAvKipcbiAgICogIE1pbmltdW0gcG9zaXRpb24gLSB1c2VmdWwgdG8ga2VlcCBhIHBhcnQgb2YgdGhlIGZvb3RlciBhbHdheXMgdmlzaWJsZSBhdCB0aGUgYm90dG9tXG4gICAqL1xuICBASW5wdXQoKSBtaW5Cb3R0b21WaXNpYmxlID0gMDtcblxuICAvKipcbiAgICogSWYgdHJ1ZSwgZm9vdGVyIGNhbiBiZSBkb2NrZWQgYXQgdGhlIGJvdHRvbVxuICAgKi9cbiAgQElucHV0KCkgZG9ja2FibGU6IGJvb2xlYW47XG5cbiAgQE91dHB1dCgpIGV4cGFuZGVkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBjb2xsYXBzZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIG1pbmltaXplZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIC8qKlxuICAgKiBPdXRwdXRzIHRoZSBhbW91bnQgb2YgcGl4ZWxzIHRoZSB1c2VyIGhhcyBkcmFnZ2VkIHBvc2l0aXZlIG9yIG5lZ2F0aXZlXG4gICAqL1xuICBAT3V0cHV0KCkgZHJhZ2dlZCA9IG5ldyBFdmVudEVtaXR0ZXI8RHJhZ2dlZE91dHB1dEV2ZW50PigpO1xuXG4gIEBWaWV3Q2hpbGQoJ2Zvb3RlcicsIHsgc3RhdGljOiB0cnVlIH0pIGNoaWxkRm9vdGVyO1xuICBAQ29udGVudENoaWxkcmVuKCdpb25EcmFnRm9vdGVyJykgZHJhZ0VsZW1lbnRzICE6IFF1ZXJ5TGlzdDxhbnk+O1xuXG4gIHByb3RlY3RlZCBmb290ZXJNZXRhOiBGb290ZXJNZXRhZGF0YTtcbiAgcHJvdGVjdGVkIGN1cnJlbnRWaWV3TWV0YTogVmlld01ldGFkYXRhO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBASW5qZWN0KEhBTU1FUl9HRVNUVVJFX0NPTkZJRykgcHJpdmF0ZSBoYW1tZXJDb25maWc6IEhhbW1lckdlc3R1cmVDb25maWcpIHtcbiAgICB0aGlzLmZvb3Rlck1ldGEgPSB7XG4gICAgICBoZWlnaHQ6IDAsXG4gICAgICBwb3NZOiAwLFxuICAgICAgbGFzdFBvc1k6IDBcbiAgICB9O1xuICAgIHRoaXMuY3VycmVudFZpZXdNZXRhID0geyBib3R0b21TcGFjZTogc2NyZWVuLmhlaWdodCAtIHdpbmRvdy5pbm5lckhlaWdodCB9O1xuXG4gICAgLy8gc2V0cyBpbml0aWFsIHN0YXRlXG4gICAgdGhpcy5pbml0aWFsU3RhdGUgPSB0aGlzLmluaXRpYWxTdGF0ZSB8fCBJb25QdWxsVXBGb290ZXJTdGF0ZS5Db2xsYXBzZWQ7XG4gICAgdGhpcy5kZWZhdWx0QmVoYXZpb3IgPSB0aGlzLmRlZmF1bHRCZWhhdmlvciB8fCBJb25QdWxsVXBGb290ZXJCZWhhdmlvci5FeHBhbmQ7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBjb25zb2xlLmRlYnVnKCdpb25pYy1wdWxsdXAgPT4gSW5pdGlhbGl6aW5nIGZvb3Rlci4uLicpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgKCkgPT4ge1xuICAgICAgLy8gY29uc29sZS5kZWJ1ZygnaW9uaWMtcHVsbHVwID0+IENoYW5nZWQgb3JpZW50YXRpb24gPT4gdXBkYXRpbmcnKTtcbiAgICAgIHRoaXMudXBkYXRlVUkoKTtcbiAgICAgIHRoaXMuY29sbGFwc2UoKTtcbiAgICB9KTtcbiAgICB0aGlzLnBsYXRmb3JtLnJlc3VtZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgLy8gY29uc29sZS5kZWJ1ZygnaW9uaWMtcHVsbHVwID0+IFJlc3VtZWQgZnJvbSBiYWNrZ3JvdW5kID0+IHVwZGF0aW5nJyk7XG4gICAgICB0aGlzLnVwZGF0ZVVJKCk7XG4gICAgICB0aGlzLmNvbGxhcHNlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBjb21wdXRlIG1pbiBib3VuZGFyeSBvZiB0b29sYmFyIGRlcGVuZGluZyBvbiB3aGV0aGVyIGRyYXdlciBpcyBkb2NrYWJsZVxuICAgIHRoaXMuZm9vdGVyTWV0YS50b29sYmFyTG93ZXJCb3VuZGFyeSA9IHRoaXMuZG9ja2FibGUgPyB0aGlzLm1pbkJvdHRvbVZpc2libGUgOiAwO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuY29tcHV0ZURlZmF1bHRzKCk7XG5cbiAgICB0aGlzLnN0YXRlID0gSW9uUHVsbFVwRm9vdGVyU3RhdGUuQ29sbGFwc2VkO1xuXG4gICAgdGhpcy51cGRhdGVVSSgpO1xuICB9XG5cbiAgcHVibGljIGdldCBleHBhbmRlZEhlaWdodCgpOiBudW1iZXIge1xuICAgIHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHQgLSB0aGlzLmN1cnJlbnRWaWV3TWV0YS50b29sYmFySGVpZ2h0IC0gdGhpcy5jdXJyZW50Vmlld01ldGEudGFic0hlaWdodDtcbiAgfVxuXG4gIGNvbXB1dGVEZWZhdWx0cygpIHtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5mb290ZXJNZXRhLnRvb2xiYXJEZWZhdWx0SGVpZ2h0ID0gdGhpcy5jaGlsZEZvb3Rlci5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodDtcblxuICAgICAgdGhpcy5maW5kSW9uaWNDb21wb25lbnRzSW5QYWdlKCk7XG5cbiAgICAgIHRoaXMuZHJhZ0VsZW1lbnRzLmZvckVhY2goZWxlbSA9PiB7XG4gICAgICAgIGNvbnN0IGhhbW1lciA9IHRoaXMuaGFtbWVyQ29uZmlnLmJ1aWxkSGFtbWVyKGVsZW0uZWwpO1xuICAgICAgICBoYW1tZXIub24oJ3BhbiBwYW5zdGFydCBwYW5lbmQnLCAoZXYpID0+IHtcbiAgICAgICAgICB0aGlzLm9uUGFuKGV2KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LCAzMDApO1xuICB9XG5cbiAgY29tcHV0ZUhlaWdodHMoKSB7XG4gICAgdGhpcy5mb290ZXJNZXRhLmhlaWdodCA9IHRoaXMuZXhwYW5kZWRIZWlnaHQ7XG4gICAgdGhpcy5mb290ZXJNZXRhLnRvb2xiYXJEZWZhdWx0RXhwYW5kZWRQb3NpdGlvbiA9IC10aGlzLmZvb3Rlck1ldGEuaGVpZ2h0ICsgdGhpcy5mb290ZXJNZXRhLnRvb2xiYXJEZWZhdWx0SGVpZ2h0ICsgdGhpcy5taW5Cb3R0b21WaXNpYmxlO1xuICAgIHRoaXMuZm9vdGVyTWV0YS50b29sYmFyVXBwZXJCb3VuZGFyeSA9IHRoaXMuZm9vdGVyTWV0YS5oZWlnaHQgLSB0aGlzLmZvb3Rlck1ldGEudG9vbGJhckRlZmF1bHRIZWlnaHQgLSB0aGlzLm1pbkJvdHRvbVZpc2libGU7XG4gICAgXG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmNoaWxkRm9vdGVyLm5hdGl2ZUVsZW1lbnQsICdoZWlnaHQnLCB0aGlzLmZvb3Rlck1ldGEuaGVpZ2h0ICsgJ3B4Jyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmNoaWxkRm9vdGVyLm5hdGl2ZUVsZW1lbnQsICd0b3AnLFxuICAgICAgYCR7d2luZG93LmlubmVySGVpZ2h0IC0gdGhpcy5mb290ZXJNZXRhLnRvb2xiYXJEZWZhdWx0SGVpZ2h0IC0gdGhpcy5jdXJyZW50Vmlld01ldGEudGFic0hlaWdodCAtIHRoaXMubWluQm90dG9tVmlzaWJsZX1weGBcbiAgICApO1xuXG4gICAgdGhpcy51cGRhdGVJb25Db250ZW50SGVpZ2h0KCk7XG5cbiAgICAvLyBUT0RPIGNoZWNrIGlmIHRoaXMgaXMgbmVlZGVkIGZvciBuYXRpdmUgcGxhdGZvcm0gaU9TL0FuZHJvaWRcbiAgICAvLyB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuY2hpbGRGb290ZXIubmF0aXZlRWxlbWVudCwgJ2JvdHRvbScsIHRoaXMuY3VycmVudFZpZXdNZXRhLnRhYnNIZWlnaHQgKyAncHgnKTtcbiAgfVxuXG4gIHVwZGF0ZVVJKGlzSW5pdDogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgaWYgKCF0aGlzLmNoaWxkRm9vdGVyKSB7IHJldHVybjsgfVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLmNvbXB1dGVIZWlnaHRzKCk7XG4gICAgfSwgMzAwKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuY2hpbGRGb290ZXIubmF0aXZlRWxlbWVudCwgJ3RyYW5zaXRpb24nLCAnbm9uZScpOyAgLy8gYXZvaWRzIGZsaWNrZXJpbmcgd2hlbiBjaGFuZ2luZyBvcmllbnRhdGlvblxuICB9XG5cbiAgZXhwYW5kKCkge1xuICAgIHRoaXMuZm9vdGVyTWV0YS5sYXN0UG9zWSA9IHRoaXMuZm9vdGVyTWV0YS50b29sYmFyRGVmYXVsdEV4cGFuZGVkUG9zaXRpb247XG5cbiAgICAvLyByZXNldCBpb25Db250ZW50IHNjYWxpbmdcbiAgICB0aGlzLnVwZGF0ZUlvbkNvbnRlbnRIZWlnaHQodGhpcy5taW5Cb3R0b21WaXNpYmxlIC0gdGhpcy5mb290ZXJNZXRhLmxhc3RQb3NZKTtcblxuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5jaGlsZEZvb3Rlci5uYXRpdmVFbGVtZW50LCAnLXdlYmtpdC10cmFuc2Zvcm0nLCBgdHJhbnNsYXRlM2QoMCwgJHt0aGlzLmZvb3Rlck1ldGEubGFzdFBvc1l9cHgsIDApYCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmNoaWxkRm9vdGVyLm5hdGl2ZUVsZW1lbnQsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlM2QoMCwgJHt0aGlzLmZvb3Rlck1ldGEubGFzdFBvc1l9cHgsIDApYCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmNoaWxkRm9vdGVyLm5hdGl2ZUVsZW1lbnQsICd0cmFuc2l0aW9uJywgJzMwMG1zIGVhc2UtaW4tb3V0Jyk7XG5cbiAgICB0aGlzLmV4cGFuZGVkLmVtaXQobnVsbCk7XG4gIH1cblxuICBjb2xsYXBzZShpc0luaXQ6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGlmICghdGhpcy5jaGlsZEZvb3RlcikgeyByZXR1cm47IH1cbiAgICB0aGlzLmZvb3Rlck1ldGEubGFzdFBvc1kgPSAwO1xuXG4gXG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmNoaWxkRm9vdGVyLm5hdGl2ZUVsZW1lbnQsICctd2Via2l0LXRyYW5zZm9ybScsIGB0cmFuc2xhdGUzZCgwLCAke3RoaXMuZm9vdGVyTWV0YS5sYXN0UG9zWX1weCwgMClgKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuY2hpbGRGb290ZXIubmF0aXZlRWxlbWVudCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUzZCgwLCAke3RoaXMuZm9vdGVyTWV0YS5sYXN0UG9zWX1weCwgMClgKTtcblxuICAgIC8vIHJlc2V0IGlvbkNvbnRlbnQgc2NhbGluZyAtPiBuZWVkcyAzMDBtcyB0aW1lb3V0IHRvIGRlbGF5IGNvbnRlbnQgcmVzaXplXG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnVwZGF0ZUlvbkNvbnRlbnRIZWlnaHQodGhpcy5taW5Cb3R0b21WaXNpYmxlIC0gdGhpcy5mb290ZXJNZXRhLmxhc3RQb3NZKSwgMzAwKTtcblxuICAgIGlmICghaXNJbml0KSB7IHRoaXMuY29sbGFwc2VkLmVtaXQobnVsbCk7IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUT0RPXG4gICAqL1xuICBtaW5pbWl6ZSgpIHtcbiAgICB0aGlzLmZvb3Rlck1ldGEubGFzdFBvc1kgPSB0aGlzLmZvb3Rlck1ldGEuaGVpZ2h0O1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5jaGlsZEZvb3Rlci5uYXRpdmVFbGVtZW50LCAnLXdlYmtpdC10cmFuc2Zvcm0nLCAndHJhbnNsYXRlM2QoMCwgJyArIHRoaXMuZm9vdGVyTWV0YS5sYXN0UG9zWSArICdweCwgMCknKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuY2hpbGRGb290ZXIubmF0aXZlRWxlbWVudCwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUzZCgwLCAnICsgdGhpcy5mb290ZXJNZXRhLmxhc3RQb3NZICsgJ3B4LCAwKScpO1xuXG4gICAgdGhpcy5taW5pbWl6ZWQuZW1pdChudWxsKTtcbiAgfVxuXG5cbiAgb25UYXAoZTogYW55KSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgaWYgKHRoaXMuc3RhdGUgPT09IElvblB1bGxVcEZvb3RlclN0YXRlLkNvbGxhcHNlZCkge1xuICAgICAgaWYgKHRoaXMuZGVmYXVsdEJlaGF2aW9yID09PSBJb25QdWxsVXBGb290ZXJCZWhhdmlvci5IaWRlKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBJb25QdWxsVXBGb290ZXJTdGF0ZS5NaW5pbWl6ZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0YXRlID0gSW9uUHVsbFVwRm9vdGVyU3RhdGUuRXhwYW5kZWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlID09PSBJb25QdWxsVXBGb290ZXJTdGF0ZS5NaW5pbWl6ZWQpIHtcbiAgICAgICAgaWYgKHRoaXMuZGVmYXVsdEJlaGF2aW9yID09PSBJb25QdWxsVXBGb290ZXJCZWhhdmlvci5IaWRlKSB7XG4gICAgICAgICAgdGhpcy5zdGF0ZSA9IElvblB1bGxVcEZvb3RlclN0YXRlLkNvbGxhcHNlZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnN0YXRlID0gSW9uUHVsbFVwRm9vdGVyU3RhdGUuRXhwYW5kZWQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGZvb3RlciBpcyBleHBhbmRlZFxuICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5pbml0aWFsU3RhdGUgPT09IElvblB1bGxVcEZvb3RlclN0YXRlLk1pbmltaXplZCA/IElvblB1bGxVcEZvb3RlclN0YXRlLk1pbmltaXplZCA6IElvblB1bGxVcEZvb3RlclN0YXRlLkNvbGxhcHNlZDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIG9uUGFuKGU6IEhhbW1lcklucHV0KSB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmNoaWxkRm9vdGVyLm5hdGl2ZUVsZW1lbnQsICd0cmFuc2l0aW9uJywgJ25vbmUnKTtcblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIFxuXG4gICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3Bhbic6XG4gICAgICAgIHRoaXMuZm9vdGVyTWV0YS5wb3NZID0gZS5kZWx0YVkgKyB0aGlzLmZvb3Rlck1ldGEubGFzdFBvc1k7XG5cbiAgICAgICAgLy8gY2hlY2sgZm9yIG1pbiBhbmQgbWF4IGJvdW5kYXJpZXMgb2YgZHJhZ2dhYmxlIHRvb2xiYXJcbiAgICAgICAgdGhpcy5mb290ZXJNZXRhLnBvc1kgPSB0aGlzLmZvb3Rlck1ldGEucG9zWSA+IHRoaXMuZm9vdGVyTWV0YS50b29sYmFyTG93ZXJCb3VuZGFyeSA/IHRoaXMuZm9vdGVyTWV0YS50b29sYmFyTG93ZXJCb3VuZGFyeSA6XG4gICAgICAgICAgKE1hdGguYWJzKHRoaXMuZm9vdGVyTWV0YS5wb3NZKSA+IHRoaXMuZm9vdGVyTWV0YS50b29sYmFyVXBwZXJCb3VuZGFyeSA/XG4gICAgICAgICAgICB0aGlzLmZvb3Rlck1ldGEudG9vbGJhckRlZmF1bHRFeHBhbmRlZFBvc2l0aW9uIDpcbiAgICAgICAgICAgIHRoaXMuZm9vdGVyTWV0YS5wb3NZKTtcblxuICAgICAgICAvLyBpb25Db250ZW50IHNjYWxpbmcgLSBGSVggc2Nyb2xsaW5nIGJ1Z1xuICAgICAgICB0aGlzLnVwZGF0ZUlvbkNvbnRlbnRIZWlnaHQodGhpcy5taW5Cb3R0b21WaXNpYmxlIC0gdGhpcy5mb290ZXJNZXRhLnBvc1kpO1xuXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5jaGlsZEZvb3Rlci5uYXRpdmVFbGVtZW50LCAnLXdlYmtpdC10cmFuc2Zvcm0nLCAndHJhbnNsYXRlM2QoMCwgJyArIHRoaXMuZm9vdGVyTWV0YS5wb3NZICsgJ3B4LCAwKScpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuY2hpbGRGb290ZXIubmF0aXZlRWxlbWVudCwgJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUzZCgwLCAnICsgdGhpcy5mb290ZXJNZXRhLnBvc1kgKyAncHgsIDApJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncGFuZW5kJzpcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmNoaWxkRm9vdGVyLm5hdGl2ZUVsZW1lbnQsICd0cmFuc2l0aW9uJywgJzMwMG1zIGVhc2UtaW4tb3V0Jyk7XG4gICAgICAgIHRoaXMuZm9vdGVyTWV0YS5sYXN0UG9zWSA9IHRoaXMuZm9vdGVyTWV0YS5wb3NZO1xuXG4gICAgICAgIC8vIGlvbkNvbnRlbnQgc2NhbGluZyAtIEZJWCBzY3JvbGxpbmcgYnVnXG4gICAgICAgIHRoaXMudXBkYXRlSW9uQ29udGVudEhlaWdodCh0aGlzLm1pbkJvdHRvbVZpc2libGUgLSB0aGlzLmZvb3Rlck1ldGEubGFzdFBvc1kpO1xuXG4gICAgICAgIC8vIGVtaXQgbGFzdCBmb290ZXIgcG9zaXRpb24gYWZ0ZXIgZHJhZ2dpbmcgZW5kc1xuICAgICAgICBjb25zdCBoYW5kbGUgPSB0aGlzLmRyYWdFbGVtZW50cy5maXJzdDtcbiAgICAgICAgdGhpcy5kcmFnZ2VkLmVtaXQoe1xuICAgICAgICAgIGRlbHRhOiB0aGlzLmZvb3Rlck1ldGEubGFzdFBvc1ksXG4gICAgICAgICAgdG9vbGJhckFic29sdXRlUG9zaXRpb246IGhhbmRsZSA/IGhhbmRsZS5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSA6IG51bGxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gVE9ETyBhdXRvIGRvY2tcbiAgICAgICAgLy8gaWYgKHRoaXMuZm9vdGVyTWV0YS5sYXN0UG9zWSA+IHRoaXMuZm9vdGVyTWV0YS5oZWlnaHQgLSB0aGlzLmZvb3Rlck1ldGEuZGVmYXVsdEhlaWdodCkge1xuICAgICAgICAvLyAgIHRoaXMuc3RhdGUgPSAgSW9uUHVsbFVwRm9vdGVyU3RhdGUuQ29sbGFwc2VkO1xuICAgICAgICAvLyB9XG5cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzLnN0YXRlLmlzRmlyc3RDaGFuZ2UoKSB8fCBjaGFuZ2VzLnN0YXRlLmN1cnJlbnRWYWx1ZSA9PT0gY2hhbmdlcy5zdGF0ZS5wcmV2aW91c1ZhbHVlKSB7IHJldHVybjsgfVxuXG4gICAgc3dpdGNoICh0aGlzLnN0YXRlKSB7XG4gICAgICBjYXNlIElvblB1bGxVcEZvb3RlclN0YXRlLkNvbGxhcHNlZDpcbiAgICAgICAgdGhpcy5jb2xsYXBzZSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgSW9uUHVsbFVwRm9vdGVyU3RhdGUuRXhwYW5kZWQ6XG4gICAgICAgIHRoaXMuZXhwYW5kKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBJb25QdWxsVXBGb290ZXJTdGF0ZS5NaW5pbWl6ZWQ6XG4gICAgICAgIHRoaXMubWluaW1pemUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogZml4IGhhY2sgZHVlIHRvIEJVRyAoaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvNjAwNSlcbiAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlLmVtaXQodGhpcy5zdGF0ZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZWN0IGlvbmljIGNvbXBvbmVudHMgaW4gcGFnZVxuICAgKi9cbiAgcHJpdmF0ZSBmaW5kSW9uaWNDb21wb25lbnRzSW5QYWdlKCkge1xuICAgIHRoaXMuZm9vdGVyTWV0YS5pb25Db250ZW50UmVmID0gdGhpcy5jaGlsZEZvb3Rlci5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lvbi1jb250ZW50Jyk7XG5cbiAgICB0aGlzLmN1cnJlbnRWaWV3TWV0YS50YWJzUmVmID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW9uLXRhYi1iYXInKTtcbiAgICB0aGlzLmN1cnJlbnRWaWV3TWV0YS50YWJzSGVpZ2h0ID0gdGhpcy5jdXJyZW50Vmlld01ldGEudGFic1JlZiA/ICh0aGlzLmN1cnJlbnRWaWV3TWV0YS50YWJzUmVmIGFzIEhUTUxFbGVtZW50KS5vZmZzZXRIZWlnaHQgOiAwO1xuICAgIC8vIGNvbnNvbGUuZGVidWcodGhpcy5jdXJyZW50Vmlld01ldGEudGFic1JlZiA/ICdpb25pYy1wdWxsdXAgPT4gVGFicyBkZXRlY3RlZCcgOiAnaW9uaWMucHVsbHVwID0+IFZpZXcgaGFzIG5vIHRhYnMnKTtcblxuICAgIGlmICghdGhpcy50b29sYmFyVG9wTWFyZ2luKSB7XG4gICAgICBjb25zdCBvdXRsZXRSZWYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpb24tcm91dGVyLW91dGxldCcpO1xuICAgICAgaWYgKG91dGxldFJlZikge1xuICAgICAgICBjb25zdCBoZWFkZXJSZWYgPSBvdXRsZXRSZWYucXVlcnlTZWxlY3RvcignaW9uLWhlYWRlcicpO1xuICAgICAgICBpZiAoaGVhZGVyUmVmKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50Vmlld01ldGEudG9vbGJhclJlZiA9IGhlYWRlclJlZi5xdWVyeVNlbGVjdG9yKCdpb24tdG9vbGJhcicpO1xuICAgICAgICAgIHRoaXMuY3VycmVudFZpZXdNZXRhLnRvb2xiYXJIZWlnaHQgPSB0aGlzLmN1cnJlbnRWaWV3TWV0YS50b29sYmFyUmVmLmNsaWVudEhlaWdodDtcbiAgICAgICAgICAvLyBjb25zb2xlLmRlYnVnKHRoaXMuY3VycmVudFZpZXdNZXRhLnRvb2xiYXJSZWYgPyBgaW9uaWMtcHVsbHVwID0+IFRvb2xiYXIgZGV0ZWN0ZWRgIDogJ2lvbmljLnB1bGx1cCA9PiBWaWV3IGhhcyBubyB0YWJzJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50Vmlld01ldGEudG9vbGJhckhlaWdodCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJyZW50Vmlld01ldGEudG9vbGJhckhlaWdodCA9IHRoaXMudG9vbGJhclRvcE1hcmdpbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGlubmVyIGlvbi1jb250ZW50IGNvbXBvbmVudCBoZWlnaHQgd2hlbiBmb290ZXIgaXMgZXhwYW5kZWQsIGNvbGxhcHNlZCBvciBkcmFnZ2VkXG4gICAqIEBwYXJhbSBtYXhIZWlnaHQgbWF4aW11bSBpb25Db250ZW50IGhlaWdodCB0byBzZXRcbiAgICovXG4gIHByaXZhdGUgdXBkYXRlSW9uQ29udGVudEhlaWdodChtYXhIZWlnaHQ/OiBudW1iZXIpIHtcbiAgICBpZiAoIXRoaXMuZm9vdGVyTWV0YS5pb25Db250ZW50UmVmKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgbWF4SGVpZ2h0VW5pdHMgPSBtYXhIZWlnaHQgPyBgJHttYXhIZWlnaHR9cHhgIDogKHRoaXMubWluQm90dG9tVmlzaWJsZSA+IDAgPyBgJHt0aGlzLm1pbkJvdHRvbVZpc2libGV9cHhgIDogJzEwMCUnKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZm9vdGVyTWV0YS5pb25Db250ZW50UmVmLCAnbWF4LWhlaWdodCcsIG1heEhlaWdodFVuaXRzKTtcbiAgfVxuXG59XG5cblxuIiwiPGRpdiBjbGFzcz1cImZvb3RlclwiICNmb290ZXI+XG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbjwvZGl2PiJdfQ==