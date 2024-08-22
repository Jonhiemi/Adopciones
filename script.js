document.addEventListener("DOMContentLoaded", function() {
    const containerList = document.getElementById("container-list");
    const containers = ["Barrio Ferrisi", "Hospital Perrupato", "Centro", "Distribuidora días", "Ruta 50", "Barrio Centenario", "Escuela Bolaños", "TyT", "Fench", "Lima lubricentro", "La 60", "Calle Montecaseros", "La Magna", "Plaza Francia", "Pedro Vargas", "Vialidad", "Bailen", "Plaza Los Médicos", "Plaza Córdoba", "Plaza Burgoa", "B° San Antonio", "Mitre", "Callejon Fernandez","B° Mebna", "B° San Pedro", "San Pedro Industrial", "Casino"];
    
    function loadContainers() {
        containers.forEach((location, index) => {
            const listItem = document.createElement("li");
            const locationText = document.createElement("span");
            locationText.textContent = location;
            const button = document.createElement("button");
            button.textContent = "Pendiente";
            button.addEventListener("click", () => toggleComplete(button, index));
            listItem.appendChild(locationText);
            listItem.appendChild(button);
            containerList.appendChild(listItem);

            // Restaurar el estado del contenedor desde localStorage
            const state = localStorage.getItem(`container_${index}`);
            if (state === "completed") {
                button.classList.add("completed");
                button.textContent = "Completado";
            }
        });
    }

    function toggleComplete(button, index) {
        if (button.classList.contains("completed")) {
            button.classList.remove("completed");
            button.textContent = "Pendiente";
            localStorage.setItem(`container_${index}`, "pending");
        } else {
            button.classList.add("completed");
            button.textContent = "Completado";
            localStorage.setItem(`container_${index}`, "completed");
        }
    }

    function resetStatus() {
        const buttons = document.querySelectorAll("#container-list button");
        buttons.forEach((button, index) => {
            button.classList.remove("completed");
            button.textContent = "Pendiente";
            localStorage.setItem(`container_${index}`, "pending");
        });
    }

    function checkReset() {
        const lastReset = localStorage.getItem("lastReset");
        const today = new Date().toDateString();
        if (lastReset !== today) {
            resetStatus();
            localStorage.setItem("lastReset", today);
        }
    }

    // Manejador de envío del formulario de contacto
    document.getElementById("contact-form").addEventListener("submit", function(event) {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        // Mostrar un mensaje de éxito (puedes reemplazar esto con un envío a un servidor si es necesario)
        alert(`Gracias por contactarnos, ${name}. Hemos recibido tu mensaje: "${message}"`);

        // Reiniciar el formulario
        document.getElementById("contact-form").reset();
    });

    checkReset();
    loadContainers();
});