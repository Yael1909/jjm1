// ===== Menú responsive =====
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuToggle.addEventListener("click", () => navLinks.classList.toggle("active"));

// ===== Variables =====
const blogGrid = document.getElementById("blogGrid");
const newPostForm = document.getElementById("newPostForm");

// ===== Publicaciones iniciales =====
let posts = JSON.parse(localStorage.getItem("publicaciones")) || [
  {
    titulo: "JJM lanza nueva plataforma",
    contenido: "Nuestra nueva plataforma de innovación tecnológica ya está disponible.",
    imagen: "img/placeholder1.jpg",
    likes: 0,
    comments: [
      { texto: "¡Excelente noticia!", likes: 2 },
      { texto: "Felicidades equipo JJM.", likes: 1 }
    ]
  },
  {
    titulo: "Conferencia sobre IA",
    contenido: "Participa en nuestra conferencia de inteligencia artificial el próximo mes.",
    imagen: "img/placeholder2.jpg",
    likes: 0,
    comments: []
  }
];

// ===== Función para renderizar publicaciones =====
function renderPosts() {
  blogGrid.innerHTML = "";
  posts.forEach((post, postIndex) => {
    const article = document.createElement("article");
    article.classList.add("blog-card");

    article.innerHTML = `
      <img src="${post.imagen}" alt="${post.titulo}">
      <h3>${post.titulo}</h3>
      <p>${post.contenido}</p>
      <div class="actions">
        <button onclick="toggleLike(${postIndex})"><i class="fa-solid fa-thumbs-up"></i> <span id="like-count-${postIndex}">${post.likes}</span></button>
        <button onclick="showCommentInput(${postIndex})"><i class="fa-solid fa-comment"></i> Comentar</button>
        <button onclick="editPost(${postIndex})"><i class="fa-solid fa-pen-to-square"></i> Editar</button>
        <button onclick="deletePost(${postIndex})"><i class="fa-solid fa-trash"></i> Eliminar</button>
      </div>
      <div class="comments-container" id="comments-${postIndex}">
        ${post.comments.map((cmt, cmtIndex) => `
          <div class="comment">
            <p>${cmt.texto}</p>
            <div class="comment-actions">
              <button onclick="likeComment(${postIndex},${cmtIndex})"><i class="fa-solid fa-thumbs-up"></i> ${cmt.likes}</button>
              <button onclick="deleteComment(${postIndex},${cmtIndex})"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
        `).join("")}
      </div>
      <div class="comment-input-container" id="comment-input-${postIndex}" style="display:none; margin-top:10px;">
        <input type="text" id="comment-text-${postIndex}" placeholder="Escribe un comentario..." style="width:80%; padding:5px; border-radius:6px; border:1px solid #ccc;">
        <button onclick="addComment(${postIndex})" style="padding:5px 10px; margin-left:5px; border:none; border-radius:6px; background-color:#6fb98f; color:white; cursor:pointer;">Comentar</button>
      </div>
    `;

    blogGrid.appendChild(article);
  });
}

// ===== Funciones de interacción =====
function toggleLike(index) {
  posts[index].likes++;
  localStorage.setItem("publicaciones", JSON.stringify(posts));
  renderPosts();
}

function showCommentInput(index) {
  const container = document.getElementById(`comment-input-${index}`);
  container.style.display = container.style.display === "none" ? "block" : "none";
}

function addComment(postIndex) {
  const input = document.getElementById(`comment-text-${postIndex}`);
  const text = input.value.trim();
  if (!text) return;
  posts[postIndex].comments.push({ texto: text, likes: 0 });
  localStorage.setItem("publicaciones", JSON.stringify(posts));
  input.value = "";
  renderPosts();
}

function likeComment(postIndex, cmtIndex) {
  posts[postIndex].comments[cmtIndex].likes++;
  localStorage.setItem("publicaciones", JSON.stringify(posts));
  renderPosts();
}

function deleteComment(postIndex, cmtIndex) {
  if (!confirm("¿Deseas eliminar este comentario?")) return;
  posts[postIndex].comments.splice(cmtIndex, 1);
  localStorage.setItem("publicaciones", JSON.stringify(posts));
  renderPosts();
}

function editPost(index) {
  const newTitle = prompt("Editar título:", posts[index].titulo);
  const newContent = prompt("Editar contenido:", posts[index].contenido);
  if (newTitle && newContent) {
    posts[index].titulo = newTitle;
    posts[index].contenido = newContent;
    localStorage.setItem("publicaciones", JSON.stringify(posts));
    renderPosts();
  }
}

function deletePost(index) {
  if (!confirm("¿Deseas eliminar esta publicación?")) return;
  posts.splice(index, 1);
  localStorage.setItem("publicaciones", JSON.stringify(posts));
  renderPosts();
}

// ===== Agregar nueva publicación con imagen local =====
newPostForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const contenido = document.getElementById("contenido").value.trim();
  const imagenInput = document.getElementById("imagen");

  if (!titulo || !contenido) {
    alert("Por favor completa el título y el contenido de la publicación.");
    return;
  }

  if (imagenInput.files && imagenInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const newPost = {
        titulo,
        contenido,
        imagen: event.target.result,
        likes: 0,
        comments: []
      };
      posts.unshift(newPost);
      localStorage.setItem("publicaciones", JSON.stringify(posts));
      newPostForm.reset();
      renderPosts();
    };
    reader.readAsDataURL(imagenInput.files[0]);
  } else {
    const newPost = {
      titulo,
      contenido,
      imagen: "img/placeholder1.jpg",
      likes: 0,
      comments: []
    };
    posts.unshift(newPost);
    localStorage.setItem("publicaciones", JSON.stringify(posts));
    newPostForm.reset();
    renderPosts();
  }
});

// ===== Inicialización =====
document.addEventListener("DOMContentLoaded", () => {
  renderPosts();
});

const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotContainer = document.getElementById('chatbot');
const chatClose = document.getElementById('chatClose');
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

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

    if (msg.includes('publicación') || msg.includes('noticia') || msg.includes('blog'))
        return '📚 Puedes explorar, comentar y agregar nuevas publicaciones en esta sección.';

    if (msg.includes('contacto'))
        return '✉️ Para cualquier duda, puedes usar el formulario de contacto al final de la página.';

    if (msg.includes('gracias'))
        return 'Ha sido un placer ayudarte. 💚';

    return 'Disculpa, no entendí tu mensaje. 🤔 Puedo ayudarte con publicaciones y noticias.';
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
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
