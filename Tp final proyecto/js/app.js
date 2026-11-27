const API_URL = "https://pokeapi.co/api/v2/pokemon";
const TYPE_API_URL = "https://pokeapi.co/api/v2/type";
const BACKEND_URL = "backend";

const POKEMON_PER_PAGE = 20;

let paginaActual = 1;
let siguientePagina = null;
let paginaAnterior = null;

let favoritos = [];
let mostrandoFavoritos = false;

let pokemonFiltrados = [];
let pokemonPaginaActual = [];

let tipoActual = "";

const pokemonContainer = document.getElementById("pokemon-container");

const searchInput = document.getElementById("pokemon-search");
const searchButton = document.getElementById("search-button");
const clearButton = document.getElementById("clear-button");

const previousButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");
const pageIndicator = document.getElementById("page-indicator");
const pagination = document.getElementById("pagination");

const favoritesButton = document.getElementById("favorites-button");
const favoritesCount = document.getElementById("favorites-count");
const favoritesSection = document.getElementById("favorites-section");
const favoritesContainer = document.getElementById("favorites-container");

const catalogSection = document.getElementById("catalog-section");

const typeFilter = document.getElementById("type-filter");
const filterButton = document.getElementById("filter-button");
const resetFilterButton = document.getElementById("reset-filter-button");

const sortFilter = document.getElementById("sort-filter");

const modal = document.getElementById("pokemon-modal");
const modalBody = document.getElementById("modal-body");
const closeModalButton = document.getElementById("close-modal");

const statsStyles = document.createElement("style");

statsStyles.textContent = `
    .pokedex-stats {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 15px;
        margin: 0 auto 30px;
        animation: aparecer 0.7s ease;
    }

    .pokedex-stat {
        display: flex;
        align-items: center;
        gap: 15px;
        min-width: 0;
        padding: 20px;
        background: linear-gradient(145deg, #1c2230, #171d29);
        border: 1px solid #30394b;
        border-radius: 12px;
        transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
    }

    .pokedex-stat:hover {
        transform: translateY(-4px);
        border-color: #e3350d;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .pokedex-stat-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        border-radius: 12px;
        font-size: 24px;
        background-color: rgba(227, 53, 13, 0.13);
    }

    .pokedex-stat-value {
        color: #ffffff;
        font-size: 25px;
        font-weight: bold;
        line-height: 1.2;
    }

    .pokedex-stat-label {
        margin-top: 5px;
        color: #b8bdc9;
        font-size: 13px;
    }

    @media (max-width: 600px) {
        .pokedex-stats {
            grid-template-columns: 1fr;
            gap: 10px;
        }

        .pokedex-stat {
            padding: 15px;
        }

        .pokedex-stat-icon {
            width: 42px;
            height: 42px;
        }

        .pokedex-stat-value {
            font-size: 22px;
        }
    }
`;

document.head.appendChild(statsStyles);

const statsPanel = document.createElement("section");
statsPanel.className = "pokedex-stats";
statsPanel.innerHTML = `
    <article class="pokedex-stat">
        <div class="pokedex-stat-icon">📚</div>
        <div>
            <div class="pokedex-stat-value" id="total-pokemon-stat">...</div>
            <div class="pokedex-stat-label">Pokémon disponibles</div>
        </div>
    </article>
    <article class="pokedex-stat">
        <div class="pokedex-stat-icon">♥</div>
        <div>
            <div class="pokedex-stat-value" id="total-favorites-stat">0</div>
            <div class="pokedex-stat-label">Favoritos guardados</div>
        </div>
    </article>
    <article class="pokedex-stat">
        <div class="pokedex-stat-icon">⚡</div>
        <div>
            <div class="pokedex-stat-value" id="total-types-stat">18</div>
            <div class="pokedex-stat-label">Tipos disponibles</div>
        </div>
    </article>
`;

const searchContainer = document.querySelector(".search-container");
searchContainer.parentNode.insertBefore(statsPanel, searchContainer);

