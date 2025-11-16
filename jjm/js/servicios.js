// ===== VARIABLES =====
const subproductsModal = document.getElementById('subproductsModal');
const subproductsList = document.getElementById('subproductsList');
const subproductsForm = document.getElementById('subproductsForm');
const modalTitle = document.getElementById('modalTitle');

const cartModal = document.getElementById('cartModal');
const cartItemsContainer = document.getElementById('cartItems');
const cartButton = document.getElementById('cartButton');
const cartCount = document.getElementById('cartCount');
const payButton = document.getElementById('payButton');

let cart = [];
let currentProduct = '';

// ===== FUNCIONES DE SUBPRODUCTOS =====
function abrirModal(productName, subproducts) {
    currentProduct = productName;
    modalTitle.textContent = `Selecciona Subproductos para "${productName}"`;
    subproductsList.innerHTML = '';

    subproducts.forEach((sub, index) => {
        const div = document.createElement('div');
        div.classList.add('subproduct-item');
        div.innerHTML = `
            <input type="checkbox" id="sub${index}" name="subproduct" value="${sub}">
            <label for="sub${index}"><i class="fas fa-box"></i> ${sub}</label>
        `;
        subproductsList.appendChild(div);
    });

    subproductsModal.style.display = 'block';
}

// ===== CERRAR MODALES =====
subproductsModal.querySelector('.close').addEventListener('click', () => {
    subproductsModal.style.display = 'none';
});
cartModal.querySelector('.close').addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// ===== AGREGAR SUBPRODUCTOS AL CARRITO =====
subproductsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const selected = Array.from(subproductsForm.querySelectorAll('input[name="subproduct"]:checked')).map(i => i.value);

    if(selected.length === 0){
        alert("Selecciona al menos un subproducto");
        return;
    }

    cart.push({ product: currentProduct, subproducts: selected });
    subproductsModal.style.display = 'none';
    actualizarCarrito();
});

// ===== ACTUALIZAR CARRITO =====
function actualizarCarrito() {
    cartItemsContainer.innerHTML = '';
    cartCount.textContent = cart.length;

    if(cart.length === 0){
        cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        return;
    }

    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `<strong>${item.product}:</strong> ${item.subproducts.join(', ')}
        <button onclick="eliminarDelCarrito(${index})" class="button-unified" style="background-color:#e74c3c"><i class="fas fa-trash"></i> Eliminar</button>`;
        cartItemsContainer.appendChild(div);
    });
}

function eliminarDelCarrito(index) {
    cart.splice(index,1);
    actualizarCarrito();
}

// ===== ABRIR CARRITO =====
cartButton.addEventListener('click', () => {
    actualizarCarrito();
    cartModal.style.display = 'block';
});

