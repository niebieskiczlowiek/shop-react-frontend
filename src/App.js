import React, { useState, useEffect } from 'react'; 
import './App.css';
import Products from './components/products/Products'
import Cart from './components/cart/Cart'
import Coupons from './components/coupons/Coupons';


const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartState, setCartState] = useState(false);
  const [itemCategory, setCategory] = useState([])
  const [couponBox, setCouponBox] = useState(false);
  let [cartSum, setCartSum] = useState(0);
  const [image, setImageState] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const response = await fetch('./products.json');
      const data = await response.json();
  
      setProducts(data.products);
      setCategory(data.products);
    };
  
    getData();
  }, []); /*  <---- ten pusty array daje to ze funkcja odpali sie tyklo raz (to tylko taki zapis, tu nie ma faktycznego arraya) */

  const addToCart = (product) => {
    setCart([...cart, product]);
    setCartState(true)
    console.log(product.price)
    getCartSum(product.price);
  }

  const clearCart = () => {
    setCart([]);
    setCartSum(0);
  }

  const showCart = () => {
    setCartState(!cartState);
  }

  const showCouponBox = () => {
    setCouponBox(!couponBox);
  }

  const deleteLastItem = () => {
    setCart(cart.slice(0, -1));
    setCartSum(cartSum - cart[cart.length - 1].price);
  }

  const deleteItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    setCartSum(cartSum - cart[index].price);
  }

  const discountCode = (code) => {
    const item = products.filter((products) => products.promoCode === code)[0]
    const redeemed = item.redeemed
    if (item) {
      if (redeemed === false) {
        item.price = (item.price - item.price*item.promoCodeDiscount).toFixed(1);
        item.redeemed = true;
        setProducts([...products, item])
      }
      else {
        alert('Coupon already used')
      }
    }
    else {
      console.log('Invalid coupon code')
    }
  } 

  const category = (category) => {
    if (category === 'all') {
      setCategory(products)
    }
    else {
      const listCategory = products.filter((products) => products.category === category);
      setCategory(listCategory);
    }
  }
  const getCartSum = (price) => {
    console.log('ok')
    setCartSum(cartSum + price)
  }

  const getImage = (id) => {
    setImageState(!image)
    console.log(id, image)
  }

  return (
    <div className="App">
      <div className="topbar">
        
        <div className="top3"></div>
        <div className="top2" onClick={showCouponBox}>
          <p className="topButton">Kupony</p>
        </div>
        <div className="top1">
          <h1 className="header"> Shop Pracz </h1>
        </div>
        <div className="top2" onClick={showCart}>
          <p className="topButton">Koszyk</p>
        </div>
        <div className="top3"></div>

      </div>  
      {couponBox && <Coupons discountCode={discountCode}/>}
      {cartState && <Cart cart={cart} className="outerCart" clearCart={clearCart} deleteLast={deleteLastItem} deleteItem={deleteItem} cartSum={cartSum} />}
      <div> 
        <Products products={products} setCart={addToCart} category={category} itemCategory={itemCategory} getImage={getImage}/>
      </div> 
    </div>
  );
}

export default App;