const totalPokemonStat = document.getElementById("total-pokemon-stat");
const totalFavoritesStat = document.getElementById("total-favorites-stat");
const totalTypesStat = document.getElementById("total-types-stat");

async function actualizarEstadisticasGenerales() {
    totalTypesStat.textContent = typeFilter.options.length - 1;

    try {
        const respuesta = await fetch(`${API_URL}?limit=1`);

        if (!respuesta.ok) {
            throw new Error("No se pudo obtener la cantidad de Pokémon.");
        }

        const datos = await respuesta.json();

        totalPokemonStat.textContent = datos.count.toLocaleString("es-AR");
    } catch (error) {
        console.error("Error al obtener estadísticas generales:", error);
        totalPokemonStat.textContent = "—";
    }
}

function actualizarEstadisticaFavoritos() {
    totalFavoritesStat.textContent = favoritos.length.toLocaleString("es-AR");
}

function obtenerImagen(pokemon) {
    return (
        pokemon.sprites.other?.["official-artwork"]?.front_default ||
        pokemon.sprites.front_default ||
        ""
    );
}

function obtenerTipos(pokemon) {
    return pokemon.types.map(tipo => {
        const nombre = tipo.type.name;

        return `
            <span class="type-badge ${nombre}">
                ${nombre}
            </span>
        `;
    }).join("");
}

function estaEnFavoritos(id) {
    return favoritos.some(pokemon => {
        return Number(pokemon.pokemon_id) === Number(id);
    });
}

function obtenerEstadistica(pokemon, nombreEstadistica) {
    const estadistica = pokemon.stats.find(stat => {
        return stat.stat.name === nombreEstadistica;
    });

    return estadistica ? estadistica.base_stat : 0;
}

function ordenarPokemones(lista) {
    const criterio = sortFilter.value;

    const [campo, direccion] = criterio.split("-");

    const resultado = [...lista];

    resultado.sort((pokemonA, pokemonB) => {
        let valorA;
        let valorB;

        switch (campo) {
            case "id":
                valorA = pokemonA.id;
                valorB = pokemonB.id;
                break;

            case "name":
                valorA = pokemonA.name;
                valorB = pokemonB.name;
                break;

            case "attack":
                valorA = obtenerEstadistica(pokemonA, "attack");
                valorB = obtenerEstadistica(pokemonB, "attack");
                break;

            case "defense":
                valorA = obtenerEstadistica(pokemonA, "defense");
                valorB = obtenerEstadistica(pokemonB, "defense");
                break;

            case "speed":
                valorA = obtenerEstadistica(pokemonA, "speed");
                valorB = obtenerEstadistica(pokemonB, "speed");
                break;

            default:
                return 0;
        }

        let comparacion;

        if (campo === "name") {
            comparacion = valorA.localeCompare(valorB);
        } else {
            comparacion = valorA - valorB;
        }

        return direccion === "desc"
            ? -comparacion
            : comparacion;
    });

    return resultado;
}

function aplicarOrdenamiento() {
    if (tipoActual !== "") {
        pokemonFiltrados = ordenarPokemones(pokemonFiltrados);

        paginaActual = 1;

        mostrarPaginaFiltrada();

        return;
    }

    pokemonPaginaActual = ordenarPokemones(pokemonPaginaActual);

    mostrarPokemonesEnPantalla(pokemonPaginaActual);
}

async function obtenerFavoritos() {
    try {
        const respuesta = await fetch(
            `${BACKEND_URL}/obtener_favoritos.php`
        );

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los favoritos.");
        }

        favoritos = await respuesta.json();

        actualizarContadorFavoritos();

        mostrarFavoritos();
    } catch (error) {
        console.error("Error al obtener favoritos:", error);

        favoritesContainer.innerHTML = `
            <p class="error-message">
                No se pudieron cargar los favoritos.
            </p>
        `;
    }
}

