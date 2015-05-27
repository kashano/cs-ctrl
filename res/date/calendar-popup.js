System.register(['../chs'], function (_export) {
    'use strict';

    var chs, MonthName, CalendarPopup;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    return {
        setters: [function (_chs) {
            chs = _chs;
        }],
        execute: function () {
            MonthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            CalendarPopup = (function () {
                function CalendarPopup() {
                    _classCallCheck(this, CalendarPopup);

                    var self = this,
                        doc = document;
                    self.curCtrl = null;
                    self.element = doc.createElement('div');
                    self.element.className = 'cs-cal cs-hidden';
                    doc.body.appendChild(self.element);

                    doc.addEventListener('mousedown', function (ev) {
                        var target = ev.target;
                        var tEl = chs.closest(target, '.cs-cal');
                        if (tEl) {
                            return;
                        }

                        tEl = chs.closest(target, '.cs-date');
                        if (tEl) {
                            self.curCtrl = tEl.parentNode.primaryBehavior.executionContext;
                            self.show();
                            return;
                        }
                        self.hide();
                    });

                    doc.addEventListener('mouseup', function (ev) {
                        var target = ev.target;
                        var tEl = chs.closest(target, '.cs-cal-prev');
                        if (tEl) {
                            return self.changeMonth(-1);
                        }

                        tEl = chs.closest(target, '.cs-cal-next');
                        if (tEl) {
                            self.changeMonth(1);
                        }
                    });
                }

                _createClass(CalendarPopup, [{
                    key: 'hide',
                    value: function hide() {
                        this.element.classList.add('cs-hidden');
                        this.lastDt = null;
                    }
                }, {
                    key: 'show',
                    value: function show() {
                        this.render();
                        this.position();
                        this.element.classList.remove('cs-hidden');
                    }
                }, {
                    key: 'changeMonth',
                    value: function changeMonth(delta) {
                        var lDt = this.lastDt;
                        lDt.setDate(1);
                        lDt.setMonth(lDt.getMonth() + delta);
                        this.render(lDt);
                    }
                }, {
                    key: 'render',
                    value: function render(dt) {
                        var self = this,
                            ctrl = self.curCtrl;

                        var dt = dt || ctrl.value || new Date();
                        dt = new Date(dt.getTime());

                        var month = dt.getMonth();
                        var year = dt.getFullYear();
                        var firstDayDt = new Date(year, month, 1);
                        var startDay = firstDayDt.getDay();
                        var todayDt = new Date();
                        var today = -1;
                        self.lastDt = dt;

                        dt = new Date(year, month + 1, 0);
                        var daysInMonth = dt.getDate();

                        if (month == todayDt.getMonth() && year == todayDt.getFullYear()) {
                            today = todayDt.getDate();
                        }

                        var html = '<div class=\'cs-cal-hdr\'>\n                        <a class=\'cs-cal-prev\'><i class=\'cs-cal-prev-ico\'></i></a>\n                        <div class=\'cs-cal-title\'>' + MonthName[month] + ' ' + year + '</div>\n                        <a class=\'cs-cal-next\'><i class=\'cs-cal-next-ico\'></i></a>\n                    </div>\n                    <table class=\'cs-cal-tbl\'>\n                        <tr class=\'cs-cal-dayrow\'>\n                          <th class=\'cs-cal-daycell\'><span class=\'cs-cal-daylbl\'>Su</span></th>\n                          <th class=\'cs-cal-daycell\'><span class=\'cs-cal-daylbl\'>Mo</span></th>\n                          <th class=\'cs-cal-daycell\'><span class=\'cs-cal-daylbl\'>Tu</span></th>\n                          <th class=\'cs-cal-daycell\'><span class=\'cs-cal-daylbl\'>We</span></th>\n                          <th class=\'cs-cal-daycell\'><span class=\'cs-cal-daylbl\'>Th</span></th>\n                          <th class=\'cs-cal-daycell\'><span class=\'cs-cal-daylbl\'>Fr</span></th>\n                          <th class=\'cs-cal-daycell\'><span class=\'cs-cal-daylbl\'>Sa</span></th>\n                        </tr><tr>';

                        var w = 0,
                            d,
                            dayCount = 1;
                        for (; w < 6; w++) {
                            for (d = 0; d < 7; d++) {
                                if (dayCount <= daysInMonth && (w > 0 || d >= startDay)) {
                                        if (dayCount == today) {
                                                html += '<td class=\'cs-cal-cell\'><a class=\'cs-cal-cell-content cs-today\'>' + dayCount + '</a></td>';
                                            } else {
                                                html += '<td class=\'cs-cal-cell\'><a class=\'cs-cal-cell-content\'>' + dayCount + '</a></td>';
                                            }
                                        dayCount++;
                                    } else {
                                    html += '<td class="cs-cal-cell cs-cal-cell-blank"></td>';
                                }
                            }
                            if (dayCount > daysInMonth) {
                                break;
                            }
                            html += '</tr><tr>';
                        }
                        html += '</tr></table>';

                        self.element.innerHTML = html;
                    }
                }, {
                    key: 'position',
                    value: function position() {
                        var ctrlEl = this.curCtrl.element,
                            ctrlPos = chs.jqOffset(ctrlEl),
                            cal = this.element,
                            ctrlHeight = ctrlEl.offsetHeight,
                            y = ctrlPos.top + ctrlHeight,
                            wh = window.innerHeight,
                            topSpace = ctrlPos.top,
                            botSpace = wh - y;
                        cal.style.left = ctrlPos.left + 'px';

                        if (y + cal.offsetHeight > wh) {
                            if (topSpace > botSpace) {
                                    y = ctrlPos.top - cal.offsetHeight - 1;
                                }
                        }

                        cal.style.top = y + 'px';
                    }
                }]);

                return CalendarPopup;
            })();

            _export('CalendarPopup', CalendarPopup);
        }
    };
});
//# sourceMappingURL=../../res/date/calendar-popup.js.map