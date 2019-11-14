$(function () {

	var perdiode;
	var a;
	var c;
	var m;
	var x0;
    
    $('#contact-form').submit(function(e) {
        e.preventDefault();

        if (document.getElementById('solution') == null) {
            divContainer = document.createElement('div');
            divContainer.classList.add('container');
	        divDivider = document.createElement('div');
	        divDivider.classList.add('divider');
	        divHeading = document.createElement('div');
	        divHeading.classList.add('heading');
	        title = document.createElement('h2');
	        title.innerHTML = 'Solution';
	        divSolution = document.createElement('div');
	        divSolution.classList.add('row', 'divDisplay');
            divSolution.id = "solution";

            divHeading.append(title);
            divContainer.append(divDivider);
            divContainer.append(divHeading);
            divContainer.append(divSolution);

            document.body.append(divContainer);
        }

        a = document.getElementById('a');
        c = document.getElementById('c');
        m = document.getElementById('m');
        x0 = document.getElementById('x');

		divSolution = document.getElementById('solution');
        divSolution.innerHTML = '';

        // Affichage des valeurs envoyées
        mesValeurs = document.createElement('ul');
        mesValeurs.innerHTML = 'Valeurs de départ :';
        newLi = document.createElement('li');
        newLi.innerHTML = '<span class="reponse">A :</span> ' + a.value;
        mesValeurs.append(newLi);
        newLi = document.createElement('li');
        newLi.innerHTML = '<span class="reponse">C :</span> ' + c.value;
        mesValeurs.append(newLi);
        newLi = document.createElement('li');
        newLi.innerHTML = '<span class="reponse">M :</span> ' + m.value;
        mesValeurs.append(newLi);
        newLi = document.createElement('li');
        newLi.innerHTML = '<span class="reponse">X0 :</span> ' + x0.value;
        mesValeurs.append(newLi);
        divSolution.append(mesValeurs);

        //Affichages de Hull-Dobell
        divSubtitle = document.createElement('div');
        divSubtitle.classList.add('subtitle');
        subtitle = document.createElement('h3');
        subtitle.innerHTML = 'Hull-Dobell';
        divSubtitle.append(subtitle);
        divSolution.append(divSubtitle);

        divDobellQuestion = document.createElement('div');
        divDobellQuestion.classList.add('col-md-8', 'text-left');
        divDobellQuestion.innerHTML = 'C et M sont premier entre eux';
        divDobellSolution = document.createElement('div');
        divDobellSolution.classList.add('col-md-4', 'text-left');
        let verif1 = verification1(c.value, m.value);
        divDobellSolution.innerHTML = (verif1 ? "<span class='green'>Oui" : "<span class='red'>Non" ) + "</span>";
        divSolution.append(divDobellQuestion);
        divSolution.append(divDobellSolution);
        divDobellQuestion = document.createElement('div');
        divDobellQuestion.classList.add('col-md-8', 'text-left');
        divDobellQuestion.innerHTML = 'Pour tout p, facteur premier de m, on a (a-1) multiple de p';
        divDobellSolution = document.createElement('div');
        divDobellSolution.classList.add('col-md-4', 'text-left');
        let verif2 = verification2(a.value, m.value);
        divDobellSolution.innerHTML = (verif2 ? "<span class='green'>Oui" : "<span class='red'>Non") + "</span>";
        divSolution.append(divDobellQuestion);
        divSolution.append(divDobellSolution);
        divDobellQuestion = document.createElement('div');
        divDobellQuestion.classList.add('col-md-8', 'text-left');
        divDobellQuestion.innerHTML = 'Si m est multiple de 4, alors (a-1) est multiple de 4';
        divDobellSolution = document.createElement('div');
        divDobellSolution.classList.add('col-md-4', 'text-left');
        let verif3 = verification3(a.value, m.value);
        divDobellSolution.innerHTML = (verif3 ? "<span class='green'>Oui" : "<span class='red'>Non") + "</span>";
        divSolution.append(divDobellQuestion);
        divSolution.append(divDobellSolution);

        pIsValid = document.createElement('p');
        pIsValid.classList.add('col-md-12', 'text-center', 'hull-dobell-reponse');
        pIsValid.innerHTML = (verif1 && verif2 && verif3 ? "<span class='green'>La vérification de Hull-Dobell est valide." : "<span class='red'>La vérification de Hull-Dobell est invalide.") + "</span>";
    	divSolution.append(pIsValid);

        pPeriod = document.createElement('p');
        pPeriod.classList.add('col-md-12');
        pPeriod.innerHTML = "<span class='reponse'>Période :</span> " + (verif1 && verif2 && verif3 ? m.value : "TODO");
    	divSolution.append(pPeriod);
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