function actualizarContadorFavoritos() {
    const cantidad = favoritos.length;

    favoritesCount.textContent =
        `${cantidad} ${cantidad === 1 ? "favorito" : "favoritos"}`;

    actualizarEstadisticaFavoritos();
}

async function alternarFavorito(pokemon) {
    const id = Number(pokemon.id);

    const esFavorito = estaEnFavoritos(id);

    const url = esFavorito
        ? `${BACKEND_URL}/eliminar_favorito.php`
        : `${BACKEND_URL}/agregar_favorito.php`;

    const datos = esFavorito
        ? {
            pokemon_id: id
        }
        : {
            pokemon_id: id,
            pokemon_name: pokemon.name,
            pokemon_image: obtenerImagen(pokemon)
        };

    try {
        const respuesta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.error || "No se pudo modificar el favorito.");
        }

        await obtenerFavoritos();

        document.querySelectorAll(".favorite-toggle").forEach(boton => {
            const botonId = Number(boton.dataset.id);

            const activo = estaEnFavoritos(botonId);

            boton.classList.toggle("active", activo);

            boton.textContent = activo ? "♥" : "♡";

            boton.title = activo
                ? "Eliminar de favoritos"
                : "Agregar a favoritos";
        });

        const botonModal = document.querySelector(".modal-favorite");

        if (botonModal) {
            const activo = estaEnFavoritos(id);

            botonModal.classList.toggle("active", activo);

            botonModal.textContent = activo
                ? "♥ Eliminar de favoritos"
                : "♡ Agregar a favoritos";
        }
    } catch (error) {
        console.error("Error al modificar favoritos:", error);

        alert(error.message);
    }
}

function crearTarjeta(pokemon) {
    const imagen = obtenerImagen(pokemon);

    const favorito = estaEnFavoritos(pokemon.id);

    const tarjeta = document.createElement("article");

    tarjeta.className = "pokemon-card";

    tarjeta.dataset.id = pokemon.id;

    tarjeta.innerHTML = `
        <button
            class="favorite-toggle ${favorito ? "active" : ""}"
            data-id="${pokemon.id}"
            title="${favorito ? "Eliminar de favoritos" : "Agregar a favoritos"}"
            aria-label="${favorito ? "Eliminar de favoritos" : "Agregar a favoritos"}"
        >
            ${favorito ? "♥" : "♡"}
        </button>

        <img
            src="${imagen}"
            alt="${pokemon.name}"
            loading="lazy"
        >

        <p class="pokemon-id">
            #${String(pokemon.id).padStart(3, "0")}
        </p>

        <h3>${pokemon.name}</h3>

        <div class="types-container">
            ${obtenerTipos(pokemon)}
        </div>
    `;

    return tarjeta;
}

function mostrarPokemonesEnPantalla(lista) {
    pokemonContainer.innerHTML = "";

    if (lista.length === 0) {
        pokemonContainer.innerHTML = `
            <p class="empty-message">
                No se encontraron Pokémon.
            </p>
        `;

        return;
    }

    lista.forEach(pokemon => {
        pokemonContainer.appendChild(crearTarjeta(pokemon));
    });
}

function actualizarPaginacion() {
    const totalPaginas = Math.ceil(
        pokemonFiltrados.length / POKEMON_PER_PAGE
    );

    previousButton.disabled = paginaActual <= 1;

    nextButton.disabled = paginaActual >= totalPaginas;

    pageIndicator.textContent =
        `Página ${paginaActual} de ${totalPaginas}`;
}

function mostrarPaginaFiltrada() {
    const inicio = (paginaActual - 1) * POKEMON_PER_PAGE;

    const pokemonesPagina = pokemonFiltrados.slice(
        inicio,
        inicio + POKEMON_PER_PAGE
    );

    mostrarPokemonesEnPantalla(pokemonesPagina);

    actualizarPaginacion();
}

