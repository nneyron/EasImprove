// jeu.js

//DECLARATION DES VARIABLES
//Images et sons
var vaisseau = new Image();
vaisseau.src = "./rocket.png";
var vaisseauAlien = new Image();
vaisseauAlien.src = "./vaisseauAlien_petit.png";
var explosion = new Image();
explosion.src = "./giphy.gif";
var sonTir = new Audio('./sonTir.mp3');
var sonExplosion = new Audio('./sonExplosion.mp3');

//Tableaux pour les propositions
var tableauQuestions = []; //tableau qui contiendra les dix propositions et les dix booléens associés
var tableauPositionsQuestions=[]; //tableau qui contiendra les hauteurs des vaisseaux ennemis
var tableauVaisseauxDisparus = []; //tableau à remplir au fur et à mesure des explosions
var tableauQuestionsAPoser = []; //tableau qui permettra de gérer les propositions sélectionnées dans le tableau suivant
var tableau48Questions = []; //tableau qui regroupe toutes les questions possibles et le booléen associé


var score = 0;
var position=0; 
var nbVaisseauxADetruire=0;
var fini = false;
var timer;

/* TODO :
DONE gérer dix proposition sur trois lignes
fonction tirer() :
DONE    mettre un faisceau laser
DONE    obtenir la proposition tirée
DONE    envoyer le résultat à la fonction vérifierReponse()
DONE    faire disparaître la case si c'est bien une fausse prop
    faire apparaître une perte de points sinon
mettre des vaisseaux à la place des boutons
jauge de PV/score ?
nettoyer et commenter le code
fonction ondocumentready
*/


//Fonction générique d'ajout d'événement, sert pour onclick et onmousemove
function addEvent(obj,event,fct)
{
        if( obj.attachEvent)
                obj.attachEvent('on' + event,fct);
        else
                obj.addEventListener(event,fct,true);
}


//Fonction générale de gestion de l'API pour récupérer les données
function ajaxGet(url, callback) 
{
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) 
        {
            // Appelle la fonction callback en lui passant la réponse de la requête
            callback(req.responseText);
        } 
        else 
        {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
    });
    req.send(null);
}


//Fonction onload : affichage, initialisation
window.onload = function() 
{
    chargerTableau();
    setTimeout(chargerQuestions,1000);

    //déclaration des éléments HTML
    //tableau = document.getElementById('tableau');
    boutonCommencer = document.getElementById('boutonCommencer');
    boutonRejouer = document.getElementById('boutonRejouer');
    boutonCommencer.disabled = true;
    boutonCommencer.value="Chargement...";

    //canvas
    canvas = document.getElementById('canvas');
    canvasLaser = document.getElementById('canvasLaser');
    canvasProp1 = document.getElementById('canvasProp1');
    canvasProp2 = document.getElementById('canvasProp2');
    canvasProp3 = document.getElementById('canvasProp3');
    canvasProp4 = document.getElementById('canvasProp4');
    canvasProp5 = document.getElementById('canvasProp5');
    canvasProp6 = document.getElementById('canvasProp6');
    canvasProp7 = document.getElementById('canvasProp7');
    canvasProp8 = document.getElementById('canvasProp8');
    canvasProp9 = document.getElementById('canvasProp9');
    canvasProp10 = document.getElementById('canvasProp10');
    
    //contextes
    ctx = canvas.getContext('2d'); 
    ctx2 = canvasLaser.getContext('2d'); 
    ctxProp1 = canvasProp1.getContext('2d');
    ctxProp2 = canvasProp2.getContext('2d');
    ctxProp3 = canvasProp3.getContext('2d');
    ctxProp4 = canvasProp4.getContext('2d');
    ctxProp5 = canvasProp5.getContext('2d');
    ctxProp6 = canvasProp6.getContext('2d');
    ctxProp7 = canvasProp7.getContext('2d');
    ctxProp8 = canvasProp8.getContext('2d');
    ctxProp9 = canvasProp9.getContext('2d');
    ctxProp10 = canvasProp10.getContext('2d');

    addEvent(window,"mousemove",bougerFusee); //permet de déplacer la fusée en même temps que la souris
    addEvent(window,"click",lancerLaser); //permet de tirer un faisceau laser au click

    //affichage avant l'appui sur Start : le seul bouton visible est "Start"
    canvas.hidden =true;
    canvasLaser.hidden=true;
    canvasProp1.hidden=true;
    canvasProp2.hidden=true;
    canvasProp3.hidden=true;
    canvasProp4.hidden=true;
    canvasProp5.hidden=true;
    canvasProp6.hidden=true;
    canvasProp7.hidden=true;
    canvasProp8.hidden=true;
    canvasProp9.hidden=true;
    canvasProp10.hidden=true;
    boutonRejouer.hidden=true;
}


