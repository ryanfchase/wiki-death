const fs = require('fs')
const mkdirp = require('mkdirp')
const d3 = require('d3')
const request = require('request')
const outputDir = './output'

const BASE_PATH = 'https://en.wikipedia.org/api/rest_v1/page/summary/'

function getDetails(person) {
  return new Promise((resolve, reject) => {
    // const id = person.link.replace('/wiki/', '')
    // const url = `${BASE_PATH}/${ID}`
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
  })
}

async function init(){
  console.log('starting promise')
  await getDetails(null).then(response => {
    console.log('done')
  })
}

init()

