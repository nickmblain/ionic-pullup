import { HammerGestureConfig } from '@angular/platform-browser';
import * as i0 from "@angular/core";
import * as i1 from "./ionic-pullup.component";
import * as i2 from "./ionic-pullup-tab.component";
export declare class MyHammerConfig extends HammerGestureConfig {
    overrides: {
        pan: {
            direction: number;
        };
    };
}
export declare class IonicPullupModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<IonicPullupModule, [typeof i1.IonicPullupComponent, typeof i2.IonicPullupComponentTabComponent], never, [typeof i1.IonicPullupComponent, typeof i2.IonicPullupComponentTabComponent]>;
    static ɵinj: i0.ɵɵInjectorDef<IonicPullupModule>;
}
