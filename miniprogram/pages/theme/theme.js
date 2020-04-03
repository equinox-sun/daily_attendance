// miniprogram/pages/theme/theme.js
const app  = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    queryTheme:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var today_date = new Date(),
      year=today_date.getFullYear(),
      month=today_date.getMonth()+1,
      day=today_date.getDate(),
      theme_date=year*10000+month*100+day;
    const db = wx.cloud.database()
    db.collection('qd_theme').where({
      theme_date:theme_date
    }).get({
      success:res => {
        this.setData({
          queryTheme:JSON.stringify(res.data[0], null, 2)
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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

  dayClick: function (event) {
    console.log(event.detail)
  }
})