// miniprogram/pages/index.js
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        openid: '',
        queryTheme: '',
        weekList: ['日', '一', '二', '三', '四', '五', '六'],
        daysList: [],
        currentDate:20200408,
        chooseDate:20200408
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var today_date = new Date(),
            year = today_date.getFullYear(),
            month = today_date.getMonth() + 1,
            day = today_date.getDate(),
            weekDay = today_date.getDay(),
            currentMonthDay = parseInt(new Date(year, month, 0).getDate()),
            lastMonthDay = parseInt(new Date(year, month - 1, 0).getDate()), //上个月的天数
            theme_date = year * 10000 + month * 100 + day;
        var _y, _m, _d;
        for (var i = 0; i <= 6; i++) {
            _y = year, _m = month;
            if (i < weekDay) {
                if (day - weekDay + i < 1) { //上个月
                    _d = lastMonthDay + day - weekDay + i;
                    _m = month - 1;
                    if (_m < 1) {
                        _m = 12;
                        _y = year - 1;
                    }
                } else {
                    _d = day - weekDay + i;
                }
            } else if (i == weekDay) {
                _d = day;
            } else { //下个月
                if (day + i - weekDay > currentMonthDay) {
                    _d = day + i - weekDay - currentMonthDay;
                    _m = month + 1;
                    if (_m > 12) {
                        _m = 1;
                        _y = year + 1;
                    }
                } else {
                    _d = day + i - weekDay;
                }
            }
            this.setData({
                daysList: [...this.data.daysList, {
                    "day": _d,
                    "date": _y * 10000 + _m * 100 + _d
                }],
                currentDate:theme_date,
                chooseDate:theme_date
            })
        }
        this.onSearchTheme(theme_date)
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {},
    onChangeDay:function(e) {
        var theme_date = e.currentTarget.dataset.date;
        this.setData({chooseDate:theme_date})
        this.onSearchTheme(theme_date)
    },
    onSearchTheme:function (theme_date) {
        console.log(theme_date)
        const db = wx.cloud.database()
        db.collection('qd_theme').where({
            theme_date: theme_date
        }).get({
            success: res => {
                this.setData({
                    queryTheme: res.data[0]
                })
                console.log('[数据库] [查询记录] 成功: ', res)
                console.log(this.data.queryTheme.theme_content)
            }
        })
    }
})
