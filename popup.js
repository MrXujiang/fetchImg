chrome.storage.sync.get('imgArr', function(data) {
  data.imgArr && data.imgArr.forEach(item => {
    var imgWrap = $("<div class='img-box'></div>")
    var img = $("<img src='" + item + "' alt='" + item + "' />")
    imgWrap.append(img);
    $('#content').append(imgWrap);
    $('.empty').hide();
  })
});

$('#activeBtn').click(function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, "activeBtn", function(response) {
      console.log(response);
    });
  });
});

// $('#pop').on("click",
//     function() {
//   window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
// }, false);

// $('#go-to-options').on('click',function() {
//   if (chrome.runtime.openOptionsPage) {
//     chrome.runtime.openOptionsPage();
//   } else {
//     window.open(chrome.runtime.getURL('options.html'));
//   }
// });