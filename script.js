const productos = [
  { nombre: "Pizza", precio: 8.0, imagen: "pizza.jpg" },
  { nombre: "Hamburguesa", precio: 6.5, imagen: "hamburguesa.jpg" },
  { nombre: "Bebida", precio: 2.0, imagen: "bebida.jpg" }
];

const pedidos = {};

function cargarMenu() {
  const menuDiv = document.getElementById("menu");
  productos.forEach((producto, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>Precio: $${producto.precio.toFixed(2)}</p>
      <input type="number" id="cant-${index}" value="0" min="0" />
    `;
    menuDiv.appendChild(card);
  });
}

function enviarPedido() {
  const mesa = document.getElementById("mesa").value;
  if (!mesa) {
    alert("Por favor, ingresa un número de mesa.");
    return;
  }

  let pedido = [];
  let total = 0;

  productos.forEach((producto, index) => {
    const cantidad = parseInt(document.getElementById(`cant-${index}`).value);
    if (cantidad > 0) {
      const subtotal = producto.precio * cantidad;
      pedido.push({ producto: producto.nombre, cantidad, subtotal });
      total += subtotal;
    }
  });

  if (pedido.length === 0) {
    alert("No has seleccionado ningún producto.");
    return;
  }

  // Guardar el pedido localmente
  pedidos[mesa] = pedido;
  mostrarPedidos();

  // Generar mensaje de WhatsApp
  let mensaje = `Pedido para la Mesa ${mesa}:\n`;
  pedido.forEach(item => {
    mensaje += `${item.cantidad} x ${item.producto} = $${item.subtotal.toFixed(2)}\n`;
  });
  mensaje += `\nTotal: $${total.toFixed(2)}`;

  // Enviar por WhatsApp
  const numero = "593983798502";
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

function mostrarPedidos() {
  const contenedor = document.getElementById("pedidos");
  contenedor.innerHTML = "";

  for (const [mesa, items] of Object.entries(pedidos)) {
    const div = document.createElement("div");
    div.innerHTML = `<h3>Mesa ${mesa}</h3>`;
    let lista = "<ul>";
    let total = 0;
    items.forEach(item => {
      lista += `<li>${item.cantidad} x ${item.producto} = $${item.subtotal.toFixed(2)}</li>`;
      total += item.subtotal;
    });
    lista += `</ul><strong>Total: $${total.toFixed(2)}</strong>`;
    div.innerHTML += lista;
    contenedor.appendChild(div);
  }
}

window.onload = cargarMenu;
