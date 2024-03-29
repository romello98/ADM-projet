
//Variable reçue
a = 65;
c = 57;
m = 32768;
x0 = 356;
index = 0;
let periode;
tablePoids = [18, 21, 15, 3, 1, 1];

NOMBRES_ALEATOIRES = [];

$(function () {
    inputA = document.getElementById('a');
    inputC = document.getElementById('c');
    inputM = document.getElementById('m');
    inputX0 = document.getElementById('x');

    inputA.value = a;
    inputC.value = c;
    inputM.value = m;
    inputX0.value = x0;


	//Partie 1
	//Partie 2

	const tailleMaxPrioritaire = 5;
	const tempsSimulation = 600;
	const coutClientPrioritaire = 40;
	const coutClientOrdinaire = 25;
	const coutHeureOccupation = 35;
	const coutHeureInnocupation = 20;
	const coutClientPrioDevientOrdinaire = 50;
	const probClientPrioritaire = 0.3;
	const lambdaGenerationClient = 1.8;
	const nbStationMin = 2;
	const nbStationMax = 10;

	let nbStationMinEquilibre = lambdaGenerationClient * tablePoids.reduce((acc, curr, index) => acc + curr * (index + 1)) / 59.;
	console.log("Nombre de stations minimum pour une situation d'équilibre : " + nbStationMinEquilibre);

	var nbStationIdeal;
    
    $('#contact-form').submit(function(e) {
        e.preventDefault();
        document.getElementById('solution').classList.remove('hidden');

        //Partie 1

        genererNombresAleatoires(Number(inputX0.value), Number(inputA.value), Number(inputC.value), Number(inputM.value));
		periode = Number(inputM.value);

        document.getElementById('da').innerHTML = inputA.value;
        document.getElementById('dc').innerHTML = inputC.value;
        document.getElementById('dm').innerHTML = inputM.value;
        document.getElementById('dx0').innerHTML = inputX0.value;

        let verif1 = verification1(inputC.value, inputM.value);
        let verif2 = verification2(inputA.value, inputM.value);
        let verif3 = verification3(inputA.value, inputM.value);
        let hullDobellValid = verif1 && verif2 && verif3;

        if(!hullDobellValid) periode = calculPeriode(NOMBRES_ALEATOIRES);

        document.getElementById('hd-s1').innerHTML = (verif1 ? "<span class='green'>Oui" : "<span class='red'>Non" ) + "</span>";
        document.getElementById('hd-s2').innerHTML = (verif2 ? "<span class='green'>Oui" : "<span class='red'>Non" ) + "</span>";
        document.getElementById('hd-s3').innerHTML = (verif3 ? "<span class='green'>Oui" : "<span class='red'>Non" ) + "</span>";

        document.getElementById('hd-isValid').innerHTML = (hullDobellValid ? "<span class='green'>La vérification de Hull-Dobell est valide." : "<span class='red'>La vérification de Hull-Dobell est invalide.") + "</span>";
        document.getElementById('period').innerHTML = periode + "";


        //Partie 2
        document.getElementById('best-solution').innerHTML = "";
        document.getElementById('time-solution').innerHTML = "";
        coutMin = { total: Infinity };
        nbStationIdeal = null;
        let iStation = nbStationMin;
		
        while (iStation <= nbStationMax) {

        	index = 0;

			let filePrioritaire = 0;
			let fileOrdinaire = 0;
			let cumPrioritaire = 0;
			let cumOrdinaire = 0;
			let nbCumMinOccupe = 0;
			let nbCumMinInnocupe = 0;
			let nbTransitionPrioOrdinaire = 0;

			let dureeGeneree = 0;
			let tabClientsSontPrio = [];
			let tabDureeService = [];
			let nombreArrivee = 0;


        	tabDureeService = init(tabDureeService, iStation);
        	let iTemps = 1;

        	while (iTemps <= tempsSimulation) {
        		var nouvelleArriveePrio = 0;
        		var nouvelleArriveeOrdi = 0;

        		let doitAfficherInfos = (iTemps <= 20 && (iStation == nbStationMin || iStation == 5));

        		nombreArrivee = genererArrivee(lambdaGenerationClient);

				reponse = repartirFiles(filePrioritaire, fileOrdinaire, nombreArrivee, probClientPrioritaire, cumPrioritaire, cumOrdinaire, nbTransitionPrioOrdinaire);
				filePrioritaire = reponse.filePrioritaire;
				fileOrdinaire = reponse.fileOrdinaire;
				cumPrioritaire = reponse.cumPrioritaire;
				cumOrdinaire = reponse.cumOrdinaire;
				nbTransitionPrioOrdinaire = reponse.nbTransitionPrioOrdinaire;
				nouvelleArriveePrio = reponse.nouvelleArriveePrio;
				nouvelleArriveeOrdi = reponse.nouvelleArriveeOrdi;

        		if (doitAfficherInfos) {
			      	div = document.getElementById('time-solution');
					title = document.createElement('h3');
					title.innerHTML = "<span class=\"reponse\">Minute :</span> " + iTemps;
					generate = document.createElement('h3');
					generate.innerHTML = "<span class=\"reponse\">Nombre d'arrivées générées :</span> " + nombreArrivee + " (Prio : " + nouvelleArriveePrio + ", Ordi : " + nouvelleArriveeOrdi + ")";
					div.append(title);
					div.append(generate);

					sortirStations(iStation, tabClientsSontPrio, tabDureeService);
					sortirFiles(filePrioritaire, fileOrdinaire);
				}

				let i = 0;

				while (i <= iStation) {
					if (tabDureeService[i] <= 0) {
						filePrioritaireEstVide = (filePrioritaire <= 0);
						fileOrdinaireEstVide = (fileOrdinaire <= 0);

						if (i == 0) {
							if (!filePrioritaireEstVide) {
								nbCumMinOccupe++;
								filePrioritaire--;
								tabDureeService[i] = genererDuree();
								tabClientsSontPrio[i] = true;
							} else {
								tabClientsSontPrio[i] = null;
								nbCumMinInnocupe++;
							}
						} else {
							if (!fileOrdinaireEstVide) {
								nbCumMinOccupe++;
								fileOrdinaire--;
								tabDureeService[i] = genererDuree();
								tabClientsSontPrio[i] = false;
							} else {
								if (!filePrioritaireEstVide) {
									nbCumMinOccupe++;
									filePrioritaire--;
									tabDureeService[i] = genererDuree();
									tabClientsSontPrio[i] = true;							
								} else {
									tabClientsSontPrio[i] = null;
									nbCumMinInnocupe++;
								}
							}

						}

					} else {
						nbCumMinOccupe++;
						if(tabClientsSontPrio[i]){
							cumPrioritaire++;
						}else{
							cumOrdinaire++;
						}
					}

					tabDureeService[i]--;

					i++;
				}

				iTemps++;
        	}

        	let coutEstimeOccupe = (nbCumMinOccupe / 60) * coutHeureOccupation;
        	let coutEstimeInnoccupe = (nbCumMinInnocupe / 60) * coutHeureInnocupation;
        	let coutEstimeClientPrioOrdinaire = (nbTransitionPrioOrdinaire * coutClientPrioDevientOrdinaire);
        	let coutEstimePresenceSysPrio = (cumPrioritaire / 60) * coutClientPrioritaire;
        	let coutEstimePresenceSysOrdinaraire = (cumOrdinaire / 60) * coutClientOrdinaire;
        	let couts = 
        	{
        		total: coutEstimeOccupe + coutEstimeInnoccupe + coutEstimeClientPrioOrdinaire + coutEstimePresenceSysPrio + coutEstimePresenceSysOrdinaraire,
        		occupation: coutEstimeOccupe,
        		inoccupation: coutEstimeInnoccupe,
        		transferts: coutEstimeClientPrioOrdinaire,
        		presencePrio: coutEstimePresenceSysPrio,
        		presenceOrdi: coutEstimePresenceSysOrdinaraire
        	};

        	if (couts.total < coutMin.total) {
        		coutMin = couts;
        		nbStationIdeal = iStation + 1;
        	}

        	iStation++;
        }

        sortirCouts(coutMin, nbStationIdeal);													

    });

})

