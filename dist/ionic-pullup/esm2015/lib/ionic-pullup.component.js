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
const _c0 = ["ionDragFooter"];
const _c1 = ["footer"];
const _c2 = ["*"];
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
export class IonicPullupComponent {
    constructor(platform, renderer, hammerConfig) {
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
    ngOnInit() {
        // console.debug('ionic-pullup => Initializing footer...');
        window.addEventListener('orientationchange', () => {
            // console.debug('ionic-pullup => Changed orientation => updating');
            this.updateUI();
            this.collapse();
        });
        this.platform.resume.subscribe(() => {
            // console.debug('ionic-pullup => Resumed from background => updating');
            this.updateUI();
            this.collapse();
        });
        // compute min boundary of toolbar depending on whether drawer is dockable
        this.footerMeta.toolbarLowerBoundary = this.dockable ? this.minBottomVisible : 0;
    }
    ngAfterContentInit() {
        this.computeDefaults();
        this.state = IonPullUpFooterState.Collapsed;
        this.updateUI();
    }
    get expandedHeight() {
        return window.innerHeight - this.currentViewMeta.toolbarHeight - this.currentViewMeta.tabsHeight;
    }
    computeDefaults() {
        setTimeout(() => {
            this.footerMeta.toolbarDefaultHeight = this.childFooter.nativeElement.offsetHeight;
            this.findIonicComponentsInPage();
            this.dragElements.forEach(elem => {
                const hammer = this.hammerConfig.buildHammer(elem.el);
                hammer.on('pan panstart panend', (ev) => {
                    this.onPan(ev);
                });
            });
        }, 300);
    }
    computeHeights() {
        this.footerMeta.height = this.expandedHeight;
        this.footerMeta.toolbarDefaultExpandedPosition = -this.footerMeta.height + this.footerMeta.toolbarDefaultHeight + this.minBottomVisible;
        this.footerMeta.toolbarUpperBoundary = this.footerMeta.height - this.footerMeta.toolbarDefaultHeight - this.minBottomVisible;
        this.renderer.setStyle(this.childFooter.nativeElement, 'height', this.footerMeta.height + 'px');
        this.renderer.setStyle(this.childFooter.nativeElement, 'top', `${window.innerHeight - this.footerMeta.toolbarDefaultHeight - this.currentViewMeta.tabsHeight - this.minBottomVisible}px`);
        this.updateIonContentHeight();
        // TODO check if this is needed for native platform iOS/Android
        // this.renderer.setStyle(this.childFooter.nativeElement, 'bottom', this.currentViewMeta.tabsHeight + 'px');
    }
    updateUI(isInit = false) {
        if (!this.childFooter) {
            return;
        }
        setTimeout(() => {
            this.computeHeights();
        }, 300);
        this.renderer.setStyle(this.childFooter.nativeElement, 'transition', 'none'); // avoids flickering when changing orientation
    }
    expand() {
        this.footerMeta.lastPosY = this.footerMeta.toolbarDefaultExpandedPosition;
        // reset ionContent scaling
        this.updateIonContentHeight(this.minBottomVisible - this.footerMeta.lastPosY);
        this.renderer.setStyle(this.childFooter.nativeElement, '-webkit-transform', `translate3d(0, ${this.footerMeta.lastPosY}px, 0)`);
        this.renderer.setStyle(this.childFooter.nativeElement, 'transform', `translate3d(0, ${this.footerMeta.lastPosY}px, 0)`);
        this.renderer.setStyle(this.childFooter.nativeElement, 'transition', '300ms ease-in-out');
        this.expanded.emit(null);
    }
    collapse(isInit = false) {
        if (!this.childFooter) {
            return;
        }
        this.footerMeta.lastPosY = 0;
        this.renderer.setStyle(this.childFooter.nativeElement, '-webkit-transform', `translate3d(0, ${this.footerMeta.lastPosY}px, 0)`);
        this.renderer.setStyle(this.childFooter.nativeElement, 'transform', `translate3d(0, ${this.footerMeta.lastPosY}px, 0)`);
        // reset ionContent scaling -> needs 300ms timeout to delay content resize
        setTimeout(() => this.updateIonContentHeight(this.minBottomVisible - this.footerMeta.lastPosY), 300);
        if (!isInit) {
            this.collapsed.emit(null);
        }
    }
    /**
     * TODO
     */
    minimize() {
        this.footerMeta.lastPosY = this.footerMeta.height;
        this.renderer.setStyle(this.childFooter.nativeElement, '-webkit-transform', 'translate3d(0, ' + this.footerMeta.lastPosY + 'px, 0)');
        this.renderer.setStyle(this.childFooter.nativeElement, 'transform', 'translate3d(0, ' + this.footerMeta.lastPosY + 'px, 0)');
        this.minimized.emit(null);
    }
    onTap(e) {
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
    }
    onPan(e) {
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
                const handle = this.dragElements.first;
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
    }
    ngOnChanges(changes) {
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
        window.setTimeout(() => {
            this.stateChange.emit(this.state);
        });
    }
    /**
     * Detect ionic components in page
     */
    findIonicComponentsInPage() {
        this.footerMeta.ionContentRef = this.childFooter.nativeElement.querySelector('ion-content');
        this.currentViewMeta.tabsRef = document.querySelector('ion-tab-bar');
        this.currentViewMeta.tabsHeight = this.currentViewMeta.tabsRef ? this.currentViewMeta.tabsRef.offsetHeight : 0;
        // console.debug(this.currentViewMeta.tabsRef ? 'ionic-pullup => Tabs detected' : 'ionic.pullup => View has no tabs');
        if (!this.toolbarTopMargin) {
            const outletRef = document.querySelector('ion-router-outlet');
            if (outletRef) {
                const headerRef = outletRef.querySelector('ion-header');
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
    }
    /**
     * Update inner ion-content component height when footer is expanded, collapsed or dragged
     * @param maxHeight maximum ionContent height to set
     */
    updateIonContentHeight(maxHeight) {
        if (!this.footerMeta.ionContentRef) {
            return;
        }
        const maxHeightUnits = maxHeight ? `${maxHeight}px` : (this.minBottomVisible > 0 ? `${this.minBottomVisible}px` : '100%');
        this.renderer.setStyle(this.footerMeta.ionContentRef, 'max-height', maxHeightUnits);
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9uaWMtcHVsbHVwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2lvbmljLXB1bGx1cC8iLCJzb3VyY2VzIjpbImxpYi9pb25pYy1wdWxsdXAuY29tcG9uZW50LnRzIiwibGliL2lvbmljLXB1bGx1cC5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7OztFQWFFO0FBQ0YsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFzRCxlQUFlLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5TSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDMUMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLG1CQUFtQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDdkYsT0FBTyxVQUFVLENBQUM7Ozs7Ozs7QUFnQ2xCLE1BQU0sQ0FBTixJQUFZLG9CQUlYO0FBSkQsV0FBWSxvQkFBb0I7SUFDOUIseUVBQWEsQ0FBQTtJQUNiLHVFQUFZLENBQUE7SUFDWix5RUFBYSxDQUFBO0FBQ2YsQ0FBQyxFQUpXLG9CQUFvQixLQUFwQixvQkFBb0IsUUFJL0I7QUFFRCxNQUFNLENBQU4sSUFBWSx1QkFHWDtBQUhELFdBQVksdUJBQXVCO0lBQ2pDLHFFQUFJLENBQUE7SUFDSix5RUFBTSxDQUFBO0FBQ1IsQ0FBQyxFQUhXLHVCQUF1QixLQUF2Qix1QkFBdUIsUUFHbEM7QUFhRCxNQUFNLE9BQU8sb0JBQW9CO0lBeUMvQixZQUNVLFFBQWtCLEVBQ2xCLFFBQW1CLEVBQ1ksWUFBaUM7UUFGaEUsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNsQixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ1ksaUJBQVksR0FBWixZQUFZLENBQXFCO1FBekNoRSxnQkFBVyxHQUF1QyxJQUFJLFlBQVksRUFBd0IsQ0FBQztR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LENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUgsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ3RGLENBQUM7OzJHQXRTVSxvQkFBb0IsOEZBNENyQixxQkFBcUI7NEVBNUNwQixvQkFBb0I7Ozs7Ozs7Ozs7OztRQ3ZFakMsaUNBQ0U7UUFBQSxrQkFBWTtRQUNkLGlCQUFNOztrRERxRU8sb0JBQW9CO2NBTmhDLFNBQVM7ZUFBQztnQkFDVCxRQUFRLEVBQUUsa0JBQWtCO2dCQUM1QixXQUFXLEVBQUUsK0JBQStCO2dCQUM1QyxTQUFTLEVBQUUsQ0FBQywrQkFBK0IsQ0FBQztnQkFDNUMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07YUFDaEQ7O3NCQTZDSSxNQUFNO3VCQUFDLHFCQUFxQjs7a0JBMUM5QixLQUFLOztrQkFDTCxNQUFNOztrQkFFTixLQUFLOztrQkFDTCxLQUFLOztrQkFRTCxLQUFLOztrQkFLTCxLQUFLOztrQkFLTCxLQUFLOztrQkFFTCxNQUFNOztrQkFDTixNQUFNOztrQkFDTixNQUFNOztrQkFLTixNQUFNOztrQkFFTixTQUFTO21CQUFDLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7O2tCQUNwQyxlQUFlO21CQUFDLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuaW9uaWMtcHVsbHVwIHY0IGZvciBJb25pYyA0IGFuZCBBbmd1bGFyIDhcblxuQ29weXJpZ2h0IDIwMjAgQXJpZWwgRmF1ciAoaHR0cHM6Ly9naXRodWIuY29tL2FyaWVsZmF1cilcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG55b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG5Zb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcblVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbmRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbldJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxubGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4qL1xuaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBSZW5kZXJlcjIsIFZpZXdDaGlsZCwgT3V0cHV0LCBJbnB1dCwgT25Jbml0LCBBZnRlckNvbnRlbnRJbml0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIENvbnRlbnRDaGlsZHJlbiwgUXVlcnlMaXN0LCBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBsYXRmb3JtIH0gZnJvbSAnQGlvbmljL2FuZ3VsYXInO1xuaW1wb3J0IHsgSEFNTUVSX0dFU1RVUkVfQ09ORklHLCBIYW1tZXJHZXN0dXJlQ29uZmlnIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgJ2hhbW1lcmpzJztcblxuZXhwb3J0IGludGVyZmFjZSBGb290ZXJNZXRhZGF0YSB7XG4gIGhlaWdodDogbnVtYmVyO1xuICBwb3NZOiBudW1iZXI7XG4gIGxhc3RQb3NZOiBudW1iZXI7XG4gIHRvb2xiYXJEZWZhdWx0SGVpZ2h0PzogbnVtYmVyO1xuICB0b29sYmFyRGVmYXVsdEV4cGFuZGVkUG9zaXRpb24/OiBudW1iZXI7XG4gIHRvb2xiYXJVcHBlckJvdW5kYXJ5PzogbnVtYmVyO1xuICB0b29sYmFyTG93ZXJCb3VuZGFyeT86IG51bWJlcjtcbiAgaW9uQ29udGVudFJlZj86IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBWaWV3TWV0YWRhdGEge1xuICB0YWJzUmVmPzogRWxlbWVudDtcbiAgdGFic0hlaWdodD86IG51bWJlcjtcbiAgaGFzQm90dG9tVGFicz86IGJvb2xlYW47XG4gIHRvb2xiYXJSZWY/OiBFbGVtZW50O1xuICB0b29sYmFySGVpZ2h0PzogbnVtYmVyO1xuICBib3R0b21TcGFjZT86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBGb290ZXJUYWIge1xuICB4PzogbnVtYmVyO1xuICB5PzogbnVtYmVyO1xuICB1cHBlckxlZnRSYWRpdXM/OiBudW1iZXI7XG4gIHVwcGVyUmlnaHRSYWRpdXM/OiBudW1iZXI7XG4gIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcbiAgY29sb3I/OiBzdHJpbmc7XG4gIGNvbnRlbnQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBlbnVtIElvblB1bGxVcEZvb3RlclN0YXRlIHtcbiAgQ29sbGFwc2VkID0gMCxcbiAgRXhwYW5kZWQgPSAxLFxuICBNaW5pbWl6ZWQgPSAyXG59XG5cbmV4cG9ydCBlbnVtIElvblB1bGxVcEZvb3RlckJlaGF2aW9yIHtcbiAgSGlkZSxcbiAgRXhwYW5kXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRHJhZ2dlZE91dHB1dEV2ZW50IHtcbiAgZGVsdGE6IG51bWJlcjtcbiAgdG9vbGJhckFic29sdXRlUG9zaXRpb246IERPTVJlY3Q7XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2xpYi1pb25pYy1wdWxsdXAnLFxuICB0ZW1wbGF0ZVVybDogJy4vaW9uaWMtcHVsbHVwLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vaW9uaWMtcHVsbHVwLmNvbXBvbmVudC5zY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBJb25pY1B1bGx1cENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJDb250ZW50SW5pdCwgT25DaGFuZ2VzIHtcblxuICBASW5wdXQoKSBzdGF0ZTogSW9uUHVsbFVwRm9vdGVyU3RhdGU7XG4gIEBPdXRwdXQoKSBzdGF0ZUNoYW5nZTogRXZlbnRFbWl0dGVyPElvblB1bGxVcEZvb3RlclN0YXRlPiA9IG5ldyBFdmVudEVtaXR0ZXI8SW9uUHVsbFVwRm9vdGVyU3RhdGU+KCk7XG5cbiAgQElucHV0KCkgaW5pdGlhbFN0YXRlOiBJb25QdWxsVXBGb290ZXJTdGF0ZTsgICAgICAgICAgLy8gVE9ETyBpbXBsZW1tZW50XG4gIEBJbnB1dCgpIGRlZmF1bHRCZWhhdmlvcjogSW9uUHVsbFVwRm9vdGVyQmVoYXZpb3I7ICAgIC8vIFRPRE8gaW1wbGVtbWVudFxuICBcblxuXG4gIC8qKlxuICAgKiAgTWF4aW11bSBleHBhbmRlZCBwb3NpdGlvbiAtIHVzZWZ1bCBpZiB0aGVyZSBhcmUgdG9wIGhlYWRlcnNcbiAgICogIElmIG5vdCBwcm92aWRlZCBieSBkZWZhdWx0IGNvbXB1dGVzIGF2YWlsYWJsZSBzY3JlZW4gbWludXMgdGFicyBhbmQgaGVhZGVyc1xuICAgKi9cbiAgQElucHV0KCkgdG9vbGJhclRvcE1hcmdpbiA9IDA7XG5cbiAgLyoqXG4gICAqICBNaW5pbXVtIHBvc2l0aW9uIC0gdXNlZnVsIHRvIGtlZXAgYSBwYXJ0IG9mIHRoZSBmb290ZXIgYWx3YXlzIHZpc2libGUgYXQgdGhlIGJvdHRvbVxuICAgKi9cbiAgQElucHV0KCkgbWluQm90dG9tVmlzaWJsZSA9IDA7XG5cbiAgLyoqXG4gICAqIElmIHRydWUsIGZvb3RlciBjYW4gYmUgZG9ja2VkIGF0IHRoZSBib3R0b21cbiAgICovXG4gIEBJbnB1dCgpIGRvY2thYmxlOiBib29sZWFuO1xuXG4gIEBPdXRwdXQoKSBleHBhbmRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgY29sbGFwc2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBtaW5pbWl6ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAvKipcbiAgICogT3V0cHV0cyB0aGUgYW1vdW50IG9mIHBpeGVscyB0aGUgdXNlciBoYXMgZHJhZ2dlZCBwb3NpdGl2ZSBvciBuZWdhdGl2ZVxuICAgKi9cbiAgQE91dHB1dCgpIGRyYWdnZWQgPSBuZXcgRXZlbnRFbWl0dGVyPERyYWdnZWRPdXRwdXRFdmVudD4oKTtcblxuICBAVmlld0NoaWxkKCdmb290ZXInLCB7IHN0YXRpYzogdHJ1ZSB9KSBjaGlsZEZvb3RlcjtcbiAgQENvbnRlbnRDaGlsZHJlbignaW9uRHJhZ0Zvb3RlcicpIGRyYWdFbGVtZW50cyAhOiBRdWVyeUxpc3Q8YW55PjtcblxuICBwcm90ZWN0ZWQgZm9vdGVyTWV0YTogRm9vdGVyTWV0YWRhdGE7XG4gIHByb3RlY3RlZCBjdXJyZW50Vmlld01ldGE6IFZpZXdNZXRhZGF0YTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgQEluamVjdChIQU1NRVJfR0VTVFVSRV9DT05GSUcpIHByaXZhdGUgaGFtbWVyQ29uZmlnOiBIYW1tZXJHZXN0dXJlQ29uZmlnKSB7XG4gICAgdGhpcy5mb290ZXJNZXRhID0ge1xuICAgICAgaGVpZ2h0OiAwLFxuICAgICAgcG9zWTogMCxcbiAgICAgIGxhc3RQb3NZOiAwXG4gICAgfTtcbiAgICB0aGlzLmN1cnJlbnRWaWV3TWV0YSA9IHsgYm90dG9tU3BhY2U6IHNjcmVlbi5oZWlnaHQgLSB3aW5kb3cuaW5uZXJIZWlnaHQgfTtcblxuICAgIC8vIHNldHMgaW5pdGlhbCBzdGF0ZVxuICAgIHRoaXMuaW5pdGlhbFN0YXRlID0gdGhpcy5pbml0aWFsU3RhdGUgfHwgSW9uUHVsbFVwRm9vdGVyU3RhdGUuQ29sbGFwc2VkO1xuICAgIHRoaXMuZGVmYXVsdEJlaGF2aW9yID0gdGhpcy5kZWZhdWx0QmVoYXZpb3IgfHwgSW9uUHVsbFVwRm9vdGVyQmVoYXZpb3IuRXhwYW5kO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gY29uc29sZS5kZWJ1ZygnaW9uaWMtcHVsbHVwID0+IEluaXRpYWxpemluZyBmb290ZXIuLi4nKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsICgpID0+IHtcbiAgICAgIC8vIGNvbnNvbGUuZGVidWcoJ2lvbmljLXB1bGx1cCA9PiBDaGFuZ2VkIG9yaWVudGF0aW9uID0+IHVwZGF0aW5nJyk7XG4gICAgICB0aGlzLnVwZGF0ZVVJKCk7XG4gICAgICB0aGlzLmNvbGxhcHNlKCk7XG4gICAgfSk7XG4gICAgdGhpcy5wbGF0Zm9ybS5yZXN1bWUuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIC8vIGNvbnNvbGUuZGVidWcoJ2lvbmljLXB1bGx1cCA9PiBSZXN1bWVkIGZyb20gYmFja2dyb3VuZCA9PiB1cGRhdGluZycpO1xuICAgICAgdGhpcy51cGRhdGVVSSgpO1xuICAgICAgdGhpcy5jb2xsYXBzZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gY29tcHV0ZSBtaW4gYm91bmRhcnkgb2YgdG9vbGJhciBkZXBlbmRpbmcgb24gd2hldGhlciBkcmF3ZXIgaXMgZG9ja2FibGVcbiAgICB0aGlzLmZvb3Rlck1ldGEudG9vbGJhckxvd2VyQm91bmRhcnkgPSB0aGlzLmRvY2thYmxlID8gdGhpcy5taW5Cb3R0b21WaXNpYmxlIDogMDtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLmNvbXB1dGVEZWZhdWx0cygpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IElvblB1bGxVcEZvb3RlclN0YXRlLkNvbGxhcHNlZDtcblxuICAgIHRoaXMudXBkYXRlVUkoKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgZXhwYW5kZWRIZWlnaHQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0IC0gdGhpcy5jdXJyZW50Vmlld01ldGEudG9vbGJhckhlaWdodCAtIHRoaXMuY3VycmVudFZpZXdNZXRhLnRhYnNIZWlnaHQ7XG4gIH1cblxuICBjb21wdXRlRGVmYXVsdHMoKSB7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuZm9vdGVyTWV0YS50b29sYmFyRGVmYXVsdEhlaWdodCA9IHRoaXMuY2hpbGRGb290ZXIubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgIHRoaXMuZmluZElvbmljQ29tcG9uZW50c0luUGFnZSgpO1xuXG4gICAgICB0aGlzLmRyYWdFbGVtZW50cy5mb3JFYWNoKGVsZW0gPT4ge1xuICAgICAgICBjb25zdCBoYW1tZXIgPSB0aGlzLmhhbW1lckNvbmZpZy5idWlsZEhhbW1lcihlbGVtLmVsKTtcbiAgICAgICAgaGFtbWVyLm9uKCdwYW4gcGFuc3RhcnQgcGFuZW5kJywgKGV2KSA9PiB7XG4gICAgICAgICAgdGhpcy5vblBhbihldik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSwgMzAwKTtcbiAgfVxuXG4gIGNvbXB1dGVIZWlnaHRzKCkge1xuICAgIHRoaXMuZm9vdGVyTWV0YS5oZWlnaHQgPSB0aGlzLmV4cGFuZGVkSGVpZ2h0O1xuICAgIHRoaXMuZm9vdGVyTWV0YS50b29sYmFyRGVmYXVsdEV4cGFuZGVkUG9zaXRpb24gPSAtdGhpcy5mb290ZXJNZXRhLmhlaWdodCArIHRoaXMuZm9vdGVyTWV0YS50b29sYmFyRGVmYXVsdEhlaWdodCArIHRoaXMubWluQm90dG9tVmlzaWJsZTtcbiAgICB0aGlzLmZvb3Rlck1ldGEudG9vbGJhclVwcGVyQm91bmRhcnkgPSB0aGlzLmZvb3Rlck1ldGEuaGVpZ2h0IC0gdGhpcy5mb290ZXJNZXRhLnRvb2xiYXJEZWZhdWx0SGVpZ2h0IC0gdGhpcy5taW5Cb3R0b21WaXNpYmxlO1xuICAgIFxuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5jaGlsZEZvb3Rlci5uYXRpdmVFbGVtZW50LCAnaGVpZ2h0JywgdGhpcy5mb290ZXJNZXRhLmhlaWdodCArICdweCcpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5jaGlsZEZvb3Rlci5uYXRpdmVFbGVtZW50LCAndG9wJyxcbiAgICAgIGAke3dpbmRvdy5pbm5lckhlaWdodCAtIHRoaXMuZm9vdGVyTWV0YS50b29sYmFyRGVmYXVsdEhlaWdodCAtIHRoaXMuY3VycmVudFZpZXdNZXRhLnRhYnNIZWlnaHQgLSB0aGlzLm1pbkJvdHRvbVZpc2libGV9cHhgXG4gICAgKTtcblxuICAgIHRoaXMudXBkYXRlSW9uQ29udGVudEhlaWdodCgpO1xuXG4gICAgLy8gVE9ETyBjaGVjayBpZiB0aGlzIGlzIG5lZWRlZCBmb3IgbmF0aXZlIHBsYXRmb3JtIGlPUy9BbmRyb2lkXG4gICAgLy8gdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmNoaWxkRm9vdGVyLm5hdGl2ZUVsZW1lbnQsICdib3R0b20nLCB0aGlzLmN1cnJlbnRWaWV3TWV0YS50YWJzSGVpZ2h0ICsgJ3B4Jyk7XG4gIH1cblxuICB1cGRhdGVVSShpc0luaXQ6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGlmICghdGhpcy5jaGlsZEZvb3RlcikgeyByZXR1cm47IH1cblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5jb21wdXRlSGVpZ2h0cygpO1xuICAgIH0sIDMwMCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmNoaWxkRm9vdGVyLm5hdGl2ZUVsZW1lbnQsICd0cmFuc2l0aW9uJywgJ25vbmUnKTsgIC8vIGF2b2lkcyBmbGlja2VyaW5nIHdoZW4gY2hhbmdpbmcgb3JpZW50YXRpb25cbiAgfVxuXG4gIGV4cGFuZCgpIHtcbiAgICB0aGlzLmZvb3Rlck1ldGEubGFzdFBvc1kgPSB0aGlzLmZvb3Rlck1ldGEudG9vbGJhckRlZmF1bHRFeHBhbmRlZFBvc2l0aW9uO1xuXG4gICAgLy8gcmVzZXQgaW9uQ29udGVudCBzY2FsaW5nXG4gICAgdGhpcy51cGRhdGVJb25Db250ZW50SGVpZ2h0KHRoaXMubWluQm90dG9tVmlzaWJsZSAtIHRoaXMuZm9vdGVyTWV0YS5sYXN0UG9zWSk7XG5cbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuY2hpbGRGb290ZXIubmF0aXZlRWxlbWVudCwgJy13ZWJraXQtdHJhbnNmb3JtJywgYHRyYW5zbGF0ZTNkKDAsICR7dGhpcy5mb290ZXJNZXRhLmxhc3RQb3NZfXB4LCAwKWApO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5jaGlsZEZvb3Rlci5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgYHRyYW5zbGF0ZTNkKDAsICR7dGhpcy5mb290ZXJNZXRhLmxhc3RQb3NZfXB4LCAwKWApO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5jaGlsZEZvb3Rlci5uYXRpdmVFbGVtZW50LCAndHJhbnNpdGlvbicsICczMDBtcyBlYXNlLWluLW91dCcpO1xuXG4gICAgdGhpcy5leHBhbmRlZC5lbWl0KG51bGwpO1xuICB9XG5cbiAgY29sbGFwc2UoaXNJbml0OiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBpZiAoIXRoaXMuY2hpbGRGb290ZXIpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5mb290ZXJNZXRhLmxhc3RQb3NZID0gMDtcblxuIFxuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5jaGlsZEZvb3Rlci5uYXRpdmVFbGVtZW50LCAnLXdlYmtpdC10cmFuc2Zvcm0nLCBgdHJhbnNsYXRlM2QoMCwgJHt0aGlzLmZvb3Rlck1ldGEubGFzdFBvc1l9cHgsIDApYCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmNoaWxkRm9vdGVyLm5hdGl2ZUVsZW1lbnQsICd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlM2QoMCwgJHt0aGlzLmZvb3Rlck1ldGEubGFzdFBvc1l9cHgsIDApYCk7XG5cbiAgICAvLyByZXNldCBpb25Db250ZW50IHNjYWxpbmcgLT4gbmVlZHMgMzAwbXMgdGltZW91dCB0byBkZWxheSBjb250ZW50IHJlc2l6ZVxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy51cGRhdGVJb25Db250ZW50SGVpZ2h0KHRoaXMubWluQm90dG9tVmlzaWJsZSAtIHRoaXMuZm9vdGVyTWV0YS5sYXN0UG9zWSksIDMwMCk7XG5cbiAgICBpZiAoIWlzSW5pdCkgeyB0aGlzLmNvbGxhcHNlZC5lbWl0KG51bGwpOyB9XG4gIH1cblxuICAvKipcbiAgICogVE9ET1xuICAgKi9cbiAgbWluaW1pemUoKSB7XG4gICAgdGhpcy5mb290ZXJNZXRhLmxhc3RQb3NZID0gdGhpcy5mb290ZXJNZXRhLmhlaWdodDtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuY2hpbGRGb290ZXIubmF0aXZlRWxlbWVudCwgJy13ZWJraXQtdHJhbnNmb3JtJywgJ3RyYW5zbGF0ZTNkKDAsICcgKyB0aGlzLmZvb3Rlck1ldGEubGFzdFBvc1kgKyAncHgsIDApJyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmNoaWxkRm9vdGVyLm5hdGl2ZUVsZW1lbnQsICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlM2QoMCwgJyArIHRoaXMuZm9vdGVyTWV0YS5sYXN0UG9zWSArICdweCwgMCknKTtcblxuICAgIHRoaXMubWluaW1pemVkLmVtaXQobnVsbCk7XG4gIH1cblxuXG4gIG9uVGFwKGU6IGFueSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmICh0aGlzLnN0YXRlID09PSBJb25QdWxsVXBGb290ZXJTdGF0ZS5Db2xsYXBzZWQpIHtcbiAgICAgIGlmICh0aGlzLmRlZmF1bHRCZWhhdmlvciA9PT0gSW9uUHVsbFVwRm9vdGVyQmVoYXZpb3IuSGlkZSkge1xuICAgICAgICB0aGlzLnN0YXRlID0gSW9uUHVsbFVwRm9vdGVyU3RhdGUuTWluaW1pemVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IElvblB1bGxVcEZvb3RlclN0YXRlLkV4cGFuZGVkO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gSW9uUHVsbFVwRm9vdGVyU3RhdGUuTWluaW1pemVkKSB7XG4gICAgICAgIGlmICh0aGlzLmRlZmF1bHRCZWhhdmlvciA9PT0gSW9uUHVsbFVwRm9vdGVyQmVoYXZpb3IuSGlkZSkge1xuICAgICAgICAgIHRoaXMuc3RhdGUgPSBJb25QdWxsVXBGb290ZXJTdGF0ZS5Db2xsYXBzZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zdGF0ZSA9IElvblB1bGxVcEZvb3RlclN0YXRlLkV4cGFuZGVkO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBmb290ZXIgaXMgZXhwYW5kZWRcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHRoaXMuaW5pdGlhbFN0YXRlID09PSBJb25QdWxsVXBGb290ZXJTdGF0ZS5NaW5pbWl6ZWQgPyBJb25QdWxsVXBGb290ZXJTdGF0ZS5NaW5pbWl6ZWQgOiBJb25QdWxsVXBGb290ZXJTdGF0ZS5Db2xsYXBzZWQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICBvblBhbihlOiBIYW1tZXJJbnB1dCkge1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5jaGlsZEZvb3Rlci5uYXRpdmVFbGVtZW50LCAndHJhbnNpdGlvbicsICdub25lJyk7XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBcblxuICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICBjYXNlICdwYW4nOlxuICAgICAgICB0aGlzLmZvb3Rlck1ldGEucG9zWSA9IGUuZGVsdGFZICsgdGhpcy5mb290ZXJNZXRhLmxhc3RQb3NZO1xuXG4gICAgICAgIC8vIGNoZWNrIGZvciBtaW4gYW5kIG1heCBib3VuZGFyaWVzIG9mIGRyYWdnYWJsZSB0b29sYmFyXG4gICAgICAgIHRoaXMuZm9vdGVyTWV0YS5wb3NZID0gdGhpcy5mb290ZXJNZXRhLnBvc1kgPiB0aGlzLmZvb3Rlck1ldGEudG9vbGJhckxvd2VyQm91bmRhcnkgPyB0aGlzLmZvb3Rlck1ldGEudG9vbGJhckxvd2VyQm91bmRhcnkgOlxuICAgICAgICAgIChNYXRoLmFicyh0aGlzLmZvb3Rlck1ldGEucG9zWSkgPiB0aGlzLmZvb3Rlck1ldGEudG9vbGJhclVwcGVyQm91bmRhcnkgP1xuICAgICAgICAgICAgdGhpcy5mb290ZXJNZXRhLnRvb2xiYXJEZWZhdWx0RXhwYW5kZWRQb3NpdGlvbiA6XG4gICAgICAgICAgICB0aGlzLmZvb3Rlck1ldGEucG9zWSk7XG5cbiAgICAgICAgLy8gaW9uQ29udGVudCBzY2FsaW5nIC0gRklYIHNjcm9sbGluZyBidWdcbiAgICAgICAgdGhpcy51cGRhdGVJb25Db250ZW50SGVpZ2h0KHRoaXMubWluQm90dG9tVmlzaWJsZSAtIHRoaXMuZm9vdGVyTWV0YS5wb3NZKTtcblxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuY2hpbGRGb290ZXIubmF0aXZlRWxlbWVudCwgJy13ZWJraXQtdHJhbnNmb3JtJywgJ3RyYW5zbGF0ZTNkKDAsICcgKyB0aGlzLmZvb3Rlck1ldGEucG9zWSArICdweCwgMCknKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmNoaWxkRm9vdGVyLm5hdGl2ZUVsZW1lbnQsICd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlM2QoMCwgJyArIHRoaXMuZm9vdGVyTWV0YS5wb3NZICsgJ3B4LCAwKScpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3BhbmVuZCc6XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5jaGlsZEZvb3Rlci5uYXRpdmVFbGVtZW50LCAndHJhbnNpdGlvbicsICczMDBtcyBlYXNlLWluLW91dCcpO1xuICAgICAgICB0aGlzLmZvb3Rlck1ldGEubGFzdFBvc1kgPSB0aGlzLmZvb3Rlck1ldGEucG9zWTtcblxuICAgICAgICAvLyBpb25Db250ZW50IHNjYWxpbmcgLSBGSVggc2Nyb2xsaW5nIGJ1Z1xuICAgICAgICB0aGlzLnVwZGF0ZUlvbkNvbnRlbnRIZWlnaHQodGhpcy5taW5Cb3R0b21WaXNpYmxlIC0gdGhpcy5mb290ZXJNZXRhLmxhc3RQb3NZKTtcblxuICAgICAgICAvLyBlbWl0IGxhc3QgZm9vdGVyIHBvc2l0aW9uIGFmdGVyIGRyYWdnaW5nIGVuZHNcbiAgICAgICAgY29uc3QgaGFuZGxlID0gdGhpcy5kcmFnRWxlbWVudHMuZmlyc3Q7XG4gICAgICAgIHRoaXMuZHJhZ2dlZC5lbWl0KHtcbiAgICAgICAgICBkZWx0YTogdGhpcy5mb290ZXJNZXRhLmxhc3RQb3NZLFxuICAgICAgICAgIHRvb2xiYXJBYnNvbHV0ZVBvc2l0aW9uOiBoYW5kbGUgPyBoYW5kbGUuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkgOiBudWxsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFRPRE8gYXV0byBkb2NrXG4gICAgICAgIC8vIGlmICh0aGlzLmZvb3Rlck1ldGEubGFzdFBvc1kgPiB0aGlzLmZvb3Rlck1ldGEuaGVpZ2h0IC0gdGhpcy5mb290ZXJNZXRhLmRlZmF1bHRIZWlnaHQpIHtcbiAgICAgICAgLy8gICB0aGlzLnN0YXRlID0gIElvblB1bGxVcEZvb3RlclN0YXRlLkNvbGxhcHNlZDtcbiAgICAgICAgLy8gfVxuXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5zdGF0ZS5pc0ZpcnN0Q2hhbmdlKCkgfHwgY2hhbmdlcy5zdGF0ZS5jdXJyZW50VmFsdWUgPT09IGNoYW5nZXMuc3RhdGUucHJldmlvdXNWYWx1ZSkgeyByZXR1cm47IH1cblxuICAgIHN3aXRjaCAodGhpcy5zdGF0ZSkge1xuICAgICAgY2FzZSBJb25QdWxsVXBGb290ZXJTdGF0ZS5Db2xsYXBzZWQ6XG4gICAgICAgIHRoaXMuY29sbGFwc2UoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIElvblB1bGxVcEZvb3RlclN0YXRlLkV4cGFuZGVkOlxuICAgICAgICB0aGlzLmV4cGFuZCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgSW9uUHVsbFVwRm9vdGVyU3RhdGUuTWluaW1pemVkOlxuICAgICAgICB0aGlzLm1pbmltaXplKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIFRPRE86IGZpeCBoYWNrIGR1ZSB0byBCVUcgKGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzYwMDUpXG4gICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZS5lbWl0KHRoaXMuc3RhdGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVjdCBpb25pYyBjb21wb25lbnRzIGluIHBhZ2VcbiAgICovXG4gIHByaXZhdGUgZmluZElvbmljQ29tcG9uZW50c0luUGFnZSgpIHtcbiAgICB0aGlzLmZvb3Rlck1ldGEuaW9uQ29udGVudFJlZiA9IHRoaXMuY2hpbGRGb290ZXIubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdpb24tY29udGVudCcpO1xuXG4gICAgdGhpcy5jdXJyZW50Vmlld01ldGEudGFic1JlZiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lvbi10YWItYmFyJyk7XG4gICAgdGhpcy5jdXJyZW50Vmlld01ldGEudGFic0hlaWdodCA9IHRoaXMuY3VycmVudFZpZXdNZXRhLnRhYnNSZWYgPyAodGhpcy5jdXJyZW50Vmlld01ldGEudGFic1JlZiBhcyBIVE1MRWxlbWVudCkub2Zmc2V0SGVpZ2h0IDogMDtcbiAgICAvLyBjb25zb2xlLmRlYnVnKHRoaXMuY3VycmVudFZpZXdNZXRhLnRhYnNSZWYgPyAnaW9uaWMtcHVsbHVwID0+IFRhYnMgZGV0ZWN0ZWQnIDogJ2lvbmljLnB1bGx1cCA9PiBWaWV3IGhhcyBubyB0YWJzJyk7XG5cbiAgICBpZiAoIXRoaXMudG9vbGJhclRvcE1hcmdpbikge1xuICAgICAgY29uc3Qgb3V0bGV0UmVmID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW9uLXJvdXRlci1vdXRsZXQnKTtcbiAgICAgIGlmIChvdXRsZXRSZWYpIHtcbiAgICAgICAgY29uc3QgaGVhZGVyUmVmID0gb3V0bGV0UmVmLnF1ZXJ5U2VsZWN0b3IoJ2lvbi1oZWFkZXInKTtcbiAgICAgICAgaWYgKGhlYWRlclJlZikge1xuICAgICAgICAgIHRoaXMuY3VycmVudFZpZXdNZXRhLnRvb2xiYXJSZWYgPSBoZWFkZXJSZWYucXVlcnlTZWxlY3RvcignaW9uLXRvb2xiYXInKTtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRWaWV3TWV0YS50b29sYmFySGVpZ2h0ID0gdGhpcy5jdXJyZW50Vmlld01ldGEudG9vbGJhclJlZi5jbGllbnRIZWlnaHQ7XG4gICAgICAgICAgLy8gY29uc29sZS5kZWJ1Zyh0aGlzLmN1cnJlbnRWaWV3TWV0YS50b29sYmFyUmVmID8gYGlvbmljLXB1bGx1cCA9PiBUb29sYmFyIGRldGVjdGVkYCA6ICdpb25pYy5wdWxsdXAgPT4gVmlldyBoYXMgbm8gdGFicycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY3VycmVudFZpZXdNZXRhLnRvb2xiYXJIZWlnaHQgPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3VycmVudFZpZXdNZXRhLnRvb2xiYXJIZWlnaHQgPSB0aGlzLnRvb2xiYXJUb3BNYXJnaW47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBpbm5lciBpb24tY29udGVudCBjb21wb25lbnQgaGVpZ2h0IHdoZW4gZm9vdGVyIGlzIGV4cGFuZGVkLCBjb2xsYXBzZWQgb3IgZHJhZ2dlZFxuICAgKiBAcGFyYW0gbWF4SGVpZ2h0IG1heGltdW0gaW9uQ29udGVudCBoZWlnaHQgdG8gc2V0XG4gICAqL1xuICBwcml2YXRlIHVwZGF0ZUlvbkNvbnRlbnRIZWlnaHQobWF4SGVpZ2h0PzogbnVtYmVyKSB7XG4gICAgaWYgKCF0aGlzLmZvb3Rlck1ldGEuaW9uQ29udGVudFJlZikgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IG1heEhlaWdodFVuaXRzID0gbWF4SGVpZ2h0ID8gYCR7bWF4SGVpZ2h0fXB4YCA6ICh0aGlzLm1pbkJvdHRvbVZpc2libGUgPiAwID8gYCR7dGhpcy5taW5Cb3R0b21WaXNpYmxlfXB4YCA6ICcxMDAlJyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmZvb3Rlck1ldGEuaW9uQ29udGVudFJlZiwgJ21heC1oZWlnaHQnLCBtYXhIZWlnaHRVbml0cyk7XG4gIH1cblxufVxuXG5cbiIsIjxkaXYgY2xhc3M9XCJmb290ZXJcIiAjZm9vdGVyPlxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG48L2Rpdj4iXX0=