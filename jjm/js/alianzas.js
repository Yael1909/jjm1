// ===== VARIABLES =====
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotContainer = document.getElementById('chatbot');
const chatClose = document.getElementById('chatClose');
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// ===== FUNCIONES =====
chatbotToggle.addEventListener('click', () => {
    chatbotContainer.classList.toggle('active');
});

chatClose.addEventListener('click', () => {
    chatbotContainer.classList.remove('active');
});

function getBotResponse(input) {
    const msg = input.toLowerCase();

    if (msg.includes('hola') || msg.includes('buenas'))
        return '👋 ¡Hola! Soy tu asistente virtual de JJM Tecnologías Innovadoras. ¿En qué puedo ayudarte hoy?';

    if (msg.includes('alianza') || msg.includes('colaboración') || msg.includes('socios'))
        return '🤝 Estamos interesados en explorar alianzas estratégicas. Por favor, proporcione información sobre su empresa o propuesta.';

    if (msg.includes('contacto'))
        return 'Puede enviar su solicitud mediante el formulario de esta página o escribirnos a alianzas@jjmtecnologias.com 📩';

    if (msg.includes('empresa') || msg.includes('propuesta'))
        return 'Gracias por la información. Nuestro equipo de alianzas revisará su propuesta y se pondrá en contacto a la brevedad.';

    if (msg.includes('gracias'))
        return 'Ha sido un placer asistirle. 💚 Para cualquier consulta adicional sobre alianzas, estoy a su disposición.';

    return 'Disculpe, no comprendo completamente su solicitud. 🤔 Puedo brindarle información sobre alianzas estratégicas y colaboración empresarial.';
}

function sendMessage() {
    const userInputVal = chatInput.value.trim();
    if (!userInputVal) return;

    // Mensaje del usuario
    const userMsg = document.createElement('div');
    userMsg.classList.add('user-message');
    userMsg.textContent = userInputVal;
    chatBody.appendChild(userMsg);

    // Respuesta del bot
    const botMsg = document.createElement('div');
    botMsg.classList.add('bot-message');
    botMsg.textContent = getBotResponse(userInputVal);
    chatBody.appendChild(botMsg);

    // Scroll abajo
    chatBody.scrollTop = chatBody.scrollHeight;

    // Limpiar input
    chatInput.value = '';
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
