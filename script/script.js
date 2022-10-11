const navigationLinks = document.querySelectorAll('.navigation__link');//получаем все ссылки
const calcEtems = document.querySelectorAll('.calc');//получаем наши калькуляторы

for (let i = 0; i < navigationLinks.length; i += 1) {
    navigationLinks[i].addEventListener('click', (e) => {//навешиваем на ссылку событие клика и запускаем функцию с циклом фор
        e.preventDefault();//(e)e.prevent отключает стандартное браузерное поведение при клики на ссылки
        for( let j = 0;j < calcEtems.length; j += 1) {
            if( navigationLinks[i].dataset.tax === calcEtems[j].dataset.tax) {
            calcEtems[j].classList.add('calc_active');//добавляем класс
            navigationLinks[i].classList.add('navigation__link_active')//добавляем класс
        } else {
            calcEtems[j].classList.remove('calc_active');//удаляем класс
            navigationLinks[j].classList.remove('navigation__link_active')//удаляем класс
        }
    }
})
}

const ausn = document.querySelector('.ausn');
const formAusn = ausn.querySelector('.calc__form');
const resultTaxTotal = ausn.querySelector('.result__tax_total');
const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');


calcLabelExpenses.style.display = 'none';

formAusn.addEventListener('input', () => {
    if (formAusn.type.value === 'income') {
        calcLabelExpenses.style.display = 'none';
        resultTaxTotal.textContent = formAusn.income.value * 0.08;
        formAusn.expenses.value = '';
    }

    if (formAusn.type.value === 'expenses') {
        calcLabelExpenses.style.display = 'block';
        resultTaxTotal.textContent = (formAusn.income.value - formAusn.expenses.value) * 0.2;
}
});