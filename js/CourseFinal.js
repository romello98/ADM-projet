NOMBRES_ALEATOIRES = [];
genererNombresAleatoires(250, 17, 47, 2048);
listeNombresGeneres = NOMBRES_ALEATOIRES;

function compteCourses(listeNombresGeneres){
	let courses = new Array(listeNombresGeneres.length).fill(0);
	let tailleCourse = 1;
	for(let iNombreGenere = 1; iNombreGenere < listeNombresGeneres.length; iNombreGenere++){
		if(tailleCourse !== 0 && listeNombresGeneres[iNombreGenere] < listeNombresGeneres[iNombreGenere - 1]){
			//console.log(tailleCourse);
      courses[tailleCourse]++;
			tailleCourse = 0;
		}else{
			tailleCourse++;
		}
	}
	if(tailleCourse !== 0){
		courses[tailleCourse]++;
	}
	return courses;
}

function frequenceTheorique(longueurCourse, nbCourses){
	if(longueurCourse!==0){
		return (longueurCourse/(factorielle(Number(longueurCourse)+1)))*nbCourses;
	}else{ 
		return 0;
	}
}

function SommeCourses(courses){
	sommeCourses = 0
	for(saut of courses){
		sommeCourses += saut;
	}
	return sommeCourses;
}


coursesObserve = compteCourses(listeNombresGeneres);
sommeCourses = SommeCourses(coursesObserve);
coursesTheorique = new Array(listeNombresGeneres.length).fill(0);
for (var indiceCourses in coursesObserve){
	coursesTheorique[indiceCourses] = frequenceTheorique(indiceCourses, sommeCourses);
}
coursesObserveCompresse = new Array(listeNombresGeneres.length).fill(0);
coursesTheoriqueCompresse = new Array(listeNombresGeneres.length).fill(0);

indiceCoursesCompresse = 0;
for (var indiceCourses in coursesObserve){
	coursesObserveCompresse[indiceCoursesCompresse] += coursesObserve[indiceCourses];
	coursesTheoriqueCompresse[indiceCoursesCompresse] += coursesTheorique[indiceCourses];
	if(coursesTheoriqueCompresse[indiceCoursesCompresse]>=5){
		indiceCoursesCompresse ++;
	}
}

sommeKhiCarre = 0
indiceMax =0
for (var indiceCourses in coursesObserveCompresse){
	if(coursesTheoriqueCompresse[indiceCourses]>=5){
		sommeKhiCarre += ((coursesObserveCompresse[indiceCourses]-coursesTheoriqueCompresse[indiceCourses]) ** 2)/coursesTheoriqueCompresse[indiceCourses];
		indiceMax=indiceCourses
	}
}
degreLiberte = Number(indiceMax); // Nb de Ligne - 1 
console.log(sommeKhiCarre);
console.log(degreLiberte);

function factorielle(n)
{
	let fact = 1;
	while(n > 0)
	{
		fact *= n;
		n--;
	}
	return fact;
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

/*
Après, il faut appliquer la loi du Khi carré
sur sommeKhiCarre avec un degré de liberté = degreLiberte
Je n'ai pas trouvé la methode bien qu'elle existe sur Excel

On récupèrera ainsi la probabilité d'avoir une telle valeur (la "p-valeur" à droite )
Si c'est > que notre n-i alors le test dit que c'est ok, c'est équilibré: on n'a pas rejeter H0
Sinon, (< que notre n-i) alors le test est un contre cas de l'équilibre (via les courses): on rejette H0
*/

