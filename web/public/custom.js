/*
* CORTX-CSM: CORTX Management web and CLI interface.
* Copyright (c) 2020 Seagate Technology LLC and/or its Affiliates
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published
* by the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
* You should have received a copy of the GNU Affero General Public License
* along with this program. If not, see <https://www.gnu.org/licenses/>.
* For any questions about this software or licensing,
* please email opensource@seagate.com or cortx-questions@seagate.com.
*/
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
