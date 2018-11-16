const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}
Page({
  onLoad(){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        

        city: '武汉市',
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
      }
    })
  }
})