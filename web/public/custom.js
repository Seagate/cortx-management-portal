(function (){
    function changeLogo() {
    var link = document.querySelector("link[rel*='icon']");
    document.head.removeChild(link);
    link = document.createElement('link');
    link.type = 'image/png';
    link.rel =  'icon';
    link.href = '/public/favicon.ico';
    document.getElementsByTagName('head')[0].appendChild(link);
    var icon = document.querySelector(".topbar-wrapper");
    var img = icon.querySelector("img");
    img.src="/public/seagate-green-logo.svg";
    img.style ='display: block'
    var brandName = document.createElement('img');
    brandName.src = "/public/product-name.svg";
    brandName.style = 'display: block';
    icon.appendChild(brandName);
    }
    setTimeout(changeLogo, 600);
})();
