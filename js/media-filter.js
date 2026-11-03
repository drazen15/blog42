(() => {
  const group = document.querySelector('.media-filter');
  const list = document.querySelector('.media-list');
  const status = document.querySelector('.media-status');
  if (!group || !list || !status) return;
  let entries = [];
  function render(filter) {
    const matches = entries.filter(post => filter === 'all' || post[filter]);
    list.replaceChildren();
    for (const post of matches) {
      const item = document.createElement('li');
      const date = document.createElement('time');
      date.dateTime = post.date;
      date.textContent = post.date;
      const link = document.createElement('a');
      link.href = post.path;
      link.textContent = post.title;
      const badge = document.createElement('span');
      badge.className = 'media-badge';
      badge.textContent = [post.photo && '照片', post.attachment && '附件'].filter(Boolean).join(' · ');
      item.append(date, link, badge);
      list.append(item);
    }
    status.textContent = `共 ${matches.length} 篇文章`;
  }
  group.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button || !group.contains(button)) return;
    group.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    render(button.dataset.filter);
  });
  fetch('/media/index.json').then(response => {
    if (!response.ok) throw new Error('index unavailable');
    return response.json();
  }).then(data => { entries = data; render('all'); }).catch(() => {
    status.textContent = '文章列表加载失败，请刷新页面重试。';
  });
})();
