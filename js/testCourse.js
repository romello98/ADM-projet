function compteSauts(listeNombresGeneres){
	let sauts = new Array(listeNombresGeneres.length).fill(0);
	let tailleCourse = 1;
	for(let iNombreGenere = 1; iNombreGenere < listeNombresGeneres.length; iNombreGenere++){
		if(tailleCourse !== 0 && listeNombresGeneres[iNombreGenere] < listeNombresGeneres[iNombreGenere - 1]){
			sauts[tailleCourse]++;
			tailleCourse = 0;
		}else{
			tailleCourse++;
		}
	}
	if(tailleCourse !== 0){
		sauts[tailleCourse]++;
	}
	return sauts;
}

function frequenceTheorique(longueurCourse, nbSauts){
	return (longueurCourse/((longueurCourse+1)!))*nbSauts;
}

function SommeSauts(sauts){
	sommeSauts = 0
	for(saut of sauts){
		sommeSauts += saut;
	}
}