//Fonction qui remplit le tableau des questions grâce à l'URL de l'API
function chargerTableau()
{
  ajaxGet("https://easimprove.herokuapp.com/api.php/jeutir", function(reponse) {
    var resultat = JSON.parse(reponse);
    resultat.jeutir.records.forEach(function (prop) {

        //les cases paires du tableau contiennent une proposition
        tableau48Questions[(prop[0]-1)*2] = ""+prop[1];

        //les cases impaires contiennent le booléen associé à la proposition précédente
        tableau48Questions[(prop[0]-1)*2+1] = ""+prop[2];
  });
 });
}


//Fonction qui détermine les dix questions à poser et le nombre de fausses réponses
function chargerQuestions()
{
    //rajouter une gestion des doublons pour ne pas avoir deux fois le meme verbe
    var questionDejeAttribuee = false;

    for(var i =0; i<10;i++)
    {
            do
            {
                questionDejeAttribuee = false;
                tableauQuestionsAPoser[i] = Math.floor(Math.random() * (48));
                for (var j=0; j<i; j++)
                {
                    if(tableauQuestionsAPoser[i]==tableauQuestionsAPoser[j])
                        questionDejeAttribuee = true;
                }
                console.log(tableauQuestionsAPoser[i]);
            }
            while(questionDejeAttribuee);
            tableauQuestions[2*i] = tableau48Questions[tableauQuestionsAPoser[i]*2];
            tableauQuestions[2*i+1] = tableau48Questions[tableauQuestionsAPoser[i]*2+1];
    }

    //initialisation du nombre de vaisseaux à détruire
    for(var i = 0; i<10;i++)
    {
            if (tableauQuestions[i*2+1] == "F")
            nbVaisseauxADetruire++;
    }

    boutonCommencer.disabled = false;
    boutonCommencer.value = "Start";

}


//Fonction d'initialisation qui gère l'affichage des propositions après appui sur Start
//Appelé par le click sur le bouton Start
function initialiserPartie()
{
    score = 0;
    timer = setInterval(augmenterTemps,1000);

    //affichage et masquage des éléments HTML
    boutonRejouer.hidden = true;
    boutonCommencer.hidden=true;
    canvas.hidden = false;
    canvasLaser.hidden = false;
    canvasProp1.hidden=false;
    canvasProp2.hidden=false;
    canvasProp3.hidden=false;
    canvasProp4.hidden=false;
    canvasProp5.hidden=false;
    canvasProp6.hidden=false;
    canvasProp7.hidden=false;
    canvasProp8.hidden=false;
    canvasProp9.hidden=false;
    canvasProp10.hidden=false;
    

    //remplir tableauPositionsQuestions avec la hauteur à laquelle sera
    //affichée chaque proposition
    for(var i =0; i<10;i++)
    {
            tableauPositionsQuestions[i] = Math.floor(Math.random() * (200));
    }

    for(var i =0; i<10;i++)
    {
            //on récupère le contexte du canvas associé à la (i+1)è question
            nomContexte="ctxProp"+(i+1);
            nomElement = "#canvasProp"+(i+1);

            //et on ajoute le vaisseau ennemi et la proposition
            window[nomContexte].drawImage(vaisseauAlien, 120*i+60,tableauPositionsQuestions[i],50,50);
            window[nomContexte].font="10px Arial";
            window[nomContexte].fillStyle = "white";
            window[nomContexte].textAlign = "center";
            window[nomContexte].fillText(tableauQuestions[i*2],120*i+85,tableauPositionsQuestions[i]+55,120);
            $(nomElement).fadeIn(0);//permet de réécrire sur le fadeout
    }
}


//Fonction qui déplace la fusée (onmousemove event)
function bougerFusee(event)
{  
    //déplacer la fusée selon les coordonnées en x de la souris
    position=event.offsetX-65;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(vaisseau, position, 350,120,160);
    ctx.fillStyle = "white";
    ctx.font="30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Score : "+score,canvas.width*3/4,canvas.height/2+50);
}


