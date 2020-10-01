import { EventEmitter, Renderer2, OnInit, AfterContentInit, OnChanges, SimpleChanges, QueryList } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HammerGestureConfig } from '@angular/platform-browser';
import 'hammerjs';
import * as i0 from "@angular/core";
export interface FooterMetadata {
    height: number;
    posY: number;
    lastPosY: number;
    toolbarDefaultHeight?: number;
    toolbarDefaultExpandedPosition?: number;
    toolbarUpperBoundary?: number;
    toolbarLowerBoundary?: number;
    ionContentRef?: any;
}
export interface ViewMetadata {
    tabsRef?: Element;
    tabsHeight?: number;
    hasBottomTabs?: boolean;
    toolbarRef?: Element;
    toolbarHeight?: number;
    bottomSpace?: number;
}
export interface FooterTab {
    x?: number;
    y?: number;
    upperLeftRadius?: number;
    upperRightRadius?: number;
    backgroundColor?: string;
    color?: string;
    content?: string;
}
export declare enum IonPullUpFooterState {
    Collapsed = 0,
    Expanded = 1,
    Minimized = 2
}
export declare enum IonPullUpFooterBehavior {
    Hide = 0,
    Expand = 1
}
export interface DraggedOutputEvent {
    delta: number;
    toolbarAbsolutePosition: DOMRect;
}
export declare class IonicPullupComponent implements OnInit, AfterContentInit, OnChanges {
    private platform;
    private renderer;
    private hammerConfig;
    state: IonPullUpFooterState;
    stateChange: EventEmitter<IonPullUpFooterState>;
    initialState: IonPullUpFooterState;
    defaultBehavior: IonPullUpFooterBehavior;
    /**
     *  Maximum expanded position - useful if there are top headers
     *  If not provided by default computes available screen minus tabs and headers
     */
    toolbarTopMargin: number;
    /**
     *  Minimum position - useful to keep a part of the footer always visible at the bottom
     */
    minBottomVisible: number;
    /**
     * If true, footer can be docked at the bottom
     */
    dockable: boolean;
    expanded: EventEmitter<any>;
    collapsed: EventEmitter<any>;
    minimized: EventEmitter<any>;
    /**
     * Outputs the amount of pixels the user has dragged positive or negative
     */
    dragged: EventEmitter<DraggedOutputEvent>;
    childFooter: any;
    dragElements: QueryList<any>;
    protected footerMeta: FooterMetadata;
    protected currentViewMeta: ViewMetadata;
    constructor(platform: Platform, renderer: Renderer2, hammerConfig: HammerGestureConfig);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    get expandedHeight(): number;
    computeDefaults(): void;
    computeHeights(): void;
    updateUI(isInit?: boolean): void;
    expand(): void;
    collapse(isInit?: boolean): void;
    /**
     * TODO
     */
    minimize(): void;
    onTap(e: any): void;
    onPan(e: HammerInput): void;
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Detect ionic components in page
     */
    private findIonicComponentsInPage;
    /**
     * Update inner ion-content component height when footer is expanded, collapsed or dragged
     * @param maxHeight maximum ionContent height to set
     */
    private updateIonContentHeight;
    static ɵfac: i0.ɵɵFactoryDef<IonicPullupComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<IonicPullupComponent, "lib-ionic-pullup", never, { "state": "state"; "initialState": "initialState"; "defaultBehavior": "defaultBehavior"; "toolbarTopMargin": "toolbarTopMargin"; "minBottomVisible": "minBottomVisible"; "dockable": "dockable"; }, { "stateChange": "stateChange"; "expanded": "expanded"; "collapsed": "collapsed"; "minimized": "minimized"; "dragged": "dragged"; }, ["dragElements"], ["*"]>;
}
