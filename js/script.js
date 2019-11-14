$(function () {

	var perdiode;
	var a;
	var c;
	var m;
	var x0;
    
    $('#contact-form').submit(function(e) {
        e.preventDefault();
        document.getElementById('solution').classList.remove('hidden');

        a = document.getElementById('a');
        c = document.getElementById('c');
        m = document.getElementById('m');
        x0 = document.getElementById('x');

        document.getElementById('da').innerHTML = a.value;
        document.getElementById('dc').innerHTML = c.value;
        document.getElementById('dm').innerHTML = m.value;
        document.getElementById('dx0').innerHTML = x0.value;

        let verif1 = verification1(c.value, m.value);
        let verif2 = verification2(a.value, m.value);
        let verif3 = verification3(a.value, m.value);

        document.getElementById('hd-s1').innerHTML = (verif1 ? "<span class='green'>Oui" : "<span class='red'>Non" ) + "</span>";
        document.getElementById('hd-s2').innerHTML = (verif2 ? "<span class='green'>Oui" : "<span class='red'>Non" ) + "</span>";
        document.getElementById('hd-s3').innerHTML = (verif3 ? "<span class='green'>Oui" : "<span class='red'>Non" ) + "</span>";

        document.getElementById('hd-isValid').innerHTML = (verif1 && verif2 && verif3 ? "<span class='green'>La vérification de Hull-Dobell est valide." : "<span class='red'>La vérification de Hull-Dobell est invalide.") + "</span>";
        document.getElementById('period').innerHTML = (verif1 && verif2 && verif3 ? m.value : "TODO");
    });

})

/* Détermine si deux entiers <integer1> et <integer2> sont premiers */
function areCoPrime(integer1, integer2)
{
    let integer1PrimeFactors = primeFactorsDecomposition(integer1);
    let integer2PrimeFactors = primeFactorsDecomposition(integer2);
    let commonPrimeFactors = commonSubArray(integer1PrimeFactors, integer2PrimeFactors);
    return isValidUncommunNumber(integer1PrimeFactors, integer2PrimeFactors);
    //return commonPrimeFactors.length == 0;
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
            let maxFactor = Math.round(Math.sqrt(factor));
            
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
//Ne fonctionne pas ??? renvoie des nombres qui ne sont pas commun (exemple: c = 6 et m = 35)
function commonSubArray(array1, array2)
{
    let lowIndexWithMaxSize, highIndexWithMaxSize;
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

function isValidUncommunNumber(array1, array2)
{
    for(let i = 0; i < array1.length; i++)
    {
        for(let j = 0; j < array2.length; j++) {
        	if (array1[i] == array2[j]) return false;
        }
    }

    return true;
}

/* Détermine si <integer> est divisible par <divisor> */
function isDivisibleBy(integer, divisor)
{
    return integer % divisor == 0;
}

function isMMultiple(val) {
	return val % 4 == 0;
}

function verification1(c, m) {
	return areCoPrime(c, m);
}

function verification2(a, m) {
	let p = primeFactorsDecomposition(m);

	for (let i = 0; i < p.length; i++) {
		if ((a-1) % p[i] != 0) return false;
	}

	return true;
}

function verification3(a, m) {
	if (isMMultiple(m)) {
		return (a-1) % 4 == 0;
	} else {
		return true;
	}
	
}