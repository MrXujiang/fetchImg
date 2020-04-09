const systems = {
  a: '趣谈前端',
  b: '掘金',
  c: '微信'
}

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The color is green.");
  });
  // 类似于什么时候激活浏览器插件图标这种感觉
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostSuffix: '.com'},
      })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });

  // 上下文菜单
  for (let key of Object.keys(systems)) {
    chrome.contextMenus.create({
      id: key,
      title: systems[key],
      type: 'normal',
      contexts: ['selection'],
    });
  }
});

// chrome.runtime.onMessage.addListener(function(req, sender) {
//   chrome.storage.local.set({'address': req.address})
//   chrome.pageAction.show(sender.tab.id);
//   chrome.pageAction.setTitle({tabId: sender.tab.id, title: req.address});
// });

// 用来控制在用户搜索的时候, 可以通过插件指定的关键字跳转到我们控制的url上
chrome.omnibox.onInputEntered.addListener(function(text) {
  // Encode user input for special characters , / ? : @ & = + $ #
  var newURL = 'https://www.google.com/search?q=' + encodeURIComponent(text);
  chrome.tabs.create({ url: newURL });
});

// 谷歌自定义命令快捷键
const MainPageUrl = 'https://bbs.hupu.com/all-gambia'
chrome.commands.onCommand.addListener(function(command) {
  console.log(command)
  if (command === 'toggle-tags') {
    chrome.tabs.create({"url": MainPageUrl, "selected": true});
  }
  // chrome.tabs.query({currentWindow: true}, function(tabs) {
  //   // Sort tabs according to their index in the window.
  //   tabs.sort((a, b) => { return a.index < b.index; });
  //   let activeIndex = tabs.findIndex((tab) => { return tab.active; });
  //   let lastTab = tabs.length - 1;
  //   let newIndex = -1;
  //   if (command === 'flip-tabs-forward')
  //     newIndex = activeIndex === 0 ? lastTab : activeIndex - 1;
  //   else  // 'flip-tabs-backwards'
  //     newIndex = activeIndex === lastTab ? 0 : activeIndex + 1;
  //   chrome.tabs.update(tabs[newIndex].id, {active: true, highlighted: true});
  // });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });