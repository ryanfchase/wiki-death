function printAndWaitTwoSeconds(item) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 2000)
    console.log(item)
  })
}


function query(item) {
  return new Promise((resolve, reject) => {
    if (item === 2) reject(`reject ${item}`)
    else {
      setTimeout(() => {
        resolve(`resolve ${item}`)
      }, 3000)
    }
  })
}

async function init() {
  const data = [1, 2, 3]
  for (const item of data) {
    await printAndWaitTwoSeconds(item)
  }
}

async function more() {
  const data = [1, 2, 3, 4, 5]
  for (const item of data)
    await query(item)
      .then(console.log)
      .catch(console.error)
}

// init()
more()
