var fondEspace = new Image();
fondEspace.src = "http://hdwallpaper20.com/wp-content/uploads/2016/05/space-wallpaper-space_cataclysm_planet_art_explosion_asteroids_comets_fragments.jpg";
var vaisseau = new Image();
vaisseau.src = "https://cdn4.iconfinder.com/data/icons/whsr-january-flaticon-set/512/rocket.png";
var tableauQuestionsPossibles = ["prop1", true, "prop2", false,"prop3", true, "prop4", false,"prop5", true, "prop6", false,"prop7", true, "prop8", false, "prop9", true, "prop10", false];
var tableauPropositions = new Array;


window.onload = function() 
{
   //déclaration des variables
   tableau = document.getElementById('tableau');
	canvas = document.getElementById('canvas');
   boutonCommencer = document.getElementById('boutonCommencer');
   
   //fusée
	ctx = canvas.getContext('2d'); 
	ctx.drawImage(vaisseau, 10, 80,35,60); 
   
   canvas.addEventListener("mousemove", bougerFusee, false);
   
   //affichage avant le début
   tableau.hidden = true;
   canvas.hidden =true;
   
}

function bougerFusee()
{
   //déplacer la fusée selon les coordonnées en y de la souris
   //alert('marche');
}

function tirer()
{
   
}

function initialiserPartie()
{
   //affichage
   boutonCommencer.hidden=true;
   tableau.hidden = false;
   canvas.hidden = false;
   
   //gestion des mots sur lesquels tirer
   //on crée un tableau de douze cases, {"case2", "prop2",false,...}
   var questionDejaAttribuee = false;
   var questionAttribueeMax=0;
   var rnd = 0;
   for (var i = 0; i<4 ; i++)
      {
         do
	         {
               questionDejaAttribuee = false;
            	rnd = Math.floor(Math.random() * (10));
              if(questionAttribueeMax!=0)
               {
         			for (var j =0;j<questionAttribueeMax-1;j++)
                  {
                     if(tableauPropositions[j*3].substr(4)==rnd)
                     {questionDejaAttribuee = true;}
                  }
               }
               
               if(!questionDejaAttribuee)
                  {
               		tableauPropositions[i*3]=("case"+rnd);
               		tableauPropositions[i*3+1]=tableauQuestionsPossibles[rnd*2];
               		tableauPropositions[i*3+2]=tableauQuestionsPossibles[rnd*2+1];
                     questionAttribueeMax++;
                  }
            }
         while(questionDejaAttribuee);        
         
      }
   for (var k =0; k<4; k++)
            {
               document.getElementById(tableauPropositions[k*3]).innerHTML = tableauPropositions[k*3+1];
               document.getElementById(tableauPropositions[k*3]).style.backgroundColor="#FFFFFF"; 
            }
}


