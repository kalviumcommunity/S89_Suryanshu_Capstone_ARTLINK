import React, { useState } from "react";
import "./Checkout.css";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import { useNavigate } from "react-router-dom";

const initialAddresses = [
  {
    id: 1,
    name: "John Doe",
    street: "123 Main St",
    city: "City",
    pincode: "12345",
    state: "State",
  },
  {
    id: 2,
    name: "Jane Smith",
    street: "456 Park Ave",
    city: "City",
    pincode: "67890",
    state: "State",
  },
];

// List of Indian states
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const Checkout = () => {
  const { cartItems, setCartItems } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]?.id || "new");
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    street: "",
    city: "",
    pincode: "",
    state: "",
  });
  const [cardForm, setCardForm] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
    save: false,
  });
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Handle address form changes
  const handleAddressChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  // Edit address
  const handleEditAddress = (id) => {
    const addr = addresses.find(a => a.id === id);
    setEditingAddressId(id);
    setShowNewAddress(false);
    // Split name into first, middle, last (handle missing parts)
    const [firstName = "", middleName = "", ...rest] = (addr.name || " ").split(" ");
    const lastName = rest.join(" ");
    setAddressForm({
      firstName,
      middleName,
      lastName,
      street: addr.street,
      city: addr.city,
      pincode: addr.pincode,
      state: addr.state,
    });
  };

  // Save edited address
  const handleSaveEdit = () => {
    setAddresses(addresses.map(addr =>
      addr.id === editingAddressId
        ? {
            ...addr,
            name: `${addressForm.firstName} ${addressForm.middleName} ${addressForm.lastName}`.replace(/ +/g, ' ').trim(),
            street: addressForm.street,
            city: addressForm.city,
            pincode: addressForm.pincode,
            state: addressForm.state,
          }
        : addr
    ));
    setEditingAddressId(null);
    setAddressForm({
      firstName: "",
      middleName: "",
      lastName: "",
      street: "",
      city: "",
      pincode: "",
      state: "",
    });
  };

  // Delete address
  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
    if (selectedAddress === id) {
      setSelectedAddress(addresses[0]?.id || "new");
    }
  };

  // Add new address
  const handleAddNewAddress = () => {
    const newId = Math.max(0, ...addresses.map(a => a.id)) + 1;
    setAddresses([
      ...addresses,
      {
        id: newId,
        name: `${addressForm.firstName} ${addressForm.middleName} ${addressForm.lastName}`.replace(/ +/g, ' ').trim(),
        street: addressForm.street,
        city: addressForm.city,
        pincode: addressForm.pincode,
        state: addressForm.state,
      },
    ]);
    setSelectedAddress(newId);
    setShowNewAddress(false);
    setAddressForm({
      firstName: "",
      middleName: "",
      lastName: "",
      street: "",
      city: "",
      pincode: "",
      state: "",
    });
  };

  // Handle card form changes
  const handleCardChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCardForm({ ...cardForm, [name]: type === "checkbox" ? checked : value });
  };

  // Fetch city from pincode (using api.postalpincode.in)
  const fetchCityFromPincode = async (pincode) => {
    if (pincode.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await res.json();
        if (data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
          setAddressForm((prev) => ({ ...prev, city: data[0].PostOffice[0].District }));
        }
      } catch (e) {
        // ignore
      }
    }
  };

  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  const handlePlaceOrder = () => {
    const order = {
      id: Date.now(),
      items: cartItems,
      address: addresses.find(a => a.id === selectedAddress),
      payment: selectedPayment,
      total,
      date: new Date().toLocaleString(),
    };
    addOrder(order);
    setOrderPlaced(true);
    setCartItems([]);
    localStorage.removeItem('cartItems');
    setTimeout(() => {
      navigate("/profile");
    }, 2000);
  };

  return (
    <div className="checkout-outer">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Complete your purchase in a few easy steps</p>
      </div>
      <div className="checkout-main">
        <section className="checkout-section address-section">
          <h2>Shipping Address</h2>
          <div className="address-list">
            {addresses.map(addr => (
              <label className={`address-card ${selectedAddress === addr.id ? "selected" : ""}`} key={addr.id}>
                <input type="radio" name="address" checked={selectedAddress === addr.id} onChange={() => { setSelectedAddress(addr.id); setShowNewAddress(false); setEditingAddressId(null); }} />
                <div>
                  <strong>{addr.name}</strong><br />
                  {addr.street},<br />
                  {addr.city}, {addr.pincode},<br />
                  {addr.state}
                </div>
                <span className="edit-delete">
                  <button type="button" className="edit-btn" onClick={e => { e.preventDefault(); handleEditAddress(addr.id); }}>Edit</button>
                  |
                  <button type="button" className="delete-btn" onClick={e => { e.preventDefault(); handleDeleteAddress(addr.id); }}>Delete</button>
                </span>
              </label>
            ))}
            <label className={`address-card add-new ${selectedAddress === "new" ? "selected" : ""}`}>
              <input type="radio" name="address" checked={selectedAddress === "new"} onChange={() => { setSelectedAddress("new"); setShowNewAddress(true); setEditingAddressId(null); }} />
              <div>Add New Address</div>
            </label>
          </div>
          {/* Show edit form separately below the address list */}
          {editingAddressId && (
            <form className="edit-address-form" onSubmit={e => { e.preventDefault(); handleSaveEdit(); }}>
              <h3>Edit Address</h3>
              <div className="address-row">
                <input name="firstName" placeholder="First Name" value={addressForm.firstName} onChange={handleAddressChange} required />
                <input name="middleName" placeholder="Middle Name" value={addressForm.middleName} onChange={handleAddressChange} />
                <input name="lastName" placeholder="Last Name" value={addressForm.lastName} onChange={handleAddressChange} />
              </div>
              <input name="street" placeholder="Street" value={addressForm.street} onChange={handleAddressChange} required />
              <div className="address-row">
                <input name="city" placeholder="City" value={addressForm.city} onChange={handleAddressChange} required readOnly style={{ background: '#f5f5f5' }} />
                <input name="pincode" placeholder="Pin-code" value={addressForm.pincode} onChange={e => {
  handleAddressChange(e);
  if (e.target.value.length === 6) fetchCityFromPincode(e.target.value);
}} required />
                <select name="state" value={addressForm.state} onChange={handleAddressChange} required>
                  <option value="">Select State</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div className="address-buttons">
                <button type="button" className="cancel-btn" onClick={() => { setEditingAddressId(null); setAddressForm({ firstName: "", middleName: "", lastName: "", street: "", city: "", pincode: "", state: "" }); }}>Cancel</button>
                <button type="submit" className="use-btn">Save Address</button>
              </div>
            </form>
          )}
          {/* Show add new address form only if not editing */}
          {showNewAddress && !editingAddressId && (
            <form className="new-address-form" onSubmit={e => { e.preventDefault(); handleAddNewAddress(); }}>
              <div className="address-row">
                <input name="firstName" placeholder="First Name" value={addressForm.firstName} onChange={handleAddressChange} required />
                <input name="middleName" placeholder="Middle Name" value={addressForm.middleName} onChange={handleAddressChange} />
                <input name="lastName" placeholder="Last Name" value={addressForm.lastName} onChange={handleAddressChange} />
              </div>
              <input name="street" placeholder="Street" value={addressForm.street} onChange={handleAddressChange} required />
              <div className="address-row">
                <input name="city" placeholder="City" value={addressForm.city} onChange={handleAddressChange} required readOnly style={{ background: '#f5f5f5' }} />
                <input name="pincode" placeholder="Pin-code" value={addressForm.pincode} onChange={e => {
  handleAddressChange(e);
  if (e.target.value.length === 6) fetchCityFromPincode(e.target.value);
}} required />
                <select name="state" value={addressForm.state} onChange={handleAddressChange} required>
                  <option value="">Select State</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div className="address-buttons">
                <button type="button" className="cancel-btn" onClick={() => { setShowNewAddress(false); setAddressForm({ firstName: "", middleName: "", lastName: "", street: "", city: "", pincode: "", state: "" }); }}>Cancel</button>
                <button type="submit" className="use-btn">Use this address</button>
              </div>
            </form>
          )}
        </section>
        <section className="checkout-section payment-section">
          <h2>Payment Method</h2>
          <div className="payment-list">
            <label className={`payment-card ${selectedPayment === "card" ? "selected" : ""}`}>
              <input type="radio" name="payment" checked={selectedPayment === "card"} onChange={() => setSelectedPayment("card")} />
              <span>Credit or Debit Card</span>
            </label>
            {selectedPayment === "card" && (
              <form className="card-form">
                <input name="name" placeholder="Name on Card" value={cardForm.name} onChange={handleCardChange} />
                <input name="number" placeholder="Card Number" value={cardForm.number} onChange={handleCardChange} />
                <div className="card-row">
                  <input name="expiry" placeholder="Expiry Date" value={cardForm.expiry} onChange={handleCardChange} />
                  <input name="cvv" placeholder="CVV" value={cardForm.cvv} onChange={handleCardChange} />
                </div>
                <div className="card-save-row">
                  <input type="checkbox" name="save" checked={cardForm.save} onChange={handleCardChange} />
                  <span>Save this Card</span>
                </div>
                <div className="card-buttons">
                  <button type="button" className="cancel-btn">Cancel</button>
                  <button type="button" className="use-btn">Use This Card</button>
                </div>
              </form>
            )}
            <label className={`payment-card ${selectedPayment === "gpay" ? "selected" : ""}`}>
              <input type="radio" name="payment" checked={selectedPayment === "gpay"} onChange={() => setSelectedPayment("gpay")} />
              <span>Google Pay</span>
            </label>
            <label className={`payment-card ${selectedPayment === "cod" ? "selected" : ""}`}>
              <input type="radio" name="payment" checked={selectedPayment === "cod"} onChange={() => setSelectedPayment("cod")} />
              <span>Cash on Delivery</span>
            </label>
          </div>
        </section>
        <aside className="checkout-summary">
          <h2>Order Summary</h2>
          {orderPlaced && (
            <div className="order-placed-message">Order placed successfully! Redirecting to homepage...</div>
          )}
          <div className="summary-details">
            {cartItems.length === 0 ? (
              <div className="summary-row">Your cart is empty.</div>
            ) : (
              cartItems.map((item) => (
                <div className="summary-row" key={item.id}>
                  <span>{item.title || item.name}</span>
                  <span>₹{item.price} x {item.quantity || 1}</span>
                </div>
              ))
            )}
            <div className="summary-row total"><span>Total</span><span>₹{total}</span></div>
          </div>
          <button className="place-order-btn" disabled={cartItems.length === 0 || orderPlaced} onClick={handlePlaceOrder}>Place Order</button>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
