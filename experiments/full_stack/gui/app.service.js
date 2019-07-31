import axios from 'axios'

axios.defaults.baseURL = window.location.protocol + '//' + window.location.host;

axios.interceptors.request.use(function (config) {
  const token = window.localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

const appService = {
 
  getAllNotes() {
    return new Promise((resolve,reject) => {
      axios.get('/notes')
        .then(response => {
          resolve(response.data)
        })
        .catch(response => {
            reject(response.status)
          })
    })
  },
  addNote (note) {
    return new Promise((resolve, reject) => {
      axios.post('/notes', note,{headers: {
        "Content-Type": "application/json"}})
        .then(response => {
          resolve(response.data)
        }).catch(response => {
          reject(response.status)
        })
    })
  }
  
}

export default appService
