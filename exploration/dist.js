!function(n){function t(e){if(a[e])return a[e].exports;var r=a[e]={i:e,l:!1,exports:{}};return n[e].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var a={};t.m=n,t.c=a,t.i=function(n){return n},t.d=function(n,a,e){t.o(n,a)||Object.defineProperty(n,a,{configurable:!1,enumerable:!0,get:e})},t.n=function(n){var a=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(a,"a",a),a},t.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},t.p="",t(t.s=0)}([function(module,exports,__webpack_require__){"use strict";eval("\n\nvar margin = { top: 10, right: 30, bottom: 30, left: 30 };\nvar width = 960 - margin.left - margin.right;\nvar height = 500 - margin.top - margin.bottom;\n\nvar svg = d3.select('body').append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);\n\nsvg.append('g').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');\n\nvar peopleData = d3.csv('data/people.csv', function (response) {\n  console.log(response);\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9zY3JpcHQuanM/OWE5NSJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBtYXJnaW4gPSB7IHRvcDogMTAsIHJpZ2h0OiAzMCwgYm90dG9tOiAzMCwgbGVmdDogMzAgfVxuY29uc3Qgd2lkdGggPSA5NjAgLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodFxuY29uc3QgaGVpZ2h0ID0gNTAwIC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b21cblxuY29uc3Qgc3ZnID0gZDNcbiAgLnNlbGVjdCgnYm9keScpXG4gIC5hcHBlbmQoJ3N2ZycpXG4gIC5hdHRyKCd3aWR0aCcsIHdpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQpXG4gIC5hdHRyKCdoZWlnaHQnLCBoZWlnaHQgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbSlcblxuc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHttYXJnaW4ubGVmdH0sICR7bWFyZ2luLnRvcH0pYClcblxuY29uc3QgcGVvcGxlRGF0YSA9IGQzLmNzdignZGF0YS9wZW9wbGUuY3N2JywgKHJlc3BvbnNlKSA9PiB7XG4gIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxufSlcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzY3JpcHQuanMiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///0\n")}]);