async function obtenerPokemones(url = null) {
    tipoActual = "";

    pokemonFiltrados = [];

    mostrandoFavoritos = false;

    favoritesSection.classList.add("hidden");
    catalogSection.classList.remove("hidden");
    pagination.classList.remove("hidden");

    pokemonContainer.innerHTML = `
        <p class="loading">Cargando Pokémon...</p>
    `;

    try {
        const respuesta = await fetch(
            url || `${API_URL}?limit=${POKEMON_PER_PAGE}&offset=${(paginaActual - 1) * POKEMON_PER_PAGE}`
        );

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los Pokémon.");
        }

        const datos = await respuesta.json();

        siguientePagina = datos.next;
        paginaAnterior = datos.previous;

        const detalles = await Promise.all(
            datos.results.map(async pokemon => {
                const respuestaPokemon = await fetch(pokemon.url);

                if (!respuestaPokemon.ok) {
                    throw new Error("No se pudo cargar un Pokémon.");
                }

                return await respuestaPokemon.json();
            })
        );

        pokemonPaginaActual = ordenarPokemones(detalles);

        mostrarPokemonesEnPantalla(pokemonPaginaActual);

        previousButton.disabled = !paginaAnterior;
        nextButton.disabled = !siguientePagina;

        pageIndicator.textContent = `Página ${paginaActual}`;
    } catch (error) {
        console.error("Error al obtener Pokémon:", error);

        pokemonContainer.innerHTML = `
            <p class="error-message">
                No se pudieron cargar los Pokémon.
            </p>
        `;
    }
}

async function buscarPokemon() {
    const busqueda = searchInput.value.trim().toLowerCase();

    if (busqueda === "") {
        alert("Ingresá un nombre o número de Pokémon.");

        return;
    }

    tipoActual = "";

    pokemonFiltrados = [];

    typeFilter.value = "";

    mostrandoFavoritos = false;

    favoritesSection.classList.add("hidden");
    catalogSection.classList.remove("hidden");
    pagination.classList.add("hidden");

    pokemonContainer.innerHTML = `
        <p class="loading">Buscando Pokémon...</p>
    `;

    try {
        const respuesta = await fetch(
            `${API_URL}/${encodeURIComponent(busqueda)}`
        );

        if (!respuesta.ok) {
            throw new Error("Pokémon no encontrado.");
        }

        const pokemon = await respuesta.json();

        pokemonPaginaActual = [pokemon];

        mostrarPokemonesEnPantalla(pokemonPaginaActual);
    } catch (error) {
        pokemonPaginaActual = [];

        pokemonContainer.innerHTML = `
            <p class="error-message">
                No se encontró ningún Pokémon con ese nombre o número.
            </p>
        `;
    }
}

async function filtrarPorTipo() {
    const tipoSeleccionado = typeFilter.value;

    if (tipoSeleccionado === "") {
        quitarFiltro();

        return;
    }

    mostrandoFavoritos = false;

    favoritesSection.classList.add("hidden");
    catalogSection.classList.remove("hidden");
    pagination.classList.remove("hidden");

    pokemonContainer.innerHTML = `
        <p class="loading">Buscando Pokémon...</p>
    `;

    searchInput.value = "";

    try {
        const respuesta = await fetch(
            `${TYPE_API_URL}/${tipoSeleccionado}`
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo obtener el tipo seleccionado.");
        }

        const datos = await respuesta.json();

        const pokemones = datos.pokemon;

        const detalles = await Promise.all(
            pokemones.map(async elemento => {
                const respuestaPokemon = await fetch(elemento.pokemon.url);

                if (!respuestaPokemon.ok) {
                    throw new Error("No se pudo cargar un Pokémon.");
                }

                return await respuestaPokemon.json();
            })
        );

        pokemonFiltrados = ordenarPokemones(detalles);

        tipoActual = tipoSeleccionado;

        paginaActual = 1;

        mostrarPaginaFiltrada();
    } catch (error) {
        console.error("Error al filtrar Pokémon:", error);

        pokemonContainer.innerHTML = `
            <p class="error-message">
                No se pudieron cargar los Pokémon de este tipo.
            </p>
        `;
    }
}

