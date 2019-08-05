const fs = require('fs')
const mkdirp = require('mkdirp')
const d3 = require('d3')
const request = require('request')
const OUTPUT_DIR = './output'

const BASE_PATH = 'https://en.wikipedia.org/api/rest_v1/page/summary/'

function getDetails(person) {
  return new Promise((resolve, reject) => {
    /*
    const id = person.link.replace('/wiki/', '')
    const url = `${BASE_PATH}/${ID}`
    const url = 'https://en.wikipedia.org/api/rest_v1/page/summary/Aharon_Appelfeld'
    request(url, (err, resp, body) => {
      if (err) reject(err)
      else if (resp.statusCode === 200) {
        console.log('found it!!!')
        const data = JSON.parse(body)
        const extractHTML = data.extract_html
        console.log(data.extract)
      }
      else reject(resp.statusCode)
    })
    */
    resolve(person)
  })
}

async function init() {
  // create output directory
  mkdirp(OUTPUT_DIR)

  // parse our filtered people csv
  const peopleData = d3.csvParse(
    fs.readFileSync(`${OUTPUT_DIR}/filtered.csv`, 'utf-8')
  )

  // prepare to add details for just this subset of people
  //  via async query
  const withDetails = []
  for (person of peopleData) {
    await getDetails(person).then(response => {
      withDetails.push(response)
    })
  }

  const output = d3.csvFormat(withDetails)
  fs.writeFileSync(`${OUTPUT_DIR}/details.csv`, output)
}

init()

