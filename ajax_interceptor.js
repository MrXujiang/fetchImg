
// 命名空间
let ajax_interceptor_qoweifjqon = {
  originalXHR: window.XMLHttpRequest,
  myXHR: function() {
    let pageScriptEventDispatched = false;
    const modifyResponse = () => {
      console.log(11111, this.response, this.responseText)
      if (!pageScriptEventDispatched) {
        window.dispatchEvent(new CustomEvent("pageScript", {
          detail: {url: this.responseURL, data: this.response}
        }));
        pageScriptEventDispatched = true;
      }
    }
    
    const xhr = new ajax_interceptor_qoweifjqon.originalXHR;
    for (let attr in xhr) {
      if (attr === 'onreadystatechange') {
        xhr.onreadystatechange = (...args) => {
          if (this.readyState == 4) {
            // 开启拦截
            modifyResponse();
          }
          this.onreadystatechange && this.onreadystatechange.apply(this, args);
        }
        continue;
      } else if (attr === 'onload') {
        xhr.onload = (...args) => {
          // 开启拦截
          modifyResponse();
          this.onload && this.onload.apply(this, args);
        }
        continue;
      }
  
      if (typeof xhr[attr] === 'function') {
        this[attr] = xhr[attr].bind(xhr);
      } else {
        // responseText和response不是writeable的，但拦截时需要修改它，所以修改就存储在this[`_${attr}`]上
        if (attr === 'responseText' || attr === 'response') {
          Object.defineProperty(this, attr, {
            get: () => this[`_${attr}`] == undefined ? xhr[attr] : this[`_${attr}`],
            set: (val) => this[`_${attr}`] = val,
            enumerable: true
          });
        } else {
          Object.defineProperty(this, attr, {
            get: () => xhr[attr],
            set: (val) => xhr[attr] = val,
            enumerable: true
          });
        }
      }
    }
  },

  originalFetch: window.fetch.bind(window),
  myFetch: function(...args) {
    return ajax_interceptor_qoweifjqon.originalFetch(...args).then((response) => {
      window.dispatchEvent(new CustomEvent("pageScript", {
        detail: {url: response.url}
      }));
      console.log('fetch', response)

      return response;
    });
  },
}

window.XMLHttpRequest = ajax_interceptor_qoweifjqon.myXHR;
window.fetch = ajax_interceptor_qoweifjqon.myFetch;