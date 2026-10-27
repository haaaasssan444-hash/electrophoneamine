let prods = JSON.parse(localStorage.getItem('productsData'))||[];
let cart = JSON.parse(localStorage.getItem('cart'))||[];
document.getElementById('totalProducts').textContent = prods.length;
document.getElementById('totalValue').textContent = prods.reduce((a,b)=>a+(b.price||0),0) + ' DH';
document.getElementById('totalOrders').textContent = cart.length;