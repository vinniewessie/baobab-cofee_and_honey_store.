let cart = [];
let total = 0;

// Add to Cart Functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const productName = button.getAttribute('data-name');
    const productPrice = parseFloat(button.getAttribute('data-price'));
    const quantityInput = button.parentNode.querySelector('.quantity'); // Get quantity from input
    const quantity = parseInt(quantityInput.value) || 1; // Default to 1 if not set

    // Check if product already in cart
    const existingIndex = cart.findIndex(item => item.name === productName);
    
    if(existingIndex > -1) {
      // If the product is already in the cart, update its quantity
      cart[existingIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.push({ name: productName, price: productPrice, quantity });
    }

    // Update the cart UI
    updateCartUI();
    updateWhatsAppLinks(); // Update WhatsApp link with cart details
  });
});

// Update Cart UI
function updateCartUI() {
  const cartItems = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');

  // Clear existing items
  cartItems.innerHTML = '';
  total = 0; // Reset total before recalculating

  let itemCount = 0;
  
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal; // Add item total to the overall total
    itemCount += item.quantity; // Add the quantity to item count

    // Create table row for each cart item
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

  // Update the cart count and total
  cartCount.textContent = itemCount;
  cartTotal.textContent = total.toFixed(2);

  // Show or hide the cart section based on whether it's empty or not
  document.getElementById('cart').style.display = cart.length > 0 ? 'block' : 'none';
}

// Update Quantity in Cart
function updateCartQuantity(index, newQuantity) {
  newQuantity = parseInt(newQuantity);
  if(newQuantity > 0) {
    cart[index].quantity = newQuantity;
  } else {
    cart[index].quantity = 1; // Ensure quantity is never less than 1
  }
  updateCartUI();
  updateWhatsAppLinks(); // Update WhatsApp link when quantity changes
}

// Remove from Cart Functionality
function removeFromCart(index) {
  total -= cart[index].price * cart[index].quantity; // Subtract the item total from the total
  cart.splice(index, 1); // Remove item from cart
  updateCartUI();
  updateWhatsAppLinks(); // Update WhatsApp link when item is removed
}

// Checkout Functionality
function checkout() {
  if(cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const confirmation = confirm(`Confirm purchase of ${cart.length} items for $${total.toFixed(2)}?`);
  if(confirmation) {
    alert(`Thank you for your purchase! Total: $${total.toFixed(2)}`);
    cart = [];
    total = 0;
    updateCartUI();
    updateWhatsAppLinks(); // Reset WhatsApp link after checkout
  }
}

// WhatsApp Integration
function generateWhatsAppLink() {
  const name = document.getElementById('name').value || 'Customer';

  // Create a list of cart items with quantities and prices
  const cartItems = cart.map(item => 
    `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
  ).join('%0A');
  
  const totalPrice = total.toFixed(2);
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

// Event Listeners
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    updateCartUI();
    updateWhatsAppLinks(); // Ensure WhatsApp link updates when cart changes
  });
});

// Initialize WhatsApp Links
updateWhatsAppLinks();
