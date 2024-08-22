document.addEventListener('DOMContentLoaded', () => {
    const animalForm = document.getElementById('animal-form');
    const animalList = document.querySelector('.animal-list');

    // Cargar animales desde localStorage al cargar la página
    loadAnimals();

    animalForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombreAnimal = document.getElementById('nombre-animal').value;
        const descripcionAnimal = document.getElementById('descripcion-animal').value;
        const imagenAnimal = document.getElementById('imagen-animal').value;
        const fileAnimal = document.getElementById('file-animal').files[0];

        let imageUrl = imagenAnimal;
        if (fileAnimal) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imageUrl = e.target.result;
                addAnimal(nombreAnimal, descripcionAnimal, imageUrl);
            };
            reader.readAsDataURL(fileAnimal);
        } else {
            addAnimal(nombreAnimal, descripcionAnimal, imageUrl);
        }

        animalForm.reset();
    });

    function addAnimal(nombre, descripcion, imagenUrl) {
        const timestamp = new Date().getTime();
        const animal = {
            nombre,
            descripcion,
            imagenUrl,
            timestamp,
            adopted: false
        };

        saveAnimal(animal);
        renderAnimal(animal);
    }

    function saveAnimal(animal) {
        const animals = getAnimals();
        animals.push(animal);
        localStorage.setItem('animals', JSON.stringify(animals));
    }

    function getAnimals() {
        const animals = localStorage.getItem('animals');
        return animals ? JSON.parse(animals) : [];
    }

    function loadAnimals() {
        const animals = getAnimals();
        animals.forEach(animal => {
            if (new Date().getTime() - animal.timestamp < 24 * 60 * 60 * 1000) { // 24 horas
                renderAnimal(animal);
            }
        });
    }

    function renderAnimal(animal) {
        const animalCard = document.createElement('div');
        animalCard.classList.add('animal-card');
        animalCard.dataset.timestamp = animal.timestamp;

        animalCard.innerHTML = `
            <img src="${animal.imagenUrl}" alt="Animal">
            <h3>${animal.nombre}</h3>
            <p>${animal.descripcion}</p>
            <p class="status">${animal.adopted ? 'Adoptado' : 'Disponible para adopción'}</p>
            <button class="adopt-animal" ${animal.adopted ? 'disabled' : ''}>Adoptar</button>
            <button class="delete-animal">Borrar</button>
        `;

        animalCard.querySelector('.adopt-animal').addEventListener('click', () => {
            const status = animalCard.querySelector('.status');
            status.textContent = 'Adoptado';
            status.style.color = 'green';
            animal.adopted = true;
            updateAnimal(animal);
        });

        animalCard.querySelector('.delete-animal').addEventListener('click', () => {
            animalCard.remove();
            removeAnimal(animal.timestamp);
        });

        animalList.appendChild(animalCard);
    }

    function updateAnimal(updatedAnimal) {
        const animals = getAnimals().map(animal => 
            animal.timestamp === updatedAnimal.timestamp ? updatedAnimal : animal
        );
        localStorage.setItem('animals', JSON.stringify(animals));
    }

    function removeAnimal(timestamp) {
        const animals = getAnimals().filter(animal => animal.timestamp !== timestamp);
        localStorage.setItem('animals', JSON.stringify(animals));
    }

    function clearOldAnimals() {
        const now = new Date().getTime();
        const animals = getAnimals().filter(animal => now - animal.timestamp < 24 * 60 * 60 * 1000);
        localStorage.setItem('animals', JSON.stringify(animals));
    }

    // Llamar a la función para eliminar animales antiguos
    clearOldAnimals();
});