function sortirCouts(couts, nbStationIdeal)
{
	couts = Object.fromEntries(Object.entries(couts).map((entry) => [entry[0], entry[1].toFixed(2)] ));
	document.getElementById('best-solution').innerHTML = "Nous vous conseillons un nombre de <strong>" + nbStationIdeal + "</strong> station(s) pour un coût de " + coutMin.total.toFixed(2) + "€"
														+"<table>"
														+"<tr><th>Type</th><th>Montant</th></tr>"
														+`<tr><td>Occupation des stations : </td><td>${couts.occupation} €</td></tr>`
														+`<tr><td>Inoccupation des stations : </td><td>${couts.inoccupation} €</td></tr>`
														+`<tr><td>Transferts de prioritaires : </td><td>${couts.transferts} €</td></tr>`
														+`<tr><td>Présence système prioritaires : </td><td>${couts.presencePrio} €</td></tr>`
														+`<tr><td>Présence système ordinaires : </td><td>${couts.presenceOrdi} €</td></tr>`
														+`<tr><td>Total : </td><td>${couts.total} €</td></tr>`;
        
}

/* Détermine si deux entiers <integer1> et <integer2> sont premiers */
function areCoPrime(integer1, integer2)
{
    let integer1PrimeFactors = primeFactorsDecomposition(integer1);
    let integer2PrimeFactors = primeFactorsDecomposition(integer2);
    //let commonPrimeFactors = commonSubArray(integer1PrimeFactors, integer2PrimeFactors);
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


function calculPeriode(tab)
{
	let tabTrouve = [];

	for(let i = 0; i < tab.length; i++)
	{
		if(tabTrouve.indexOf(tab[i]) !== -1)
			return i - tabTrouve.indexOf(tab[i]);
		tabTrouve.push(tab[i]);		    
	}

	return -1;
}

//partie 2

function repartirFiles(filePrioritaire, fileOrdinaire, nombreArrivee, probClientPrioritaire, cumPrioritaire, cumOrdinaire, nbTransitionPrioOrdinaire) {

	cumPrioritaire += filePrioritaire;
	cumOrdinaire += fileOrdinaire;

	let nouvelleArriveePrio = 0;
	let nouvelleArriveeOrdi = 0;
	while (nombreArrivee > 0) {
		nbrAleatoire = random();

		if (nbrAleatoire < probClientPrioritaire) {
			nouvelleArriveePrio++;

			if (filePrioritaire < 5) {
				filePrioritaire++;
			} else {
				fileOrdinaire++;
				nbTransitionPrioOrdinaire++;
			}
		} else {
			fileOrdinaire++;
			nouvelleArriveeOrdi++;
		}

		nombreArrivee--;
	}

	return {filePrioritaire : filePrioritaire, fileOrdinaire : fileOrdinaire, cumPrioritaire : cumPrioritaire, cumOrdinaire : cumOrdinaire, nbTransitionPrioOrdinaire : nbTransitionPrioOrdinaire, nouvelleArriveeOrdi : nouvelleArriveeOrdi, nouvelleArriveePrio : nouvelleArriveePrio};
}

function sortirStations(iStation, tabClientsSontPrio, tabDureeService) {
	i = 0;

	div = document.getElementById('time-solution');
	table = document.createElement('table');
	table.classList.add('table');
	thead = document.createElement('thead');
	tbody = document.createElement('tbody');
	tr = document.createElement('tr');
	thStation = document.createElement('th');
	thStation.innerHTML = "Station";
	thTypeClient = document.createElement('th');
	thTypeClient.innerHTML = "Type de client";
	thDureeRestante = document.createElement('th');
	thDureeRestante.innerHTML = "Durée restante";

	tr.append(thStation);
	tr.append(thTypeClient);
	tr.append(thDureeRestante);
	thead.append(tr);
	table.append(thead);

	while (i < iStation) {
		newTr = document.createElement('tr');
		newTdStation = document.createElement('td');
		newTdType = document.createElement('td');
		newTdDuree = document.createElement('td');

		newTdStation.innerHTML = i + 1;

		if (tabClientsSontPrio[i] != null) {
			if (tabClientsSontPrio[i]) {
				newTdType.innerHTML = "Client prioritaire";
			} else {
				newTdType.innerHTML = "Client ordinaire";
			}
		} else {
			newTdType.innerHTML = "/";
		}

		if (tabDureeService[i] != null) {
			newTdDuree.innerHTML = tabDureeService[i];
		}

		newTr.append(newTdStation);
		newTr.append(newTdType);
		newTr.append(newTdDuree);
		tbody.append(newTr);

		i++;
	}

	table.append(tbody);
	div.append(table);
}

function sortirFiles(filePrioritaire, fileOrdinaire) {
	div = document.getElementById('time-solution');
	table = document.createElement('table');
	table.classList.add('table');
	thead = document.createElement('thead');
	tbody = document.createElement('tbody');
	tr = document.createElement('tr');
	thFilePrio = document.createElement('th');
	thFilePrio.innerHTML = "File prioritaire";
	thFileOrdi = document.createElement('th');
	thFileOrdi.innerHTML = "File ordinaire";
	newTr = document.createElement('tr');
	newTdPrio = document.createElement('td');
	newTdPrio.innerHTML = filePrioritaire + " clients";
	newTdOrdi = document.createElement('td');
	newTdOrdi = fileOrdinaire + " clients";

	tr.append(thFilePrio);
	tr.append(thFileOrdi);
	thead.append(tr);
	table.append(thead);

	newTr.append(newTdPrio);
	newTr.append(newTdOrdi);
	tbody.append(newTr);
	table.append(tbody);
	div.append(table);
}

function init(tabDureeService, iStation) {
	i = 0;

	while (i < iStation) {
		tabDureeService[i] = 0;
		i++;
	}

	return tabDureeService;
}

function genererArrivee(lambdaGenerationClient) {
	let nbrAleatoire = random();

	let k = 0;
	while (nbrAleatoire >= 0) {
		nbrAleatoire -= (Math.pow(lambdaGenerationClient, k) * Math.pow(Math.E, -lambdaGenerationClient)) / factorielle(k);

		k++;
	}

	return k - 1;
}

function factorielle(n)
{
	if (n == 0) {
		return 1;
	} else {
		return n * factorielle (n-1);
	}
}

function genererNombresAleatoires(x0, a, c, m)
{
	let xi = x0;
	NOMBRES_ALEATOIRES[0] = Number(x0);
	for(let i = 1; i < m; i++) 
	{ 
		xi = NOMBRES_ALEATOIRES[i] = (a * xi + c) % m;
	}
}

function random()
{
	let nb = NOMBRES_ALEATOIRES[index] / m;
	index = (index + 1) % periode;
	return nb;
}

function genererDuree() {
	nbrAleatoire = random();

	tablePoids = [18, 21, 15, 3, 1, 1];
	nbrAleatoire = nbrAleatoire * 59;
	indice = 0;

	while (nbrAleatoire >= 0) {
		nbrAleatoire -= tablePoids[indice];
		indice++;
	}

	return indice;
}