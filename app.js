const normalizeSearch = (value) => value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('es');

const searchInput = document.querySelector('#chapter-search');

if (searchInput) {
    const chapters = [...document.querySelectorAll('[data-chapter]')];
    const groups = [...document.querySelectorAll('[data-chapter-group]')];
    const emptyState = document.querySelector('#empty-state');

    searchInput.addEventListener('input', () => {
        const query = normalizeSearch(searchInput.value.trim());
        let visibleCount = 0;

        chapters.forEach((chapter) => {
            const matches = normalizeSearch(chapter.dataset.chapter).includes(query);
            chapter.hidden = !matches;
            if (matches) visibleCount += 1;
        });

        groups.forEach((group) => {
            group.hidden = !group.querySelector('[data-chapter]:not([hidden])');
        });

        emptyState.hidden = visibleCount !== 0;
    });
}

const collectionSearch = document.querySelector('#collection-search');

if (collectionSearch) {
    const collections = [...document.querySelectorAll('[data-collection]')];
    const emptyState = document.querySelector('#collection-empty-state');

    collectionSearch.addEventListener('input', () => {
        const query = normalizeSearch(collectionSearch.value.trim());
        const chapterNumber = /^\d+$/.test(query) ? Number(query) : null;
        let visibleCount = 0;

        collections.forEach((collection) => {
            const containsChapter = chapterNumber !== null
                && chapterNumber >= Number(collection.dataset.rangeMin)
                && chapterNumber <= Number(collection.dataset.rangeMax);
            const matchesText = normalizeSearch(collection.dataset.search).includes(query);
            const matches = query === '' || containsChapter || matchesText;
            collection.hidden = !matches;
            if (matches) visibleCount += 1;
        });

        emptyState.hidden = visibleCount !== 0;
    });
}

document.addEventListener('keydown', (event) => {
    if (event.target.matches('input, textarea, select')) return;

    const destination = event.key === 'ArrowLeft'
        ? document.body.dataset.previousChapter
        : event.key === 'ArrowRight'
            ? document.body.dataset.nextChapter
            : null;

    if (destination) window.location.href = destination;
});
