Page({
  data: {
    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    id:''
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad(options) {
    if(options.date){
      var theme_date=options.date*1,
          year =options.date.substr(0,4), 
          month =options.date.substr(4,2), 
          day =options.date.substr(6,2);
    }else{
      var today_date = new Date(),
      year=today_date.getFullYear(),
      month=today_date.getMonth()+1,
      day=today_date.getDate(),
      theme_date=year*10000+month*100+day;
    }
    var date = year+'-'+month+'-'+day;
    this.setData({ year, month,day,date,theme_date})
    console.log(theme_date)
    const db =wx.cloud.database()
    db.collection('qd_theme').where({
      theme_date:theme_date
    }).get({
      success: res => {
        console.log(res.data[0])
        if(res.data[0]){
          const d = res.data[0];
          this.setData({
            id:d._id
            // 输出看看
          })
          that.editorCtx.setContents({
            html:d.theme_content,
            success:  (res)=> {
             console.log(res)
            },
            fail:(res)=> {
              console.log(res)
            }
          }) 
        }
      }
    })
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS})
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)

    })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
    console.log(keyboardHeight)
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  /*insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        that.editorCtx.insertImage({
          src: res.tempFilePaths[0],
          data: {
            id: 'abcd',
            role: 'god'
          },
          width: '80%',
          success: function () {
            console.log('insert image success')
          }
        })
      }
    })
  },*/
  submit(e){
    this.editorCtx.getContents({
      success:res=>{
        const db = wx.cloud.database()
        if (this.data.id) {
          db.collection('qd_theme').doc(this.data.id).update({
            data:{
              theme_content:res.html,
              update_time:db.serverDate(),
              update_date:new Date()
            },
            success: res => {
              wx.showToast({
                title:'success'
              })
            }
          })
        }else{
          db.collection('qd_theme').add({
            data:{
              theme_date:this.data.theme_date,
              theme_content:res.html,
              create_time:db.serverDate(),
              create_date:new Date()
            },success:res=>{
              wx.showToast({
                title:'success'
              })
              wx.navigateTo({
                url: '../theme/theme',
              })
            }
          })
        }
      },
      fail:err =>{
        wx.showToast({
          icon: 'none',
          title: '请输入内容',
        })
      }
    })
  }
})