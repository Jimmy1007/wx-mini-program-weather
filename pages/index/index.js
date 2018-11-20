const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js')
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}
const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

const UNPROMPTED_TIPS = "点击获取当前位置"
const UNAUTHORIZED_TIPS = "点击开启位置权限"
const AUTHORIZED_TIPS = ""

Page({
  data: {
    nowTemp: '',
    nowWeather: '',
    nowWeatherBackground: "",
    hourlyWeather: [],
    todayTemp: '',
    todayDate: '',
    city: '武汉市',
    locationAuthType: UNPROMPTED,
    locationTipsText: UNPROMPTED_TIPS
  },
  onPullDownRefresh(){
    this.getNow(()=>{
      wx.stopPullDownRefresh()
    })
  },
  onLoad(){
    this.qqmapsdk = new QQMapWX({
      key:'HVTBZ-GBF3U-YN7VP-4LYJY-OTPIH-ZZFPU'
    }),
    this.getNow()
  },
  getNow(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {        
        city: this.data.city
      },
      success:res=> {
        let result = res.data.result
        this.setNow(result)
        this.setHourlyWeather(result)
        this.setToday(result)
      },
      complete:()=>{
        callback && callback()
      }
    })
  },
  setNow(result){
    let temp = result.now.temp
    let weather = result.now.weather
    console.log(temp, weather)
    this.setData({
      nowTemp: temp,
      nowWeather: weatherMap[weather],
      nowWeatherBackground: '/images/' + weather + '-bg.png'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  },
  setHourlyWeather(result){
    let forecast = result.forecast
    let nowHour = new Date().getHours()
    let hourlyWeather = []
    for (let i = 0; i < 8; i += 1) {
      hourlyWeather.push({
        time: (i * 3 + nowHour) % 24 + '时',
        iconPath: '/images/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + '°'
      })
    }
    hourlyWeather[0].time = '现在'
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },
  setToday(result){
    let date=new Date()
    this.setData({
      todayTemp: `${result.today.minTemp}°-${result.today.maxTemp}°`,
      todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}  今天`
      //`和'是不一样的，"hello" + str + "world !"==`hello ${str} world !`
    })
  },
  onTapDayWeather(){
    wx.showToast()
    wx.navigateTo({
      url:'/pages/list/list?city='+this.data.city,
    })
  },
  onTapLocation() {
    if (this.data.locationAuthType === UNAUTHORIZED)
      wx.getSetting({
        success: res=>{
          let auth = res.authSetting["scope.userLocation"]
          if (auth) {
            this.getLocation()
          }
         // console.log(res)
        }
      })
    else
      this.getLocation()
  },
  getLocation(){
    wx.getLocation({
      success: res => {
        this.setData({
          locationAuthType: AUTHORIZED,
          locationTipsText: AUTHORIZED_TIPS
          }),
        //console.log(res.latitude, res.longitude)
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            let city = res.result.address_component.city
            console.log(city)
            this.setData({
              city: city,
            }),
            this.getNow()
          },
          fail:err=>{
            console.log("err",err);
          }
        })
      },
      fail: ()=>{
        this.setData({
          locationAuthType: UNAUTHORIZED,
          locationTipsText:UNAUTHORIZED_TIPS
        })
      }
    })
  }
})