// Z: core\z_notebook_tooltips.js
export function attachNotebookTooltip(selector, tipText) {
  const element = document.querySelector(selector);
  if (!element) return;
  element.addEventListener('mouseenter', () => {
    const tip = document.createElement('span');
    tip.className = 'z-tooltip z-notebook-tip';
    tip.textContent = tipText;
    element.appendChild(tip);
    requestAnimationFrame(() => tip.classList.add('visible'));
  });
  element.addEventListener('mouseleave', () => {
    const tip = element.querySelector('.z-tooltip.z-notebook-tip');
    tip?.remove();
  });
}
