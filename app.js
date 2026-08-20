const newsFeed = document.getElementById("news-feed");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");

let news = [];


/* Load news database */

async function loadNews() {

    try {

        const response = await fetch("data/news.json");

        if (!response.ok) {
            throw new Error("Could not load news database");
        }

        news = await response.json();

        displayNews();

    } catch (error) {

        console.error(error);

        newsFeed.innerHTML = `
            <article class="news-card">
                <h3>No se pudo cargar el feed</h3>
                <p>
                    Comprueba que el archivo data/news.json
                    existe correctamente.
                </p>
            </article>
        `;

    }

}


/* Display news */

function displayNews() {

    const searchTerm = searchInput.value.toLowerCase();

    const selectedCategory = categorySelect.value;


    const filteredNews = news.filter(item => {

        const matchesSearch =
            item.title.toLowerCase().includes(searchTerm) ||
            item.summary.toLowerCase().includes(searchTerm) ||
            item.source.toLowerCase().includes(searchTerm);


        const matchesCategory =
            selectedCategory === "all" ||
            item.category.toLowerCase() === selectedCategory;


        return matchesSearch && matchesCategory;

    });


    newsFeed.innerHTML = "";


    if (filteredNews.length === 0) {

        newsFeed.innerHTML = `
            <article class="news-card">
                <h3>No hay resultados</h3>
                <p>
                    No hemos encontrado información
                    que coincida con tu búsqueda.
                </p>
            </article>
        `;

        return;

    }


    filteredNews
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach(item => {

            const article = document.createElement("article");

            article.className = "news-card";


            article.innerHTML = `

                <div class="news-meta">

                    <span class="category-badge">
                        ${item.category}
                    </span>

                    <span>
                        ${item.source}
                    </span>

                </div>


                <h3>
                    ${item.title}
                </h3>


                <p>
                    ${item.summary}
                </p>


                <div class="news-footer">

                    <span>
                        ${formatDate(item.date)}
                    </span>

                    <a
                        href="${item.url}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Leer original →
                    </a>

                </div>

            `;


            newsFeed.appendChild(article);

        });


    updateStats();

}


/* Format dates */

function formatDate(date) {

    return new Date(date).toLocaleDateString(
        "es-ES",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


/* Update statistics */

function updateStats() {

    document.getElementById("total-news").textContent =
        news.length;


    document.getElementById("new-news").textContent =
        news.filter(item => item.new).length;

}


/* Search */

searchInput.addEventListener(
    "input",
    displayNews
);


/* Category */

categorySelect.addEventListener(
    "change",
    displayNews
);


/* Start */

loadNews();
