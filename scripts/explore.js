const fs = require('fs')
const mkdirp = require('mkdirp')
const d3 = require('d3')
const outputDir = './output'

function calculate(data) {
  const link = data.link
  const id = link.replace('/wiki/', '')
  let rawData = null
  try {
    rawData = d3.csvParse(fs.readFileSync(`./output/people-joined/${id}.csv`, 'utf-8'))
  }
  catch {
    return null
  }

  const dailyData = rawData.map(d => ({
    ...d,
    views: +d.views,
    percent_traffic: +d.percent_traffic
  }))

  const medianViews = d3.median(dailyData, d => d.views)
  const medianPercentTraffic = d3.median(dailyData, d => d.percent_traffic)
  const maxViews = d3.max(dailyData, d => d.views)
  const maxPercentTraffic = d3.max(dailyData, d => d.percent_traffic)
  const maxChangeViews = max_views / median_views
  const maxChangePercentTraffic = maxPercentTraffic / medianPercentTraffic

  return { 
    'id': id,
    'median_views': medianViews, 
    'median_percent_traffic': medianPercentTraffic,
    'max_views': maxViews,
    'max_percent_traffic': maxPercentTraffic,
    'max_change_views': maxChangeViews,
    'max_change_percent_traffic': maxChangePercentTraffic,
    'link': link, 
  }

}

function init() {
  mkdirp(outputDir)

  const csv_data = d3.csvParse(
    fs.readFileSync('./output/all-deaths-2015-2018.csv', 'utf-8')
  )

  const len = csv_data.length
  const explorationData = csv_data.map((data, i) => {
    console.log("exploring object " + (i + 1) + " of " + len)
    return calculate(data)
  })

  const withAverages = explorationData.filter((obj) => obj)
  const output = d3.csvFormat(withAverages)
  fs.writeFileSync('./output/explore.csv', output)
}

init()
