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