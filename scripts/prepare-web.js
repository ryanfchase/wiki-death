const fs = require('fs')
const mkdirp = require('mkdirp')
const d3 = require('d3')
const ALL_DEATHS_PATH = './output/all-deaths-2015-2018.csv'
const FILTERED_PATH = './output/filtered.csv'

function getPageviews(person) {
  const id = person.link.replace('/wiki', '')
  const data = d3.csvParse(`/output/people-pageviews/${id}.csv`, 'utf-8')
  const output = data.map(({ timestamp, views, percent_traffic }) => ({
    link,
    timestamp: timestamp.substring(0,8),
    views,
    percent_traffic: +percent_traffic.toFixed(8)
  }))

  return output
}

function init() {
  mkdirp(outputDir)
  const dataAll = d3.csvParse(fs.readFileSync(ALL_DEATHS_PATH, 'utf-8'))
  const population = d3.csvParse(fs.readFileSync(FILTERED_PATH, 'utf-8'))
  const populationlinks = population.map(d => d.link)
  const dataAllFiltered = dataAll.filter(d =>populationLink.includes(d.link))
  const withCalcs = dataFilter.map(d => ({
    id: d.link.replace('/wiki', '')
    ...d,
    ...population.find(p => p.link === d.link)
  }))

  const peopleOutput = d3.csvFormat(withCalcs)
  fs.writeFileSync('./web-data/people.csv', peopleOutput)

  // pageviews
  const pageviewData = [].concat(withCalcs.map(getPageviews))

  const pageviewOutput = d3.csvFormat(pageviewData)
  fs.writeFileSync('./web-data/people.csv', pageviewOutput)
}

init()
