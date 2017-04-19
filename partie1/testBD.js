var resultat = [];

/*ajaxGet("https://easimprove.herokuapp.com/api.php/verbes", function (reponse) 
{
    // Transforme la réponse en tableau d'objets JavaScript
    var verbes = JSON.parse(reponse);
    console.log(verbes.verbes);
});*/
// Exécute un appel AJAX GET
// Prend en paramètres l'URL cible et la fonction callback appelée en cas de succès
function ajaxGet(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            // Appelle la fonction callback en lui passant la réponse de la requête
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
    });
    req.send(null);
}

ajaxGet("https://easimprove.herokuapp.com/api.php/verbes", function(reponse) {
  resultat = JSON.parse(reponse);
  resultat.verbes.records.forEach(function (verbe) {
      console.log(verbe[1], verbe[2], verbe[3], verbe[4]);
      console.log(resultat.verbes.records[1]);
  });
});

