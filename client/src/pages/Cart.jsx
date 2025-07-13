import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import './Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [cartError, setCartError] = useState("");

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = (e) => {
    if (cartItems.length === 0) {
      e.preventDefault();
      setCartError('Your cart is empty.');
      setTimeout(() => setCartError(""), 2000);
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="cart-container">
      <h1>YOUR CART</h1>
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.title} className="item-image" />
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p>by {item.artist}</p>
                  <p className="price">${item.price}</p>
                </div>
                <div className="item-quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease quantity">
                    {/* <FaMinus /> */}
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">
                    {/* <FaPlus /> */}
                    +
                  </button>
                </div>
                <button className="remove-item" onClick={() => removeFromCart(item.id)}>
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>
        <div className="cart-summary">
          <h2>Order Summary</h2>
          {cartError && <div className="cart-error-message">{cartError}</div>}
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>FREE</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            className="checkout-button"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
