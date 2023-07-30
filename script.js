$(function() {
	var urlId = tabId = null, image = '';
	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
	  tabId = tabs[0]['id'];
	  urlId = tabs[0]['url'];
	});


	chrome.tabs.executeScript(tabId, {code:"var item = document.querySelector('body > div.ReactModalPortal button img');item.getAttribute('src');"}, 
		(res) => { 
			if (res != undefined) {
				image = res[0]
			}
		});

	$('form').on('submit', function(e) {
		e.preventDefault();
		url = image
		var name = $(this).find('input[name=name]').val() || false;
		var width = $(this).find('input[name=width]').val() || false;
		var height = $(this).find('input[name=height]').val() || false;
		var txt = $(this).find('input[name=txt]').val() || false;
		var txtAlign = $(this).find('input[name=txt-align]').val() || false;
		var txtFont = $(this).find('input[name=txt-font]').val() || false;
		var txtSize = $(this).find('input[name=txt-size]').val() || false;
		var txtColor = $(this).find('input[name=txt-color]').val() || false;
		var fpY = $(this).find('input[name=fp-y]').val() || false;
		var fpX = $(this).find('input[name=fp-x]').val() || false;


		if (width) url = url+'&w='+width;
		if (height) url = url+'&h='+height;
		if (txt) {
			url = url+'&txt='+txt;
			if (txtAlign) url = url+'&txt-align='+txtAlign;
			if (txtFont) url = url+'&txt-font='+txtFont;
			if (txtSize) url = url+'&txt-size='+txtSize;
			if (txtColor) url = url+'&txt-color='+txtColor;
			if (fpY) url = url+'&fp-y='+fpY;
			if (fpX) url = url+'&fp-x='+fpX;
		}

		image_id = urlId.split('/');
		image_id = image_id[image_id.length - 1]

		$('body').find('#tmp_image').remove();

		fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                var $a = $("<a>");
				$a.attr("href",reader.result);
				$("body").append($a);
				$a.append('<img src="'+url+'" id="tmp_image" style="margin-top:20px; display:block">');
				if (name) $a.attr("download",name+'.jpeg');
				else $a.attr("download",image_id+'.jpeg');
				$a[0].click();
				$a.remove();

				setTimeout(function() {
					window.close();
				}, 1000)
            };
            reader.readAsDataURL(blob);
        });
	})
})