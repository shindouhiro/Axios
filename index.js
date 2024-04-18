function Axios(config) {
  this.defaults = config
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  }

}

function InterceptorManager() {
  this.handlers = []
}
InterceptorManager.prototype.use = function(fulfilled, rejected) {
  this.handlers.push({
    fulfilled,
    rejected
  })
}


Axios.prototype.request = function(config) {
  // console.log(this, 'this')
  // console.log('发送 AJAX 请求 请求的类型为 ' + config.method);
  let promise = Promise.resolve(config)
  const chanis = [dispatchRequest, undefined]
  this.interceptors.request.handlers.forEach(item => {
    chanis.unshift(item.fulfilled, item.rejected)
  })

  this.interceptors.response.handlers.forEach(item => {
    chanis.push(item.fulfilled, item.rejected)
  })
  // console.log(chanis)
  while (chanis.length) {
    promise = promise.then(chanis.shift(), chanis.shift())
  }
  return promise
}

function dispatchRequest() {
  return new Promise((relove, reject) => {
    relove({
      status: '200',
      statusText: 'ok'
    })
  })
}

Axios.prototype.get = function(config) {
  return this.request({ method: 'GET' })
}
Axios.prototype.post = function(config) {
  return this.request({ method: 'POST' })
}

function createInstance(config) {
  let context = new Axios(config)
  let instance = Axios.prototype.request.bind(context)
  Object.keys(Axios.prototype).forEach(key => {
    // instance[key] = Axios.prototype[key].bind(context)
    instance[key] = Axios.prototype[key].bind(context)
  })
  // console.log(instance)
  Object.keys(context).forEach(key => {
    instance[key] = context[key]
  })
  // console.dir(instance)
  return instance
}

let axios = createInstance()
axios.interceptors.request.use(function one(config) {
  console.log('请求拦截器 成功 - 1号');
  return config;
}, function one(error) {
  console.log('请求拦截器 失败 - 1号');
  return Promise.reject(error);
});

axios.interceptors.request.use(function two(config) {
  console.log('请求拦截器 成功 - 2号');
  return config;
}, function two(error) {
  console.log('请求拦截器 失败 - 2号');
  return Promise.reject(error);
});

// 设置响应拦截器
axios.interceptors.response.use(function(response) {
  console.log('响应拦截器 成功 1号');
  return response;
}, function(error) {
  console.log('响应拦截器 失败 1号')
  return Promise.reject(error);
});

axios.interceptors.response.use(function(response) {
  console.log('响应拦截器 成功 2号')
  return response;
}, function(error) {
  console.log('响应拦截器 失败 2号')
  return Promise.reject(error);
});
// console.log(axios)
axios.post({}).then(res => {
  console.log(res)
})
console.dir(axios, {
  depth: null,
})
// console.log(axios)
// axios.get({})
// axios.post({})

