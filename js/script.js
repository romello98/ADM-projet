$(function () {
    
    // JQuery edition
    $('#contact-form').submit(function(e) {
        e.preventDefault();

        if (document.getElementById('solution') == null) {
            newRow = document.createElement('div');
            newRow.classList.add('row');
            divSolution = document.createElement('div');
            divSolution.classList.add('col-lg-10', 'col-lg-offset-1', 'myContainer');
            divSolution.id = "solution";
            newRow.append(divSolution);

            document.body.getElementsByClassName('container')[0].append(newRow);
        }

        a = document.getElementById('a');
        c = document.getElementById('c');
        m = document.getElementById('m');
        x0 = document.getElementById('x');

        divSolution = document.getElementById('solution');
        divSolution.innerHTML = '';
        mesValeurs = document.createElement('ul');
        mesValeurs.innerHTML = 'Valeurs de départ :';
        newLi = document.createElement('li');
        newLi.innerHTML = 'A = ' + a.value;
        mesValeurs.append(newLi);
        newLi = document.createElement('li');
        newLi.innerHTML = 'C = ' + c.value;
        mesValeurs.append(newLi);
        newLi = document.createElement('li');
        newLi.innerHTML = 'M = ' + m.value;
        mesValeurs.append(newLi);
        newLi = document.createElement('li');
        newLi.innerHTML = 'X0 = ' + x0.value;
        mesValeurs.append(newLi);
        divSolution.append(mesValeurs);
    });

})

/* Détermine si deux entiers <integer1> et <integer2> sont premiers */
function areCoPrime(integer1, integer2)
{
    let integer1PrimeFactors = primeFactorsDecomposition(integer1);
    let integer2PrimeFactors = primeFactorsDecomposition(integer2);
    let commonPrimeFactors = commonSubArray(integer1PrimeFactors, integer2PrimeFactors);
    return commonPrimeFactors.length == 0;
}

/* Retourne un tableau contenant les facteurs premiers de <integer> */
function primeFactorsDecomposition(integer)
{
    let primeFactors = [];

    for(let factor = 2; factor <= integer; factor++)
    {
        if (isDivisibleBy(integer, factor)) 
        {
            let isPrimeFactor = true;
            let maxFactor = Math.floor(Math.sqrt(factor));
            
            for(let divisor = 2; isPrimeFactor && divisor <= maxFactor; divisor++) 
                isPrimeFactor = !isDivisibleBy(factor, divisor);
            
            if(isPrimeFactor) 
                while (isDivisibleBy(integer, factor)) 
                {
                    integer /= factor;
                    primeFactors.push(factor);
                }
        }
    }

    return primeFactors;
}

/* Retourne le sous-tableau commun le plus long de <array1> et <array2> */
function commonSubArray(array1, array2)
{
    let lowIndexWithMaxSize;
    let highIndexWithMaxSize;
    let maxSize = 0;

    for(let i = 0; i < array1.length; i++)
    {
        let size;
        let savedI = i;
        let lowIndex = i;

        for(let j = 0; j < array2.length && array1[i] == array2[j]; j++)
            i++;

        size = i - lowIndex;
        if(size > maxSize) 
        {
            maxSize = size;
            highIndexWithMaxSize = i;
            lowIndexWithMaxSize = lowIndex;
        }
        i = savedI;
    }

    return array1.slice(lowIndexWithMaxSize, highIndexWithMaxSize);
}

/* Détermine si <integer> est divisible par <divisor> */
function isDivisibleBy(integer, divisor)
{
    return integer % divisor == 0;
}