function quitarFiltro() {
    typeFilter.value = "";

    tipoActual = "";

    paginaActual = 1;

    pokemonFiltrados = [];

    searchInput.value = "";

    obtenerPokemones();
}

function mostrarTodos() {
    typeFilter.value = "";

    searchInput.value = "";

    paginaActual = 1;

    pokemonFiltrados = [];

    obtenerPokemones();
}

function mostrarFavoritos() {
    favoritesContainer.innerHTML = "";

    if (favoritos.length === 0) {
        favoritesContainer.innerHTML = `
            <p class="empty-message">
                Todavía no agregaste ningún Pokémon a favoritos.
            </p>
        `;

        return;
    }

    favoritos.forEach(pokemon => {
        const tarjeta = document.createElement("article");

        tarjeta.className = "pokemon-card";

        tarjeta.dataset.id = pokemon.pokemon_id;

        tarjeta.innerHTML = `
            <button
                class="favorite-toggle active"
                data-id="${pokemon.pokemon_id}"
                title="Eliminar de favoritos"
                aria-label="Eliminar de favoritos"
            >
                ♥
            </button>

            <img
                src="${pokemon.pokemon_image}"
                alt="${pokemon.pokemon_name}"
                loading="lazy"
            >

            <p class="pokemon-id">
                #${String(pokemon.pokemon_id).padStart(3, "0")}
            </p>

            <h3>${pokemon.pokemon_name}</h3>
        `;

        favoritesContainer.appendChild(tarjeta);
    });
}

async function alternarVistaFavoritos() {
    mostrandoFavoritos = !mostrandoFavoritos;

    if (mostrandoFavoritos) {
        catalogSection.classList.add("hidden");
        favoritesSection.classList.remove("hidden");
        pagination.classList.add("hidden");

        await obtenerFavoritos();
    } else {
        favoritesSection.classList.add("hidden");
        catalogSection.classList.remove("hidden");

        if (searchInput.value.trim() !== "" || tipoActual !== "") {
            pagination.classList.add("hidden");
        } else {
            pagination.classList.remove("hidden");
        }
    }
}

