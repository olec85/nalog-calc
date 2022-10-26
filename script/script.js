const formatCurrency = (n) => {
    const currency = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 2,//количество знаков после запятой
    });
    return currency.format(n)
};

const debounceTimer = (fn, msec) => {//фуекция принимает два параметра:функцию и количество милисекунд
    let lastCall = 0;
    let lastCallTimer;

    return (...arg) => {
        const previousCall = lastCall;
        lastCall = Date.now();

        if(previousCall && ((lastCall - previousCall) <= msec)) {
            clearTimeout(lastCallTimer)
        }

        lastCallTimer = setTimeout(() => {
            fn(...arg);
        }, msec)
    }
}

{
    //навигация

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
}

{
    //АУСН

    const ausn = document.querySelector('.ausn');
    const formAusn = ausn.querySelector('.calc__form');
    const resultTaxTotal = ausn.querySelector('.result__tax_total');
    const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');

    calcLabelExpenses.style.display = 'none';

    

    formAusn.addEventListener('input', debounceTimer(() => {

        const income = +formAusn.income.value;

        if (formAusn.type.value === 'income') {
            calcLabelExpenses.style.display = 'none';
            resultTaxTotal.textContent = formatCurrency(income * 0.08);
            formAusn.expenses.value = '';
        }

        if (formAusn.type.value === 'expenses') {
            calcLabelExpenses.style.display = '';
            const expenses = +formAusn.expenses.value;
            console.log(typeof expenses, expenses);
            const profit = income < expenses ? 0 : income - expenses
            resultTaxTotal.textContent = formatCurrency(profit * 0.2);
    }
    }, 500));
}

{
//Самозанятый или ИП НПД

    const selfEmployment = document.querySelector('.self-employment');
    const formSelfEmployment = selfEmployment.querySelector('.calc__form');
    const resultTaxSelfEmployment = selfEmployment.querySelector('.result__tax');
    const calcCompensation = selfEmployment.querySelector('.calc__label_compensation');
    const resultBlockCompensation = selfEmployment.querySelectorAll('.result__block_compensation');
    const resulTaxCompensation = selfEmployment.querySelector('.result__tax-compensation');
    const resultTaxRestCompensation = selfEmployment.querySelector('.result__tax_rest-compensation');
    const resultTaxResult = selfEmployment.querySelector('.result__tax_result');


    const checkCompenstation = () => {
        const setDisplay = formSelfEmployment.addCompensation.checked ? '' : 'none'
        calcCompensation.style.display = setDisplay;

        resultBlockCompensation.forEach((elem) => {
            elem.style.display = setDisplay;
        })
    };

    checkCompenstation();

    const handlerForm = debounceTimer(() => {
        const individual = +formSelfEmployment.individual.value;
        const entity = +formSelfEmployment.entity.value;
        const resIndividual = individual * 0.04;
        const resEntity = entity * 0.06;

        checkCompenstation();

        const tax = resIndividual + resEntity;

        formSelfEmployment.compensation.value = 
            +formSelfEmployment.compensation.value > 10_000
            ? 10_000 
            : formSelfEmployment.compensation.value//через тернарный оператор если formSelfEmployment.compensation.value больше 10000 то вернем 10000 а иначе вернем formSelfEmployment.compensation.value
        const benefit = +formSelfEmployment.compensation.value;
        const resBenefit = individual * 0.01 + entity * 0.02;
        const finalBenefit = benefit - resBenefit > 0 ? benefit - resBenefit : 0;
        const finalTax = tax - (benefit - finalBenefit)

        resultTaxSelfEmployment.textContent = formatCurrency(tax);
        resulTaxCompensation.textContent = formatCurrency(benefit - finalBenefit);
        resultTaxRestCompensation.textContent = formatCurrency(finalBenefit);
        resultTaxResult.textContent = formatCurrency(finalTax);
    }, 300);

    formSelfEmployment.addEventListener('reset', () => {
        setTimeout(handlerForm);
    })

    formSelfEmployment.addEventListener('input', debounceTimer(handlerForm), 300);


}

{
// осно
    const osno = document.querySelector('.osno');
    const formOsno = osno.querySelector('.calc__form');

    const ndflExpenses = osno.querySelector('.result__block_ndfl-expenses');
    const ndflIncome = osno.querySelector('.result__block_ndfl-income');
    const profit = osno.querySelector('.result__block_profit');

    const resultTaxNds = osno.querySelector('.result__tax_nds');
    const resultTaxProperty = osno.querySelector('.result__tax_property');
    const resultTaxNdflExpenses = osno.querySelector('.result__tax_ndfl-expenses');
    const resultTaxNdflIncome = osno.querySelector('.result__tax_ndfl-income');
    const resultTaxProfit = osno.querySelector('.result__tax_profit');

    const checkFormBusiness = () => {
        if (formOsno.formBusiness.value === 'ИП') {
            ndflExpenses.style.display = '';
            ndflIncome.style.display = '';
            profit.style.display = 'none';
        }   

        if (formOsno.formBusiness.value === 'ООО') {
            ndflExpenses.style.display = 'none';
            ndflIncome.style.display = 'none';
            profit.style.display = '';
        }
    };
    checkFormBusiness();

    formOsno.addEventListener('input', debounceTimer(() => {
        checkFormBusiness();

        const income = +formOsno.income.value;
        const expenses = +formOsno.expenses.value;
        const property = +formOsno.property.value;
        

        const nds = income * 0.2;//ндс
        const taxProperty = property * 0.02//налог на имущество
        const profit = income < expenses ? 0 : income - expenses;
        const ndflExpensesTotal = profit * 0.13;//ндфл вычет в виде рассходов
        const ndflIncomeTotal = (income - nds) * 0.13;//ндфл вычет 20% от доходов
        const taxProfit = profit * 0.2;//налог на прибыль 20%


        resultTaxNds.textContent = formatCurrency(nds);
        resultTaxProperty.textContent = formatCurrency(taxProperty);
        resultTaxNdflExpenses.textContent = formatCurrency(ndflExpensesTotal);
        resultTaxNdflIncome.textContent = formatCurrency(ndflIncomeTotal);
        resultTaxProfit.textContent = formatCurrency(taxProfit);
    }, 500));
    

}

