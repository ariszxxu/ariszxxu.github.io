(() => {
  const selected = document.getElementById('selected-papers');
  const collaborative = document.getElementById('collaborative-papers');
  const dated = document.getElementById('dated-papers');
  const datedList = document.getElementById('dated-paper-list');
  const buttons = [...document.querySelectorAll('[data-publication-view]')];
  const papers = [...document.querySelectorAll('.publication-card')].map((card, order) => {
    card.setAttribute('role', 'article');
    if (card.parentElement === selected) {
      card.dataset.selected = 'true';
      card.setAttribute('aria-label', 'Research highlight: ' + card.querySelector('.summary-title').textContent);
    }
    const image = card.querySelector('.teaser-column img');
    const frame = document.createElement('div');
    frame.className = 'paper-frame';
    image.replaceWith(frame);
    frame.append(image);
    // Acceptance months come from News; manuscripts use their release month.
    // Keep explicit metadata so awards and old section order cannot change dates.
    const date = card.dataset.sortDate;
    return {
      card, order, home: card.parentElement,
      date: date ? Number(date.replace('-', '')) : null,
    };
  });

  function showView(view) {
    // Restore the original groups before changing views; reuse each paper's DOM.
    papers.forEach(({ card, home }) => home.append(card));
    datedList.replaceChildren();
    selected.hidden = view !== 'selected';
    collaborative.hidden = true;
    dated.hidden = view === 'selected';
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.publicationView === view));
    });

    if (view !== 'selected') {
      const chronological = [...papers].sort((a, b) => {
        if (a.date === b.date) return a.order - b.order;
        if (a.date === null) return -1;
        if (b.date === null) return 1;
        return b.date - a.date;
      });
      datedList.append(...chronological.map(({ card }) => card));
    }
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      showView(button.dataset.publicationView);
      document.getElementById('publications').scrollIntoView({ block: 'start' });
    });
  });

  // Section links should still reveal their destination from a filtered view.
  document.querySelectorAll('.link-button').forEach(link => {
    const hash = new URL(link.href).hash;
    if (!['#coledproj', '#coopproj', '#publications'].includes(hash)) return;
    link.addEventListener('click', event => {
      event.preventDefault();
      showView(hash === '#coledproj' ? 'selected' : 'all');
      document.getElementById('publications').scrollIntoView();
      history.replaceState(null, '', hash);
    });
  });

  showView('all');
})();
