import { Component, DestroyRef, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
const _forTrack0 = ($index, $item) => $item.id;
function ConnectComponent_Conditional_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li", 10);
    i0.ɵɵtext(1, "Loading timeline...");
    i0.ɵɵelementEnd();
} }
function ConnectComponent_For_31_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "li", 26);
    i0.ɵɵlistener("click", function ConnectComponent_For_31_Template_li_click_0_listener() { const item_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.selectTimelineItem(item_r2)); });
    i0.ɵɵelementStart(1, "div", 27)(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵpipe(6, "date");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "p");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "small");
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("selected", ctx_r2.selectedEnquiryId === item_r2.enquiryId);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r2.enquiryReference);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(6, 8, item_r2.occurredAtUtc, "dd/MM HH:mm"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(item_r2.subject || item_r2.preview);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate3("", item_r2.contactName, " \u00B7 ", item_r2.type, " \u00B7 ", item_r2.direction);
} }
function ConnectComponent_Conditional_32_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li", 10);
    i0.ɵɵtext(1, "No communications found.");
    i0.ɵɵelementEnd();
} }
function ConnectComponent_For_59_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "li")(1, "div")(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p");
    i0.ɵɵtext(5);
    i0.ɵɵpipe(6, "date");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "small");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "button", 14);
    i0.ɵɵlistener("click", function ConnectComponent_For_59_Template_button_click_9_listener() { const email_r5 = i0.ɵɵrestoreView(_r4).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.linkUnmatched(email_r5)); });
    i0.ɵɵtext(10, "Link");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const email_r5 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(email_r5.subject);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", email_r5.fromAddress, " \u00B7 ", i0.ɵɵpipeBind2(6, 5, email_r5.receivedAtUtc, "dd/MM HH:mm"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(email_r5.preview);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", !ctx_r2.canCompose);
} }
function ConnectComponent_Conditional_60_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li", 10);
    i0.ɵɵtext(1, "No unmatched emails.");
    i0.ɵɵelementEnd();
} }
function ConnectComponent_For_69_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const channel_r7 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(channel_r7.unreadCount);
} }
function ConnectComponent_For_69_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "li", 26);
    i0.ɵɵlistener("click", function ConnectComponent_For_69_Template_li_click_0_listener() { const channel_r7 = i0.ɵɵrestoreView(_r6).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.openChannel(channel_r7)); });
    i0.ɵɵelementStart(1, "strong");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(3, ConnectComponent_For_69_Conditional_3_Template, 2, 1, "span");
    i0.ɵɵelementStart(4, "small");
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const channel_r7 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("active", ctx_r2.selectedChannelId === channel_r7.id);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("#", channel_r7.slug);
    i0.ɵɵadvance();
    i0.ɵɵconditional(channel_r7.unreadCount > 0 ? 3 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(channel_r7.lastMessagePreview || "No messages yet");
} }
function ConnectComponent_Conditional_70_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "li", 10);
    i0.ɵɵtext(1, "No channels.");
    i0.ɵɵelementEnd();
} }
function ConnectComponent_Conditional_73_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 10);
    i0.ɵɵtext(1, "Loading chat...");
    i0.ɵɵelementEnd();
} }
function ConnectComponent_For_75_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "article")(1, "div")(2, "strong");
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span");
    i0.ɵɵtext(5);
    i0.ɵɵpipe(6, "date");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "p");
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const message_r8 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(message_r8.senderName);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(i0.ɵɵpipeBind2(6, 3, message_r8.createdAtUtc, "dd/MM HH:mm"));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(message_r8.body);
} }
function ConnectComponent_Conditional_76_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 10);
    i0.ɵɵtext(1, "No messages in this channel.");
    i0.ɵɵelementEnd();
} }
export class ConnectComponent {
    constructor() {
        this.api = inject(ApiService);
        this.auth = inject(AuthService);
        this.destroyRef = inject(DestroyRef);
        this.venueId = null;
        this.timelineType = 'all';
        this.timelineSearch = '';
        this.timeline = [];
        this.unmatchedEmailCount = 0;
        this.unreadMentionCount = 0;
        this.selectedEnquiryId = '';
        this.noteDraft = '';
        this.emailTo = '';
        this.emailCc = '';
        this.emailSubject = '';
        this.emailBody = '';
        this.unmatchedInbox = [];
        this.channels = [];
        this.selectedChannelId = null;
        this.chatMessages = [];
        this.chatDraft = '';
        this.isLoadingTimeline = false;
        this.isLoadingChat = false;
    }
    get canCompose() {
        return this.selectedEnquiryId.length > 0;
    }
    get selectedChannel() {
        return this.channels.find((channel) => channel.id === this.selectedChannelId) ?? null;
    }
    ngOnInit() {
        this.venueId = this.auth.selectedVenueId;
        if (!this.venueId) {
            return;
        }
        this.loadTimeline();
        this.loadUnmatchedInbox();
        this.loadChannels();
    }
    setTimelineType(type) {
        this.timelineType = type;
        this.loadTimeline();
    }
    loadTimeline() {
        if (!this.venueId) {
            return;
        }
        this.isLoadingTimeline = true;
        this.api
            .getConnectTimeline({
            venueId: this.venueId,
            type: this.timelineType,
            search: this.timelineSearch || undefined,
            page: 1,
            pageSize: 80
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.timeline = response.page.items;
                this.unmatchedEmailCount = response.unmatchedEmailCount;
                this.unreadMentionCount = response.unreadMentionCount;
                if (!this.selectedEnquiryId && this.timeline.length > 0) {
                    this.selectedEnquiryId = this.timeline[0].enquiryId;
                }
                this.isLoadingTimeline = false;
            },
            error: () => {
                this.timeline = [];
                this.isLoadingTimeline = false;
            }
        });
    }
    selectTimelineItem(item) {
        this.selectedEnquiryId = item.enquiryId;
    }
    addNote() {
        if (!this.canCompose || !this.noteDraft.trim()) {
            return;
        }
        this.api
            .addInternalNote(this.selectedEnquiryId, { body: this.noteDraft.trim() })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.noteDraft = '';
                this.loadTimeline();
            }
        });
    }
    sendEmail() {
        if (!this.canCompose || !this.venueId || !this.emailTo.trim() || !this.emailSubject.trim() || !this.emailBody.trim()) {
            return;
        }
        this.api
            .sendConnectEmail(this.selectedEnquiryId, {
            venueId: this.venueId,
            to: this.emailTo.trim(),
            cc: this.emailCc.trim() || undefined,
            subject: this.emailSubject.trim(),
            body: this.emailBody.trim()
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.emailTo = '';
                this.emailCc = '';
                this.emailSubject = '';
                this.emailBody = '';
                this.loadTimeline();
            }
        });
    }
    loadUnmatchedInbox() {
        if (!this.venueId) {
            return;
        }
        this.api
            .getUnmatchedInbox(this.venueId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.unmatchedInbox = response.items;
            },
            error: () => {
                this.unmatchedInbox = [];
            }
        });
    }
    linkUnmatched(item) {
        if (!this.selectedEnquiryId) {
            return;
        }
        this.api
            .linkUnmatchedInboxItem(item.id, this.selectedEnquiryId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: () => {
                this.loadUnmatchedInbox();
                this.loadTimeline();
            }
        });
    }
    loadChannels() {
        this.api
            .getChatChannels(this.venueId ?? undefined)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.channels = response.channels;
                if (!this.selectedChannelId && this.channels.length > 0) {
                    this.openChannel(this.channels[0]);
                }
            },
            error: () => {
                this.channels = [];
                this.chatMessages = [];
            }
        });
    }
    openChannel(channel) {
        this.selectedChannelId = channel.id;
        this.isLoadingChat = true;
        this.api
            .getChatThread(channel.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (response) => {
                this.chatMessages = response.messages;
                this.isLoadingChat = false;
                this.api.markChatRead(channel.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
                this.loadChannels();
            },
            error: () => {
                this.chatMessages = [];
                this.isLoadingChat = false;
            }
        });
    }
    sendChatMessage() {
        if (!this.selectedChannelId || !this.chatDraft.trim()) {
            return;
        }
        this.api
            .sendChatMessage(this.selectedChannelId, { body: this.chatDraft.trim() })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
            next: (message) => {
                this.chatMessages = [...this.chatMessages, message];
                this.chatDraft = '';
                this.loadChannels();
            }
        });
    }
    static { this.ɵfac = function ConnectComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ConnectComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ConnectComponent, selectors: [["app-connect"]], decls: 81, vars: 27, consts: [[1, "connect-page"], [1, "page-header"], [1, "status-pills"], [1, "layout-grid"], [1, "panel", "timeline-panel"], [1, "tabs"], ["type", "button", 3, "click"], [1, "search-row"], ["type", "text", "placeholder", "Search within communications", 3, "ngModelChange", "ngModel"], [1, "timeline-list"], [1, "empty"], [3, "selected"], [1, "panel", "compose-panel"], ["rows", "4", "placeholder", "Add internal note and use @mentions.", 3, "ngModelChange", "ngModel"], ["type", "button", 3, "click", "disabled"], ["type", "email", "placeholder", "To", 3, "ngModelChange", "ngModel"], ["type", "text", "placeholder", "CC (optional)", 3, "ngModelChange", "ngModel"], ["type", "text", "placeholder", "Subject", 3, "ngModelChange", "ngModel"], ["rows", "5", "placeholder", "Message", 3, "ngModelChange", "ngModel"], [1, "unmatched-list"], [1, "panel", "chat-panel"], [1, "chat-layout"], [3, "active"], [1, "messages"], [1, "chat-compose"], ["rows", "3", "placeholder", "Message channel", 3, "ngModelChange", "ngModel"], [3, "click"], [1, "line-top"]], template: function ConnectComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "header", 1)(2, "div")(3, "h1");
            i0.ɵɵtext(4, "Connect");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "p");
            i0.ɵɵtext(6, "Unified communications timeline, unmatched inbox, and team chat.");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(7, "div", 2)(8, "span");
            i0.ɵɵtext(9);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "span");
            i0.ɵɵtext(11);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(12, "section", 3)(13, "article", 4)(14, "header")(15, "h2");
            i0.ɵɵtext(16, "Timeline");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "div", 5)(18, "button", 6);
            i0.ɵɵlistener("click", function ConnectComponent_Template_button_click_18_listener() { return ctx.setTimelineType("all"); });
            i0.ɵɵtext(19, "All");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(20, "button", 6);
            i0.ɵɵlistener("click", function ConnectComponent_Template_button_click_20_listener() { return ctx.setTimelineType("emails"); });
            i0.ɵɵtext(21, "Emails");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "button", 6);
            i0.ɵɵlistener("click", function ConnectComponent_Template_button_click_22_listener() { return ctx.setTimelineType("notes"); });
            i0.ɵɵtext(23, "Notes");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(24, "button", 6);
            i0.ɵɵlistener("click", function ConnectComponent_Template_button_click_24_listener() { return ctx.setTimelineType("system"); });
            i0.ɵɵtext(25, "System");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(26, "div", 7)(27, "input", 8);
            i0.ɵɵtwoWayListener("ngModelChange", function ConnectComponent_Template_input_ngModelChange_27_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.timelineSearch, $event) || (ctx.timelineSearch = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function ConnectComponent_Template_input_ngModelChange_27_listener() { return ctx.loadTimeline(); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(28, "ul", 9);
            i0.ɵɵconditionalCreate(29, ConnectComponent_Conditional_29_Template, 2, 0, "li", 10);
            i0.ɵɵrepeaterCreate(30, ConnectComponent_For_31_Template, 11, 11, "li", 11, _forTrack0);
            i0.ɵɵconditionalCreate(32, ConnectComponent_Conditional_32_Template, 2, 0, "li", 10);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(33, "article", 12)(34, "header")(35, "h2");
            i0.ɵɵtext(36, "Compose");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(37, "span");
            i0.ɵɵtext(38);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(39, "section")(40, "h3");
            i0.ɵɵtext(41, "Internal Note");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(42, "textarea", 13);
            i0.ɵɵtwoWayListener("ngModelChange", function ConnectComponent_Template_textarea_ngModelChange_42_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.noteDraft, $event) || (ctx.noteDraft = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(43, "button", 14);
            i0.ɵɵlistener("click", function ConnectComponent_Template_button_click_43_listener() { return ctx.addNote(); });
            i0.ɵɵtext(44, "Add Note");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(45, "section")(46, "h3");
            i0.ɵɵtext(47, "Email");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(48, "input", 15);
            i0.ɵɵtwoWayListener("ngModelChange", function ConnectComponent_Template_input_ngModelChange_48_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.emailTo, $event) || (ctx.emailTo = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(49, "input", 16);
            i0.ɵɵtwoWayListener("ngModelChange", function ConnectComponent_Template_input_ngModelChange_49_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.emailCc, $event) || (ctx.emailCc = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(50, "input", 17);
            i0.ɵɵtwoWayListener("ngModelChange", function ConnectComponent_Template_input_ngModelChange_50_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.emailSubject, $event) || (ctx.emailSubject = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(51, "textarea", 18);
            i0.ɵɵtwoWayListener("ngModelChange", function ConnectComponent_Template_textarea_ngModelChange_51_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.emailBody, $event) || (ctx.emailBody = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(52, "button", 14);
            i0.ɵɵlistener("click", function ConnectComponent_Template_button_click_52_listener() { return ctx.sendEmail(); });
            i0.ɵɵtext(53, "Send Email");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(54, "section")(55, "h3");
            i0.ɵɵtext(56, "Unmatched Inbox");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(57, "ul", 19);
            i0.ɵɵrepeaterCreate(58, ConnectComponent_For_59_Template, 11, 8, "li", null, _forTrack0);
            i0.ɵɵconditionalCreate(60, ConnectComponent_Conditional_60_Template, 2, 0, "li", 10);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(61, "article", 20)(62, "header")(63, "h2");
            i0.ɵɵtext(64, "Team Chat");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(65, "div", 21)(66, "aside")(67, "ul");
            i0.ɵɵrepeaterCreate(68, ConnectComponent_For_69_Template, 6, 5, "li", 22, _forTrack0);
            i0.ɵɵconditionalCreate(70, ConnectComponent_Conditional_70_Template, 2, 0, "li", 10);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(71, "section")(72, "div", 23);
            i0.ɵɵconditionalCreate(73, ConnectComponent_Conditional_73_Template, 2, 0, "p", 10);
            i0.ɵɵrepeaterCreate(74, ConnectComponent_For_75_Template, 9, 6, "article", null, _forTrack0);
            i0.ɵɵconditionalCreate(76, ConnectComponent_Conditional_76_Template, 2, 0, "p", 10);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(77, "div", 24)(78, "textarea", 25);
            i0.ɵɵtwoWayListener("ngModelChange", function ConnectComponent_Template_textarea_ngModelChange_78_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.chatDraft, $event) || (ctx.chatDraft = $event); return $event; });
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(79, "button", 14);
            i0.ɵɵlistener("click", function ConnectComponent_Template_button_click_79_listener() { return ctx.sendChatMessage(); });
            i0.ɵɵtext(80, "Send");
            i0.ɵɵelementEnd()()()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(9);
            i0.ɵɵtextInterpolate1("Unmatched: ", ctx.unmatchedEmailCount);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1("@ Mentions: ", ctx.unreadMentionCount);
            i0.ɵɵadvance(7);
            i0.ɵɵclassProp("active", ctx.timelineType === "all");
            i0.ɵɵadvance(2);
            i0.ɵɵclassProp("active", ctx.timelineType === "emails");
            i0.ɵɵadvance(2);
            i0.ɵɵclassProp("active", ctx.timelineType === "notes");
            i0.ɵɵadvance(2);
            i0.ɵɵclassProp("active", ctx.timelineType === "system");
            i0.ɵɵadvance(3);
            i0.ɵɵtwoWayProperty("ngModel", ctx.timelineSearch);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.isLoadingTimeline ? 29 : -1);
            i0.ɵɵadvance();
            i0.ɵɵrepeater(ctx.timeline);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(!ctx.isLoadingTimeline && ctx.timeline.length === 0 ? 32 : -1);
            i0.ɵɵadvance(6);
            i0.ɵɵtextInterpolate(ctx.selectedEnquiryId || "Select an enquiry");
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.noteDraft);
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", !ctx.canCompose || !ctx.noteDraft.trim());
            i0.ɵɵadvance(5);
            i0.ɵɵtwoWayProperty("ngModel", ctx.emailTo);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.emailCc);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.emailSubject);
            i0.ɵɵadvance();
            i0.ɵɵtwoWayProperty("ngModel", ctx.emailBody);
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", !ctx.canCompose || !ctx.emailTo || !ctx.emailSubject || !ctx.emailBody);
            i0.ɵɵadvance(6);
            i0.ɵɵrepeater(ctx.unmatchedInbox);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.unmatchedInbox.length === 0 ? 60 : -1);
            i0.ɵɵadvance(8);
            i0.ɵɵrepeater(ctx.channels);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.channels.length === 0 ? 70 : -1);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.isLoadingChat ? 73 : -1);
            i0.ɵɵadvance();
            i0.ɵɵrepeater(ctx.chatMessages);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(!ctx.isLoadingChat && ctx.chatMessages.length === 0 ? 76 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵtwoWayProperty("ngModel", ctx.chatDraft);
            i0.ɵɵadvance();
            i0.ɵɵproperty("disabled", !ctx.selectedChannelId || !ctx.chatDraft.trim());
        } }, dependencies: [FormsModule, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgModel, DatePipe], styles: [".connect-page[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.9rem;\n}\n\n.page-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 0.8rem;\n}\n\n.page-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.4rem;\n  color: #0f172a;\n}\n\n.page-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.2rem 0 0;\n  font-size: 0.84rem;\n  color: #64748b;\n}\n\n.status-pills[_ngcontent-%COMP%] {\n  display: inline-flex;\n  gap: 0.4rem;\n}\n\n.status-pills[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  border: 1px solid #dbeafe;\n  background: #eff6ff;\n  color: #1d4ed8;\n  border-radius: 999px;\n  padding: 0.2rem 0.55rem;\n  font-size: 0.68rem;\n  font-weight: 800;\n}\n\n.layout-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1.1fr 1fr 1.3fr;\n  gap: 0.8rem;\n}\n\n.panel[_ngcontent-%COMP%] {\n  border: 1px solid var(--cf-border);\n  background: #fff;\n  border-radius: 14px;\n  box-shadow: var(--cf-shadow-sm);\n  padding: 0.8rem;\n  display: grid;\n  gap: 0.7rem;\n  min-height: 620px;\n}\n\n.panel[_ngcontent-%COMP%]    > header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n}\n\n.panel[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.94rem;\n  color: #0f172a;\n}\n\n.panel[_ngcontent-%COMP%]   header[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  color: #64748b;\n  font-size: 0.72rem;\n}\n\n.tabs[_ngcontent-%COMP%] {\n  display: inline-flex;\n  gap: 0.25rem;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 0.14rem;\n}\n\n.tabs[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 1px solid transparent;\n  border-radius: 8px;\n  background: transparent;\n  padding: 0.2rem 0.42rem;\n  font-size: 0.68rem;\n  color: #64748b;\n  font-weight: 700;\n}\n\n.tabs[_ngcontent-%COMP%]   button.active[_ngcontent-%COMP%] {\n  border-color: #bfdbfe;\n  background: #eff6ff;\n  color: #1d4ed8;\n}\n\n.search-row[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.compose-panel[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], \n.compose-panel[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%], \n.chat-compose[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 0.45rem 0.55rem;\n  font-size: 0.78rem;\n  color: #334155;\n  background: #fff;\n}\n\n.timeline-list[_ngcontent-%COMP%], \n.unmatched-list[_ngcontent-%COMP%], \n.chat-layout[_ngcontent-%COMP%]   aside[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: grid;\n  gap: 0.42rem;\n}\n\n.timeline-list[_ngcontent-%COMP%] {\n  overflow: auto;\n  align-content: start;\n}\n\n.timeline-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  border: 1px solid #e2e8f0;\n  border-radius: 11px;\n  background: #fff;\n  padding: 0.5rem 0.58rem;\n  display: grid;\n  gap: 0.12rem;\n  cursor: pointer;\n}\n\n.timeline-list[_ngcontent-%COMP%]   li.selected[_ngcontent-%COMP%] {\n  border-color: #bfdbfe;\n  background: #f8fbff;\n}\n\n.line-top[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  gap: 0.6rem;\n}\n\n.line-top[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.76rem;\n  color: #1e293b;\n}\n\n.line-top[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], \n.timeline-list[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 0.66rem;\n  color: #64748b;\n}\n\n.timeline-list[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  color: #334155;\n}\n\n.compose-panel[_ngcontent-%COMP%]   section[_ngcontent-%COMP%] {\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n  padding: 0.55rem;\n  display: grid;\n  gap: 0.42rem;\n  align-content: start;\n}\n\n.compose-panel[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.76rem;\n  color: #0f172a;\n}\n\n.compose-panel[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.unmatched-list[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], \n.chat-compose[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n  border: 1px solid transparent;\n  border-radius: 9px;\n  background: var(--cf-primary);\n  color: #fff;\n  font-size: 0.72rem;\n  font-weight: 700;\n  padding: 0.36rem 0.55rem;\n  justify-self: end;\n}\n\n.compose-panel[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:disabled, \n.unmatched-list[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:disabled, \n.chat-compose[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n}\n\n.unmatched-list[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 0.46rem 0.5rem;\n  display: grid;\n  grid-template-columns: 1fr auto;\n  gap: 0.5rem;\n}\n\n.unmatched-list[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.74rem;\n  color: #0f172a;\n}\n\n.unmatched-list[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.unmatched-list[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #64748b;\n  font-size: 0.68rem;\n}\n\n.chat-layout[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 230px 1fr;\n  gap: 0.65rem;\n  min-height: 0;\n}\n\n.chat-layout[_ngcontent-%COMP%]   aside[_ngcontent-%COMP%] {\n  border-right: 1px solid #e2e8f0;\n  padding-right: 0.5rem;\n  min-height: 0;\n  overflow: auto;\n}\n\n.chat-layout[_ngcontent-%COMP%]   aside[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 0.42rem;\n  display: grid;\n  gap: 0.1rem;\n  cursor: pointer;\n}\n\n.chat-layout[_ngcontent-%COMP%]   aside[_ngcontent-%COMP%]   li.active[_ngcontent-%COMP%] {\n  border-color: #bfdbfe;\n  background: #f8fbff;\n}\n\n.chat-layout[_ngcontent-%COMP%]   aside[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.72rem;\n  color: #0f172a;\n}\n\n.chat-layout[_ngcontent-%COMP%]   aside[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  justify-self: start;\n  border-radius: 999px;\n  background: #dbeafe;\n  color: #1d4ed8;\n  font-size: 0.62rem;\n  padding: 0.05rem 0.34rem;\n  font-weight: 800;\n}\n\n.chat-layout[_ngcontent-%COMP%]   aside[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  font-size: 0.66rem;\n  color: #64748b;\n}\n\n.chat-layout[_ngcontent-%COMP%]   section[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-rows: 1fr auto;\n  min-height: 0;\n  gap: 0.6rem;\n}\n\n.messages[_ngcontent-%COMP%] {\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  background: #f8fafc;\n  padding: 0.52rem;\n  overflow: auto;\n  display: grid;\n  gap: 0.42rem;\n  align-content: start;\n}\n\n.messages[_ngcontent-%COMP%]   article[_ngcontent-%COMP%] {\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  background: #fff;\n  padding: 0.42rem 0.5rem;\n  display: grid;\n  gap: 0.12rem;\n}\n\n.messages[_ngcontent-%COMP%]   article[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  gap: 0.6rem;\n}\n\n.messages[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 0.72rem;\n  color: #0f172a;\n}\n\n.messages[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.64rem;\n  color: #64748b;\n}\n\n.messages[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 0.74rem;\n  color: #334155;\n}\n\n.chat-compose[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.35rem;\n}\n\n.empty[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #94a3b8;\n  font-size: 0.75rem;\n}\n\n@media (max-width: 1320px) {\n  .layout-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .panel[_ngcontent-%COMP%] {\n    min-height: auto;\n  }\n\n  .chat-layout[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .chat-layout[_ngcontent-%COMP%]   aside[_ngcontent-%COMP%] {\n    border-right: 0;\n    border-bottom: 1px solid #e2e8f0;\n    padding-right: 0;\n    padding-bottom: 0.5rem;\n  }\n}"] }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ConnectComponent, [{
        type: Component,
        args: [{ selector: 'app-connect', standalone: true, imports: [FormsModule, DatePipe], template: "<section class=\"connect-page\">\n  <header class=\"page-header\">\n    <div>\n      <h1>Connect</h1>\n      <p>Unified communications timeline, unmatched inbox, and team chat.</p>\n    </div>\n    <div class=\"status-pills\">\n      <span>Unmatched: {{ unmatchedEmailCount }}</span>\n      <span>@ Mentions: {{ unreadMentionCount }}</span>\n    </div>\n  </header>\n\n  <section class=\"layout-grid\">\n    <article class=\"panel timeline-panel\">\n      <header>\n        <h2>Timeline</h2>\n        <div class=\"tabs\">\n          <button type=\"button\" [class.active]=\"timelineType === 'all'\" (click)=\"setTimelineType('all')\">All</button>\n          <button type=\"button\" [class.active]=\"timelineType === 'emails'\" (click)=\"setTimelineType('emails')\">Emails</button>\n          <button type=\"button\" [class.active]=\"timelineType === 'notes'\" (click)=\"setTimelineType('notes')\">Notes</button>\n          <button type=\"button\" [class.active]=\"timelineType === 'system'\" (click)=\"setTimelineType('system')\">System</button>\n        </div>\n      </header>\n\n      <div class=\"search-row\">\n        <input type=\"text\" [(ngModel)]=\"timelineSearch\" (ngModelChange)=\"loadTimeline()\" placeholder=\"Search within communications\" />\n      </div>\n\n      <ul class=\"timeline-list\">\n        @if (isLoadingTimeline) {\n          <li class=\"empty\">Loading timeline...</li>\n        }\n\n        @for (item of timeline; track item.id) {\n          <li [class.selected]=\"selectedEnquiryId === item.enquiryId\" (click)=\"selectTimelineItem(item)\">\n            <div class=\"line-top\">\n              <strong>{{ item.enquiryReference }}</strong>\n              <span>{{ item.occurredAtUtc | date: 'dd/MM HH:mm' }}</span>\n            </div>\n            <p>{{ item.subject || item.preview }}</p>\n            <small>{{ item.contactName }} \u00B7 {{ item.type }} \u00B7 {{ item.direction }}</small>\n          </li>\n        }\n\n        @if (!isLoadingTimeline && timeline.length === 0) {\n          <li class=\"empty\">No communications found.</li>\n        }\n      </ul>\n    </article>\n\n    <article class=\"panel compose-panel\">\n      <header>\n        <h2>Compose</h2>\n        <span>{{ selectedEnquiryId || 'Select an enquiry' }}</span>\n      </header>\n\n      <section>\n        <h3>Internal Note</h3>\n        <textarea [(ngModel)]=\"noteDraft\" rows=\"4\" placeholder=\"Add internal note and use @mentions.\"></textarea>\n        <button type=\"button\" (click)=\"addNote()\" [disabled]=\"!canCompose || !noteDraft.trim()\">Add Note</button>\n      </section>\n\n      <section>\n        <h3>Email</h3>\n        <input type=\"email\" [(ngModel)]=\"emailTo\" placeholder=\"To\" />\n        <input type=\"text\" [(ngModel)]=\"emailCc\" placeholder=\"CC (optional)\" />\n        <input type=\"text\" [(ngModel)]=\"emailSubject\" placeholder=\"Subject\" />\n        <textarea [(ngModel)]=\"emailBody\" rows=\"5\" placeholder=\"Message\"></textarea>\n        <button type=\"button\" (click)=\"sendEmail()\" [disabled]=\"!canCompose || !emailTo || !emailSubject || !emailBody\">Send Email</button>\n      </section>\n\n      <section>\n        <h3>Unmatched Inbox</h3>\n        <ul class=\"unmatched-list\">\n          @for (email of unmatchedInbox; track email.id) {\n            <li>\n              <div>\n                <strong>{{ email.subject }}</strong>\n                <p>{{ email.fromAddress }} \u00B7 {{ email.receivedAtUtc | date: 'dd/MM HH:mm' }}</p>\n                <small>{{ email.preview }}</small>\n              </div>\n              <button type=\"button\" (click)=\"linkUnmatched(email)\" [disabled]=\"!canCompose\">Link</button>\n            </li>\n          }\n          @if (unmatchedInbox.length === 0) {\n            <li class=\"empty\">No unmatched emails.</li>\n          }\n        </ul>\n      </section>\n    </article>\n\n    <article class=\"panel chat-panel\">\n      <header>\n        <h2>Team Chat</h2>\n      </header>\n\n      <div class=\"chat-layout\">\n        <aside>\n          <ul>\n            @for (channel of channels; track channel.id) {\n              <li [class.active]=\"selectedChannelId === channel.id\" (click)=\"openChannel(channel)\">\n                <strong>#{{ channel.slug }}</strong>\n                @if (channel.unreadCount > 0) {\n                  <span>{{ channel.unreadCount }}</span>\n                }\n                <small>{{ channel.lastMessagePreview || 'No messages yet' }}</small>\n              </li>\n            }\n            @if (channels.length === 0) {\n              <li class=\"empty\">No channels.</li>\n            }\n          </ul>\n        </aside>\n\n        <section>\n          <div class=\"messages\">\n            @if (isLoadingChat) {\n              <p class=\"empty\">Loading chat...</p>\n            }\n            @for (message of chatMessages; track message.id) {\n              <article>\n                <div>\n                  <strong>{{ message.senderName }}</strong>\n                  <span>{{ message.createdAtUtc | date: 'dd/MM HH:mm' }}</span>\n                </div>\n                <p>{{ message.body }}</p>\n              </article>\n            }\n            @if (!isLoadingChat && chatMessages.length === 0) {\n              <p class=\"empty\">No messages in this channel.</p>\n            }\n          </div>\n\n          <div class=\"chat-compose\">\n            <textarea [(ngModel)]=\"chatDraft\" rows=\"3\" placeholder=\"Message channel\"></textarea>\n            <button type=\"button\" (click)=\"sendChatMessage()\" [disabled]=\"!selectedChannelId || !chatDraft.trim()\">Send</button>\n          </div>\n        </section>\n      </div>\n    </article>\n  </section>\n</section>\n", styles: [".connect-page {\n  display: grid;\n  gap: 0.9rem;\n}\n\n.page-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 0.8rem;\n}\n\n.page-header h1 {\n  margin: 0;\n  font-size: 1.4rem;\n  color: #0f172a;\n}\n\n.page-header p {\n  margin: 0.2rem 0 0;\n  font-size: 0.84rem;\n  color: #64748b;\n}\n\n.status-pills {\n  display: inline-flex;\n  gap: 0.4rem;\n}\n\n.status-pills span {\n  border: 1px solid #dbeafe;\n  background: #eff6ff;\n  color: #1d4ed8;\n  border-radius: 999px;\n  padding: 0.2rem 0.55rem;\n  font-size: 0.68rem;\n  font-weight: 800;\n}\n\n.layout-grid {\n  display: grid;\n  grid-template-columns: 1.1fr 1fr 1.3fr;\n  gap: 0.8rem;\n}\n\n.panel {\n  border: 1px solid var(--cf-border);\n  background: #fff;\n  border-radius: 14px;\n  box-shadow: var(--cf-shadow-sm);\n  padding: 0.8rem;\n  display: grid;\n  gap: 0.7rem;\n  min-height: 620px;\n}\n\n.panel > header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.6rem;\n}\n\n.panel h2 {\n  margin: 0;\n  font-size: 0.94rem;\n  color: #0f172a;\n}\n\n.panel header > span {\n  color: #64748b;\n  font-size: 0.72rem;\n}\n\n.tabs {\n  display: inline-flex;\n  gap: 0.25rem;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 0.14rem;\n}\n\n.tabs button {\n  border: 1px solid transparent;\n  border-radius: 8px;\n  background: transparent;\n  padding: 0.2rem 0.42rem;\n  font-size: 0.68rem;\n  color: #64748b;\n  font-weight: 700;\n}\n\n.tabs button.active {\n  border-color: #bfdbfe;\n  background: #eff6ff;\n  color: #1d4ed8;\n}\n\n.search-row input,\n.compose-panel input,\n.compose-panel textarea,\n.chat-compose textarea {\n  width: 100%;\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 0.45rem 0.55rem;\n  font-size: 0.78rem;\n  color: #334155;\n  background: #fff;\n}\n\n.timeline-list,\n.unmatched-list,\n.chat-layout aside ul {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  display: grid;\n  gap: 0.42rem;\n}\n\n.timeline-list {\n  overflow: auto;\n  align-content: start;\n}\n\n.timeline-list li {\n  border: 1px solid #e2e8f0;\n  border-radius: 11px;\n  background: #fff;\n  padding: 0.5rem 0.58rem;\n  display: grid;\n  gap: 0.12rem;\n  cursor: pointer;\n}\n\n.timeline-list li.selected {\n  border-color: #bfdbfe;\n  background: #f8fbff;\n}\n\n.line-top {\n  display: flex;\n  justify-content: space-between;\n  gap: 0.6rem;\n}\n\n.line-top strong {\n  font-size: 0.76rem;\n  color: #1e293b;\n}\n\n.line-top span,\n.timeline-list small {\n  font-size: 0.66rem;\n  color: #64748b;\n}\n\n.timeline-list p {\n  margin: 0;\n  font-size: 0.74rem;\n  color: #334155;\n}\n\n.compose-panel section {\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n  padding: 0.55rem;\n  display: grid;\n  gap: 0.42rem;\n  align-content: start;\n}\n\n.compose-panel h3 {\n  margin: 0;\n  font-size: 0.76rem;\n  color: #0f172a;\n}\n\n.compose-panel button,\n.unmatched-list button,\n.chat-compose button {\n  border: 1px solid transparent;\n  border-radius: 9px;\n  background: var(--cf-primary);\n  color: #fff;\n  font-size: 0.72rem;\n  font-weight: 700;\n  padding: 0.36rem 0.55rem;\n  justify-self: end;\n}\n\n.compose-panel button:disabled,\n.unmatched-list button:disabled,\n.chat-compose button:disabled {\n  opacity: 0.6;\n}\n\n.unmatched-list li {\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 0.46rem 0.5rem;\n  display: grid;\n  grid-template-columns: 1fr auto;\n  gap: 0.5rem;\n}\n\n.unmatched-list strong {\n  font-size: 0.74rem;\n  color: #0f172a;\n}\n\n.unmatched-list p,\n.unmatched-list small {\n  margin: 0;\n  color: #64748b;\n  font-size: 0.68rem;\n}\n\n.chat-layout {\n  display: grid;\n  grid-template-columns: 230px 1fr;\n  gap: 0.65rem;\n  min-height: 0;\n}\n\n.chat-layout aside {\n  border-right: 1px solid #e2e8f0;\n  padding-right: 0.5rem;\n  min-height: 0;\n  overflow: auto;\n}\n\n.chat-layout aside li {\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  padding: 0.42rem;\n  display: grid;\n  gap: 0.1rem;\n  cursor: pointer;\n}\n\n.chat-layout aside li.active {\n  border-color: #bfdbfe;\n  background: #f8fbff;\n}\n\n.chat-layout aside strong {\n  font-size: 0.72rem;\n  color: #0f172a;\n}\n\n.chat-layout aside span {\n  justify-self: start;\n  border-radius: 999px;\n  background: #dbeafe;\n  color: #1d4ed8;\n  font-size: 0.62rem;\n  padding: 0.05rem 0.34rem;\n  font-weight: 800;\n}\n\n.chat-layout aside small {\n  font-size: 0.66rem;\n  color: #64748b;\n}\n\n.chat-layout section {\n  display: grid;\n  grid-template-rows: 1fr auto;\n  min-height: 0;\n  gap: 0.6rem;\n}\n\n.messages {\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  background: #f8fafc;\n  padding: 0.52rem;\n  overflow: auto;\n  display: grid;\n  gap: 0.42rem;\n  align-content: start;\n}\n\n.messages article {\n  border: 1px solid #e2e8f0;\n  border-radius: 10px;\n  background: #fff;\n  padding: 0.42rem 0.5rem;\n  display: grid;\n  gap: 0.12rem;\n}\n\n.messages article > div {\n  display: flex;\n  justify-content: space-between;\n  gap: 0.6rem;\n}\n\n.messages strong {\n  font-size: 0.72rem;\n  color: #0f172a;\n}\n\n.messages span {\n  font-size: 0.64rem;\n  color: #64748b;\n}\n\n.messages p {\n  margin: 0;\n  font-size: 0.74rem;\n  color: #334155;\n}\n\n.chat-compose {\n  display: grid;\n  gap: 0.35rem;\n}\n\n.empty {\n  margin: 0;\n  color: #94a3b8;\n  font-size: 0.75rem;\n}\n\n@media (max-width: 1320px) {\n  .layout-grid {\n    grid-template-columns: 1fr;\n  }\n\n  .panel {\n    min-height: auto;\n  }\n\n  .chat-layout {\n    grid-template-columns: 1fr;\n  }\n\n  .chat-layout aside {\n    border-right: 0;\n    border-bottom: 1px solid #e2e8f0;\n    padding-right: 0;\n    padding-bottom: 0.5rem;\n  }\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ConnectComponent, { className: "ConnectComponent", filePath: "src/app/pages/connect/connect.component.ts", lineNumber: 21 }); })();
//# sourceMappingURL=connect.component.js.map