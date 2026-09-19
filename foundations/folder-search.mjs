const input = document.querySelector('[data-file-search]');
if (input) {
  const sections = [...document.querySelectorAll('.file-section')];
  const rows = [...document.querySelectorAll('.file-row')];
  const status = document.querySelector('[data-search-status]');
  const filter = () => {
    const query = input.value.trim().toLocaleLowerCase();
    let visible = 0;
    for (const row of rows) {
      row.hidden = !row.textContent.toLocaleLowerCase().includes(query);
      if (!row.hidden) visible++;
    }
    for (const section of sections) section.hidden = !section.querySelector('.file-row:not([hidden])');
    status.textContent = `${visible} of ${rows.length} source files shown`;
  };
  input.addEventListener('input', filter);
  filter();
}