async function abrirFicha(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`);

        if (!respuesta.ok) {
            throw new Error("No se pudo obtener la ficha.");
        }

        const pokemon = await respuesta.json();

        const imagen =
            pokemon.sprites.other?.["official-artwork"]?.front_default ||
            pokemon.sprites.front_default;

        const favorito = estaEnFavoritos(pokemon.id);

        modalBody.innerHTML = `
            <div class="modal-header">
                <img
                    src="${imagen}"
                    alt="${pokemon.name}"
                >

                <p class="pokemon-id">
                    #${String(pokemon.id).padStart(3, "0")}
                </p>

                <h2>${pokemon.name}</h2>

                <div class="types-container">
                    ${obtenerTipos(pokemon)}
                </div>
            </div>

            <div class="modal-info">
                <p>
                    <strong>Altura</strong><br>
                    ${pokemon.height / 10} m
                </p>

                <p>
                    <strong>Peso</strong><br>
                    ${pokemon.weight / 10} kg
                </p>
            </div>

            <h3 class="modal-subtitle">
                Habilidades
            </h3>

            <div class="abilities-container">
                ${pokemon.abilities.map(habilidad => `
                    <span class="ability-badge">
                        ${habilidad.ability.name.replace("-", " ")}
                    </span>
                `).join("")}
            </div>

            <h3 class="modal-subtitle">
                Estadísticas
            </h3>

            <div class="stats-container">
                ${pokemon.stats.map(stat => {
                    const valor = stat.base_stat;

                    const porcentaje = Math.min((valor / 255) * 100, 100);

                    return `
                        <div class="stat-row">
                            <div class="stat-info">
                                <span>
                                    ${stat.stat.name.replace("-", " ")}
                                </span>

                                <strong>
                                    ${valor}
                                </strong>
                            </div>

                            <div class="stat-bar">
                                <div
                                    class="stat-fill"
                                    style="width: ${porcentaje}%"
                                ></div>
                            </div>
                        </div>
                    `;
                }).join("")}
            </div>

            <button
                class="modal-favorite ${favorito ? "active" : ""}"
                data-id="${pokemon.id}"
            >
                ${favorito ? "♥ Eliminar de favoritos" : "♡ Agregar a favoritos"}
            </button>
        `;

        modal.classList.remove("hidden");
    } catch (error) {
        console.error("Error al abrir ficha:", error);

        alert("No se pudo cargar la ficha del Pokémon.");
    }
}

function cerrarModal() {
    modal.classList.add("hidden");

    modalBody.innerHTML = "";
}

pokemonContainer.addEventListener("click", async (evento) => {
    const botonFavorito = evento.target.closest(".favorite-toggle");

    if (botonFavorito) {
        evento.stopPropagation();

        const id = Number(botonFavorito.dataset.id);

        try {
            const respuesta = await fetch(`${API_URL}/${id}`);

            if (!respuesta.ok) {
                throw new Error("No se pudo obtener el Pokémon.");
            }

            const pokemon = await respuesta.json();

            await alternarFavorito(pokemon);
        } catch (error) {
            console.error(error);

            alert("No se pudo modificar el favorito.");
        }

        return;
    }

    const tarjeta = evento.target.closest(".pokemon-card");

    if (tarjeta) {
        abrirFicha(tarjeta.dataset.id);
    }
});

favoritesContainer.addEventListener("click", async (evento) => {
    const botonFavorito = evento.target.closest(".favorite-toggle");

    if (botonFavorito) {
        evento.stopPropagation();

        const id = Number(botonFavorito.dataset.id);

        await alternarFavorito({
            id: id
        });

        return;
    }

    const tarjeta = evento.target.closest(".pokemon-card");

    if (tarjeta) {
        abrirFicha(tarjeta.dataset.id);
    }
});

modalBody.addEventListener("click", async (evento) => {
    const boton = evento.target.closest(".modal-favorite");

    if (!boton) {
        return;
    }

    const id = Number(boton.dataset.id);

    try {
        const respuesta = await fetch(`${API_URL}/${id}`);

        if (!respuesta.ok) {
            throw new Error("No se pudo obtener el Pokémon.");
        }

        const pokemon = await respuesta.json();

        await alternarFavorito(pokemon);
    } catch (error) {
        console.error(error);

        alert("No se pudo modificar el favorito.");
    }
});

searchButton.addEventListener("click", buscarPokemon);

searchInput.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        buscarPokemon();
    }
});

clearButton.addEventListener("click", mostrarTodos);

filterButton.addEventListener("click", filtrarPorTipo);

resetFilterButton.addEventListener("click", quitarFiltro);

sortFilter.addEventListener("change", aplicarOrdenamiento);

nextButton.addEventListener("click", () => {
    if (tipoActual !== "") {
        const totalPaginas = Math.ceil(
            pokemonFiltrados.length / POKEMON_PER_PAGE
        );

        if (paginaActual < totalPaginas) {
            paginaActual++;

            mostrarPaginaFiltrada();
        }

        return;
    }

    if (siguientePagina) {
        paginaActual++;

        obtenerPokemones(siguientePagina);
    }
});

previousButton.addEventListener("click", () => {
    if (tipoActual !== "") {
        if (paginaActual > 1) {
            paginaActual--;

            mostrarPaginaFiltrada();
        }

        return;
    }

    if (paginaAnterior) {
        paginaActual--;

        obtenerPokemones(paginaAnterior);
    }
});

favoritesButton.addEventListener("click", alternarVistaFavoritos);

closeModalButton.addEventListener("click", cerrarModal);

modal.addEventListener("click", (evento) => {
    if (evento.target === modal) {
        cerrarModal();
    }
});

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        cerrarModal();
    }
});

async function iniciarAplicacion() {
    actualizarEstadisticasGenerales();

    await obtenerFavoritos();

    await obtenerPokemones();
}

iniciarAplicacion();