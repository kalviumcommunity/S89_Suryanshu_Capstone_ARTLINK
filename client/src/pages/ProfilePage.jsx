import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from "../context/CartContext";
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const { orders, addOrder, setOrders } = useOrders();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleCancelOrder = (orderId) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const handleAddToCartFromWishlist = (item) => {
    addToCart(item);
    removeFromWishlist(item.id);
  };

  return (
    <div className="profile-page-center">
      <div className="profile-box">
        <h1 className="profile-title">My Profile</h1>
        <div className="profile-info">
          <h2>{user?.name || 'User Name'}</h2>
          <p>Email: {user?.email || 'user@example.com'}</p>
          {/* Add more profile details and edit options here */}
        </div>
      </div>
      <section className="orders-section">
        <h2>My Orders</h2>
        {orders.length === 0 ? (
          <div>No orders placed yet.</div>
        ) : (
          <ul className="orders-list">
            {orders.map(order => (
              <li key={order.id} className="order-item">
                <div><b>Date:</b> {order.date}</div>
                <div><b>Total:</b> ₹{order.total}</div>
                <div><b>Payment:</b> {order.payment}</div>
                <div><b>Address:</b> {order.address ? `${order.address.name}, ${order.address.street}, ${order.address.city}, ${order.address.pincode}, ${order.address.state}` : "-"}</div>
                <div><b>Items:</b>
                  <ul>
                    {order.items.map(item => (
                      <li key={item.id}>{item.title || item.name} x {item.quantity || 1} (₹{item.price})</li>
                    ))}
                  </ul>
                </div>
                <button className="cancel-order-btn" onClick={() => handleCancelOrder(order.id)}>Cancel Order</button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="wishlist-section">
        <h2>My Wishlist</h2>
        {wishlist.length === 0 ? (
          <div>No products in wishlist.</div>
        ) : (
          <ul className="wishlist-list">
            {wishlist.map(item => (
              <li key={item.id} className="wishlist-item">
                <span>{item.title || item.name} (₹{item.price})</span>
                <div className="wishlist-actions">
                  <button className="add-to-cart-mini-btn" onClick={() => handleAddToCartFromWishlist(item)} title="Add to Cart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#2d2dcf" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14.26l.03.01L7.16 14.26zM7.1 14l-.94-2h9.45c.75 0 1.41-.41 1.75-1.03l3.24-5.88A1 1 0 0 0 19.45 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7.42c-.14 0-.25-.11-.32-.24z"></path></svg>
                  </button>
                  <button className="remove-wishlist-btn" onClick={() => removeFromWishlist(item.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
