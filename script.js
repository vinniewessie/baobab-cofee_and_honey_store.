let cart = [];
let total = 0;

// Add to Cart Functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const product = {
      name: button.getAttribute('data-name'),
      price: parseFloat(button.getAttribute('data-price')),
      quantity: parseInt(button.parentNode.querySelector('.quantity').value)
    };

    // Check if product already in cart
    const existingIndex = cart.findIndex(item => item.name === product.name);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += product.quantity;
    } else {
      cart.push(product);
    }

    total += product.price * product.quantity;

    updateCartUI();
    updateWhatsAppLinks(); // Update WhatsApp link when cart changes
  });
});

// Update Cart UI
function updateCartUI() {
  const cartItems = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');

  // Clear existing items
  cartItems.innerHTML = '';
  total = 0;
  let itemCount = 0;

  // Add new items
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    itemCount += item.quantity;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.name}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>
        <input type="number" min="1" value="${item.quantity}"
               class="form-control cart-quantity"
               onchange="updateCartQuantity(${index}, this.value)">
      </td>
      <td>$${itemTotal.toFixed(2)}</td>
      <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Remove</button></td>
    `;
    cartItems.appendChild(row);
  });

  cartCount.textContent = itemCount;
  cartTotal.textContent = total.toFixed(2);
  document.getElementById('cart').style.display = cart.length > 0 ? 'block' : 'none';
}

// Update Quantity in Cart
function updateCartQuantity(index, newQuantity) {
  newQuantity = parseInt(newQuantity);
  if (newQuantity > 0) {
    cart[index].quantity = newQuantity;
  } else {
    cart[index].quantity = 1;
  }
  updateCartUI();
  updateWhatsAppLinks(); // Update WhatsApp link when cart changes
}

// Remove from Cart Functionality
function removeFromCart(index) {
  total -= cart[index].price * cart[index].quantity;
  cart.splice(index, 1);
  updateCartUI();
  updateWhatsAppLinks(); // Update WhatsApp link when cart changes
}

// Checkout Functionality
function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const confirmation = confirm(`Confirm purchase of ${cart.length} items for $${total.toFixed(2)}?`);
  if (confirmation) {
    alert(`Thank you for your purchase! Total: $${total.toFixed(2)}`);
    cart = [];
    total = 0;
    updateCartUI();
    updateWhatsAppLinks(); // Update WhatsApp link when cart changes
  }
}

// WhatsApp Integration
function generateWhatsAppLink() {
  const name = document.getElementById('name').value || 'Customer';
  const cartItems = cart.map(item =>
    `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
  ).join('%0A');

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  const defaultMessage = `Hi, I need assistance with my order.`;

  let message = `*Name:* ${name}%0A`;
  if (cart.length > 0) {
    message += `*Order Summary:*%0A${cartItems}%0A*Total:* $${totalPrice}%0A`;
  }
  message += `*Message:* ${defaultMessage}`;

  const whatsappLink = `https://wa.me/263714384521?text=${message}`;
  return whatsappLink;
}

// Update WhatsApp Links
function updateWhatsAppLinks() {
  const whatsappLink = generateWhatsAppLink();
  document.getElementById('whatsapp-float').href = whatsappLink;
  document.getElementById('whatsapp-contact').href = whatsappLink;
}

// Share Cart via WhatsApp
function shareCartViaWhatsApp() {
  if (cart.length === 0) {
    alert("Your cart is empty. Add some products to share!");
    return;
  }

  let message = "📦 *ORDER SUMMARY* 📦\n\n";
  message += "Here are the items in my cart:\n\n";

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    message += `${index + 1}. ${item.name}\n`;
    message += `   Quantity: ${item.quantity}\n`;
    message += `   Price Each: $${item.price.toFixed(2)}\n`;
    message += `   Total: $${itemTotal.toFixed(2)}\n\n`;
  });

  message += `💵 *GRAND TOTAL: $${total.toFixed(2)}*\n\n`;
  message += "Please confirm this order. Thank you!";

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/263714384521?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
}

// Event Listeners
document.getElementById('contact-form').addEventListener('input', updateWhatsAppLinks);
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    updateCartUI();
    updateWhatsAppLinks(); // Update WhatsApp link when cart changes
  });
});

// Initialize WhatsApp Links
updateWhatsAppLinks();