{
//УСН
const LIMIT =300_000;
const usn = document.querySelector('.usn');
const formUsn = usn.querySelector('.calc__form');

const calcLabelExpenses = usn.querySelector('.calc__label_expenses');
const calcLabelProperty = usn.querySelector('.calc__label_property');
const resultBlockProperty = usn.querySelector('.result__block_property');

const resultTaxTotal = usn.querySelector('.result__tax_total');
const resultTaxProperty = usn.querySelector('.result__tax_property');
//это вариант исполнения через switch

// const checkShopProperty = (typeTax) => {
//     switch(typeTax) {
//         case 'income':{
//         calcLabelExpenses.style.display = 'none';
//         calcLabelProperty.style.display = 'none';
//         resultBlockProperty.style.display = 'none';

//         formUsn.expenses.value = '';
//         formUsn.property.value = '';
//         break;
//         };
//         case 'ip-expenses':{
//             calcLabelExpenses.style.display = '';
//             calcLabelProperty.style.display = 'none';
//             resultBlockProperty.style.display = 'none';

//             formUsn.property.value = '';
//             break;
//         };
//         case 'ooo-expenses':{
//             calcLabelExpenses.style.display = '';
//             calcLabelProperty.style.display = '';
//             resultBlockProperty.style.display = '';
//             break;
//         };
//     }
// };
//это вариант исполнения через обьект
const typeTax = {
    'income': () => {
        calcLabelExpenses.style.display = 'none';
        calcLabelProperty.style.display = 'none';
        resultBlockProperty.style.display = 'none';

        formUsn.expenses.value = '';
        formUsn.property.value = '';
    },
    'ip-expenses': () => {
        calcLabelExpenses.style.display = '';
        calcLabelProperty.style.display = 'none';
        resultBlockProperty.style.display = 'none';

        formUsn.property.value = '';
    },
    'ooo-expenses': () => {
        calcLabelExpenses.style.display = '';
        calcLabelProperty.style.display = '';
        resultBlockProperty.style.display = '';
    },
}

const percent = {
    'income': 0.06,
    'ip-expenses': 0.15,
    'ooo-expenses': 0.15,
}

typeTax[formUsn.typeTax.value]();

formUsn.addEventListener('input', debounceTimer(()=> {
    typeTax[formUsn.typeTax.value]();

    const income = +formUsn.income.value;
    const expenses = +formUsn.expenses.value;
    const сontributions = +formUsn.сontributions.value;
    const property = +formUsn.property.value;

    let profit = income - сontributions;

    if(formUsn.typeTax.value !== 'income') {
        profit -= expenses;
    }

    const taxBigIncome = income > LIMIT ? (profit - LIMIT) * 0.01 : 0;

    const summ = profit - (taxBigIncome < 0 ? 0 : taxBigIncome);
    const tax = summ * percent[formUsn.typeTax.value];
    const taxProperty = property * 0.02;

    resultTaxTotal.textContent = formatCurrency(tax < 0 ? 0 : tax);
    resultTaxProperty.textContent = formatCurrency(taxProperty);
}, 500));

}
//13%
{
    const taxReturn = document.querySelector('.tax-return');
    const formTaxReturn = taxReturn.querySelector('.calc__form');
    const resultTaxNdfl = taxReturn.querySelector('.result__tax_ndfl');
    const resultTaxPossible = taxReturn.querySelector('.result__tax_possible');
    const resultTaxDeduction = taxReturn.querySelector('.result__tax_deduction');

    let timer;

    formTaxReturn.addEventListener('input',() => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            const expenses = +formTaxReturn.expenses.value;
        const income = +formTaxReturn.income.value;

        const ndfl = income * 0.13;
        const sumExpenses = +formTaxReturn.sumExpenses.value;
        const possibleDeduction = expenses < sumExpenses
         ? expenses * 0.13
          : sumExpenses * 0.13;

          const deduction = possibleDeduction < ndfl ? possibleDeduction : ndfl;

          resultTaxNdfl.textContent = formatCurrency(ndfl);
          resultTaxPossible.textContent = formatCurrency(possibleDeduction);
          resultTaxDeduction.textContent = formatCurrency(deduction);
        },500)
    })
}