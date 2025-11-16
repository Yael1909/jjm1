document.addEventListener('DOMContentLoaded', () => {

  // ===== MENÚ HAMBURGUESA =====
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('rotate');
  });

  // ===== FORMULARIO =====
  const complaintForm = document.getElementById('complaintForm');
  const clearFormBtn = document.getElementById('clearFormBtn');
  const publicInbox = document.getElementById('publicInbox');
  const voiceBtn = document.getElementById('voiceBtn');
  const mensajeInput = document.getElementById('mensaje');

  function renderInbox() {
    const messages = JSON.parse(localStorage.getItem('buzon')) || [];
    publicInbox.innerHTML = '';
    const latestThree = messages.slice(-3).reverse();
    if (!latestThree.length) {
      publicInbox.innerHTML = '<p class="muted">No hay mensajes públicos aún.</p>';
      return;
    }
    latestThree.forEach(msg => {
      const div = document.createElement('div');
      div.className = 'comment';
      div.innerHTML = `<p><strong>${msg.nombre}</strong> (${msg.tipo}): ${msg.mensaje}</p>`;
      publicInbox.appendChild(div);
    });
  }

  complaintForm.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const tipo = document.getElementById('tipo').value;
    const mensaje = mensajeInput.value.trim();
    if (!nombre || !email || !mensaje) { alert('Por favor completa todos los campos.'); return; }
    const messages = JSON.parse(localStorage.getItem('buzon')) || [];
    messages.push({ nombre, email, tipo, mensaje, fecha: new Date().toISOString() });
    localStorage.setItem('buzon', JSON.stringify(messages));
    alert('¡Gracias! Tu mensaje ha sido enviado al buzón público.');
    complaintForm.reset();
    renderInbox();
  });

  clearFormBtn.addEventListener('click', () => complaintForm.reset());

  // ===== RECONOCIMIENTO DE VOZ =====
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-MX';
    recognition.continuous = false;
    recognition.interimResults = false;
    voiceBtn.addEventListener('click', () => {
      recognition.start();
      voiceBtn.textContent = '🎙️ Escuchando... (habla ahora)';
      voiceBtn.disabled = true;
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        mensajeInput.value += (mensajeInput.value ? ' ' : '') + transcript;
      };
      recognition.onerror = (event) => alert('Error al reconocer la voz: ' + event.error);
      recognition.onend = () => { voiceBtn.textContent = '🎤 Grabar voz'; voiceBtn.disabled = false; };
    });
  } else { voiceBtn.style.display = 'none'; }

  // ===== MAPA INTERACTIVO =====
  const map = L.map('mapBox').setView([19.7271, -99.0860], 16);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
  L.marker([19.7271, -99.0860]).addTo(map).bindPopup('JJM Tecnologías Innovadoras').openPopup();

  // ===== CHATBOT =====
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbotContainer = document.getElementById('chatbot');
  const chatClose = document.getElementById('chatClose');
  const chatBody = document.getElementById('chatBody');
  const chatInput = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');

  chatbotToggle.addEventListener('click', () => chatbotContainer.classList.toggle('active'));
  chatClose.addEventListener('click', () => chatbotContainer.classList.remove('active'));

  function getBotResponse(input) {
    const msg = input.toLowerCase();
    if (msg.includes('hola') || msg.includes('buenas')) return '👋 ¡Hola! Soy tu asistente virtual de JJM Tecnologías Innovadoras. ¿En qué puedo ayudarte hoy?';
    if (msg.includes('contacto') || msg.includes('queja') || msg.includes('sugerencia')) return '✉️ Puedes usar el formulario para enviar tus mensajes, quejas o sugerencias.';
    if (msg.includes('mapa') || msg.includes('ubicación')) return '🗺️ Nuestra ubicación está mostrada en el mapa interactivo de la página.';
    if (msg.includes('gracias')) return 'Ha sido un placer ayudarte. 💚';
    return 'Disculpa, no entendí tu mensaje. 🤔 Puedo ayudarte con el formulario y el mapa.';
  }

  function sendMessage() {
    const userInputVal = chatInput.value.trim();
    if (!userInputVal) return;
    const userMsg = document.createElement('div');
    userMsg.classList.add('user-message');
    userMsg.textContent = userInputVal;
    chatBody.appendChild(userMsg);
    const botMsg = document.createElement('div');
    botMsg.classList.add('bot-message');
    botMsg.textContent = getBotResponse(userInputVal);
    chatBody.appendChild(botMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
    chatInput.value = '';
  }

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

  // ===== INICIALIZACIÓN =====
  renderInbox();

});
