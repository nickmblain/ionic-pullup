import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPullupComponent } from './ionic-pullup.component';
import { IonicPullupComponentTabComponent } from './ionic-pullup-tab.component';
import * as Hammer from 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import * as i0 from "@angular/core";
export class MyHammerConfig extends HammerGestureConfig {
    constructor() {
        super(...arguments);
        this.overrides = {
            pan: { direction: Hammer.DIRECTION_VERTICAL },
        };
    }
}
export class IonicPullupModule {
}
/** @nocollapse */ IonicPullupModule.ɵmod = i0.ɵɵdefineNgModule({ type: IonicPullupModule });
/** @nocollapse */ IonicPullupModule.ɵinj = i0.ɵɵdefineInjector({ factory: function IonicPullupModule_Factory(t) { return new (t || IonicPullupModule)(); }, providers: [
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: MyHammerConfig,
        },
    ], imports: [[]] });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9uaWMtcHVsbHVwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2lvbmljLXB1bGx1cC8iLCJzb3VyY2VzIjpbImxpYi9pb25pYy1wdWxsdXAubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDakUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDaEUsT0FBTyxFQUFFLGdDQUFnQyxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDaEYsT0FBTyxLQUFLLE1BQU0sTUFBTSxVQUFVLENBQUM7QUFDbkMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLHFCQUFxQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7O0FBRXZGLE1BQU0sT0FBTyxjQUFlLFNBQVEsbUJBQW1CO0lBQXZEOztRQUNFLGNBQVMsR0FBRztZQUNWLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsa0JBQWtCLEVBQUU7U0FDOUMsQ0FBQztJQUNKLENBQUM7Q0FBQTtBQWVELE1BQU0sT0FBTyxpQkFBaUI7O3dFQUFqQixpQkFBaUI7b0lBQWpCLGlCQUFpQixtQkFQakI7UUFDVDtZQUNFLE9BQU8sRUFBRSxxQkFBcUI7WUFDOUIsUUFBUSxFQUFFLGNBQWM7U0FDekI7S0FDRixZQVRRLEVBQ1I7d0ZBVVUsaUJBQWlCLG1CQVpaLG9CQUFvQixFQUFFLGdDQUFnQyxhQUczRCxvQkFBb0IsRUFBRSxnQ0FBZ0M7a0RBU3RELGlCQUFpQjtjQWI3QixRQUFRO2VBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUUsb0JBQW9CLEVBQUUsZ0NBQWdDLENBQUU7Z0JBQ3hFLE9BQU8sRUFBRSxFQUNSO2dCQUNELE9BQU8sRUFBRSxDQUFFLG9CQUFvQixFQUFFLGdDQUFnQyxDQUFFO2dCQUNuRSxPQUFPLEVBQUUsQ0FBRSxzQkFBc0IsQ0FBRTtnQkFDbkMsU0FBUyxFQUFFO29CQUNUO3dCQUNFLE9BQU8sRUFBRSxxQkFBcUI7d0JBQzlCLFFBQVEsRUFBRSxjQUFjO3FCQUN6QjtpQkFDRjthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIENVU1RPTV9FTEVNRU5UU19TQ0hFTUEgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IElvbmljUHVsbHVwQ29tcG9uZW50IH0gZnJvbSAnLi9pb25pYy1wdWxsdXAuY29tcG9uZW50JztcbmltcG9ydCB7IElvbmljUHVsbHVwQ29tcG9uZW50VGFiQ29tcG9uZW50IH0gZnJvbSAnLi9pb25pYy1wdWxsdXAtdGFiLmNvbXBvbmVudCc7XG5pbXBvcnQgKiBhcyBIYW1tZXIgZnJvbSAnaGFtbWVyanMnO1xuaW1wb3J0IHsgSGFtbWVyR2VzdHVyZUNvbmZpZywgSEFNTUVSX0dFU1RVUkVfQ09ORklHIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmV4cG9ydCBjbGFzcyBNeUhhbW1lckNvbmZpZyBleHRlbmRzIEhhbW1lckdlc3R1cmVDb25maWcge1xuICBvdmVycmlkZXMgPSB7XG4gICAgcGFuOiB7IGRpcmVjdGlvbjogSGFtbWVyLkRJUkVDVElPTl9WRVJUSUNBTCB9LFxuICB9O1xufVxuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFsgSW9uaWNQdWxsdXBDb21wb25lbnQsIElvbmljUHVsbHVwQ29tcG9uZW50VGFiQ29tcG9uZW50IF0sXG4gIGltcG9ydHM6IFtcbiAgXSxcbiAgZXhwb3J0czogWyBJb25pY1B1bGx1cENvbXBvbmVudCwgSW9uaWNQdWxsdXBDb21wb25lbnRUYWJDb21wb25lbnQgXSxcbiAgc2NoZW1hczogWyBDVVNUT01fRUxFTUVOVFNfU0NIRU1BIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IEhBTU1FUl9HRVNUVVJFX0NPTkZJRyxcbiAgICAgIHVzZUNsYXNzOiBNeUhhbW1lckNvbmZpZyxcbiAgICB9LFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIElvbmljUHVsbHVwTW9kdWxlIHsgfVxuIl19