//Fonction qui lance le laser (onclick event)
function lancerLaser(event)
{ 
    //Récupération de la position de la souris (clientX ne fonctionne pas si on scrolle)
    position=event.offsetX-7;
    var vaisseauDejaDisparu = false; //permettra de ne tirer que sur les vaisseaux qui sont encore là
    var distanceAuVaisseau = (position)%120; //reste pour savoir si on est sur un vaisseau ou dans le vide
    var lieuDuTir = Math.floor((position)/120); //identifie la prop concernée

    //Ne pas tirer si le jeu n'a pas commencé ou est fini
    if(boutonCommencer.hidden && !fini)   
    {
        sonTir.play();

        //afficher le faisceau une demie seconde
        setTimeout(supprimerLaser,500);
        ctx2.lineWidth=5;
        ctx2.beginPath();

        //on vérifie si le vaisseau a déjà été éliminé
        for(var i = 0; i<tableauVaisseauxDisparus.length;i++)
        {
            if(tableauVaisseauxDisparus[i]==lieuDuTir)
            vaisseauDejaDisparu = true;
        }

        //tir sur un vaisseau
        if(distanceAuVaisseau>=60 && distanceAuVaisseau<=110 && vaisseauDejaDisparu==false) 
        {
        ctx2.moveTo(position,tableauPositionsQuestions[lieuDuTir]+20);
        ctx2.lineTo(position,358);
            if(tableauQuestions[lieuDuTir*2+1]=="F")//ne doit pas disparaître
            {
                 //perdre des points
                score -= 2 ;
                ctx2.fillStyle = "white";
                ctx2.font="30px Arial";
                ctx2.textAlign = "center";
                ctx2.fillText("-2",120*(lieuDuTir)+115,tableauPositionsQuestions[lieuDuTir]);
            }
            else
            {
                detruireVaisseauAlien(lieuDuTir+1);
            }
        }

        //tir dans le vide
        else 
        {
            ctx2.moveTo(position,0);
            ctx2.lineTo(position,358);
        }

        //tracer le trait du faisceau laser
        ctx2.strokeStyle='white'; 
        ctx2.stroke(); 
    }
}


//Fonction qui efface le laser et réaffiche le message de fin une fois le dernier laser effacé
function supprimerLaser()
{
    ctx2.clearRect(0, 0, canvasLaser.width, canvasLaser.height);
    if(fini)
    {
        ctx2.fillStyle = "white";
        ctx2.font="100px Arial";
        ctx2.textAlign = "center";
        ctx2.fillText("Finished!",canvas.width/2,canvas.height/2);
        ctx2.font="50px Arial";
        ctx2.fillText("You scored "+score,canvas.width/4,canvas.height/2+100);
    }  
}

function supprimeImageBombe(nomContexte)
{
    window[nomContexte].clearRect(0, 0, 1260, 800);
}


//Fonction qui détruit le vaisseau sur lequel on a tiré
function detruireVaisseauAlien(lieuDuTir)
{
    score += 6;
    nomContexte = "ctxProp"+lieuDuTir;
    var nomElement = "#canvasProp"+lieuDuTir;
    sonExplosion.play();

    //on fait disparaître le vaisseau ennemi
    window[nomContexte].clearRect(0, 0, 1260, 800);
    tableauVaisseauxDisparus[tableauVaisseauxDisparus.length]=(lieuDuTir-1);
    window[nomContexte].drawImage(explosion, 120*(lieuDuTir-1)+60,tableauPositionsQuestions[lieuDuTir-1],80,80);
    window[nomContexte].fillStyle = "white";
    window[nomContexte].font="30px Arial";
    window[nomContexte].textAlign = "center";
    window[nomContexte].fillText("+6",120*(lieuDuTir-1)+110,tableauPositionsQuestions[lieuDuTir-1]+40);

    setTimeout(function() {$(nomElement).fadeOut(500);},1000);
    //supprimeImageBombe(nomContexte);
    //si c'était le dernier vaisseau à détruire, c'est terminé
    if(tableauVaisseauxDisparus.length==nbVaisseauxADetruire)
    {
        terminer();
    }
}


//Fonction qui empêche de tirer et affiche le msg de fin
function terminer()
{
    canvas.hidden=true;
    fini = true;
    ctx2.font="100px Arial";
    ctx2.fillStyle = "white";
    ctx2.textAlign = "center";
    ctx2.fillText("Finished!",canvas.width/2,canvas.height/2);
    boutonRejouer.hidden = false;
}

//Fonction qui permet de diminuer le score à chaque seconde qui s'écoule 
//lorsqu'une partie est en cours
function augmenterTemps()
{
    if(!fini)
        score--;
    else
        clearInterval(timer);
}


//Fonction qui permet de rejouer
function rejouer()
{    
    tableauQuestions = []; 
    tableauPositionsQuestions=[]; 
    tableauVaisseauxDisparus = []; 
    tableauQuestionsAPoser = [];

    score = 0;
    position=0; 
    nbVaisseauxADetruire=0;

    viderCanvas();
    setTimeout(chargerQuestions,50);
    setTimeout(initialiserPartie,100);
    
    fini = false;
    canvas.hidden=false;
}


//Fonction qui permet de vider tous les canvasProp, afin de réécrire pour rejouer
function viderCanvas()
{
    ctx2.clearRect(0, 0, canvas.width, canvas.height);
    for (var i=1; i<=10;i++)
    {
        nomContexte="ctxProp"+(i);
        window[nomContexte].clearRect(0, 0, canvas.width, canvas.height);
    }
}

