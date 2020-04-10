// miniprogram/pages/theme/theme.js
const app  = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    queryTheme:{},
    dayRecord:[],
    startDate:20200409,
    pageSize:7,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var dd = new Date();
		    dd.setDate(dd.getDate()+this.data.pageSize);
      var y = dd.getFullYear(),
          m = dd.getMonth()+1,
          d = dd.getDate(),
          startDate = y*10000+m*100+d;
      this.setData({startDate:startDate});
      this.onSearchThemeList(startDate);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindDateChange:function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var date = e.detail.value.replace('-', '').replace('-', '')
    console.log(date);
    wx.navigateTo({
      url: '../themeEdit/themeEdit?date='+date,
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function(data) {
          console.log(data)
        },
        someEvent: function(data) {
          console.log(data)
        }
      },
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      }
    })
  },
  onSearchThemeList:function (startDate) {
    console.log(startDate)
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('qd_theme').field({
      theme_date:true,theme_title:true,_id:true
    }).where({
      theme_date: _.lt(startDate)
    }).orderBy('theme_date','desc').limit(this.data.pageSize)
    .get({
      success:res => {
        this.setData({
          queryTheme:res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res.data)
      }
    })
  }
})