// ===== BOTON PAGAR =====
payButton.addEventListener('click', () => {
    if(cart.length === 0){
        alert("Tu carrito está vacío");
        return;
    }

    const paymentModal = document.createElement('div');
    paymentModal.classList.add('modal', 'payment-modal');
    paymentModal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h3>Selecciona Método de Pago</h3>
            <div class="payment-buttons" style="display:flex;gap:10px;justify-content:center;margin:20px 0;">
                <button id="cardPayButton" class="button-unified"><i class="fas fa-credit-card"></i> Tarjeta</button>
                <button id="paypalPayButton" class="button-unified"><i class="fab fa-paypal"></i> PayPal</button>
                <button id="storePayButton" class="button-unified"><i class="fas fa-store"></i> Pago Físico</button>
            </div>
            <div id="paymentFormContainer"></div>
        </div>
    `;
    document.body.appendChild(paymentModal);

    paymentModal.querySelector('.close').addEventListener('click', () => paymentModal.remove());
    const paymentFormContainer = document.getElementById('paymentFormContainer');

    // ===== FORMULARIOS =====
    const crearFormularioTarjeta = () => {
        paymentFormContainer.innerHTML = `
            <form id="paymentForm">
                <input type="text" placeholder="Nombre" required />
                <input type="email" placeholder="Correo" required />
                <input type="text" placeholder="Número de tarjeta" required />
                <input type="text" placeholder="Fecha de expiración" required />
                <input type="text" placeholder="CVV" required />
                <button type="submit" class="button-unified"><i class="fas fa-dollar-sign"></i> Pagar</button>
            </form>
        `;
        document.getElementById('paymentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Pago con tarjeta realizado con éxito!");
            cart = [];
            actualizarCarrito();
            paymentModal.remove();
        });
    };

    const crearFormularioPaypal = () => {
        paymentFormContainer.innerHTML = `
            <form id="paymentForm">
                <input type="text" placeholder="Nombre" required />
                <input type="email" placeholder="Correo" required />
                <input type="text" placeholder="Cuenta PayPal" required />
                <button type="submit" class="button-unified"><i class="fas fa-dollar-sign"></i> Pagar</button>
            </form>
        `;
        document.getElementById('paymentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Pago con PayPal realizado con éxito!");
            cart = [];
            actualizarCarrito();
            paymentModal.remove();
        });
    };

    const crearFormularioFisico = () => {
        paymentFormContainer.innerHTML = `
            <form id="paymentForm">
                <input type="text" placeholder="Nombre" required />
                <input type="email" placeholder="Correo" required />
                <input type="text" placeholder="Identificador" value="ID-${Date.now()}" readonly />
                <button type="submit" class="button-unified"><i class="fas fa-download"></i> Descargar PDF</button>
            </form>
        `;

        document.getElementById('paymentForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const { jsPDF } = window.jspdf;
            const form = e.target;
            const name = form.querySelector('input[placeholder="Nombre"]').value;
            const email = form.querySelector('input[placeholder="Correo"]').value;
            const id = form.querySelector('input[placeholder="Identificador"]').value;

            const doc = new jsPDF();
            doc.setFillColor(6,68,69);
            doc.rect(0,0,210,30,'F');
            doc.setTextColor(255,255,255);
            doc.setFontSize(16);
            doc.text("JJM Tecnologías - Línea de Captura",105,20,{align:"center"});
            doc.setFontSize(12);
            doc.setTextColor(0,0,0);
            doc.text(`Nombre: ${name}`,20,50);
            doc.text(`Correo: ${email}`,20,60);
            doc.text(`Identificador: ${id}`,20,70);
            doc.text("Productos seleccionados:",20,80);
            let y = 90;
            cart.forEach(item => {
                doc.text(`${item.product}: ${item.subproducts.join(', ')}`,25,y);
                y += 10;
            });

            const canvas = document.createElement('canvas');
            JsBarcode(canvas, id, {format:"CODE128", displayValue:true, height:50});
            const imgData = canvas.toDataURL("image/png");
            doc.addImage(imgData,'PNG',20,y+20,170,30);
            doc.text("¡Presenta este PDF al pagar en físico!",20,y+60);
            doc.save(`LineaCaptura_${id}.pdf`);
            alert("PDF generado exitosamente!");
            cart = [];
            actualizarCarrito();
            paymentModal.remove();
        });
    };

    paymentModal.querySelector('#cardPayButton').addEventListener('click', crearFormularioTarjeta);
    paymentModal.querySelector('#paypalPayButton').addEventListener('click', crearFormularioPaypal);
    paymentModal.querySelector('#storePayButton').addEventListener('click', crearFormularioFisico);

    paymentModal.style.display = 'block';
});

// ===== CHATBOT PERSISTENTE =====
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotContainer = document.getElementById('chatbotContainer');
const closeChat = document.getElementById('closeChat');
const chatBody = document.getElementById('chatBody');
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');

let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

// Inicializar saludo al cargar por primera vez
if(chatHistory.length === 0){
  chatHistory.push({ type: 'bot', message: '👋 ¡Hola! Soy tu asistente virtual de JJM Tecnologías Innovadoras. ¿En qué puedo ayudarte hoy?' });
  localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// Función para renderizar todo el chat guardado
function renderChat() {
  chatBody.innerHTML = '';
  chatHistory.forEach(item => {
    const div = document.createElement('div');
    div.classList.add(item.type === 'user' ? 'user-message' : 'bot-message');
    div.textContent = item.message;
    chatBody.appendChild(div);
  });
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Renderizar chat al cargar
renderChat();

chatbotToggle.addEventListener('click', () => {
  chatbotContainer.classList.toggle('active');
});

closeChat.addEventListener('click', () => {
  chatbotContainer.classList.remove('active');
});

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const message = userInput.value.trim();
  if (message === '') return;

  chatHistory.push({ type: 'user', message });
  localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

  const userMsg = document.createElement('div');
  userMsg.classList.add('user-message');
  userMsg.textContent = message;
  chatBody.appendChild(userMsg);
  userInput.value = '';

  setTimeout(() => {
    const botResponse = getBotResponse(message);
    chatHistory.push({ type: 'bot', message: botResponse });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

    const botMsg = document.createElement('div');
    botMsg.classList.add('bot-message');
    botMsg.textContent = botResponse;
    chatBody.appendChild(botMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 600);
}

function getBotResponse(input) {
  const msg = input.toLowerCase();
  if (msg.includes('hola') || msg.includes('buenas')) return '¡Hola! 😊 ¿Buscas información sobre algún producto o servicio?';
  if (msg.includes('producto') || msg.includes('servicio')) return 'Tenemos 14 productos y servicios como desarrollo de software, IA, marketing digital y más. ¿Cuál te interesa?';
  if (msg.includes('contacto')) return 'Puedes escribirnos desde la sección de contacto o al correo: soporte@jjmtecnologias.com 📩';
  if (msg.includes('pago') || msg.includes('carrito')) return 'Puedes agregar productos al carrito y pagar con tarjeta, PayPal o en tienda 🛒';
  if (msg.includes('gracias')) return '¡Con gusto! 💚 Si necesitas más ayuda, aquí estaré.';
  return 'No estoy seguro de entenderte 🤔, pero puedo ayudarte con productos, servicios o pagos.';
}
