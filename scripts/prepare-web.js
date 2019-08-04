const fs = require('fs')
const mkdirp = require('mkdirp')
const d3 = require('d3')
const ALL_DEATHS_PATH = './output/all-deaths-2015-2018.csv'
const FILTERED_PATH = './output/filtered.csv'
const outputDir = './web-data/'

function getPageviews(person) {
  const {pageid} = person
  const id = person.link.replace('/wiki', '')
  const data = d3.csvParse(`/output/people-pageviews/${id}.csv`, 'utf-8')
  const output = data.map(({ link, timestamp, views, percent_traffic }) => ({
    link,
    pageid,
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
  const populationLinks = population.map(d => d.link)
  const dataAllFiltered = dataAll.filter(d =>populationLinks.includes(d.link))
  const withCalcs = dataFilter.map(d => ({
    id: d.link.replace('/wiki', ''),
    ...d,
    ...population.find(p => p.link === d.link)
  }))

  const peopleOutput = d3.csvFormat(withCalcs)
  fs.writeFileSync(`./${OUTPUT_DIR}/people.csv`, peopleOutput)

  // pageviews
  const pageviewData = [].concat(withCalcs.map(getPageviews))

  const pageviewOutput = d3.csvFormat(pageviewData)
  fs.writeFileSync(`./${OUTPUT_DIR}/pageviews.csv`, pageviewOutput)
}

init()
