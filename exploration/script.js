const margin = { top: 10, right: 30, bottom: 30, left: 30 }
const width = 960 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

const svg = d3
  .select('body')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)

svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

function loadPeopleData() {
  return new Promise((resolve, reject) => {
    const peopleData = d3
      .csv('data/people.csv', d => ({
        ...d,
        max_views: d3.max_views,
        max_percent_traffic: +d.max_percent_traffic,
        thumbnail_width: +d.thumbnail_width,
        thumbnail_height: +d.thumbnail_height,
        year_of_birth: +d.year_of_birth,
        year_of_death: +d.year_of_death
      }))
      .then(resolve)
      .catch(reject)
  })
}

function loadPageviewData() {
  return new Promise((resolve, reject) => {
    const data = d3
      .csv('data/pageviews.csv', d => ({
        ...d,
        timestamp: +d.timestamp,
        views: +d.views,
        percent_traffic: +d.percent_traffic
      }))
      .then(resolve)
      .catch(reject)
  })
}

function init() {
  const p = [loadPeopleData(), loadPageviewData()]
  Promise.all(p)
    .then(response => {
      console.log(response)
    })
    .catch(console.error)
}

init()