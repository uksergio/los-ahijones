const newsFeed = document.getElementById("news-feed");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");

let news = [];


/* =========================================================
   LOAD NEWS
========================================================= */

async function loadNews() {

    try {

        const response = await fetch("data/news.json");

        if (!response.ok) {
            throw new Error("Could not load news database");
        }

        news = await response.json();

        updateStats();

        displayNews();

    } catch (error) {

        console.error(error);

        newsFeed.innerHTML = `
            <article class="news-card">
                <h3>No se pudo cargar el feed</h3>
                <p>
                    Comprueba que el archivo
                    data/news.json existe correctamente.
                </p>
            </article>
        `;

    }

}


/* =========================================================
   DISPLAY NEWS
========================================================= */

function displayNews() {

    const searchTerm =
        searchInput.value.trim().toLowerCase();

    const selectedCategory =
        categorySelect.value.toLowerCase();


    const filteredNews = news
        .filter(item => {

            const title =
                (item.title || "").toLowerCase();

            const summary =
                (item.summary || "").toLowerCase();

            const source =
                (item.source || "").toLowerCase();

            const category =
                (item.category || "").toLowerCase();


            const matchesSearch =
                title.includes(searchTerm) ||
                summary.includes(searchTerm) ||
                source.includes(searchTerm);


            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;


            return (
                matchesSearch &&
                matchesCategory
            );

        })
        .sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );


    newsFeed.innerHTML = "";


    /* No results */

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


    /* Create cards */

    filteredNews.forEach(item => {

        const article =
            document.createElement("article");


        article.className = "news-card";


        article.innerHTML = `

            <div class="news-meta">

                <span class="category-badge">
                    ${escapeHtml(item.category)}
                </span>

                <span>
                    ${escapeHtml(item.source)}
                </span>

            </div>


            <h3>
                ${escapeHtml(item.title)}
            </h3>


            <p>
                ${escapeHtml(item.summary)}
            </p>


            <div class="news-footer">

                <span>
                    ${formatDate(item.date)}
                </span>


                <a
                    href="${escapeAttribute(item.url)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Leer original →
                </a>

            </div>

        `;


        newsFeed.appendChild(article);

    });

}


/* =========================================================
   UPDATE STATISTICS
========================================================= */

function updateStats() {

    const totalNews =
        document.getElementById("total-news");


    const newNews =
        document.getElementById("new-news");


    const sourceCount =
        document.getElementById("source-count");


    totalNews.textContent =
        news.length;


    newNews.textContent =
        news.filter(item => item.new === true).length;


    const uniqueSources =
        new Set(
            news
                .map(item => item.source)
                .filter(Boolean)
        );


    sourceCount.textContent =
        uniqueSources.size;

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(date) {

    const parsedDate =
        new Date(date);


    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }


    return parsedDate.toLocaleDateString(
        "es-ES",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


/* =========================================================
   SECURITY HELPERS
========================================================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function escapeAttribute(value) {

    return String(value ?? "")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

}


/* =========================================================
   SEARCH
========================================================= */

searchInput.addEventListener(
    "input",
    displayNews
);


/* =========================================================
   CATEGORY FILTER
========================================================= */

categorySelect.addEventListener(
    "change",
    displayNews
);


/* =========================================================
   START
========================================================= */

loadNews();
