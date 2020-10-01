import { ɵɵdefineComponent, ɵɵprojectionDef, ɵɵprojection, ɵsetClassMetadata, Component, EventEmitter, ɵɵdirectiveInject, Renderer2, ɵɵcontentQuery, ɵɵqueryRefresh, ɵɵloadQuery, ɵɵstaticViewQuery, ɵɵNgOnChangesFeature, ɵɵelementStart, ɵɵelementEnd, ChangeDetectionStrategy, Inject, Input, Output, ViewChild, ContentChildren, ɵɵdefineNgModule, ɵɵdefineInjector, ɵɵsetNgModuleScope, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { DIRECTION_VERTICAL } from 'hammerjs';
import { __extends } from 'tslib';

var _c0 = ["*"];
var IonicPullupComponentTabComponent = /** @class */ (function () {
    function IonicPullupComponentTabComponent() {
    }
    /** @nocollapse */ IonicPullupComponentTabComponent.ɵfac = function IonicPullupComponentTabComponent_Factory(t) { return new (t || IonicPullupComponentTabComponent)(); };
    /** @nocollapse */ IonicPullupComponentTabComponent.ɵcmp = ɵɵdefineComponent({ type: IonicPullupComponentTabComponent, selectors: [["lib-ionic-pullup-tab"]], ngContentSelectors: _c0, decls: 1, vars: 0, template: function IonicPullupComponentTabComponent_Template(rf, ctx) { if (rf & 1) {
            ɵɵprojectionDef();
            ɵɵprojection(0);
        } }, styles: ["[_nghost-%COMP%]{z-index:1000;display:-webkit-box;display:flex;-webkit-box-pack:center;justify-content:center;position:relative;width:120px;height:10px;background:var(--ion-color-primary);color:#fff;border-radius:10px 10px 0 0;margin:0 auto}"] });
    return IonicPullupComponentTabComponent;
}());
/*@__PURE__*/ (function () { ɵsetClassMetadata(IonicPullupComponentTabComponent, [{
        type: Component,
        args: [{
                selector: 'lib-ionic-pullup-tab',
                templateUrl: './ionic-pullup-tab.component.html',
                styleUrls: ['./ionic-pullup-tab.component.scss']
            }]
    }], null, null); })();

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
var _c0$1 = ["ionDragFooter"];
var _c1 = ["footer"];
var _c2 = ["*"];
var IonPullUpFooterState;
(function (IonPullUpFooterState) {
    IonPullUpFooterState[IonPullUpFooterState["Collapsed"] = 0] = "Collapsed";
    IonPullUpFooterState[IonPullUpFooterState["Expanded"] = 1] = "Expanded";
    IonPullUpFooterState[IonPullUpFooterState["Minimized"] = 2] = "Minimized";
})(IonPullUpFooterState || (IonPullUpFooterState = {}));
var IonPullUpFooterBehavior;
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
    /** @nocollapse */ IonicPullupComponent.ɵfac = function IonicPullupComponent_Factory(t) { return new (t || IonicPullupComponent)(ɵɵdirectiveInject(Platform), ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(HAMMER_GESTURE_CONFIG)); };
    /** @nocollapse */ IonicPullupComponent.ɵcmp = ɵɵdefineComponent({ type: IonicPullupComponent, selectors: [["lib-ionic-pullup"]], contentQueries: function IonicPullupComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
            ɵɵcontentQuery(dirIndex, _c0$1, false);
        } if (rf & 2) {
            var _t;
            ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.dragElements = _t);
        } }, viewQuery: function IonicPullupComponent_Query(rf, ctx) { if (rf & 1) {
            ɵɵstaticViewQuery(_c1, true);
        } if (rf & 2) {
            var _t;
            ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.childFooter = _t.first);
        } }, inputs: { state: "state", initialState: "initialState", defaultBehavior: "defaultBehavior", toolbarTopMargin: "toolbarTopMargin", minBottomVisible: "minBottomVisible", dockable: "dockable" }, outputs: { stateChange: "stateChange", expanded: "expanded", collapsed: "collapsed", minimized: "minimized", dragged: "dragged" }, features: [ɵɵNgOnChangesFeature], ngContentSelectors: _c2, decls: 3, vars: 0, consts: [[1, "footer"], ["footer", ""]], template: function IonicPullupComponent_Template(rf, ctx) { if (rf & 1) {
            ɵɵprojectionDef();
            ɵɵelementStart(0, "div", 0, 1);
            ɵɵprojection(2);
            ɵɵelementEnd();
        } }, styles: [".footer[_ngcontent-%COMP%]{left:0;right:0;position:fixed}"], changeDetection: 0 });
    return IonicPullupComponent;
}());
/*@__PURE__*/ (function () { ɵsetClassMetadata(IonicPullupComponent, [{
        type: Component,
        args: [{
                selector: 'lib-ionic-pullup',
                templateUrl: './ionic-pullup.component.html',
                styleUrls: ['./ionic-pullup.component.scss'],
                changeDetection: ChangeDetectionStrategy.OnPush,
            }]
    }], function () { return [{ type: Platform }, { type: Renderer2 }, { type: HammerGestureConfig, decorators: [{
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

var MyHammerConfig = /** @class */ (function (_super) {
    __extends(MyHammerConfig, _super);
    function MyHammerConfig() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.overrides = {
            pan: { direction: DIRECTION_VERTICAL },
        };
        return _this;
    }
    return MyHammerConfig;
}(HammerGestureConfig));
var IonicPullupModule = /** @class */ (function () {
    function IonicPullupModule() {
    }
    /** @nocollapse */ IonicPullupModule.ɵmod = ɵɵdefineNgModule({ type: IonicPullupModule });
    /** @nocollapse */ IonicPullupModule.ɵinj = ɵɵdefineInjector({ factory: function IonicPullupModule_Factory(t) { return new (t || IonicPullupModule)(); }, providers: [
            {
                provide: HAMMER_GESTURE_CONFIG,
                useClass: MyHammerConfig,
            },
        ], imports: [[]] });
    return IonicPullupModule;
}());
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(IonicPullupModule, { declarations: [IonicPullupComponent, IonicPullupComponentTabComponent], exports: [IonicPullupComponent, IonicPullupComponentTabComponent] }); })();
/*@__PURE__*/ (function () { ɵsetClassMetadata(IonicPullupModule, [{
        type: NgModule,
        args: [{
                declarations: [IonicPullupComponent, IonicPullupComponentTabComponent],
                imports: [],
                exports: [IonicPullupComponent, IonicPullupComponentTabComponent],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
                providers: [
                    {
                        provide: HAMMER_GESTURE_CONFIG,
                        useClass: MyHammerConfig,
                    },
                ]
            }]
    }], null, null); })();

/*
 * Public API Surface of ionic-pullup
 */

/**
 * Generated bundle index. Do not edit.
 */

export { IonPullUpFooterBehavior, IonPullUpFooterState, IonicPullupComponent, IonicPullupComponentTabComponent, IonicPullupModule, MyHammerConfig };
//# sourceMappingURL=ionic-pullup.js.map
