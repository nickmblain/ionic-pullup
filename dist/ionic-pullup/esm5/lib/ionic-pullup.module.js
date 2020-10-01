import { __extends } from "tslib";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPullupComponent } from './ionic-pullup.component';
import { IonicPullupComponentTabComponent } from './ionic-pullup-tab.component';
import * as Hammer from 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import * as i0 from "@angular/core";
var MyHammerConfig = /** @class */ (function (_super) {
    __extends(MyHammerConfig, _super);
    function MyHammerConfig() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.overrides = {
            pan: { direction: Hammer.DIRECTION_VERTICAL },
        };
        return _this;
    }
    return MyHammerConfig;
}(HammerGestureConfig));
export { MyHammerConfig };
var IonicPullupModule = /** @class */ (function () {
    function IonicPullupModule() {
    }
    /** @nocollapse */ IonicPullupModule.ɵmod = i0.ɵɵdefineNgModule({ type: IonicPullupModule });
    /** @nocollapse */ IonicPullupModule.ɵinj = i0.ɵɵdefineInjector({ factory: function IonicPullupModule_Factory(t) { return new (t || IonicPullupModule)(); }, providers: [
            {
                provide: HAMMER_GESTURE_CONFIG,
                useClass: MyHammerConfig,
            },
        ], imports: [[]] });
    return IonicPullupModule;
}());
export { IonicPullupModule };
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(IonicPullupModule, { declarations: [IonicPullupComponent, IonicPullupComponentTabComponent], exports: [IonicPullupComponent, IonicPullupComponentTabComponent] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(IonicPullupModule, [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9uaWMtcHVsbHVwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2lvbmljLXB1bGx1cC8iLCJzb3VyY2VzIjpbImxpYi9pb25pYy1wdWxsdXAubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLHNCQUFzQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxnQ0FBZ0MsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ2hGLE9BQU8sS0FBSyxNQUFNLE1BQU0sVUFBVSxDQUFDO0FBQ25DLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDOztBQUV2RjtJQUFvQyxrQ0FBbUI7SUFBdkQ7UUFBQSxxRUFJQztRQUhDLGVBQVMsR0FBRztZQUNWLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsa0JBQWtCLEVBQUU7U0FDOUMsQ0FBQzs7SUFDSixDQUFDO0lBQUQscUJBQUM7QUFBRCxDQUFDLEFBSkQsQ0FBb0MsbUJBQW1CLEdBSXREOztBQUVEO0lBQUE7S0Fha0M7NEVBQXJCLGlCQUFpQjt3SUFBakIsaUJBQWlCLG1CQVBqQjtZQUNUO2dCQUNFLE9BQU8sRUFBRSxxQkFBcUI7Z0JBQzlCLFFBQVEsRUFBRSxjQUFjO2FBQ3pCO1NBQ0YsWUFUUSxFQUNSOzRCQWZIO0NBeUJrQyxBQWJsQyxJQWFrQztTQUFyQixpQkFBaUI7d0ZBQWpCLGlCQUFpQixtQkFaWixvQkFBb0IsRUFBRSxnQ0FBZ0MsYUFHM0Qsb0JBQW9CLEVBQUUsZ0NBQWdDO2tEQVN0RCxpQkFBaUI7Y0FiN0IsUUFBUTtlQUFDO2dCQUNSLFlBQVksRUFBRSxDQUFFLG9CQUFvQixFQUFFLGdDQUFnQyxDQUFFO2dCQUN4RSxPQUFPLEVBQUUsRUFDUjtnQkFDRCxPQUFPLEVBQUUsQ0FBRSxvQkFBb0IsRUFBRSxnQ0FBZ0MsQ0FBRTtnQkFDbkUsT0FBTyxFQUFFLENBQUUsc0JBQXNCLENBQUU7Z0JBQ25DLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxPQUFPLEVBQUUscUJBQXFCO3dCQUM5QixRQUFRLEVBQUUsY0FBYztxQkFDekI7aUJBQ0Y7YUFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBDVVNUT01fRUxFTUVOVFNfU0NIRU1BIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJb25pY1B1bGx1cENvbXBvbmVudCB9IGZyb20gJy4vaW9uaWMtcHVsbHVwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJb25pY1B1bGx1cENvbXBvbmVudFRhYkNvbXBvbmVudCB9IGZyb20gJy4vaW9uaWMtcHVsbHVwLXRhYi5jb21wb25lbnQnO1xuaW1wb3J0ICogYXMgSGFtbWVyIGZyb20gJ2hhbW1lcmpzJztcbmltcG9ydCB7IEhhbW1lckdlc3R1cmVDb25maWcsIEhBTU1FUl9HRVNUVVJFX0NPTkZJRyB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5leHBvcnQgY2xhc3MgTXlIYW1tZXJDb25maWcgZXh0ZW5kcyBIYW1tZXJHZXN0dXJlQ29uZmlnIHtcbiAgb3ZlcnJpZGVzID0ge1xuICAgIHBhbjogeyBkaXJlY3Rpb246IEhhbW1lci5ESVJFQ1RJT05fVkVSVElDQUwgfSxcbiAgfTtcbn1cblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbIElvbmljUHVsbHVwQ29tcG9uZW50LCBJb25pY1B1bGx1cENvbXBvbmVudFRhYkNvbXBvbmVudCBdLFxuICBpbXBvcnRzOiBbXG4gIF0sXG4gIGV4cG9ydHM6IFsgSW9uaWNQdWxsdXBDb21wb25lbnQsIElvbmljUHVsbHVwQ29tcG9uZW50VGFiQ29tcG9uZW50IF0sXG4gIHNjaGVtYXM6IFsgQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQSBdLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBIQU1NRVJfR0VTVFVSRV9DT05GSUcsXG4gICAgICB1c2VDbGFzczogTXlIYW1tZXJDb25maWcsXG4gICAgfSxcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBJb25pY1B1bGx1cE1vZHVsZSB7IH1cbiJdfQ==