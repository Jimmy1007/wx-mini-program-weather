const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}
Page({
  noPullDownRegresh(){
    this.getNow(()=>{
      wx.stopPullDownRefresh()
    })
  },
  data:{
    nowTemp: '',
    nowWeather: '',
    nowWeatherBackground: "",
    forecast: [1,2,3,4,5,6,7,8,9]
  },
  onLoad(){
    this.getNow()
  },
  getNow(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {        
        city: '西安市',
      },
      success:res=> {
        console.log(res)
        let result = res.data.result
        let temp = result.now.temp
        let weather = result.now.weather
        console.log(temp,weather)
        this.setData({
          nowTemp:temp,
          nowWeather:weatherMap[weather],
          nowWeatherBackground:'/images/'+weather+'-bg.png'
        })
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: weatherColorMap[weather],
        })
      },
      complete:()=>{
        callback && callback()
      }
    })
  }
})